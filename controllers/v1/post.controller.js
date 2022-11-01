const { Types } = require('mongoose');
const {
  postModel, userModel, commentModel, categoryModel,
} = require('../../database/models');
const { apiResponse, responseCodes } = require('../../utility/common.utility');
const { getCacheValue, setCachevalue, deleteCacheByPattern } = require('../../utility/redis.utility');

exports.createPost = async (req, res) => {
  try {
    const {
      title, description, visibility, cover_image,
    } = req.body;
    const post = new postModel({
      title,
      description,
      visibility,
      cover_image,
      author: req.authorized,
    });
    await post.save();
    await deleteCacheByPattern('posts*');
    return apiResponse(res, responseCodes.CREATED_OK, 'Post created successfully');
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.listPosts = async (req, res) => {
  try {
    let { limit, skip } = req.query;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
    const cachedPosts = await getCacheValue(`posts_${skip}_${limit}`);
    let responseObj = {
      posts: [],
      total: 0,
    };
    if (cachedPosts) {
      responseObj = JSON.parse(cachedPosts);
    } else {
      responseObj.total = await postModel.countDocuments({
        visibility: 'public',
      });
      responseObj.posts = await postModel
        .find(
          {
            visibility: 'public',
          },
        )
        .populate('author', 'first_name last_name')
        .populate('comments', 'comment created_at')
        .select('author comments title description created_at likes_count')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      setCachevalue(`posts_${skip}_${limit}`, JSON.stringify(responseObj));
    }
    return apiResponse(res, responseCodes.SUCCESS, null, responseObj);
  } catch (e) {
    console.log(e);
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.postDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let responseObj = {
      post: null,
      recent_posts: [],
    };
    const cachedPost = await getCacheValue(`post_${id}`);
    if (cachedPost) {
      responseObj = JSON.parse(cachedPost);
    } else {
      responseObj.post = await postModel.findOne({
        _id: id,
      })
        .populate('author', 'first_name last_name dob')
        .populate('comments');
      if (responseObj.post) {
        responseObj.recent_posts = await postModel
          .find({ author: responseObj.post.author._id, visibility: 'public', _id: { $nin: [id] } }, {
            title: 1, description: 1, created_at: 1, author: 1, visibility: 1,
          })
          .populate('author', 'first_name last_name dob')
          .sort({ created_at: -1 })
          .limit(5)
          .skip(0);
      }
      setCachevalue(`post_${id}`, JSON.stringify(responseObj));
    }
    return apiResponse(res, responseCodes.SUCCESS, null, responseObj);
  } catch (e) {
    console.log(e);
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.listPostById = async (req, res) => {
  try {
    let { limit, skip } = req.query;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
    const cachedUserPosts = await getCacheValue(`posts_${req.authorized}_${skip}_${limit}`);
    let responseObj = {
      total: 0,
      posts: [],
    };
    if (cachedUserPosts) {
      responseObj = JSON.parse(cachedUserPosts);
    } else {
      responseObj.total = await postModel.countDocuments({ author: req.authorized });
      responseObj.posts = await postModel
        .find({ author: req.authorized }, {
          title: 1, description: 1, created_at: 1, author: 1, visibility: 1,
        })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);
      setCachevalue(`posts_${req.authorized}_${skip}_${limit}`, JSON.stringify(responseObj));
    }
    return apiResponse(res, responseCodes.SUCCESS, null, responseObj);
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

const deleteSinglePost = (doc) => new Promise(async (resolve, reject) => {
  try {
    // delete post data
    await postModel.deleteOne({
      _id: doc._id,
    });
    // delete comment data
    await commentModel.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
    // update user
    await userModel.findOneAndUpdate({
      _id: doc.author,
    }, {
      $pull: {
        posts: doc._id,
        comments: {
          $in: doc.comments,
        },
      },
    });
    // update category
    await categoryModel.findOneAndUpdate({
      posts: {
        $in: doc._id,
      },
    }, {
      $pull: {
        posts: doc._id,
      },
    });
    resolve(true);
  } catch (e) {
    reject(e);
  }
});

exports.deletePostHandler = deleteSinglePost;

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postModel.findOne({
      _id: id,
      author: req.authorized,
    });
    if (!postDoc) return apiResponse(res, responseCodes.NOT_FOUND, 'Failed to deleted. No post found.');
    await deleteSinglePost(postDoc);
    return apiResponse(res, responseCodes.CREATED_OK, 'Comment deleted successfully');
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id } = req.body;
    await postModel.findOneAndUpdate({
      _id: id,
      author: req.authorized,
    }, {
      $set: {
        title,
        description,
        category_id,
      },
    });
    if (category_id) {
      const alreadyExists = await categoryModel.findOne({
        _id: category_id,
        author: req.authorized,
        posts: {
          $nin: [id],
        },
      });
      if (!alreadyExists) {
        await categoryModel.findOneAndUpdate({
          _id: category_id,
          author: req.authorized,
        }, {
          $push: {
            posts: id,
          },
        });
      }
    }
    return apiResponse(res, responseCodes.CREATED_OK, 'Post updated successfully');
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

const getPostsCount = (query) => new Promise(async () => {
  try {
    const allPostsCounts = await postModel.countDocuments(query);
    resolve(allPostsCounts);
  } catch (e) {
    reject(e);
  }
});

exports.getPostsStats = async (req, res) => {
  try {
    const [allPostsCount, allPrivatePosts, allPublicPosts] = await Promise.all([
      getPostsCount({
        author: req.authorized,
      }),
      getPostsCount({
        author: req.authorized,
        visibility: 'private',
      }),
      getPostsCount({
        author: req.authorized,
        visibility: 'public',
      }),
    ]);
    return apiResponse(res, responseCodes.SUCCESS, null, {
      allPosts: allPostsCount,
      allPrivatePosts,
      allPublicPosts,
    });
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.updateVisibilities = async (req, res) => {
  try {
    const { postId, visibility } = req.body;
    await postModel.updateMany({
      _id: {
        $in: postId.map((el) => Types.ObjectId(el)),
      },
    }, {
      $set: {
        visibility,
      },
    }, {
      upsert: true,
    });
    await deleteCacheByPattern('posts*');
    return apiResponse(res, responseCodes.SUCCESS, 'Post visibility updated.');
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};
