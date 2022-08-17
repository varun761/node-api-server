const express = require('express')
const { validate } = require('express-validation')
const { loginValidation } = require('../validations/authValidation')
const {login, refreshToken } = require('../controllers/authController')
const verifyRefreshToken = require('../middleware/verifyRefreshToken')
const authRouter = express()

authRouter.post('/', validate(loginValidation), login)
authRouter.post('/refresh-token', verifyRefreshToken, refreshToken)

module.exports = authRouter