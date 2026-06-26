# Book Sharing Geolocation App

## Descrizione del progetto

Book Sharing Geolocation App è un prototipo dimostrativo sviluppato nell’ambito del Project Work del corso di laurea in Informatica per le Aziende Digitali (L-31).

L’obiettivo del progetto è simulare una piattaforma digitale per la condivisione del patrimonio librario privato attraverso un sistema basato su geolocalizzazione. Gli utenti possono registrarsi, inserire i libri disponibili, cercare testi presenti nella propria area geografica e inviare richieste di prestito o scambio.

Il progetto non rappresenta un’applicazione commerciale completa, ma una struttura tecnica dimostrativa utile a descrivere il funzionamento di una piattaforma web basata su frontend, backend, database e API REST.

## Funzionalità principali

Il prototipo prevede le seguenti funzionalità:

- registrazione degli utenti;
- inserimento di libri associati a un proprietario;
- ricerca dei libri per titolo, autore o città;
- simulazione della geolocalizzazione tramite città e coordinate;
- invio di richieste di prestito o scambio;
- gestione dello stato delle richieste;
- struttura dati relazionale per utenti, libri, richieste, feedback e segnalazioni.

## Architettura del sistema

Il progetto è organizzato secondo un’architettura client-server suddivisa in tre livelli principali:

1. **Frontend**: rappresenta l’interfaccia utente e consente di interagire con il sistema tramite una pagina HTML.
2. **Backend**: gestisce la logica applicativa attraverso API REST realizzate con Node.js ed Express.
3. **Database**: definisce lo schema relazionale per l’archiviazione strutturata delle informazioni.

La comunicazione tra frontend e backend avviene tramite richieste HTTP e scambio di dati in formato JSON.

## Struttura del repository

```text
book-sharing-geolocation-app/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── index.html
│
├── database/
│   └── schema.sql
│
└── README.md
```

## Tecnologie utilizzate

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- API REST
- JSON
- SQL
- Database relazionale
- Architettura client-server

## Backend

Il backend è realizzato con Node.js ed Express.js.

Espone diversi endpoint API per la gestione delle funzionalità principali della piattaforma.

Endpoint principali:

- `GET /api/users`: restituisce l’elenco degli utenti registrati.
- `POST /api/users`: registra un nuovo utente.
- `GET /api/books`: restituisce l’elenco dei libri disponibili, con possibilità di filtro per città o parola chiave.
- `POST /api/books`: inserisce un nuovo libro.
- `POST /api/loan-requests`: crea una nuova richiesta di prestito o scambio.
- `GET /api/loan-requests`: restituisce l’elenco delle richieste di prestito.
- `PUT /api/loan-requests/:id/status`: aggiorna lo stato di una richiesta.

## Frontend

Il frontend è costituito da una pagina HTML dimostrativa che consente di:

- registrare un utente;
- inserire un libro;
- cercare libri disponibili;
- filtrare i libri per città;
- creare una richiesta di prestito;
- visualizzare utenti e richieste.

La pagina comunica con il backend tramite chiamate `fetch()` e riceve risposte in formato JSON.

## Database

Il file `database/schema.sql` contiene lo schema relazionale del sistema.

Sono previste le seguenti tabelle:

- `users`: dati degli utenti registrati;
- `books`: libri disponibili e informazioni sul proprietario;
- `loan_requests`: richieste di prestito o scambio;
- `feedback`: valutazioni tra utenti;
- `reports`: eventuali segnalazioni.

Lo schema include chiavi primarie, chiavi esterne, vincoli e dati dimostrativi.

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

Il server sarà disponibile all’indirizzo:

```text
http://localhost:3000
```

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

## Esempio di flusso operativo

1. L’utente si registra inserendo nome, email e città.
2. L’utente inserisce un libro specificando titolo, autore, categoria e città.
3. Un altro utente cerca libri disponibili nella propria zona.
4. Il sistema restituisce i libri filtrati in base ai parametri indicati.
5. L’utente invia una richiesta di prestito o scambio.
6. Il backend registra la richiesta e ne gestisce lo stato.

## Aspetti di sicurezza e privacy

Il progetto considera alcuni principi fondamentali di sicurezza informatica e protezione dei dati personali:

- raccolta dei soli dati necessari al funzionamento del servizio;
- utilizzo di password memorizzate tramite hash nello schema dati;
- gestione controllata delle richieste;
- separazione tra frontend, backend e database;
- possibilità di utilizzo del protocollo HTTPS in un’implementazione reale.

## Limiti del prototipo

Il progetto ha finalità dimostrative. Alcuni aspetti, come autenticazione reale, geolocalizzazione tramite API esterne, persistenza completa dei dati e deploy cloud, sono descritti a livello progettuale e possono rappresentare sviluppi futuri.

## Sviluppi futuri

In una versione completa dell’applicazione potrebbero essere implementati:

- autenticazione con login e password;
- integrazione con Google Maps API o altri servizi di geolocalizzazione;
- database reale collegato al backend;
- sistema di notifiche;
- sistema di rating tra utenti;
- pannello di amministrazione;
- deploy su infrastruttura cloud.

## Autore

Francesco Ambrosio  
Project Work - Informatica per le Aziende Digitali (L-31)  
Università Telematica Pegaso
