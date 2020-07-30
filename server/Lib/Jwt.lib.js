const { sign } = require('jsonwebtoken');

const JwtSettings = Object.freeze({
  expiresIn: '2 days',
});

const signToken = (user) => {
  const payload = {
    username: user,
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

module.exports = {
  signToken,
};
