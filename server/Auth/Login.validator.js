const Joi = require('joi');

const loginValidator = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .max(15)
      .pattern(new RegExp('^[a-zA-Z0-9_]{3,15}$'), 'Username')
      .required(),
    password: Joi.string()
      .trim()
      .min(6)
      .max(30)
      .pattern(new RegExp('^[a-zA-Z0-9_]{6,30}$'))
      .required(),
  });

  const result = await schema.validate(req.body);
    if (result.error) {
      res.status(422);
      next(new Error(result.error));
      return;
    }
    next();
};

module.exports = loginValidator;
