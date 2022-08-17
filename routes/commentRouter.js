const express = require('express')
const { validate } = require('express-validation')
const { create } = require('../controllers/commentController')
const verifyUser = require('../middleware/verifyUser')
const { createCommentValidation } = require('../validations/commentValidation')
const commentRouter = express()

commentRouter.post('/', verifyUser, validate(createCommentValidation), create)

module.exports = commentRouter