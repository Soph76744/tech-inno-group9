const Joi = require("joi");

const ToolCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  type: Joi.string().min(2).max(50).required(),
  location: Joi.string().optional()
});

const ToolUpdateSchema = Joi.object({
  status: Joi.string().valid("available", "in-use", "missing").required()
});

module.exports = {
  ToolCreateSchema,
  ToolUpdateSchema
};