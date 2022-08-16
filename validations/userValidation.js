const { Joi } = require("express-validation");
const mongoose = require("mongoose")

exports.createUserValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(3),
    dob: Joi.date().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const singleDetailsOrDelete = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message('Id must be a valid string.');
        }
      }),
  }),
};

exports.detailsUserValidation = singleDetailsOrDelete;

exports.deleteUserValidation = singleDetailsOrDelete;
