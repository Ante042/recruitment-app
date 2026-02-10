const { CompetenceProfile } = require('../model');

/**
 * Create a new competence profile
 * @param {number} personId - The person ID
 * @param {number} competenceId - The competence ID
 * @param {number} years - Years of experience
 * @returns {Promise<CompetenceProfile>} The created competence profile
 */
async function create(personId, competenceId, years) {
  try {
    return await CompetenceProfile.create({
      personId,
      competenceId,
      yearsOfExperience: years
    });
  } catch (error) {
    console.error('Error creating competence profile:', error);
    throw error;
  }
}

/**
 * Find competence profiles by person ID
 * @param {number} personId - The person ID
 * @returns {Promise<CompetenceProfile[]>} Array of competence profiles
 */
async function findByPersonId(personId) {
  try {
    return await CompetenceProfile.findAll({
      where: { personId }
    });
  } catch (error) {
    console.error('Error finding competence profiles by person ID:', error);
    throw error;
  }
}

/**
 * Delete a competence profile by ID with ownership check
 * @param {number} competenceProfileId - The competence profile ID
 * @param {number} personId - The person ID for ownership verification
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteById(competenceProfileId, personId) {
  try {
    const profile = await CompetenceProfile.findOne({
      where: {
        competenceProfileId,
        personId
      }
    });

    if (!profile) return false;

    await profile.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting competence profile:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByPersonId,
  deleteById
};
