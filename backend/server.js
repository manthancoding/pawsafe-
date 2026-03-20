const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// ── Connect to Firebase (Replacing MongoDB) ─────────────────
require('./config/firebaseAdmin');

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ── Static Files (uploaded photos) ────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/emergencies', require('./routes/emergencies'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chats', require('./routes/chats'));

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '🐾 PawSafe API is running', time: new Date() });
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 PawSafe API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Mode:   ${process.env.NODE_ENV || 'development'}\n`);
});
