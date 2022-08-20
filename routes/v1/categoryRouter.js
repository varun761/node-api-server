const express = require("express")
const { validate } = require("express-validation")
const { createCategory } = require("../../controllers/v1/categoryController")
const { updatePost } = require("../../controllers/v1/postController")
const verifyUser = require("../../middleware/verifyUser")
const { createCategoryValidation } = require("../../validations/v1/categoryValidation")
const { updatePostValidation } = require("../../validations/v1/postValidation")
const categoryRouter = express()

categoryRouter.post('/', verifyUser, validate(createCategoryValidation), createCategory)
categoryRouter.patch('/:id', verifyUser, validate(updatePostValidation), updatePost)

module.exports = categoryRouter