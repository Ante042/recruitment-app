const { CompetenceProfile } = require('../model');

/**
 * Create a new competence profile.
 * @param {number} personId - The person ID
 * @param {number} competenceId - The competence ID
 * @param {number} years - Years of experience
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<CompetenceProfile>} The created competence profile
 */
async function create(personId, competenceId, years, transaction = null) {
  try {
    return await CompetenceProfile.create({
      personId,
      competenceId,
      yearsOfExperience: years
    }, { transaction });
  } catch (error) {
    console.error('Error creating competence profile:', error);
    throw error;
  }
}

/**
 * Find competence profiles by person ID.
 * @param {number} personId - The person ID
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<CompetenceProfile[]>} Array of competence profiles
 */
async function findByPersonId(personId, transaction = null) {
  try {
    return await CompetenceProfile.findAll({
      where: { personId },
      transaction
    });
  } catch (error) {
    console.error('Error finding competence profiles by person ID:', error);
    throw error;
  }
}

/**
 * Delete a competence profile by ID with ownership check.
 * @param {number} competenceProfileId - The competence profile ID
 * @param {number} personId - The person ID for ownership verification
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteById(competenceProfileId, personId, transaction = null) {
  try {
    const profile = await CompetenceProfile.findOne({
      where: {
        competenceProfileId,
        personId
      },
      transaction
    });

    if (!profile) return false;

    await profile.destroy({ transaction });
    return true;
  } catch (error) {
    console.error('Error deleting competence profile:', error);
    throw error;
  }
}

/**
 * Delete all competence profiles for a person
 * @param {number} personId - The person ID
 * @param {Object} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of deleted rows
 */
async function deleteAllByPersonId(personId, transaction = null) {
  try {
    return await CompetenceProfile.destroy({
      where: { personId },
      transaction
    });
  } catch (error) {
    console.error('Error deleting all competence profiles for person:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByPersonId,
  deleteById,
  deleteAllByPersonId
};
