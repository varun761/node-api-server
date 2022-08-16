const express = require('express')
const { validate } = require('express-validation')
const authValidation = require('../validations/authValidation')
const authController = require('../controllers/authController')
const authRouter = express()

authRouter.post('/', validate(authValidation.loginValidation), authController.login)

module.exports = authRouter