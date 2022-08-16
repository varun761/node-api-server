const { postModel } = require("../database/models");

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = new postModel({
      title,
      description,
      author: req.authorized,
    });
    await post.save();
    return res.status(201).json({
      message: "Post created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.list = async (req, res) => {
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
        {}
      )
      .populate('author')
      .limit(limit)
      .skip(skip);
    return res.status(200).json({
      posts,
      message: "Post list successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
