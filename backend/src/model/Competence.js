const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competence = sequelize.define('Competence', {
  competenceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'competence_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'competence',
  timestamps: false
});

module.exports = Competence;
