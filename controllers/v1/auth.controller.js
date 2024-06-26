require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userModel } = require('../../database/models');
const { apiResponse, responseCodes } = require('../../utility/common.utility');

const errorMessages = {
  INVALID_EMAIL_PASSWORD: 'Incorrect email or password',
};

const generateToken = (subject, secret, expiresIn = 60 * 60) => jwt.sign({
  subject,
  // issuer: process.env.JWT_ISSUER,
  // audience: process.env.JWT_CONSUMER,
  algorithm: 'RS256',
}, secret, { expiresIn });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return apiResponse(res, responseCodes.UNAUTHORIZED, errorMessages.INVALID_EMAIL_PASSWORD);
    }
    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      return apiResponse(res, responseCodes.UNAUTHORIZED, errorMessages.INVALID_EMAIL_PASSWORD);
    }
    // expires in
    // const expiresIn = 60 * 60 * 60;
    // token
    const token = generateToken(user.email, process.env.JWT_SECRET);
    // refresh token
    const refreshToken = generateToken(user.email, process.env.JWT_REFRESH_SECRET);
    // send response
    return apiResponse(res, responseCodes.SUCCESS, null, {
      token,
      refreshToken,
      // expiresIn,
    });
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.authorized,
    });
    // token
    const token = generateToken(user.email, process.env.JWT_SECRET);
    // refresh token
    const refreshToken = generateToken(user.email, process.env.JWT_REFRESH_SECRET, 60 * 60 * 60);
    // send response
    return apiResponse(res, responseCodes.SUCCESS, null, {
      token,
      refreshToken,
    });
  } catch (e) {
    return apiResponse(res, responseCodes.SERVER_ERROR, e.message);
  }
};
