const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'featherpet.db'));

const migration = fs.readFileSync(
  path.join(__dirname, 'migrations', '001_create_pets.sql'),
  'utf8'
);
db.exec(migration);

module.exports = db;
