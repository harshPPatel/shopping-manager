const express = require('express');

const loginController = require('./Login.controller');
const loginValidator = require('./Login.validator');

const Router = express.Router();

Router.post('/login', loginValidator, loginController);

module.exports = Router;
