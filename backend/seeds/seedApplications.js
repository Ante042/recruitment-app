require('dotenv').config();
const sequelize = require('../src/config/database');
const { Person, Application, CompetenceProfile } = require('../src/model');

/**
 * Seed application records for existing applicants who have competence profiles
 */
async function seedApplications() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync database schema to create Application table if it doesn't exist
    await sequelize.sync();
    console.log('Database schema synced');

    // Find all applicants who have competence profiles
    const applicants = await Person.findAll({
      where: { role: 'applicant' },
      include: [
        {
          model: CompetenceProfile,
          required: true
        }
      ]
    });

    console.log(`Found ${applicants.length} applicants with competence profiles`);

    let created = 0;
    let skipped = 0;

    for (const applicant of applicants) {
      // Check if application already exists
      const existingApp = await Application.findOne({
        where: { personId: applicant.personId }
      });

      if (existingApp) {
        skipped++;
        continue;
      }

      // Create application with default status
      await Application.create({
        personId: applicant.personId,
        status: 'unhandled'
      });

      created++;
    }

    console.log(`Created ${created} applications`);
    console.log(`Skipped ${skipped} existing applications`);
    console.log('Seeding complete');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedApplications();
