const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Sequelize model representing an availability period for a person.
 * @type {import('sequelize').Model}
 */
const Availability = sequelize.define('Availability', {
  availabilityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'availability_id'
  },
  personId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'person_id',
    references: {
      model: 'person',
      key: 'person_id'
    }
  },
  fromDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'from_date'
  },
  toDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'to_date'
  }
}, {
  tableName: 'availability',
  timestamps: false
});

module.exports = Availability;
