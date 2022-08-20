const express = require("express")
const { validate } = require("express-validation")
const { createCategory } = require("../controllers/categoryController")
const { updatePost } = require("../controllers/postController")
const verifyUser = require("../middleware/verifyUser")
const { createCategoryValidation } = require("../validations/categoryValidation")
const { updatePostValidation } = require("../validations/postValidation")
const categoryRouter = express()

categoryRouter.post('/', verifyUser, validate(createCategoryValidation), createCategory)
categoryRouter.patch('/:id', verifyUser, validate(updatePostValidation), updatePost)

module.exports = categoryRouter