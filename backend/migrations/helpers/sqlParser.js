const fs = require('fs');

/**
 * Parse PostgreSQL COPY statements from a SQL dump file.
 * Returns structured data for each table.
 */
function parseSqlCopyStatements(sqlFilePath) {
  const content = fs.readFileSync(sqlFilePath, 'utf8');
  const lines = content.split('\n');

  const data = {
    person: [],
    competence: [],
    competence_profile: [],
    availability: [],
    role: []
  };

  let currentTable = null;
  let columns = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for COPY statement start
    const copyMatch = line.match(/^COPY public\.(\w+)\s*\(([^)]+)\)\s*FROM stdin;$/);
    if (copyMatch) {
      currentTable = copyMatch[1];
      columns = copyMatch[2].split(',').map(c => c.trim());
      continue;
    }

    // Check for end of COPY data
    if (line === '\\.' && currentTable) {
      currentTable = null;
      columns = [];
      continue;
    }

    // Parse data rows
    if (currentTable && data[currentTable] !== undefined) {
      const values = line.split('\t');
      if (values.length === columns.length) {
        const row = {};
        columns.forEach((col, idx) => {
          let val = values[idx];
          // Handle NULL values (\N in PostgreSQL)
          if (val === '\\N') {
            val = null;
          }
          row[col] = val;
        });
        data[currentTable].push(row);
      }
    }
  }

  return data;
}

module.exports = { parseSqlCopyStatements };
