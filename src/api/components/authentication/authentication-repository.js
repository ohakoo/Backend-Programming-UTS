const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}


async function updateLoginAttempt(attempts, lastAttempt, email) {
  return User.updateOne({ email },
  { $set: {attempts, lastAttempt}})
}

module.exports = {
  getUserByEmail,
  updateLoginAttempt
};
