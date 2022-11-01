const { likeModel, userModel, postModel } = require('../../database/models');
const { responseCodes, apiResponse } = require('../../utility/common.utility');

const deleteLikePostTransaction = (like_id, post_id, author_id) => new Promise(async (resolve, reject) => {
  try {
    await userModel.findOneAndUpdate({
      _id: author_id,
    }, {
      $pull: {
        likes: like_id,
      },
    });
    const linkedPost = await postModel.findOne({
      _id: post_id,
    });
    if (linkedPost) {
      linkedPost.likes.pull(like_id);
      linkedPost.likes_count -= 1;
      await linkedPost.save();
    }
    // await postModel.findOneAndUpdate({

    // }, {
    //     $pull: {
    //       likes: like_id
    //     }
    // })

    // await postModel.findOneAndUpdate({
    //     _id: post_id
    // }, {
    //     $dec: {
    //         likes_count: 1
    //     }
    // });
    resolve(true);
  } catch (e) {
    console.log(e);
    reject(e);
  }
});

exports.likePostHandler = async (req, res) => {
  try {
    const { post_id } = req.body;
    let responseCode = responseCodes.CREATED_OK;
    let responseMessage = 'Post liked successfully.';
    const checkIfPostLiked = await likeModel.findOne({
      post_id,
      author_id: req.authorized,
    });
    if (!checkIfPostLiked) {
      const likes = new likeModel({
        post_id,
        author_id: req.authorized,
      });
      await likes.save();
      await postModel.findOneAndUpdate({
        _id: post_id,
      }, {
        $inc: {
          likes_count: 1,
        },
      });
    } else {
      responseCode = responseCodes.SUCCESS;
      responseMessage = 'Post updated.';
      await checkIfPostLiked.remove();
      await deleteLikePostTransaction(checkIfPostLiked._id, post_id, checkIfPostLiked.author_id);
    }
    return apiResponse(res, responseCode, responseMessage);
  } catch (e) {
    console.log(e);
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};
