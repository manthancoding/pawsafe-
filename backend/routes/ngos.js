const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');

// GET /api/ngos — list NGOs with optional city filter
router.get('/', async (req, res, next) => {
    try {
        const { city, state, animals, limit = 100 } = req.query;
        const filter = {};

        if (city) filter.city = { $regex: city, $options: 'i' };
        if (state) filter.state = { $regex: state, $options: 'i' };
        if (animals) filter.animals = { $in: [animals] };

        const ngos = await NGO.find(filter)
            .sort({ verified: -1, name: 1 })
            .limit(parseInt(limit));

        res.json({ success: true, data: ngos });
    } catch (err) {
        next(err);
    }
});

// GET /api/ngos/:id
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await NGO.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'NGO not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// POST /api/ngos — register an NGO
router.post('/', async (req, res, next) => {
    try {
        const doc = await NGO.create(req.body);
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
