const { Schema, model, Types } = require('mongoose');
const userModel = require('./user.model');

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    short_description: {
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
    visibility: {
      type: String,
      default: 'private',
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: Types.ObjectId,
        ref: 'Comment',
      },
    ],
    category: {
      type: Types.ObjectId,
      ref: 'Category',
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'Like',
      },
    ],
    likes_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  },
);

postSchema.post('save', async (doc) => {
  try {
    // remove comments from user
    await userModel.findOneAndUpdate({
      _id: doc.author,
      posts: { $nin: [doc._id] },
    }, {
      $push: {
        posts: doc._id,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
});

const postModel = new model('Post', postSchema);

module.exports = postModel;
