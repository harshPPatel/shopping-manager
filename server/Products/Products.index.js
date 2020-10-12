const { Router } = require('express');

const Product = require('./Products.Model');
const Shop = require('../Shops/Shops.model');
const { productValidator, productQuantititiesValidator } = require('./Products.validator');
const AuthMiddleware = require('../Middlewares/Auth.middleware');

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const products = await Product.find().exec();
  const shops = await Shop.find().exec();
  const returnProducts = [];
  products.forEach((product) => {
    // eslint-disable-next-line
    const returnProduct = { ...product._doc };
    // eslint-disable-next-line
    const productShops = shops.filter((shop) => product.shops.includes(shop._id));
    // eslint-disable-next-line
    returnProduct.shops = productShops;
    returnProducts.push(returnProduct);
  });
  res.status(200);
  res.json({
    products: returnProducts,
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

productsRouter.patch('/quantities', productQuantititiesValidator, async (req, res, next) => {
  const { validQuantities } = req;
  const updatedProducts = [];
  validQuantities.forEach(async ({ productId, quantities }, index) => {
    await Product.findByIdAndUpdate(productId, {
      quantities,
    }, { new: true },
    (err, doc) => {
      if (err) {
        next(new Error(err));
        return;
      }
      updatedProducts.push(doc);
    });
  });

  res.status(200);
  res.json({
    message: 'Updated the products\' quantities successfully',
    updatedProducts,
  });
});

productsRouter.patch('/:productId', AuthMiddleware.userIsAdmin, productValidator, async (req, res, next) => {
  const { productId } = req.params;
  const DbProduct = await Product.findById(productId).exec().catch(next);
  if (!DbProduct) {
    res.status(404);
    next(new Error('Product does not exists'));
    return;
  }
  // const shopRegex = new RegExp(`(${DbProduct.shops.join('|')})`);
  DbProduct.shops = req.validProduct.shops;
  DbProduct.name = req.validProduct.name;
  DbProduct.price = parseFloat(req.validProduct.price);
  DbProduct.image = req.validProduct.image;

  const shops = await Shop.find().exec();
  // eslint-disable-next-line
  const returnProduct = { ...DbProduct._doc };
  // eslint-disable-next-line
  const productShops = shops.filter((shop) => req.validProduct.shops.includes(shop.id));

  // eslint-disable-next-line
  returnProduct.shops = productShops;

  DbProduct.save()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Product has been updated successfully',
        updatedProduct: returnProduct,
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
