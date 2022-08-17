const { Schema, model } = require("mongoose");

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

const commentModel = new model("Comment", commentSchema);

module.exports = commentModel;