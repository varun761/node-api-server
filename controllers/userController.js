const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userModel } = require("../database/models/");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    const salt = await bcrypt.genSaltSync(10);
    const bcryptPassword = await bcrypt.hashSync(password, salt);
    const user = new userModel({
      name,
      email,
      dob,
      password: bcryptPassword,
    });
    await user.save();
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.listUsers = async (req, res) => {
  try {
    let { limit, skip } = req.params;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
    const usersListing = await userModel
      .find(
        {},
        {
          first_name: 1,
          last_name: 1,
          email: 1,
          dob: 1,
          createdAt: 1,
        }
      )
      .limit(limit)
      .skip(skip);
    return res.status(200).json({
      users: usersListing,
      message: "User list successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userDetails = await userModel.findOne(
      {
        id: mongoose.Types.ObjectId(id),
      },
      {
        first_name: 1,
        last_name: 1,
        dob: 1,
        email: 1,
      }
    );
    if (!userDetails) {
      return res.status(403).json({
        message: "No user exists.",
      });
    }
    return res.status(200).json({
      user: userDetails,
      message: "User list successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
