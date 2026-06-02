# TodoList Backend

Backend REST + Socket.IO per una applicazione TodoList. Progetto base per corsi frontend.

---

## Requisiti

- Node.js 18+
- Account Gmail (per le email)

---

## Installazione

```bash
cd <nome-repo>
npm install
```

Compila il file `.env` con le tue credenziali (vedi sezione successiva), poi:

```bash
npm start
```

---

## Configurazione .env

```env
MAIL_USER=tuaemail@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```


### MAIL_USER e MAIL_PASSWORD

Il progetto usa Gmail per inviare email di conferma registrazione.

`MAIL_USER` è il tuo indirizzo Gmail (es. `tuaemail@gmail.com`).

`MAIL_PASSWORD` **non è la password del tuo account Google** — è una **App Password** da generare:

1. Vai su [myaccount.google.com](https://myaccount.google.com)
2. **Sicurezza** → **Verifica in due passaggi** (deve essere attiva)
3. Cerca **Password per le app** (in fondo alla sezione Sicurezza)
4. Seleziona **Posta** come app e **Windows/Mac** come dispositivo
5. Clicca **Genera** → copia la password di 16 caratteri (formato: `abcd efgh ijkl mnop`)
6. Incollala in `MAIL_PASSWORD`

---

## Endpoint REST

### Utenti

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| POST | `/user` | No | Registrazione |
| GET | `/user/:id/confirm/:token` | No | Conferma email |
| POST | `/user/login` | No | Login |
| POST | `/user/pending` | No | Login in attesa di conferma |

### Attività

Tutti gli endpoint richiedono il token JWT nell'header:
```
Authorization: Bearer <token>
```

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/activity` | Lista attività aperte |
| GET | `/activity/completed` | Lista attività completate |
| GET | `/activity/archived` | Lista attività archiviate |
| GET | `/activity/deleted` | Lista attività cancellate |
| GET | `/activity/:id` | Dettaglio attività |
| PATCH | `/activity/:id` | Modifica attività |
| PATCH | `/activity/:id/complete` | Segna come completata |
| PATCH | `/activity/:id/open` | Riapri attività |
| PATCH | `/activity/:id/archived` | Archivia attività |
| DELETE | `/activity/:id` | Elimina attività |

---

## Payload

### POST `/user` — Registrazione

```json
{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "password": "password123"
}
```

- `name` — obbligatorio, min 3 max 256 caratteri
- `email` — obbligatorio, formato email valido
- `password` — obbligatorio, min 3 caratteri

### POST `/user/login` e POST `/user/pending` — Login

```json
{
  "email": "mario@example.com",
  "password": "password123"
}
```

- `email` — obbligatorio, formato email valido
- `password` — obbligatorio

### PATCH `/activity/:id` — Modifica attività

```json
{
  "name": "Nome aggiornato",
  "description": "Descrizione aggiornata",
  "status": "open",
  "dueDate": "2026-12-31"
}
```

- `name` — obbligatorio, min 3 max 256 caratteri
- `description` — obbligatorio, min 3 caratteri
- `status` — opzionale, valori: `open` | `closed`
- `dueDate` — opzionale, formato data ISO

---

## Socket.IO

Il server usa Socket.IO sul namespace `/todolist`.

### Connessione

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001/todolist', {
  auth: {
    accessToken: 'IL_TUO_ACCESS_TOKEN' // ottenuto dal login
  }
});
```

### Eventi disponibili

#### `addActivity`
Crea una nuova attività.

**Payload:**
```json
{
  "name": "Nome attività",
  "description": "Descrizione attività",
  "status": "open",
  "dueDate": "2026-12-31"
}
```

- `name` — obbligatorio, min 3 max 256 caratteri
- `description` — obbligatorio, min 3 caratteri
- `status` — opzionale, valori: `open` || `completed` || `archived` || `deleted`)
- `dueDate` — opzionale, formato data ISO

**Risposta (acknowledgement):**
```json
{
  "result": {
    "success": true,
    "data": {
      "_id": "...",
      "name": "Nome attività",
      "description": "Descrizione attività",
      "status": "open",
      "ownerId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

In caso di errore:
```json
{
  "result": {
    "success": false,
    "error": "Messaggio di errore"
  }
}
```

---

## Flusso di registrazione

1. `POST /user` → registrazione, viene inviata una email di conferma
2. `GET /user/:id/confirm/:token` → conferma email (link nella mail)
3. `POST /user/login` → login, ricevi il JWT
4. Usa il JWT per le chiamate REST e per connetterti al socket
