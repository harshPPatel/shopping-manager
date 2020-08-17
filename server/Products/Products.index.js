const { Router } = require('express');

const Product = require('./Products.Model');
const productValidator = require('./Products.validator');
const AuthMiddleware = require('../Middlewares/Auth.middleware');

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const products = await Product.find().exec();
  res.status(200);
  res.json({
    products,
    totalProducts: products.length,
    message: 'List of all products!',
  });
});

productsRouter.post('/create', AuthMiddleware.userIsAdmin, productValidator, async (req, res, next) => {
  const newProduct = new Product({
    name: req.validProduct.name,
    price: parseFloat(req.validProduct.price),
    image: req.validProduct.image,
    shops: req.validProduct.shops,
  });
  newProduct.save()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Product has been created successfully.',
        createdProduct: newProduct,
      });
    })
    .catch(next);
});

productsRouter.patch('/:productId', AuthMiddleware.userIsAdmin, productValidator, async (req, res, next) => {
  const { productId } = req.params;
  const DbProduct = await Product.findById(productId).exec().catch(next);
  if (!DbProduct) {
    res.status(404);
    next(new Error('Product does not exists'));
    return;
  }
  const shopRegex = new RegExp(`(${DbProduct.shops.join('|')})`);
  if (DbProduct.name === req.validProduct.name
    && DbProduct.image === req.validProduct.image
    && DbProduct.price === parseFloat(req.validProduct.price)
    && shopRegex.test(req.validProduct.shops.join('|'))) {
    res.status(422);
    next(new Error('Update data is invalid'));
  }
  DbProduct.name = req.validProduct.name;
  DbProduct.price = parseFloat(req.validProduct.price);
  DbProduct.image = req.validProduct.image;
  DbProduct.shops = req.validProduct.shops;

  DbProduct.save()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Product has been updated successfully',
        updatedProduct: DbProduct,
      });
    }).catch(next);
});

productsRouter.delete('/:productId', AuthMiddleware.userIsAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const DbProduct = await Product.findById(productId).exec().catch(next);
  if (!DbProduct) {
    res.status(404);
    next(new Error('Product does not exists'));
    return;
  }
  DbProduct.deleteOne()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Product has been deleted successfully',
        deletedProductId: productId,
      });
    }).catch(next);
});

module.exports = productsRouter;
