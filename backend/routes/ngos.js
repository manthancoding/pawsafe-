const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

// GET /api/ngos — list NGOs with optional city filter
router.get('/', async (req, res, next) => {
    try {
        const { city, state, animals, limit = 100 } = req.query;
        let query = db.collection('ngos');

        if (city) query = query.where('city', '==', city);
        if (state) query = query.where('state', '==', state);
        if (animals) query = query.where('animals', 'array-contains', animals);

        const snapshot = await query.orderBy('verified', 'desc').orderBy('name', 'asc').limit(parseInt(limit)).get();
        const ngos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ success: true, data: ngos });
    } catch (err) {
        next(err);
    }
});

// GET /api/ngos/:id
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await db.collection('ngos').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'NGO not found' });
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (err) {
        next(err);
    }
});

// POST /api/ngos/overpass — proxy for live data
router.post('/overpass', async (req, res, next) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Overpass API Error:', response.status, errorText);
            return res.status(response.status).json({ success: false, message: 'Overpass API error', detail: errorText });
        }

        const data = await response.json();
        res.json(data);


    } catch (err) {
        next(err);
    }
});

// POST /api/ngos — register an NGO
router.post('/', async (req, res, next) => {

    try {
        const data = {
            ...req.body,
            verified: false,
            createdAt: new Date()
        };
        const docRef = await db.collection('ngos').add(data);
        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
