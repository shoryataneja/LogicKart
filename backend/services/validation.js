const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().max(500).optional(),
  stock: Joi.number().integer().min(0).optional(),
});

const cartItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).optional(),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
});

// Middleware factory — validates req.body against a schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  productSchema,
  cartItemSchema,
  updateCartSchema,
  updateProfileSchema,
};
