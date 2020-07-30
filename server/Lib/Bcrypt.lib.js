const { hash, compare } = require('bcrypt');

const hashPassword = (password) => {
  return hash(password, Number(process.env.SALT_ROUNDS) || 10);
};

const comparePassword = (password, hashedPassword) => {
  console.log({
    password,
    hashedPassword,
  })
  return compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
