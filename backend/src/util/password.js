const bcrypt = require('bcrypt');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - The plain text password
 * @returns {Promise<string>} The hashed password
 */
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
}

/**
 * Compare a plain text password with a hash
 * @param {string} plainPassword - The plain text password
 * @param {string} hash - The hashed password
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
async function comparePassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
