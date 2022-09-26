const { Joi } = require("express-validation");
const mongoose = require("mongoose")

const ObjectIdValidations = (value, helper) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helper.message('Id must be a valid string.');
  }
}

const visibilityValidations = (value, helper) => {
  if (['public', 'private'].indexOf(value) === -1) {
    return helper.message('Visibility value can be public or private')
  }
}

exports.createPostValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    visibility: Joi.string().required(),
    cover_image: Joi.string().allow(null),
    // catgeory_id: Joi.string().custom(ObjectIdValidations)
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

exports.updateVisibilityValidation = {
  body: Joi.object({
    postId: Joi.array().required(),
    visibility: Joi.string().required().custom(visibilityValidations)
  })
}

exports.detailsPostValidation = {
  params: Joi.object({
    id: Joi.string().required().custom(ObjectIdValidations)
  })
}
