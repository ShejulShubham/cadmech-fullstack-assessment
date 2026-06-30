// backend/db/connection.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
// require('dotenv').config();

// Resolve database file path relative to the root backend directory
const dbRelativePath = process.env.DB_PATH || './db/equipment.sqlite';
const dbPath = path.resolve(__dirname, '..', dbRelativePath);

// Ensure directory path exists before database allocation
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Establish the database lifecycle connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('CRITICAL: Database instance execution failure:', err.message);
    process.exit(1);
  }
  console.log(`CONNECTED: SQLite instance loaded at ${dbPath}`);
  
  // Seed database automatically if it is initialized empty
  initializeDatabaseSchema();
});

// Run schema setup automatically
function initializeDatabaseSchema() {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='equipment'", (err, row) => {
    if (err) return console.error('Error checking schema:', err.message);
    
    if (!row) {
      console.log('Database empty. Bootstrapping tables from schema.sql...');
      const schemaPath = path.resolve(__dirname, 'schema.sql');
      
      try {
        const sqlContent = fs.readFileSync(schemaPath, 'utf8');
        
        db.exec(sqlContent, (execErr) => {
          if (execErr) console.error('Execution schema bootstrap error:', execErr.message);
          else console.log('Database tables and seed data created successfully.');
        });
      } catch (fileErr) {
        console.error('Failed to read schema.sql file:', fileErr.message);
      }
    }
  });
}

// Promisified query methods to enable clean async/await execution layers
const dbMethods = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbMethods;