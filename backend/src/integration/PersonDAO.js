const Person = require('../model/Person');

/**
 * Find a person by username
 * @param {string} username - The username to search for
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findByUsername(username) {
  return await Person.findOne({ where: { username } });
}

/**
 * Find a person by email
 * @param {string} email - The email to search for
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findByEmail(email) {
  return await Person.findOne({ where: { email } });
}

/**
 * Find a person by ID
 * @param {number} id - The person ID
 * @returns {Promise<Person|null>} The person or null if not found
 */
async function findById(id) {
  return await Person.findByPk(id);
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
async function createPerson(personData) {
  return await Person.create(personData);
}

module.exports = {
  findByUsername,
  findByEmail,
  findById,
  createPerson
};
