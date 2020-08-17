const Joi = require('joi');

const updateValidator = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .pattern(new RegExp('^[\\w]{3,15}$'), 'Username'),
    password: Joi.string()
      .trim()
      .pattern(new RegExp('^[\\w&^%$!]{6,30}$')),
  });

  if (req.body.username && req.params.username === req.body.username && !req.body.password) {
    next(new Error('Invalid Operation'));
    return;
  }

  const result = await schema.validate(req.body);
  if (result.error) {
    res.status(422);
    next(new Error(result.error));
    return;
  }
  next();
};

module.exports = {
  updateValidator,
};
