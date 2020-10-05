const express = require('express');

const CreateUserValidator = require('../Auth/Login.validator');
const UserValidators = require('./User.Validator');
const User = require('./User.model');
const Bcrypt = require('../Lib/Bcrypt.lib');

const Router = express.Router();

Router.get('/', async (req, res) => {
  const dbUsers = await User.find(
    { username: { $ne: process.env.ADMIN_USERNAME.toString() } },
  ).exec();
  const responseUsers = dbUsers.map((user) => ({
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
  res.status(200);
  res.json({
    message: 'List of all the users',
    users: responseUsers,
  });
});

Router.post('/create', CreateUserValidator, async (req, res, next) => {
  const user = {
    username: req.body.username.toString().trim(),
    password: req.body.password.toString().trim(),
  };
  user.password = await Bcrypt.hashPassword(user.password);
  const dbUser = new User(user);

  dbUser.save()
    .then(() => {
      res.status(200);
      res.json({
        createdUser: {
          username: dbUser.username,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        },
        message: 'User has been created sucessfully',
      });
    })
    .catch((dbErr) => {
      if (dbErr.code === 11000) {
        res.status(409);
        next(new Error('User already exists'));
        return;
      }
      next(new Error(dbErr));
    });
});

Router.patch('/:username', UserValidators.updateValidator, async (req, res, next) => {
  const dbUser = await User.findOne({
    username: req.params.username.toString().trim(),
  }).exec();

  if (!dbUser) {
    res.status(404);
    next(new Error('User does not exist'));
    return;
  }

  const { password } = req.body;
  if (password) {
    const hashedPassword = await Bcrypt.hashPassword(password);

    if (hashedPassword !== dbUser.password) {
      dbUser.password = hashedPassword;
    }
  }

  dbUser.username = req.body.username.toString().trim();

  dbUser.save()
    .then(() => {
      res.status(200);
      res.json({
        updatedUser: {
          username: dbUser.username,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        },
        message: 'User has been updated successfully',
      });
    })
    .catch(next);
});

Router.delete('/:username', async (req, res, next) => {
  const dbUser = await User.findOne({
    username: req.params.username.toString().trim(),
  }).exec();

  if (!dbUser) {
    res.status(404);
    next(new Error('User does not exist'));
    return;
  }

  dbUser.deleteOne()
    .then(() => {
      res.status(200);
      res.json({
        deletedUser: req.params.username.toString().trim(),
        message: 'User had been deleted successfully',
      });
    })
    .catch(next);
});

module.exports = Router;
