/* Conexão com o banco (SQLite). Na primeira execução cria o arquivo e carrega
   db/schema.sql e db/seed.sql. */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'db', 'quadraja4.db');
const read = f => fs.readFileSync(path.join(__dirname, '..', 'db', f), 'utf8');

function open({ reset = false } = {}) {
  if (reset && fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
  const db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const hasTables = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='quadras'").get();
  if (!hasTables) {
    db.exec(read('schema.sql'));
    db.exec(read('seed.sql'));
    console.log('Banco criado e populado:', DB_FILE);
  }
  return db;
}

module.exports = { open, DB_FILE };

if (require.main === module && process.argv.includes('--reset')) {
  open({ reset: true }).close();
  console.log('Banco recriado do zero.');
}
