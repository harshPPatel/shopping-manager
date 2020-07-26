const express = require('express');

const Router = express.Router();

Router.post('/login', (req, res) => {
  res.json({
    message: 'Login Route!',
  });
});

module.exports = Router;
