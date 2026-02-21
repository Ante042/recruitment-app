const { Availability } = require('../model');
const { isPositiveInteger } = require('../util/validation');

/**
 * Create a new availability period.
 * @param {number} personId - The person ID
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Availability>} The created availability period
 */
async function create(personId, fromDate, toDate, transaction = null) {
  if (!isPositiveInteger(personId)) throw new Error('personId must be a positive integer');
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fromDate || !dateRegex.test(fromDate)) throw new Error('fromDate must be in YYYY-MM-DD format');
  if (!toDate || !dateRegex.test(toDate)) throw new Error('toDate must be in YYYY-MM-DD format');
  if (new Date(toDate) < new Date(fromDate)) throw new Error('toDate must be equal to or after fromDate');
  try {
    return await Availability.create({
      personId,
      fromDate,
      toDate
    }, { transaction });
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

/**
 * Find availability periods by person ID.
 * @param {number} personId - The person ID
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Availability[]>} Array of availability periods
 */
async function findByPersonId(personId, transaction = null) {
  try {
    return await Availability.findAll({
      where: { personId },
      transaction
    });
  } catch (error) {
    console.error('Error finding availability by person ID:', error);
    throw error;
  }
}

/**
 * Delete an availability period by ID with ownership check.
 * @param {number} availabilityId - The availability ID
 * @param {number} personId - The person ID for ownership verification
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteById(availabilityId, personId, transaction = null) {
  if (!isPositiveInteger(availabilityId)) throw new Error('availabilityId must be a positive integer');
  if (!isPositiveInteger(personId)) throw new Error('personId must be a positive integer');
  try {
    const period = await Availability.findOne({
      where: {
        availabilityId,
        personId
      },
      transaction
    });

    if (!period) return false;

    await period.destroy({ transaction });
    return true;
  } catch (error) {
    console.error('Error deleting availability period:', error);
    throw error;
  }
}

/**
 * Delete all availability periods for a person
 * @param {number} personId - The person ID
 * @param {Object} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of deleted rows
 */
async function deleteAllByPersonId(personId, transaction = null) {
  if (!isPositiveInteger(personId)) throw new Error('personId must be a positive integer');
  try {
    return await Availability.destroy({
      where: { personId },
      transaction
    });
  } catch (error) {
    console.error('Error deleting all availability periods for person:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByPersonId,
  deleteById,
  deleteAllByPersonId
};
