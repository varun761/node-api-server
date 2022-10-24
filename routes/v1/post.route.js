const express = require('express')
const { validate } = require('express-validation')
const { createPostValidation, detailsPostValidation } = require('../../validations/v1/postValidation')
const { createPost, listPosts, listPostById, deletePost, getPostsStats, updateVisibilities, postDetails} = require('../../controllers/v1/post.controller')
const verifyUser = require('../../middleware/verifyUser')
const { commonDetailsOrDelete } = require('../../validations/v1/commonValidation')
const { likePostHandler } = require('../../controllers/v1/like.controller')
const postRoute = express()

postRoute.post('/', verifyUser, validate(createPostValidation), createPost)
.get('/', listPosts)
.delete('/:id', verifyUser, validate(commonDetailsOrDelete), deletePost)

postRoute.get('/single/:id', validate(detailsPostValidation), postDetails)

postRoute.get('/by-author', verifyUser, listPostById)

postRoute.get('/stats', verifyUser, getPostsStats)

postRoute.post('/update-visibility', verifyUser, updateVisibilities)

postRoute.post('/like', verifyUser, likePostHandler)

module.exports = postRoute