import Database from "better-sqlite3";

const db = new Database("database.db")

db.pragma('journal_mode = WAL')

console.log("Бд включена")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER UNIQUE,
    email TEXT,
    text TEXT,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);