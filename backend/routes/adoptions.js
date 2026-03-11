const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const Animal = require('../models/Animal');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/adoptions — list all (Admin only)
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const adoptions = await Adoption.find()
            .populate('animal', 'name species status')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: adoptions });
    } catch (err) {
        next(err);
    }
});

// POST /api/adoptions — submit a new request (Public/User)
router.post('/', async (req, res, next) => {
    try {
        const doc = await Adoption.create(req.body);
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/adoptions/:id/status — approve or reject (Admin only)
router.patch('/:id/status', protect, admin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const adoption = await Adoption.findById(req.params.id);

        if (!adoption) return res.status(404).json({ success: false, message: 'Adoption request not found' });

        adoption.status = status;
        await adoption.save();

        // If approved, update animal status to 'adopted'
        if (status === 'approved') {
            await Animal.findByIdAndUpdate(adoption.animal, { status: 'adopted' });
        }

        res.json({ success: true, data: adoption });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/adoptions/:id (Admin only)
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        await Adoption.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Adoption request deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
