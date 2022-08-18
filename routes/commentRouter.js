const express = require('express')
const { validate } = require('express-validation')
const { createComment, deleteComment } = require('../controllers/commentController')
const verifyUser = require('../middleware/verifyUser')
const { createCommentValidation } = require('../validations/commentValidation')
const { commonDetailsOrDelete } = require('../validations/commonValidation')
const commentRouter = express()

commentRouter.post('/:post_id', verifyUser, validate(createCommentValidation), createComment)
commentRouter.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deleteComment)

module.exports = commentRouter