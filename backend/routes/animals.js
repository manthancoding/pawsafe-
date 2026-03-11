const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/animals — all animals in recovery
router.get('/', async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;
        const animals = await Animal.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: animals });
    } catch (err) {
        next(err);
    }
});

// GET /api/animals/:id — single animal detail
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await Animal.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Animal not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// POST /api/animals — add a new animal (Admin only)
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const doc = await Animal.create(req.body);
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/animals/:id — update animal (Admin only)
router.patch('/:id', protect, admin, async (req, res, next) => {
    try {
        const { status, note, milestoneIndex, milestoneCompleted } = req.body;
        const update = {};

        if (status) update.status = status;

        const doc = await Animal.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Animal not found' });

        if (status) doc.status = status;

        // Add a new vet note
        if (note) {
            doc.notes.push(note);
        }

        // Toggle a milestone
        if (milestoneIndex !== undefined && doc.milestones[milestoneIndex]) {
            doc.milestones[milestoneIndex].completed = milestoneCompleted;
        }

        await doc.save();
        res.json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/animals/:id (Admin only)
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        await Animal.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Animal record deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
