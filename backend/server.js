const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulazione di un database in memoria
let users = [
  {
    id: 1,
    name: "Mario Rossi",
    email: "mario.rossi@email.it",
    city: "Napoli"
  },
  {
    id: 2,
    name: "Lucia Bianchi",
    email: "lucia.bianchi@email.it",
    city: "Casoria"
  }
];

let books = [
  {
    id: 1,
    title: "Il nome della rosa",
    author: "Umberto Eco",
    category: "Narrativa",
    city: "Napoli",
    ownerId: 1,
    available: true
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Informatica",
    city: "Casoria",
    ownerId: 2,
    available: true
  }
];

let loanRequests = [];

// Endpoint di controllo
app.get("/", (req, res) => {
  res.json({
    message: "Book Sharing Geolocation App API attiva",
    version: "1.0.0"
  });
});

// Restituisce tutti gli utenti
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Registra un nuovo utente
app.post("/api/users", (req, res) => {
  const { name, email, city } = req.body;

  if (!name || !email || !city) {
    return res.status(400).json({
      error: "Nome, email e città sono obbligatori"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    city
  };

  users.push(newUser);

  res.status(201).json({
    message: "Utente registrato correttamente",
    user: newUser
  });
});

// Restituisce i libri, con possibilità di filtro per città o titolo
app.get("/api/books", (req, res) => {
  const { city, search } = req.query;

  let filteredBooks = books;

  if (city) {
    filteredBooks = filteredBooks.filter(
      book => book.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (search) {
    filteredBooks = filteredBooks.filter(
      book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredBooks);
});

// Inserisce un nuovo libro
app.post("/api/books", (req, res) => {
  const { title, author, category, city, ownerId } = req.body;

  if (!title || !author || !category || !city || !ownerId) {
    return res.status(400).json({
      error: "Titolo, autore, categoria, città e proprietario sono obbligatori"
    });
  }

  const ownerExists = users.find(user => user.id === Number(ownerId));

  if (!ownerExists) {
    return res.status(404).json({
      error: "Utente proprietario non trovato"
    });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    category,
    city,
    ownerId: Number(ownerId),
    available: true
  };

  books.push(newBook);

  res.status(201).json({
    message: "Libro inserito correttamente",
    book: newBook
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

  const book = books.find(book => book.id === Number(bookId));
  const requester = users.find(user => user.id === Number(requesterId));

  if (!book) {
    return res.status(404).json({
      error: "Libro non trovato"
    });
  }

  if (!requester) {
    return res.status(404).json({
      error: "Utente richiedente non trovato"
    });
  }

  if (!book.available) {
    return res.status(409).json({
      error: "Il libro non è attualmente disponibile"
    });
  }

  const newRequest = {
    id: loanRequests.length + 1,
    bookId: Number(bookId),
    requesterId: Number(requesterId),
    message: message || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  loanRequests.push(newRequest);

  res.status(201).json({
    message: "Richiesta di prestito creata correttamente",
    request: newRequest
  });
});

// Restituisce tutte le richieste di prestito
app.get("/api/loan-requests", (req, res) => {
  res.json(loanRequests);
});

// Aggiorna lo stato di una richiesta
app.put("/api/loan-requests/:id/status", (req, res) => {
  const { status } = req.body;
  const requestId = Number(req.params.id);

  const allowedStatuses = ["pending", "accepted", "rejected", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Stato non valido"
    });
  }

  const request = loanRequests.find(request => request.id === requestId);

  if (!request) {
    return res.status(404).json({
      error: "Richiesta non trovata"
    });
  }

  request.status = status;

  res.json({
    message: "Stato della richiesta aggiornato",
    request
  });
});

// Gestione endpoint non trovati
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint non trovato"
  });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
