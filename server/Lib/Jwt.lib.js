const { sign, verify } = require('jsonwebtoken');

const JwtSettings = Object.freeze({
  expiresIn: '2 days',
});

const signToken = (user) => {
  const payload = {
    username: user.username,
    createdAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    sign(payload, process.env.JWT_SECRET_KEY, JwtSettings, function(err, token) {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET_KEY, JwtSettings, function(err, decoded) {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  signToken,
  decodeToken,
};
