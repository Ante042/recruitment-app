# Migrations

## importExistingData.js

Imports data from `existing-database.sql` (900 persons, 3 competencies, etc).

```bash
node migrations/importExistingData.js
```

### Missing data

Old database was missing credentials for applicants, so we generate:
- Username: `firstname.lastname.id` (e.g. `leroy.crane.11`)
- Password: `NewApplicant2026!`

Recruiters keep their original passwords.
