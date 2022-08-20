const { Joi } = require('express-validation')

exports.loginValidation = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required()
    })
}