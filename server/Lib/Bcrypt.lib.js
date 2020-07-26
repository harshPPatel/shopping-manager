const { hash } = require('bcrypt');

const hashPassword = (password) => {
  return hash(password, Number(process.env.SALT_ROUNDS) || 10);
};

module.exports = {
  hashPassword,
};
