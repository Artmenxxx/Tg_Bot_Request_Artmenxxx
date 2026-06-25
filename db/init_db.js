import db from "./db.js";

db.exec(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    email TEXT,
    message TEXT,
    telegram_id INTEGER,
    username TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)