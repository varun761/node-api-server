const { postModel, userModel, commentModel, categoryModel } = require("../../database/models");
const { apiResponse, responseCodes } = require("../../utility/commonUtility");

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
    let { limit, skip } = req.params;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
    const posts = await postModel
      .find(
        {},
      )
      .populate('author', 'first_name last_name dob')
      .populate('comments', 'comment created_at')
      .limit(limit)
      .skip(skip);
    return apiResponse(res, responseCodes.SUCCESS, null, {
      posts
    })
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
};

exports.listPostById = async (req, res) => {
  try {
    let { limit, skip } = req.params;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
    const posts = await postModel
      .find({ author: req.authorized}, { title: 1, description: 1, created_at: 1, author: 1 })
      .limit(limit)
      .skip(skip);
    return apiResponse(res, responseCodes.SUCCESS, null, {
      posts
    });
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