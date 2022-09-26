const express = require('express')
const { validate } = require('express-validation')
const { createPostValidation, detailsPostValidation } = require('../../validations/v1/postValidation')
const { createPost, listPosts, listPostById, deletePost, getPostsStats, updateVisibilities, postDetails} = require('../../controllers/v1/postController')
const verifyUser = require('../../middleware/verifyUser')
const { commonDetailsOrDelete } = require('../../validations/v1/commonValidation')
const { likePostHandler } = require('../../controllers/v1/likeController')
const postRouter = express()

postRouter.post('/', verifyUser, validate(createPostValidation), createPost)
.get('/', listPosts)
.get('/:id', validate(detailsPostValidation), postDetails)
.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deletePost)

postRouter.get('/by-author', verifyUser, listPostById)

postRouter.get('/stats', verifyUser, getPostsStats)

postRouter.post('/update-visibility', verifyUser, updateVisibilities)

postRouter.post('/like', verifyUser, likePostHandler)

module.exports = postRouter