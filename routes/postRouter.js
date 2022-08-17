const express = require('express')
const { validate } = require('express-validation')
const { createPostValidation } = require('../validations/postValidation')
const { create, list, listById} = require('../controllers/postController')
const verifyUser = require('../middleware/verifyUser')
const postRouter = express()

postRouter.post('/', verifyUser, validate(createPostValidation), create)
.get('/', list)
.get('/by-author', verifyUser, listById)

module.exports = postRouter