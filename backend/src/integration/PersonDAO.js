const Person = require('../model/Person');
const { CompetenceProfile, Competence, Availability } = require('../model');

/**
 * Find a person by username
 * @param {string} username - The username to search for
 * @param {Object|null} transaction - Sequelize transaction
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findByUsername(username, transaction = null) {
  return await Person.findOne({ where: { username }, transaction });
}

/**
 * Find a person by email
 * @param {string} email - The email to search for
 * @param {Object|null} transaction - Sequelize transaction
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findByEmail(email, transaction = null) {
  return await Person.findOne({ where: { email }, transaction });
}

/**
 * Find a person by ID
 * @param {number} id - The person ID
 * @param {Object|null} transaction - Sequelize transaction
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findById(id, transaction = null) {
  return await Person.findByPk(id, { transaction });
}

/**
 * Create a new person
 * @param {Object} personData - The person data
 * @param {string} personData.firstName - First name
 * @param {string} personData.lastName - Last name
 * @param {string} personData.email - Email
 * @param {string} personData.personNumber - Person number
 * @param {string} personData.username - Username
 * @param {string} personData.passwordHash - Hashed password
 * @param {string} personData.role - Role (applicant or recruiter)
 * @returns {Promise<Person>} The created person
 */
async function createPerson(personData, transaction = null) {
  return await Person.create(personData, { transaction });
}

/**
 * Find a person by ID with their competence profiles and availability
 * @param {number} personId - The person ID
 * @returns {Promise<Person|null>} The person with profiles or null if not found
 */
async function findByIdWithProfiles(personId, transaction = null) {
  return await Person.findByPk(personId, {
    include: [
      {
        model: CompetenceProfile,
        include: [Competence]
      },
      {
        model: Availability
      }
    ],
    transaction
  });
}

module.exports = {
  findByUsername,
  findByEmail,
  findById,
  createPerson,
  findByIdWithProfiles
};
