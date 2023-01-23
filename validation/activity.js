const Joi = require("joi");

const myJoiType = {
  STRING1: Joi.string().min(1).required().messages({
    "string.base": `{{#label}} 應該為文字`,
    "string.empty": ` {{#label}} 不應為空`,
    "string.min": `{{#label}} 應大於 {{#limit}}個文字`,
    "any.required": `{{#label}} 應該有值`,
  }),
};

// Register Validation
const createActivityValidation = (data) => {
  const schema = Joi.object({
    title: myJoiType.STRING1,
    object: Joi.array().items(Joi.string()).required(),
    location: Joi.string().min(1).required(),
    activity_time: Joi.array().items(Joi.date()).required(),
    enroll_time: Joi.array().items(Joi.date()).required(),
    fee: Joi.number().required(),
    manager: Joi.string().required(),
    manager_contact: Joi.string().required(),
    quota: Joi.number().required(),
    activity_imgs: Joi.array().items(Joi.string()),
    description: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.createActivityValidation = createActivityValidation;
