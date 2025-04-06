const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

module.exports = { hashPassword, comparePasswords };