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
const createGroupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages(myJoiMessage),
    member: Joi.array().required().messages(myJoiMessage),
    authority: Joi.array().required().messages(myJoiMessage),
  });

  return schema.validate(data);
};

module.exports.createGroupValidation = createGroupValidation;
