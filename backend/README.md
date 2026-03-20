# PawSafe Backend

Node.js + Express + MongoDB REST API for the PawSafe animal rescue platform.

## Prerequisites

Install MongoDB Community Edition:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# OR via snap
sudo snap install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod   # auto-start on boot
```

## Setup

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` (already done). Edit if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pawsafe
JWT_SECRET=pawsafe_super_secret_key_change_in_production
NODE_ENV=development
```

## Seed the Database

Run once to populate with sample data (NGOs, volunteers, emergencies, animals):
```bash
npm run seed
```

## Start Development Server

```bash
npm run dev        # with auto-reload (nodemon)
# or
npm start          # without auto-reload
```

Server runs at **http://localhost:5000**

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/emergencies` | Submit emergency report (multipart) |
| GET | `/api/emergencies` | List all emergencies |
| PATCH | `/api/emergencies/:id/status` | Update status |
| GET | `/api/stats` | Live rescue counters |
| GET | `/api/animals` | List recovery animals |
| PATCH | `/api/animals/:id` | Update animal / add note |
| POST | `/api/donations` | Record donation |
| GET | `/api/ngos` | List NGOs (filter by city) |
| GET | `/api/volunteers` | List volunteers |

## Running Both Servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd pawsafe/backend && npm run dev

# Terminal 2 — Frontend
cd pawsafe && npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:5000
