const PersonDAO = require('../integration/PersonDAO');
const sequelize = require('../config/database');

/**
 * Get the authenticated user's profile with competences and availability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyProfile(req, res) {
  try {
    const person = await sequelize.transaction(async (t) => {
      return await PersonDAO.findByIdWithProfiles(req.user.id, t);
    });

    if (!person) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(person);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

module.exports = {
  getMyProfile
};
