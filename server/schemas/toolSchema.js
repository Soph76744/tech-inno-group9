const Joi = require("joi");

// Defines the rules for creating a tool using joi 
// name and type must be strings between 2 - 50 characters
// status must be either available, in-use or missing
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