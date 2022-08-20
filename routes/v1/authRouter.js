const express = require('express')
const { validate } = require('express-validation')
const { loginValidation } = require('../../validations/v1/authValidation')
const {login, refreshToken } = require('../../controllers/v1/authController')
const verifyRefreshToken = require('../../middleware/verifyRefreshToken')
const authRouter = express()

authRouter.post('/', validate(loginValidation), login)
authRouter.post('/refresh-token', verifyRefreshToken, refreshToken)

module.exports = authRouter