const bcrypt = require('bcrypt');

// Temp password for all applicants who lack login credentials
const TEMP_PASSWORD = 'NewApplicant2026!';
let TEMP_PASSWORD_HASH = null;

// Cache for recruiter password hashes
const recruiterPasswordHashes = new Map();

/**
 * Generate username from name components.
 * Format: firstname.lastname.id (all lowercase, no special chars)
 */
function generateUsername(firstName, lastName, personId) {
  const clean = str => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z]/g, '');         // Keep only a-z

  return `${clean(firstName)}.${clean(lastName)}.${personId}`;
}

/**
 * Initialize the temp password hash (async operation).
 * Must be called before transformPersons.
 */
async function initTempPasswordHash() {
  if (!TEMP_PASSWORD_HASH) {
    TEMP_PASSWORD_HASH = await bcrypt.hash(TEMP_PASSWORD, 10);
  }
  return TEMP_PASSWORD_HASH;
}

/**
 * Hash recruiter passwords before migration.
 * The old database stored plaintext passwords for recruiters.
 */
async function hashRecruiterPasswords(persons) {
  const recruiters = persons.filter(p => p.role_id === '1');
  for (const r of recruiters) {
    if (r.password && !recruiterPasswordHashes.has(r.password)) {
      const hash = await bcrypt.hash(r.password, 10);
      recruiterPasswordHashes.set(r.password, hash);
    }
  }
}

/**
 * Transform a person from old schema to new schema.
 * Handles missing data for applicants (password, username).
 */
function transformPerson(oldPerson) {
  const isRecruiter = oldPerson.role_id === '1';

  if (isRecruiter) {
    // Recruiters have password and username but lack email and pnr
    return {
      personId: parseInt(oldPerson.person_id),
      firstName: oldPerson.name,
      lastName: oldPerson.surname,
      personNumber: oldPerson.pnr || `RECRUITER-${oldPerson.person_id}`,
      email: oldPerson.email || `${oldPerson.username.toLowerCase()}@temp.local`,
      username: oldPerson.username,
      passwordHash: recruiterPasswordHashes.get(oldPerson.password),
      role: 'recruiter'
    };
  } else {
    // Applicants have email and pnr but lack password and username
    return {
      personId: parseInt(oldPerson.person_id),
      firstName: oldPerson.name,
      lastName: oldPerson.surname,
      personNumber: oldPerson.pnr,
      email: oldPerson.email,
      username: generateUsername(oldPerson.name, oldPerson.surname, oldPerson.person_id),
      passwordHash: TEMP_PASSWORD_HASH,
      role: 'applicant'
    };
  }
}

/**
 * Transform competence from old schema.
 */
function transformCompetence(oldCompetence) {
  return {
    competenceId: parseInt(oldCompetence.competence_id),
    name: oldCompetence.name
  };
}

/**
 * Transform competence profile from old schema.
 */
function transformCompetenceProfile(oldProfile) {
  return {
    competenceProfileId: parseInt(oldProfile.competence_profile_id),
    personId: parseInt(oldProfile.person_id),
    competenceId: parseInt(oldProfile.competence_id),
    yearsOfExperience: parseFloat(oldProfile.years_of_experience)
  };
}

/**
 * Transform availability from old schema.
 */
function transformAvailability(oldAvailability) {
  return {
    availabilityId: parseInt(oldAvailability.availability_id),
    personId: parseInt(oldAvailability.person_id),
    fromDate: oldAvailability.from_date,
    toDate: oldAvailability.to_date
  };
}

module.exports = {
  TEMP_PASSWORD,
  generateUsername,
  initTempPasswordHash,
  hashRecruiterPasswords,
  transformPerson,
  transformCompetence,
  transformCompetenceProfile,
  transformAvailability
};
