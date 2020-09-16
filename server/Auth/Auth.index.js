const express = require('express');

const loginController = require('./Login.controller');
const loginValidator = require('./Login.validator');

const { userIsLoggedIn } = require('../Middlewares/Auth.middleware');

const Router = express.Router();

Router.post('/login', loginValidator, loginController);

Router.post('/validatetoken', userIsLoggedIn, (req, res) => {
  res.status(200);
  res.json({
    message: 'toke is valid',
    username: req.username,
    isAdmin: req.username === process.env.ADMIN_USERNAME,
  });
});

module.exports = Router;
