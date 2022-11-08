const express = require('express');
const { validate } = require('express-validation');
const { createCategory } = require('../../controllers/v1/category.controller');
const { updatePost } = require('../../controllers/v1/post.controller');
const verifyUser = require('../../middleware/verifyUser');
const { createCategoryValidation } = require('../../validations/v1/categoryValidation');
const { updatePostValidation } = require('../../validations/v1/postValidation');

const categoryRoute = express();

categoryRoute.post('/', verifyUser, validate(createCategoryValidation), createCategory);
categoryRoute.patch('/:id', verifyUser, validate(updatePostValidation), updatePost);

module.exports = categoryRoute;
