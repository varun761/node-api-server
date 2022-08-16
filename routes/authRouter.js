const express = require('express')
const { validate } = require('express-validation')
const authValidation = require('../validations/authValidation')
const authController = require('../controllers/authController')
const authRouters = express()

authRouters.post('/', validate(authValidation.loginValidation), authController.login)

module.exports = authRouters