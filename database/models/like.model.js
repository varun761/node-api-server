const { Schema, model, Types } = require('mongoose');
const postModel = require('./post.model');
const userModel = require('./user.model');

const likeSchema = new Schema(
  {
    post_id: {
      type: Types.ObjectId,
      ref: 'Post',
    },
    author_id: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  },
);

likeSchema.post('save', async (doc) => {
  try {
    await postModel.findOneAndUpdate(
      {
        _id: doc.post_id,
        likes: { $nin: [doc._id] },
      },
      {
        $push: {
          likes: doc._id,
        },
      },
    );
    // remove comments from user
    await userModel.findOneAndUpdate(
      {
        _id: doc.author_id,
        likes: { $nin: [doc._id] },
      },
      {
        $push: {
          likes: doc._id,
        },
      },
    );
  } catch (e) {
    throw new Error(e.message);
  }
});

const likeModel = new model('Like', likeSchema);

module.exports = likeModel;
