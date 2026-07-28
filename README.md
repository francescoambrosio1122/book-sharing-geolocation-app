# Book Sharing Geolocation App

## Descrizione del progetto

Book Sharing Geolocation App è una full-stack application sviluppata nell’ambito del Project Work del corso di laurea in Informatica per le Aziende Digitali (L-31).

L’obiettivo del progetto è realizzare una piattaforma digitale per la condivisione del patrimonio librario privato attraverso un sistema basato su geolocalizzazione. Gli utenti possono registrarsi, inserire i libri disponibili, cercare testi presenti nella propria area geografica e inviare richieste di prestito o scambio.

Il progetto è strutturato come applicazione web full-stack, composta da frontend, backend, database SQLite e API REST.

---

## Funzionalità principali

L’applicazione prevede le seguenti funzionalità:

- registrazione degli utenti;
- inserimento di libri associati a un proprietario;
- consultazione dei libri disponibili;
- ricerca dei libri per titolo, autore o città;
- gestione delle richieste di prestito o scambio;
- aggiornamento dello stato delle richieste;
- salvataggio dei dati in un database SQLite reale;
- struttura dati relazionale per utenti, libri, richieste, feedback e segnalazioni.

---

## Architettura del sistema

Il progetto è organizzato secondo un’architettura client-server suddivisa in tre livelli principali:

1. **Frontend**  
   Rappresenta l’interfaccia utente e consente di interagire con il sistema tramite una pagina HTML.

2. **Backend**  
   Gestisce la logica applicativa attraverso API REST realizzate con Node.js ed Express.

3. **Database**  
   Gestisce la persistenza dei dati tramite SQLite, un database relazionale leggero e integrato nel progetto.

La comunicazione tra frontend e backend avviene tramite richieste HTTP e scambio di dati in formato JSON.

---

## Struttura del repository

```text
book-sharing-geolocation-app/
│
├── backend/
│   ├── server.js
│   ├── database.js
│   └── package.json
│
├── frontend/
│   └── index.html
│
├── database/
│   └── schema.sql
│
├── .env.example
└── README.md
```

---

## Tecnologie utilizzate

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- SQLite
- API REST
- JSON
- SQL
- Architettura client-server
- Full-stack application

---

## Backend

Il backend è realizzato con Node.js ed Express.js.

Il file `backend/server.js` espone le API REST utilizzate dal frontend per comunicare con il sistema.

Il file `backend/database.js` gestisce la connessione al database SQLite, crea automaticamente le tabelle principali se non esistono e inserisce alcuni dati iniziali utili al funzionamento dell’applicazione.

Il backend non utilizza più dati simulati direttamente nel file `server.js`, ma legge e scrive le informazioni all’interno di un database SQLite reale.

---

## Database SQLite

Il progetto utilizza SQLite come database relazionale.

All’avvio del backend viene creato automaticamente un file database denominato:

```text
book_sharing.db
```

Il database contiene le seguenti tabelle:

- `users`: utenti registrati;
- `books`: libri disponibili;
- `loan_requests`: richieste di prestito o scambio;
- `feedback`: valutazioni tra utenti;
- `reports`: segnalazioni.

Il file `database/schema.sql` contiene lo schema SQL del database ed è utile per visualizzare la struttura relazionale del sistema.

---

## Endpoint principali

### Stato del sistema

```http
GET /api/status
```

Restituisce lo stato del backend e del database.

### Utenti

```http
GET /api/users
```

Restituisce l’elenco degli utenti registrati.

```http
POST /api/users
Content-Type: application/json
```

Registra un nuovo utente.

Esempio:

```json
{
  "name": "Anna Rossi",
  "email": "anna.rossi@email.it",
  "city": "Napoli"
}
```

### Libri

```http
GET /api/books
```

Restituisce l’elenco dei libri disponibili.

```http
GET /api/books?city=Napoli
```

Filtra i libri in base alla città.

```http
GET /api/books?search=Eco
```

Filtra i libri in base a titolo o autore.

```http
POST /api/books
Content-Type: application/json
```

Inserisce un nuovo libro.

Esempio:

```json
{
  "title": "Il nome della rosa",
  "author": "Umberto Eco",
  "category": "Narrativa",
  "city": "Napoli",
  "ownerId": 1
}
```

