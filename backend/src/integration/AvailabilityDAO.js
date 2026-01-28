const { Availability } = require('../model');

/**
 * Create a new availability period
 * @param {number} personId - The person ID
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Promise<Availability>} The created availability period
 */
async function create(personId, fromDate, toDate) {
  try {
    return await Availability.create({
      personId,
      fromDate,
      toDate
    });
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

/**
 * Find availability periods by person ID
 * @param {number} personId - The person ID
 * @returns {Promise<Availability[]>} Array of availability periods
 */
async function findByPersonId(personId) {
  try {
    return await Availability.findAll({
      where: { personId }
    });
  } catch (error) {
    console.error('Error finding availability by person ID:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByPersonId
};
