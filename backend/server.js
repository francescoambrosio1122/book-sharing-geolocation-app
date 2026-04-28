const express = require('express');
const app = express();

app.use(express.json());

// simulazione database libri
let books = [];

// ottenere tutti i libri
app.get('/books', (req, res) => {
  res.json(books);
});

// aggiungere un libro
app.post('/books', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.json({ message: "Libro aggiunto", newBook });
});

app.listen(3000, () => {
  console.log("Server avviato sulla porta 3000");
});
