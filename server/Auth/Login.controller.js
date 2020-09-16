const User = require('../User/User.model');
const Bcrypt = require('../Lib/Bcrypt.lib');
const JWT = require('../Lib/Jwt.lib');

const loginController = async (req, res, next) => {
  const reqUser = {
    username: req.body.username.toString().trim(),
    password: req.body.password.toString().trim(),
  };

  const dbUser = await User.findOne({ username: reqUser.username }).exec();

  if (!dbUser) {
    res.status(404);
    next(new Error('Username or Password is Invalid.'));
    return;
  }

  Bcrypt.comparePassword(reqUser.password, dbUser.password)
    .then((result) => {
      if (!result) {
        res.status(400);
        next(new Error('Username or Password is Invalid.'));
        return;
      }
      JWT.signToken(dbUser)
        .then((token) => {
          res.status(200);
          res.json({
            username: dbUser.username,
            token: `Bearer ${token}`,
            message: 'You are logged in successfully!',
            isAdmin: dbUser.username === process.env.ADMIN_USERNAME,
          });
        })
        .catch((jwtErr) => next(new Error(jwtErr)));
    })
    .catch((err) => next(new Error(err)));
};

module.exports = loginController;
