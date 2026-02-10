const PersonDAO = require('../integration/PersonDAO');

/**
 * Get the authenticated user's profile with competences and availability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyProfile(req, res) {
  try {
    const person = await PersonDAO.findByIdWithProfiles(req.user.id);

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
