require('dotenv').config();
const sequelize = require('../src/config/database');
const Person = require('../src/model/Person');
const { hashPassword } = require('../src/util/password');

async function createRecruiter() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync();
    console.log('Database synced');

    // Check if recruiter already exists
    const existing = await Person.findOne({ where: { username: 'recruiter1' } });
    if (existing) {
      console.log('Recruiter already exists');
      process.exit(0);
    }

    // Create recruiter account
    const passwordHash = await hashPassword('RecruiterPass123');

    const recruiter = await Person.create({
      firstName: 'Test',
      lastName: 'Recruiter',
      email: 'recruiter@recruitment.com',
      personNumber: '19850101-1234',
      username: 'recruiter1',
      passwordHash,
      role: 'recruiter'
    });

    console.log('Recruiter created successfully:');
    console.log('  Username: recruiter1');
    console.log('  Password: RecruiterPass123');
    console.log('  Role: recruiter');

    process.exit(0);
  } catch (error) {
    console.error('Error creating recruiter:', error);
    process.exit(1);
  }
}

createRecruiter();
