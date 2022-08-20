const express = require('express')
const { validate } = require('express-validation')
const { createComment, deleteComment } = require('../../controllers/v1/commentController')
const verifyUser = require('../../middleware/verifyUser')
const { createCommentValidation } = require('../../validations/v1/commentValidation')
const { commonDetailsOrDelete } = require('../../validations/v1/commonValidation')
const commentRouter = express()

commentRouter.post('/:post_id', verifyUser, validate(createCommentValidation), createComment)
commentRouter.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deleteComment)

module.exports = commentRouter