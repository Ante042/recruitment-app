require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const sequelize = require('../src/config/database');
const Person = require('../src/model/Person');
const Competence = require('../src/model/Competence');
const CompetenceProfile = require('../src/model/CompetenceProfile');
const Availability = require('../src/model/Availability');

const { parseSqlCopyStatements } = require('./helpers/sqlParser');
const {
  TEMP_PASSWORD,
  initTempPasswordHash,
  hashRecruiterPasswords,
  transformPerson,
  transformCompetence,
  transformCompetenceProfile,
  transformAvailability
} = require('./helpers/dataTransformer');

// Path to the existing database SQL dump - pass as argument or use default
const path = require('path');
const SQL_FILE = process.argv[2] || path.join(__dirname, 'existing-database.sql');

async function setupAssociations() {
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
}

async function verifyMigration() {
  console.log('\n--- Verifying Migration ---');

  const checks = [
    { name: 'Persons', expected: 900, actual: await Person.count() },
    { name: 'Recruiters', expected: 10, actual: await Person.count({ where: { role: 'recruiter' } }) },
    { name: 'Applicants', expected: 890, actual: await Person.count({ where: { role: 'applicant' } }) },
    { name: 'Competencies', expected: 3, actual: await Competence.count() },
    { name: 'Competence Profiles', expected: 1357, actual: await CompetenceProfile.count() },
    { name: 'Availability', expected: 2324, actual: await Availability.count() }
  ];

  let allPassed = true;
  checks.forEach(c => {
    const passed = c.expected === c.actual;
    const status = passed ? 'OK' : 'FAIL';
    console.log(`[${status}] ${c.name}: ${c.actual}/${c.expected}`);
    if (!passed) allPassed = false;
  });

  if (!allPassed) {
    throw new Error('Verification failed - counts do not match');
  }

  console.log('\nAll verifications passed!');
}

async function resetSequences() {
  console.log('\n--- Resetting Sequences ---');

  const sequences = [
    { table: 'person', column: 'person_id' },
    { table: 'competence', column: 'competence_id' },
    { table: 'competence_profile', column: 'competence_profile_id' },
    { table: 'availability', column: 'availability_id' }
  ];

  for (const seq of sequences) {
    try {
      await sequelize.query(
        `SELECT setval('${seq.table}_${seq.column}_seq', (SELECT COALESCE(MAX(${seq.column}), 1) FROM ${seq.table}))`
      );
      console.log(`Reset sequence for ${seq.table}`);
    } catch (err) {
      // Sequence might not exist if table uses SERIAL
      console.log(`Skipped sequence for ${seq.table} (might not exist)`);
    }
  }
}

async function runMigration() {
  console.log('=== Database Migration Script ===\n');
  console.log(`SQL File: ${SQL_FILE}`);
  console.log(`Temp Password for Applicants: ${TEMP_PASSWORD}\n`);

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established');

    // Setup associations
    await setupAssociations();

    // Check if database already has data
    const existingCount = await Person.count();
    if (existingCount > 0) {
      console.log(`\nDatabase already contains ${existingCount} persons.`);
      console.log('To re-run migration, clear the database first.');
      console.log('Aborting to prevent duplicate data.\n');
      process.exit(1);
    }

    // Parse SQL file first (need data for hashing)
    console.log('\n--- Preparing Data ---');
    console.log('Parsing SQL file...');
    const data = parseSqlCopyStatements(SQL_FILE);
    console.log(`Parsed: ${data.person.length} persons, ${data.competence.length} competencies, ${data.competence_profile.length} profiles, ${data.availability.length} availabilities`);

    // Initialize password hashes
    await initTempPasswordHash();
    console.log('Temp password hash generated for applicants');

    console.log('Hashing recruiter passwords...');
    await hashRecruiterPasswords(data.person);
    console.log('Recruiter passwords hashed');

    // Sync schema (create tables if they don't exist)
    console.log('\n--- Syncing Schema ---');
    await sequelize.sync({ force: false });
    console.log('Schema synced');

    // Import competencies first (no dependencies)
    console.log('\n--- Importing Data ---');
    console.log('Importing competencies...');
    const competencies = data.competence.map(transformCompetence);
    await Competence.bulkCreate(competencies);
    console.log(`Imported ${competencies.length} competencies`);

    // Import persons
    console.log('Importing persons...');
    const persons = data.person.map(transformPerson);
    await Person.bulkCreate(persons);
    console.log(`Imported ${persons.length} persons`);

    // Import competence profiles
    console.log('Importing competence profiles...');
    const profiles = data.competence_profile.map(transformCompetenceProfile);
    await CompetenceProfile.bulkCreate(profiles);
    console.log(`Imported ${profiles.length} competence profiles`);

    // Import availability
    console.log('Importing availability periods...');
    const availabilities = data.availability.map(transformAvailability);
    await Availability.bulkCreate(availabilities);
    console.log(`Imported ${availabilities.length} availability periods`);

    // Reset sequences
    await resetSequences();

    // Verify migration
    await verifyMigration();

    console.log('\n=== Migration Complete! ===\n');
    console.log('Summary:');
    console.log('- Recruiters can login with their original username/password');
    console.log(`- Applicants can login with: username (firstname.lastname.id) / password: ${TEMP_PASSWORD}`);
    console.log('- Example applicant login: leroy.crane.11 / NewApplicant2026!\n');

  } catch (error) {
    console.error('\nMigration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
