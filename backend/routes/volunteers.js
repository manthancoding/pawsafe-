const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// GET /api/volunteers — list active volunteers
router.get('/', async (req, res, next) => {
    try {
        const { city, limit = 50 } = req.query;
        const filter = { isActive: true };
        if (city) filter.city = { $regex: city, $options: 'i' };

        const volunteers = await Volunteer.find(filter)
            .sort({ totalRescues: -1 })
            .limit(parseInt(limit));

        res.json({ success: true, data: volunteers });
    } catch (err) {
        next(err);
    }
});

// GET /api/volunteers/:id — single volunteer
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await Volunteer.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Volunteer not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// POST /api/volunteers — register a new volunteer
router.post('/', async (req, res, next) => {
    try {
        const doc = await Volunteer.create(req.body);
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/volunteers/:id — update volunteer info
router.patch('/:id', async (req, res, next) => {
    try {
        const doc = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) return res.status(404).json({ success: false, message: 'Volunteer not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
