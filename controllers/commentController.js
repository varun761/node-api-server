const { Types } = require("mongoose");
const { postModel, commentModel, userModel } = require("../database/models");

exports.create = async (req, res) => {
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
        // update post
        const post = await postModel.findOne({
            _id: post_id
        })
        post.comments.push(comments)
        await post.save()
        // update user
        const user = await userModel.findOne({
            _id: req.authorized
        })
        user.comments.push(comments)
        await user.save()
        // send response
        return res.status(201).json({
            message: "Comment created successfully",
        });
    } catch(e) {
        return res.status(500).json({
            message: e.message,
        });
    }
}