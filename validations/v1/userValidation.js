const { Joi } = require("express-validation");

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