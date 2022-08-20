const { Joi } = require("express-validation");

exports.createCategoryValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    cover_image: Joi.string(),
  }),
};
