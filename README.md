# CRM Pipeline Tracker

A lightweight, fullstack CRM built as a take-home project for Skillify's Fullstack track. Manage your sales pipeline through a kanban-style board with a Node/Express REST API backend and a plain HTML/CSS/JS frontend — no build tools or frameworks required to run it.

---

## Features

- **Kanban board** — customers are displayed in columns by pipeline stage (Lead → Contacted → Proposal → Closed)
- **Add customers** — create a customer with name, email, company, and starting stage
- **Advance stage** — move customers forward through the pipeline with one click
- **Delete customers** — remove a customer with a confirmation prompt to prevent accidents
- **Search** — filter the board live by customer name or company
- **Filter by stage** — show only customers in a specific stage
- **Stage history** — every stage change is timestamped and stored in `data.json`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript (Fetch API) |
| Backend | Node.js, Express |
| Storage | JSON file (`data.json`) |
| API testing | curl (PowerShell) |

**Why vanilla JS over React?** This project prioritized a clean REST API design over framework complexity. Vanilla JS kept the frontend lightweight and let the Node/Express backend be the focus.

**Why JSON over a database?** Keeping storage as a flat file means anyone can clone and run the project with just `node server.js` — no database setup required.

---

## Project Structure

```
CRM-Pipeline-Tracker/
├── public/
│   ├── index.html      # Kanban board UI
│   ├── app.js          # Frontend logic (fetch, render, events)
│   └── styles.css      # Styling
├── server.js           # Express API (CRUD + stage history)
├── data.json           # Persistent customer storage
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js installed ([download here](https://nodejs.org/))

### 1. Clone the repo

```bash
git clone https://github.com/dylan2007trader/CRM-Pipeline-Tracker.git
cd CRM-Pipeline-Tracker
```

### 2. Install dependencies

```bash
npm install express
```

### 3. Start the server

```bash
node server.js
# Server running at http://localhost:3000
```

Open your browser and go to **http://localhost:3000**

> The app comes pre-loaded with sample customers in `data.json`. To start with an empty list, replace the file contents with `[]`.

---

## API Reference

The backend exposes a REST API you can test directly:

```bash
# List all customers
curl http://localhost:3000/api/customers

# Filter by stage
curl http://localhost:3000/api/customers?stage=Lead

# Create a customer
curl -Method POST -Uri http://localhost:3000/api/customers `
  -ContentType "application/json" `
  -Body '{"name":"Jane Smith","email":"jane@example.com","company":"Acme","stage":"Lead"}'

# Advance a customer to a new stage (replace ID)
curl -Method POST -Uri http://localhost:3000/api/customers/CUSTOMER_ID/stage `
  -ContentType "application/json" `
  -Body '{"stage":"Contacted"}'

# Delete a customer
curl -Method DELETE -Uri http://localhost:3000/api/customers/CUSTOMER_ID
```

---

## Roadmap

- [x] Kanban board with stage columns
- [x] Add / delete customers
- [x] Search and filter
- [x] Stage history tracking (backend)
- [x] PUT endpoint for editing customer info (backend only)
- [ ] Edit customer info from the UI
- [ ] Stage history timeline visible in the UI
- [ ] Drag-and-drop to move customers between any stage
- [ ] User authentication so each user has their own pipeline
- [ ] PostgreSQL or SQLite for production-scale storage
- [ ] Deploy to Railway (backend) + Vercel (frontend)
- [ ] Automated API tests

---

## Author

Dylan Ackerman · [LinkedIn](https://www.linkedin.com/in/dylan-ackerman-2015a638a/) · [dackerm2007@gmail.com](mailto:dackerm2007@gmail.com)
