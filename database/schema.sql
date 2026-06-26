-- Schema dimostrativo per Book Sharing Geolocation App
-- Project Work - Informatica per le Aziende Digitali L-31

CREATE DATABASE IF NOT EXISTS book_sharing_geolocation;

USE book_sharing_geolocation;

-- Tabella utenti
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella libri
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    owner_id INT NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabella richieste di prestito o scambio
CREATE TABLE loan_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    requester_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabella feedback tra utenti
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loan_request_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_request_id) REFERENCES loan_requests(id)
        ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabella segnalazioni
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    reported_user_id INT NOT NULL,
    book_id INT,
    reason TEXT NOT NULL,
    status ENUM('open', 'in_review', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE SET NULL
);

-- Dati dimostrativi utenti
INSERT INTO users (name, email, password_hash, city, postal_code, latitude, longitude)
VALUES
('Mario Rossi', 'mario.rossi@email.it', 'hash_password_demo_1', 'Napoli', '80100', 40.8518, 14.2681),
('Lucia Bianchi', 'lucia.bianchi@email.it', 'hash_password_demo_2', 'Casoria', '80026', 40.9066, 14.2907),
('Giuseppe Verdi', 'giuseppe.verdi@email.it', 'hash_password_demo_3', 'Afragola', '80021', 40.9220, 14.3094);

-- Dati dimostrativi libri
INSERT INTO books (title, author, category, description, owner_id, city, latitude, longitude, available)
VALUES
('Il nome della rosa', 'Umberto Eco', 'Narrativa', 'Romanzo storico disponibile per prestito.', 1, 'Napoli', 40.8518, 14.2681, TRUE),
('Clean Code', 'Robert C. Martin', 'Informatica', 'Manuale di programmazione e buone pratiche software.', 2, 'Casoria', 40.9066, 14.2907, TRUE),
('Le città invisibili', 'Italo Calvino', 'Narrativa', 'Testo letterario disponibile per scambio.', 3, 'Afragola', 40.9220, 14.3094, TRUE);

-- Dati dimostrativi richieste
INSERT INTO loan_requests (book_id, requester_id, message, status)
VALUES
(1, 2, 'Vorrei prendere in prestito questo libro per due settimane.', 'pending'),
(2, 1, 'Sono interessato al testo per approfondire argomenti di programmazione.', 'accepted');
