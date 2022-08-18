const { postModel, userModel, commentModel } = require("../database/models");
const { apiResponse, responseCodes } = require("../utility/commonUtility");

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
          resolve(true)
      } catch(e) {
          reject(e)
      }
  })
}

exports.deletePost = async () => {
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