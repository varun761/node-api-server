const { Types } = require("mongoose");
const { postModel, commentModel, userModel } = require("../../database/models");
const { apiResponse, responseCodes } = require("../../utility/commonUtility");

exports.createComment = async (req, res) => {
    try {
        const { post_id } = req.params
        const {
            comment
        } = req.body
        const comments = new commentModel({
            comment,
            post: Types.ObjectId(post_id),
            author: req.authorized,
        });
        await comments.save();
        return apiResponse(res, responseCodes.CREATED_OK, "Comment created successfully");
    } catch(e) {
        return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
    }
}

const deleteSingleComment = (doc) => {
    return new Promise(async (resolve, reject) => {
        try {
            // fetch posts data
            await commentModel.deleteOne({
                _id: doc._id
            })
            // update post
            await postModel.findOneAndUpdate({
                _id: doc.post
            }, {
                $pull: {
                    comments: doc._id
                }
            })
            // update user
            await userModel.findOneAndUpdate({
                _id: doc.author
            }, {
                $pull: {
                    comments: doc._id
                }
            })
            resolve(true)
        } catch(e) {
            reject(e)
        }
    })
}

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const commentDoc = await commentModel.findOne({
            _id: id,
            author: req.authorized
        })
        if (!commentDoc) return apiResponse(res, responseCodes.NOT_FOUND, "Failed to deleted. No comment found.")
        await deleteSingleComment(commentDoc)
        return apiResponse(res, responseCodes.CREATED_OK, "Comment deleted successfully");
    } catch(e) {
        return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
    }
}