const { Types } = require("mongoose");
const { postModel, userModel, commentModel, categoryModel } = require("../../database/models");
const { apiResponse, responseCodes } = require("../../utility/commonUtility");
const { getCacheValue, setCachevalue } = require("../../utility/redisUtility");

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = new postModel({
      title,
      description,
      author: req.authorized,
    });
    await post.save();
    return apiResponse(res, responseCodes.CREATED_OK, "Post created successfully");
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
};

exports.listPosts = async (req, res) => {
  try {
    const cachedPosts = await getCacheValue('posts')
    let responseObj = {}
    if (cachedPosts) {
      responseObj = JSON.parse(cachedPosts)
    } else {
      let { limit, skip } = req.query;
      if (!limit) {
        limit = 10;
      }
      if (!skip) {
        skip = 0;
      }
      const total = await postModel.countDocuments({})
      const posts = await postModel
        .find(
          {
            visibility: 'public'
          },
        )
        .populate('author', 'first_name last_name dob')
        .populate('comments', 'comment created_at')
        .select('author comments title description created_at likes_count')
        .sort({'created_at': -1})
        .skip(skip)
        .limit(limit);
      responseObj = {
        posts,
        total
      }
      setCachevalue('posts', JSON.stringify(responseObj))
    }
    return apiResponse(res, responseCodes.SUCCESS, null, responseObj)
  } catch (e) {
    console.log(e)
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
};

exports.listPostById = async (req, res) => {
  try {
    const cachedUserPosts = await getCacheValue(`posts_${req.authorized}`)
    let responseObj = {}
    if (cachedUserPosts) {
      responseObj = JSON.parse(cachedUserPosts)
    } else {
      let { limit, skip } = req.query;
      if (!limit) {
        limit = 10;
      }
      if (!skip) {
        skip = 0;
      }
      const total = await postModel.countDocuments({ author: req.authorized})
      const posts = await postModel
        .find({ author: req.authorized}, { title: 1, description: 1, created_at: 1, author: 1, visibility: 1 })
        .sort({'created_at': -1})
        .limit(limit)
        .skip(skip);
      responseObj = {
        posts,
        total
      }
      setCachevalue(`posts_${req.authorized}`, JSON.stringify(responseObj))
    }
    return apiResponse(res, responseCodes.SUCCESS, null, responseObj);
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
}

const deleteSinglePost = (doc) => {
  return new Promise(async (resolve, reject) => {
      try {
          // delete post data
          await postModel.deleteOne({
              _id: doc._id
          })
          // delete comment data
          await commentModel.deleteMany({
              _id: {
                $in: doc.comments
              }
          })
          // update user
          await userModel.findOneAndUpdate({
              _id: doc.author
          }, {
              $pull: {
                  posts: doc._id,
                  comments: {
                    $in: doc.comments
                  }
              }
          })
          // update category
          await categoryModel.findOneAndUpdate({
            posts: {
              $in: doc._id
            }
          }, {
              $pull: {
                posts: doc._id,
              }
          })
          resolve(true)
      } catch(e) {
          reject(e)
      }
  })
}

exports.deletePostHandler = deleteSinglePost

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const postDoc = await postModel.findOne({
      _id: id,
      author: req.authorized
  })
  if (!postDoc) return apiResponse(res, responseCodes.NOT_FOUND, "Failed to deleted. No post found.")
    await deleteSinglePost(postDoc)
    return apiResponse(res, responseCodes.CREATED_OK, "Comment deleted successfully");
  } catch(e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
}

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category_id } = req.body
    await postModel.findOneAndUpdate({
      _id: id,
      author: req.authorized
    }, {
      $set: {
        title,
        description,
        category_id
      }
    })
    if (category_id) {
      const alreadyExists = await categoryModel.findOne({
        _id: category_id,
        author: req.authorized,
        posts: {
          $nin: [id]
        }
      })
      if (!alreadyExists) {
        await categoryModel.findOneAndUpdate({
          _id: category_id,
          author: req.authorized,
        }, {
          $push: {
            posts: id
          }
        })
      }
    }
    return apiResponse(res, responseCodes.CREATED_OK, "Post updated successfully")
  } catch(e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
}

const getPostsCount = (query) => {
  return new Promise(async () => {
    try {
      const allPostsCounts = await postModel.countDocuments(query)
      resolve(allPostsCounts)
    } catch(e) {
      reject(e)
    }
  })
}

exports.getPostsStats = async (req, res) => {
  try {
    const [allPostsCount, allPrivatePosts, allPublicPosts] = await Promise.all([
      getPostsCount({
        author: req.authorized
      }),
      getPostsCount({
        author: req.authorized,
        visibility: 'private'
      }),
      getPostsCount({
        author: req.authorized,
        visibility: 'public'
      })
    ])
    return apiResponse(res, responseCodes.SUCCESS, null, {
      allPosts: allPostsCount,
      allPrivatePosts,
      allPublicPosts
    })
  } catch(e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
}

exports.updateVisibilities = async (req, res) => {
  try {
    const { postId, visibility } = req.body
    await postModel.updateMany({
      _id: {
        $in: postId.map((el) => Types.ObjectId(el))
      }
    }, {
      $set: {
        visibility
      }
    }, {
      upsert: true
    })
    return apiResponse(res, responseCodes.SUCCESS, 'Post visibility updated.')
  } catch(e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
}