const { Competence } = require('../model');

/**
 * Find all competences
 * @returns {Promise<Competence[]>} Array of competences
 */
async function findAll() {
  try {
    return await Competence.findAll();
  } catch (error) {
    console.error('Error finding all competences:', error);
    throw error;
  }
}

/**
 * Find competence by ID
 * @param {number} id - The competence ID
 * @returns {Promise<Competence|null>} The competence or null
 */
async function findById(id) {
  try {
    return await Competence.findByPk(id);
  } catch (error) {
    console.error('Error finding competence by ID:', error);
    throw error;
  }
}

module.exports = {
  findAll,
  findById
};
