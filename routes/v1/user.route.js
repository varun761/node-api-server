const express = require('express')

const { validate } = require('express-validation')

const { createUser, listUsers, getUserDetails, deleteUser} = require('../../controllers/v1/user.controller')
const { commonDetailsOrDelete } = require('../../validations/v1/commonValidation')

const { createUserValidation } = require('../../validations/v1/userValidation')

const userRoute = express()

userRoute.post('/', validate(createUserValidation), createUser)
  .get('/', listUsers)
  .get('/:id', validate(commonDetailsOrDelete), getUserDetails)
  .delete('/:id', validate(commonDetailsOrDelete), deleteUser)

module.exports = userRoute