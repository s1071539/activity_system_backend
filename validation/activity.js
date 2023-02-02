const Joi = require("joi");

const myJoiMessage = {
  "string.base": `{{#label}} 應該為文字`,
  "string.empty": `{{#label}} 不應為空`,
  "string.min": `{{#label}} 應大於{{#limit}}個文字`,
  "array.base": `{{#label}} 應該為陣列`,
  "array.min": `{{#label}} 應大於{{#limit}}個輸入值`,
  "array.empty": `{{#label}} 不應為空`,
  "array.length": `{{#label}} 應為{{#limit}}個輸入值`,
  "number.base": `{{#label}} 應該為數字`,
  "number.empty": `{{#label}} 不應為空`,
  "number.min": `{{#label}} 應大於{{#limit}}`,
  "any.required": `{{#label}} 應該有值`,
};

// Register Validation
const createActivityValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages(myJoiMessage),
    object: Joi.array()
      .items(Joi.string())
      .required()
      .min(1)
      .messages(myJoiMessage),
    location: Joi.string().required().messages(myJoiMessage),
    activity_time: Joi.array()
      .items(Joi.date())
      .required()
      .length(2)
      .messages(myJoiMessage),
    enroll_time: Joi.array()
      .items(Joi.date())
      .required()
      .length(2)
      .messages(myJoiMessage),
    fee: Joi.number().min(0).required().messages(myJoiMessage),
    manager: Joi.string().required().messages(myJoiMessage),
    manager_contact: Joi.string().required().messages(myJoiMessage),
    quota: Joi.number().min(1).required().messages(myJoiMessage),
    activity_imgs: Joi.array().items(Joi.string()).messages(myJoiMessage),
    description: Joi.string().required().messages(myJoiMessage),
    creator: Joi.string().required().messages(myJoiMessage),
  });

  return schema.validate(data);
};

module.exports.createActivityValidation = createActivityValidation;
