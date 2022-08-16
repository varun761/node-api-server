const express = require('express')

const { validate } = require('express-validation')

const userController = require('../controllers/userController')

const userValidations = require('../validations/userValidation')

const userRouter = express()

userRouter.post('/', validate(userValidations.createUserValidation), userController.createUser)
  .get('/', userController.listUsers)
  .get('/:id', validate(userValidations.detailsUserValidation), userController.getUserDetails)
  .delete('/:id', validate(userValidations.deleteUserValidation), userController.deleteUser)

module.exports = userRouter