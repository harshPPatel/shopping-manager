const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

const Shop = require('../Shops/Shops.model');

const createProductSchema = joi.object({
  name: joi.string().trim().regex(/[\w ]+/, 'ProductName').required(),
  price: joi.string().trim().regex(/^\d+?\.\d{2}$/, 'ProductPrice').required(),
  image: joi.string().required(),
  shops: joi.array().items(joi.objectId()),
});

const productValidator = async (req, res, next) => {
  const result = await createProductSchema.validate(req.body);
  if (result.error) {
    res.status(422);
    next(new Error(result.error));
    return;
  }
  await Shop.find({ _id: { $in: req.body.shops } })
    .exec().catch(() => {
      next(new Error('Shop IDs are invalid'));
    });
  req.validProduct = result.value;
  next();
};

const productQuantitySchema = joi.object({
  productId: joi.objectId(),
  quantities: {
    [process.env.STORE1]: joi.number().min(0).required(),
    [process.env.STORE2]: joi.number().min(0).required(),
    [process.env.STORE3]: joi.number().min(0).required(),
  },
});

const productQuantitiesArraySchema = joi.object({
  products: joi.array().items(productQuantitySchema),
});

const productQuantititiesValidator = async (req, res, next) => {
  const result = await productQuantitiesArraySchema.validate(req.body);
  if (result.error) {
    res.status(422);
    next(new Error(result.error));
    return;
  }
  req.validQuantities = result.value.products;
  next();
};

module.exports = {
  productValidator,
  productQuantititiesValidator,
};
