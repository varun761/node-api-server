const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    cover_image: {
      type: String,
      default: null,
    },
    authors: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

const postModel = new model("Post", postSchema);

module.exports = postModel;