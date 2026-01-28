const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompetenceProfile = sequelize.define('CompetenceProfile', {
  competenceProfileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'competence_profile_id'
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
  competenceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'competence_id',
    references: {
      model: 'competence',
      key: 'competence_id'
    }
  },
  yearsOfExperience: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    field: 'years_of_experience'
  }
}, {
  tableName: 'competence_profile',
  timestamps: false
});

module.exports = CompetenceProfile;
