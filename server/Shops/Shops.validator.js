const joi = require('joi');

const shopSchema = joi.object({
  name: joi.string().trim().regex(/[\w ]+/, 'ShopName').required(),
});

const shopValidator = async (req, res, next) => {
  const result = await shopSchema.validate(req.body);
  if (result.error) {
    res.status(422);
    next(new Error(result.error));
    return;
  }
  req.validShop = result.value;
  next();
};

module.exports = shopValidator;
