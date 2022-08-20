const express = require('express')
const { validate } = require('express-validation')
const { createPostValidation } = require('../../validations/v1/postValidation')
const { createPost, listPosts, listPostById, deletePost} = require('../../controllers/v1/postController')
const verifyUser = require('../../middleware/verifyUser')
const { commonDetailsOrDelete } = require('../../validations/v1/commonValidation')
const postRouter = express()

postRouter.post('/', verifyUser, validate(createPostValidation), createPost)
.get('/', listPosts)
.get('/by-author', verifyUser, listPostById)
.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deletePost)

module.exports = postRouter