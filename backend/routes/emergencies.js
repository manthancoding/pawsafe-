const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const upload = require('../middleware/upload');

// POST /api/emergencies — submit a new emergency report
router.post('/', upload.single('photo'), async (req, res, next) => {
    try {
        const { animalType, issueType, location, latitude, longitude, details, name, phone, urgency } = req.body;

        const doc = await Emergency.create({
            animalType,
            issueType,
            location: location || '',
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            details: details || '',
            name,
            phone,
            urgency: urgency || 'urgent',
            photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
        });

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// GET /api/emergencies — list all (for volunteer dashboard)
router.get('/', async (req, res, next) => {
    try {
        const { status, limit = 50 } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const emergencies = await Emergency.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ success: true, data: emergencies });
    } catch (err) {
        next(err);
    }
});

// GET /api/emergencies/:id — single emergency
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await Emergency.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Emergency not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/emergencies/:id/status — accept / decline / resolve
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['pending', 'active', 'accepted', 'resolved', 'declined'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const doc = await Emergency.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!doc) return res.status(404).json({ success: false, message: 'Emergency not found' });

        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
