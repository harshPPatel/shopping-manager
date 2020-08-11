const Joi = require('joi');

const loginValidator = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .pattern(new RegExp('^[\\w]{3,15}$'), 'Username')
      .required(),
    password: Joi.string()
      .trim()
      .pattern(new RegExp('^[\\w&^%$!]{6,30}$'))
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
