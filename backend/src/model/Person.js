const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Sequelize model representing a person (applicant or recruiter).
 * @type {import('sequelize').Model}
 */
const Person = sequelize.define('Person', {
  personId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'person_id'
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'first_name',
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'last_name',
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  personNumber: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
    field: 'person_number',
    validate: {
      notEmpty: true
    }
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash',
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['applicant', 'recruiter']]
    }
  }
}, {
  tableName: 'person',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Person;
