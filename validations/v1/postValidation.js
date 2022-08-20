const { Joi } = require("express-validation");

const ObjectIdValidations = (value, helper) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helper.message('Id must be a valid string.');
  }
}

exports.createPostValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    cover_image: Joi.string(),
    catgeory_id: Joi.string().custom(ObjectIdValidations)
  }),
};

exports.updatePostValidation = {
  params: Joi.object({
    id: Joi.string().required().custom(ObjectIdValidations)
  }),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    cover_image: Joi.string(),
    catgeory_id: Joi.string().custom(ObjectIdValidations)
  }),
};
