const express = require('express')

const { validate } = require('express-validation')

const { createUser, listUsers, getUserDetails, deleteUser} = require('../controllers/userController')

const { createUserValidation, detailsUserValidation, deleteUserValidation } = require('../validations/userValidation')

const userRouter = express()

userRouter.post('/', validate(createUserValidation), createUser)
  .get('/', listUsers)
  .get('/:id', validate(detailsUserValidation), getUserDetails)
  .delete('/:id', validate(deleteUserValidation), deleteUser)

module.exports = userRouter