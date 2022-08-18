const express = require('express')
const { validate } = require('express-validation')
const { createPostValidation } = require('../validations/postValidation')
const { createPost, listPosts, listPostById, deletePost} = require('../controllers/postController')
const verifyUser = require('../middleware/verifyUser')
const { commonDetailsOrDelete } = require('../validations/commonValidation')
const postRouter = express()

postRouter.post('/', verifyUser, validate(createPostValidation), createPost)
.get('/', listPosts)
.get('/by-author', verifyUser, listPostById)
.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deletePost)

module.exports = postRouter