const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Sequelize model representing a submitted application.
 * @type {import('sequelize').Model}
 */
const Application = sequelize.define('Application', {
  applicationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'application_id'
  },
  personId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'person_id',
    references: {
      model: 'person',
      key: 'person_id'
    }
  },
  status: {
    type: DataTypes.ENUM('unhandled', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'unhandled',
    validate: {
      isIn: [['unhandled', 'accepted', 'rejected']]
    }
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'submitted_at'
  }
}, {
  tableName: 'application',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Application;
