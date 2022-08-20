const { Joi } = require("express-validation");
const mongoose = require("mongoose")

exports.commonDetailsOrDelete = {
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