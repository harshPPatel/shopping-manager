const { decodeToken } = require('../Lib/Jwt.lib');
const User = require('../User/User.model');

const userIsLoggedIn = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(400);
    next(new Error('Bad Request'));
  }

  token = token.toString().split(' ')[1];
  decodeToken(token)
    .then(async ({ username }) => {
      const dbUser = await User.findOne({ username }).exec();
      if (!dbUser) {
        res.status(403);
        next(new Error('Bad Request'));
        return;
      }
      req.username = dbUser.username;
      next();
    })
    .catch((err) => next(new Error(err)));
};

const userIsAdmin = (req, res, next) => {
  if (req.username !== process.env.ADMIN_USERNAME) {
    res.status(403);
    next(new Error('Access Forbidden'));
    return;
  }
  next();
};

module.exports = {
  userIsLoggedIn,
  userIsAdmin,
};
