const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/animals — all animals in recovery
router.get('/', async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = db.collection('animals');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ success: true, data: animals });
    } catch (err) {
        next(err);
    }
});

// GET /api/animals/:id — single animal detail
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await db.collection('animals').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Animal not found' });
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (err) {
        next(err);
    }
});

// POST /api/animals — add a new animal (Admin only)
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            createdAt: new Date(),
            notes: req.body.notes || [],
            milestones: req.body.milestones || []
        };
        const docRef = await db.collection('animals').add(data);
        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/animals/:id — update animal (Admin only)
router.patch('/:id', protect, admin, async (req, res, next) => {
    try {
        const { status, note, milestoneIndex, milestoneCompleted } = req.body;
        const animalRef = db.collection('animals').doc(req.params.id);
        const doc = await animalRef.get();

        if (!doc.exists) return res.status(404).json({ success: false, message: 'Animal not found' });

        const data = doc.data();
        const updates = {};

        if (status) updates.status = status;

        if (note) {
            updates.notes = [...(data.notes || []), note];
        }

        if (milestoneIndex !== undefined && data.milestones && data.milestones[milestoneIndex]) {
            const milestones = [...data.milestones];
            milestones[milestoneIndex].completed = milestoneCompleted;
            updates.milestones = milestones;
        }

        await animalRef.update(updates);
        res.json({ success: true, data: { id: doc.id, ...data, ...updates } });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/animals/:id (Admin only)
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        await db.collection('animals').doc(req.params.id).delete();
        res.json({ success: true, message: 'Animal record deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
