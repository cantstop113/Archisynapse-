const Joi = require('joi');

const validateTransactionCreate = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('USD'),
    description: Joi.string().optional(),
    customer: Joi.object({
      id: Joi.string().required(),
      email: Joi.string().email().required()
    }).optional(),
    payment_method: Joi.object({
      type: Joi.string().required()
    }).required(),
    metadata: Joi.object().optional()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        code: 'validation_error',
        message: error.details[0].message
      }
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateTransactionCreate
};
