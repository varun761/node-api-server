const { Joi } = require("express-validation");
const mongoose = require("mongoose")

exports.createCommentValidation = {
  params: Joi.object({
    post_id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message('Id must be a valid string.');
        }
      }),
  }),
  body: Joi.object({
    comment: Joi.string().required().min(1)
  })
};