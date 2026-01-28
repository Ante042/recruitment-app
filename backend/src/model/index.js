const Person = require('./Person');
const Competence = require('./Competence');
const CompetenceProfile = require('./CompetenceProfile');
const Availability = require('./Availability');

// Person has many CompetenceProfiles and Availabilities
Person.hasMany(CompetenceProfile, { foreignKey: 'personId' });
Person.hasMany(Availability, { foreignKey: 'personId' });

// Competence has many CompetenceProfiles
Competence.hasMany(CompetenceProfile, { foreignKey: 'competenceId' });

// CompetenceProfile belongs to Person and Competence
CompetenceProfile.belongsTo(Person, { foreignKey: 'personId' });
CompetenceProfile.belongsTo(Competence, { foreignKey: 'competenceId' });

// Availability belongs to Person
Availability.belongsTo(Person, { foreignKey: 'personId' });

module.exports = {
  Person,
  Competence,
  CompetenceProfile,
  Availability
};
