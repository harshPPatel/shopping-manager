const express = require('express');

const ShopsModel = require('./Shops.model');
const shopsValidator = require('./Shops.validator');

const ShopsRouter = express.Router();

ShopsRouter.get('/', async (req, res) => {
  const shops = await ShopsModel.find({}).exec();
  res.json({
    totalShops: shops.length,
    shops,
  });
});

ShopsRouter.post('/create', shopsValidator, (req, res, next) => {
  const dbShop = new ShopsModel({
    name: req.validShop.name,
  });

  dbShop.save()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Created shop successfully',
        createdShop: dbShop,
      });
    })
    .catch(next);
});

ShopsRouter.patch('/:id', shopsValidator, async (req, res, next) => {
  const { id } = req.params;
  const dbShop = await ShopsModel.findById(id).exec();

  if (!dbShop) {
    res.status(404);
    next(new Error('Shop does not exists'));
    return;
  }

  const updatedShopName = req.validShop.name;

  if (updatedShopName === dbShop.name) {
    res.status(422);
    next(new Error('Invalid Operation'));
    return;
  }

  dbShop.name = updatedShopName;

  dbShop.save()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Updated shop successfully',
        updatedShop: dbShop,
      });
    })
    .catch(next);
});

ShopsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const dbShop = await ShopsModel.findById(id).exec();

  if (!dbShop) {
    res.status(404);
    next(new Error('Shop does not exists'));
    return;
  }

  dbShop.delete()
    .then(() => {
      res.status(200);
      res.json({
        message: 'Deleted shop successfully',
        deletedShopId: id,
      });
    })
    .catch(next);
});

module.exports = ShopsRouter;
