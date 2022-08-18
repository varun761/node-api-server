const express = require('express')

const { validate } = require('express-validation')

const { createUser, listUsers, getUserDetails, deleteUser} = require('../controllers/userController')
const { commonDetailsOrDelete } = require('../validations/commonValidation')

const { createUserValidation } = require('../validations/userValidation')

const userRouter = express()

userRouter.post('/', validate(createUserValidation), createUser)
  .get('/', listUsers)
  .get('/:id', validate(commonDetailsOrDelete), getUserDetails)
  .delete('/:id', validate(commonDetailsOrDelete), deleteUser)

module.exports = userRouter