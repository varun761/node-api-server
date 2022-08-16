const express = require('express')
const { validate } = require('express-validation')
const postValidation = require('../validations/postValidation')
const postController = require('../controllers/postController')
const verifyUser = require('../middleware/verifyUser')
const postRouter = express()

postRouter.post('/', validate(postValidation.createPostValidation), verifyUser,postController.create)
.get('/', postController.list)

module.exports = postRouter