### Richieste di prestito

```http
GET /api/loan-requests
```

Restituisce l’elenco delle richieste di prestito o scambio.

```http
POST /api/loan-requests
Content-Type: application/json
```

Crea una nuova richiesta di prestito o scambio.

Esempio:

```json
{
  "bookId": 1,
  "requesterId": 2,
  "message": "Vorrei prendere in prestito questo libro per due settimane."
}
```

```http
PUT /api/loan-requests/1/status
Content-Type: application/json
```

Aggiorna lo stato di una richiesta.

Esempio:

```json
{
  "status": "accepted"
}
```

Gli stati previsti sono:

- `pending`
- `accepted`
- `rejected`
- `completed`

---

## Frontend

Il frontend è costituito da una pagina HTML dimostrativa che consente di:

- registrare un utente;
- inserire un libro;
- cercare libri disponibili;
- filtrare i libri per città;
- creare una richiesta di prestito;
- visualizzare utenti e richieste.

La pagina comunica con il backend tramite chiamate `fetch()` e riceve risposte in formato JSON.

---

## Configurazione del progetto

Il file `.env.example` contiene un esempio di configurazione del progetto.

Esempio:

```env
PORT=3000
API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

In una versione futura potrebbero essere aggiunte variabili di configurazione per database esterni, autenticazione e API di geolocalizzazione.

---

## Avvio del backend

Per avviare il backend è necessario avere Node.js installato.

Entrare nella cartella backend:

```bash
cd backend
```

Installare le dipendenze:

```bash
npm install
```

Avviare il server:

```bash
npm start
```

Il backend sarà disponibile all’indirizzo:

```text
http://localhost:3000
```

Per verificare che il backend sia attivo è possibile aprire:

```text
http://localhost:3000/api/status
```

---

## Avvio del frontend

Aprire il file:

```text
frontend/index.html
```

Il frontend comunica con il backend all’indirizzo:

```text
http://localhost:3000/api
```

Per un corretto funzionamento è necessario che il backend sia già avviato.

---

## Esempio di flusso operativo

1. L’utente si registra inserendo nome, email e città.
2. I dati dell’utente vengono salvati nel database SQLite.
3. L’utente inserisce un libro specificando titolo, autore, categoria e città.
4. Il backend salva il libro nel database associandolo al proprietario.
5. Un altro utente cerca libri disponibili nella propria zona.
6. Il sistema interroga il database e restituisce i risultati filtrati.
7. L’utente invia una richiesta di prestito o scambio.
8. Il backend registra la richiesta nel database e ne gestisce lo stato.

---

## Aspetti di sicurezza e privacy

Il progetto considera alcuni principi fondamentali di sicurezza informatica e protezione dei dati personali:

- raccolta dei soli dati necessari al funzionamento del servizio;
- gestione controllata delle richieste;
- separazione tra frontend, backend e database;
- utilizzo di API REST;
- possibilità di utilizzo del protocollo HTTPS in una futura implementazione online;
- struttura predisposta per eventuale autenticazione e gestione sicura delle credenziali.

---

## Limiti del prototipo

Il progetto rappresenta una full-stack application di base, utile a dimostrare il funzionamento principale del sistema.

Alcuni aspetti, come autenticazione completa, login con password, geolocalizzazione tramite API esterne, deploy cloud e gestione avanzata degli utenti, sono indicati come possibili sviluppi futuri.

La scelta di SQLite consente di avere un database reale e persistente, mantenendo però il progetto semplice da eseguire e adatto a una finalità didattica.

---

## Sviluppi futuri

In una versione completa dell’applicazione potrebbero essere implementati:

- autenticazione con login e password;
- integrazione con Google Maps API o altri servizi di geolocalizzazione;
- sistema di notifiche;
- sistema di rating tra utenti;
- pannello di amministrazione;
- deploy su infrastruttura cloud;
- gestione avanzata della disponibilità dei libri;
- gestione delle recensioni e delle segnalazioni.

---

## Autore

Francesco Ambrosio  
Project Work - Informatica per le Aziende Digitali (L-31)  
Università Telematica Pegaso
