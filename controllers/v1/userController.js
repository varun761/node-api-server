const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userModel } = require("../../database/models/");
const { apiResponse, responseCodes } = require("../../utility/commonUtility");

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
    return apiResponse(res, responseCodes.CREATED_OK, "User created successfully");
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
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
    return apiResponse(res, responseCodes.SUCCESS, {
      users: usersListing
    });
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });
    return apiResponse(res, responseCodes.SUCCESS, "User deleted successfully");
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
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
      return apiResponse(res, responseCodes.METHOD_NOT_ALLOWED, "No user exists.");
    }
    return apiResponse(res, responseCodes.SUCCESS, null, {
      user: userDetails
    });
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
  }
};
