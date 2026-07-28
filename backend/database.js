const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "book_sharing.db");

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Errore durante la connessione al database:", error.message);
  } else {
    console.log("Database SQLite collegato correttamente");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      city TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      available INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS loan_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      requester_id INTEGER NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (requester_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_request_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (loan_request_id) REFERENCES loan_requests(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_id INTEGER NOT NULL,
      reported_user_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id),
      FOREIGN KEY (reported_user_id) REFERENCES users(id)
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM users", (error, row) => {
    if (error) {
      console.error("Errore controllo dati iniziali:", error.message);
      return;
    }

    if (row.count === 0) {
      db.run(`
        INSERT INTO users (name, email, city)
        VALUES 
        ('Mario Rossi', 'mario.rossi@email.it', 'Napoli'),
        ('Lucia Bianchi', 'lucia.bianchi@email.it', 'Casoria'),
        ('Giuseppe Verdi', 'giuseppe.verdi@email.it', 'Afragola')
      `);

      db.run(`
        INSERT INTO books (title, author, category, city, owner_id, available)
        VALUES
        ('Il nome della rosa', 'Umberto Eco', 'Narrativa', 'Napoli', 1, 1),
        ('Clean Code', 'Robert C. Martin', 'Informatica', 'Casoria', 2, 1),
        ('Le città invisibili', 'Italo Calvino', 'Narrativa', 'Afragola', 3, 1)
      `);
    }
  });
});

module.exports = db;
