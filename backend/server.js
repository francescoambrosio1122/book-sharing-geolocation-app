const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Attiva il controllo delle chiavi esterne in SQLite
db.run("PRAGMA foreign_keys = ON");

// Endpoint principale
app.get("/", (req, res) => {
  res.json({
    message: "Book Sharing Geolocation App API attiva",
    version: "2.0.0",
    database: "SQLite"
  });
});

// Endpoint di controllo stato API
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    backend: "Express",
    database: "SQLite",
    timestamp: new Date().toISOString()
  });
});

// Restituisce tutti gli utenti
app.get("/api/users", (req, res) => {
  const sql = `
    SELECT id, name, email, city, created_at AS createdAt
    FROM users
    ORDER BY id DESC
  `;

  db.all(sql, [], (error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Errore durante il recupero degli utenti"
      });
    }

    res.json(rows);
  });
});

// Registra un nuovo utente
app.post("/api/users", (req, res) => {
  const { name, email, city } = req.body;

  if (!name || !email || !city) {
    return res.status(400).json({
      error: "Nome, email e città sono obbligatori"
    });
  }

  const sql = `
    INSERT INTO users (name, email, city)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [name, email, city], function (error) {
    if (error) {
      if (error.message.includes("UNIQUE")) {
        return res.status(409).json({
          error: "Email già registrata"
        });
      }

      return res.status(500).json({
        error: "Errore durante la registrazione dell'utente"
      });
    }

    res.status(201).json({
      message: "Utente registrato correttamente",
      user: {
        id: this.lastID,
        name,
        email,
        city
      }
    });
  });
});

// Restituisce i libri, con filtro facoltativo per città o parola chiave
app.get("/api/books", (req, res) => {
  const { city, search } = req.query;

  let sql = `
    SELECT 
      books.id,
      books.title,
      books.author,
      books.category,
      books.city,
      books.owner_id AS ownerId,
      books.available,
      books.created_at AS createdAt,
      users.name AS ownerName
    FROM books
    JOIN users ON books.owner_id = users.id
    WHERE 1 = 1
  `;

  const params = [];

  if (city) {
    sql += " AND LOWER(books.city) = LOWER(?)";
    params.push(city);
  }

  if (search) {
    sql += `
      AND (
        LOWER(books.title) LIKE LOWER(?)
        OR LOWER(books.author) LIKE LOWER(?)
      )
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY books.id DESC";

  db.all(sql, params, (error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Errore durante il recupero dei libri"
      });
    }

    const books = rows.map((book) => ({
      ...book,
      available: Boolean(book.available)
    }));

    res.json(books);
  });
});

// Inserisce un nuovo libro
app.post("/api/books", (req, res) => {
  const { title, author, category, city, ownerId } = req.body;

  if (!title || !author || !category || !city || !ownerId) {
    return res.status(400).json({
      error: "Titolo, autore, categoria, città e proprietario sono obbligatori"
    });
  }

  const checkUserSql = "SELECT id FROM users WHERE id = ?";

  db.get(checkUserSql, [ownerId], (userError, user) => {
    if (userError) {
      return res.status(500).json({
        error: "Errore durante il controllo dell'utente proprietario"
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "Utente proprietario non trovato"
      });
    }

    const insertBookSql = `
      INSERT INTO books (title, author, category, city, owner_id, available)
      VALUES (?, ?, ?, ?, ?, 1)
    `;

    db.run(
      insertBookSql,
      [title, author, category, city, ownerId],
      function (insertError) {
        if (insertError) {
          return res.status(500).json({
            error: "Errore durante l'inserimento del libro"
          });
        }

        res.status(201).json({
          message: "Libro inserito correttamente",
          book: {
            id: this.lastID,
            title,
            author,
            category,
            city,
            ownerId: Number(ownerId),
            available: true
          }
        });
      }
    );
  });
});

