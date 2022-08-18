const { Schema, model } = require("mongoose");
const postModel = require("./post.model");
const userModel = require("./user.model");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

commentSchema.post("save", async function (doc) {
  try {
    await postModel.findOneAndUpdate({
      _id: doc.post,
      comments: { $nin: [doc._id] }
    }, {
      $push: {
        comments: doc._id
      }
    })
    // remove comments from user
    await userModel.findOneAndUpdate({
      _id: doc.author,
      comments: { $nin: [doc._id] }
    }, {
      $push: {
        comments: doc._id
      }
    })
  } catch(e) {
    throw new Error(e.message)
  }
})

const commentModel = new model("Comment", commentSchema);

module.exports = commentModel;