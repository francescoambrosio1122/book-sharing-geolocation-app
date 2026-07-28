-- Schema SQLite per Book Sharing Geolocation App
-- Project Work - Informatica per le Aziende Digitali L-31

PRAGMA foreign_keys = ON;

-- Tabella utenti
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabella libri
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
);

-- Tabella richieste di prestito o scambio
CREATE TABLE IF NOT EXISTS loan_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    requester_id INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- Tabella feedback tra utenti
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_request_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_request_id) REFERENCES loan_requests(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Tabella segnalazioni
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER NOT NULL,
    reported_user_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_user_id) REFERENCES users(id)
);

-- Dati dimostrativi utenti
INSERT INTO users (name, email, city)
VALUES
('Mario Rossi', 'mario.rossi@email.it', 'Napoli'),
('Lucia Bianchi', 'lucia.bianchi@email.it', 'Casoria'),
('Giuseppe Verdi', 'giuseppe.verdi@email.it', 'Afragola');

-- Dati dimostrativi libri
INSERT INTO books (title, author, category, city, owner_id, available)
VALUES
('Il nome della rosa', 'Umberto Eco', 'Narrativa', 'Napoli', 1, 1),
('Clean Code', 'Robert C. Martin', 'Informatica', 'Casoria', 2, 1),
('Le città invisibili', 'Italo Calvino', 'Narrativa', 'Afragola', 3, 1);

-- Dati dimostrativi richieste
INSERT INTO loan_requests (book_id, requester_id, message, status)
VALUES
(1, 2, 'Vorrei prendere in prestito questo libro per due settimane.', 'pending'),
(2, 1, 'Sono interessato al testo per approfondire argomenti di programmazione.', 'accepted');