// Crea una richiesta di prestito o scambio
app.post("/api/loan-requests", (req, res) => {
  const { bookId, requesterId, message } = req.body;

  if (!bookId || !requesterId) {
    return res.status(400).json({
      error: "ID libro e ID richiedente sono obbligatori"
    });
  }

  const checkBookSql = `
    SELECT id, available
    FROM books
    WHERE id = ?
  `;

  db.get(checkBookSql, [bookId], (bookError, book) => {
    if (bookError) {
      return res.status(500).json({
        error: "Errore durante il controllo del libro"
      });
    }

    if (!book) {
      return res.status(404).json({
        error: "Libro non trovato"
      });
    }

    if (!book.available) {
      return res.status(409).json({
        error: "Il libro non è attualmente disponibile"
      });
    }

    const checkUserSql = `
      SELECT id
      FROM users
      WHERE id = ?
    `;

    db.get(checkUserSql, [requesterId], (userError, user) => {
      if (userError) {
        return res.status(500).json({
          error: "Errore durante il controllo dell'utente richiedente"
        });
      }

      if (!user) {
        return res.status(404).json({
          error: "Utente richiedente non trovato"
        });
      }

      const insertRequestSql = `
        INSERT INTO loan_requests (book_id, requester_id, message, status)
        VALUES (?, ?, ?, 'pending')
      `;

      db.run(
        insertRequestSql,
        [bookId, requesterId, message || ""],
        function (insertError) {
          if (insertError) {
            return res.status(500).json({
              error: "Errore durante la creazione della richiesta"
            });
          }

          res.status(201).json({
            message: "Richiesta di prestito creata correttamente",
            request: {
              id: this.lastID,
              bookId: Number(bookId),
              requesterId: Number(requesterId),
              message: message || "",
              status: "pending",
              createdAt: new Date().toISOString()
            }
          });
        }
      );
    });
  });
});

// Restituisce tutte le richieste di prestito
app.get("/api/loan-requests", (req, res) => {
  const sql = `
    SELECT
      loan_requests.id,
      loan_requests.book_id AS bookId,
      loan_requests.requester_id AS requesterId,
      loan_requests.message,
      loan_requests.status,
      loan_requests.created_at AS createdAt,
      books.title AS bookTitle,
      users.name AS requesterName
    FROM loan_requests
    JOIN books ON loan_requests.book_id = books.id
    JOIN users ON loan_requests.requester_id = users.id
    ORDER BY loan_requests.id DESC
  `;

  db.all(sql, [], (error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Errore durante il recupero delle richieste"
      });
    }

    res.json(rows);
  });
});

// Aggiorna lo stato di una richiesta di prestito
app.put("/api/loan-requests/:id/status", (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = ["pending", "accepted", "rejected", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Stato non valido"
    });
  }

  const checkRequestSql = `
    SELECT id, book_id AS bookId
    FROM loan_requests
    WHERE id = ?
  `;

  db.get(checkRequestSql, [requestId], (requestError, request) => {
    if (requestError) {
      return res.status(500).json({
        error: "Errore durante il controllo della richiesta"
      });
    }

    if (!request) {
      return res.status(404).json({
        error: "Richiesta non trovata"
      });
    }

    const updateRequestSql = `
      UPDATE loan_requests
      SET status = ?
      WHERE id = ?
    `;

    db.run(updateRequestSql, [status, requestId], function (updateError) {
      if (updateError) {
        return res.status(500).json({
          error: "Errore durante l'aggiornamento della richiesta"
        });
      }

      if (status === "accepted") {
        db.run(
          "UPDATE books SET available = 0 WHERE id = ?",
          [request.bookId]
        );
      }

      if (status === "completed" || status === "rejected") {
        db.run(
          "UPDATE books SET available = 1 WHERE id = ?",
          [request.bookId]
        );
      }

      res.json({
        message: "Stato della richiesta aggiornato correttamente",
        request: {
          id: Number(requestId),
          bookId: request.bookId,
          status
        }
      });
    });
  });
});

// Endpoint non trovato
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint non trovato"
  });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
