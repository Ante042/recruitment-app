const PersonDAO = require('../integration/PersonDAO');
const { NotFoundError } = require('../util/errors');
const { handleDatabaseError } = require('../util/databaseErrorHandler');
const sequelize = require('../config/database');

/**
 * Get the authenticated user's profile with competences and availability.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function getMyProfile(req, res, next) {
  try {
    const person = await PersonDAO.findByIdWithProfiles(req.user.id);

    if (!person) {
      throw new NotFoundError('Profile');
    }

    res.json(person);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'getMyProfile'));
    } else {
      next(error);
    }
  }
}

module.exports = {
  getMyProfile
};
