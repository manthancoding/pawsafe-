const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');
const { protect, admin: adminOnly } = require('../middleware/authMiddleware');

// GET /api/adoptions — list all (Admin only)
router.get('/', protect, adminOnly, async (req, res, next) => {
    try {
        const snapshot = await db.collection('adoptions').orderBy('createdAt', 'desc').get();
        const adoptions = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const animalDoc = await db.collection('animals').doc(data.animal).get();
            const animalData = animalDoc.exists ? { id: animalDoc.id, name: animalDoc.data().name, species: animalDoc.data().species, status: animalDoc.data().status } : null;
            adoptions.push({ id: doc.id, ...data, animal: animalData });
        }

        res.json({ success: true, data: adoptions });
    } catch (err) {
        next(err);
    }
});

// POST /api/adoptions — submit a new request (Public/User)
router.post('/', async (req, res, next) => {
    try {
        const { animal: animalId } = req.body;
        const data = {
            ...req.body,
            status: 'pending',
            createdAt: FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('adoptions').add(data);

        // Update animal status to 'adopted' immediately so it disappears from browse
        if (animalId) {
            await db.collection('animals').doc(animalId).update({ status: 'adopted' });
        }

        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/adoptions/:id/status — approve or reject (Admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
    try {
        const { status } = req.body;
        const adoptionRef = db.collection('adoptions').doc(req.params.id);
        const adoptionDoc = await adoptionRef.get();

        if (!adoptionDoc.exists) return res.status(404).json({ success: false, message: 'Adoption request not found' });

        const adoptionData = adoptionDoc.data();
        await adoptionRef.update({ status });

        // If approved, update animal status to 'adopted'
        if (status === 'approved' && adoptionData.animal) {
            await db.collection('animals').doc(adoptionData.animal).update({ status: 'adopted' });
        }

        res.json({ success: true, data: { id: adoptionDoc.id, ...adoptionData, status } });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/adoptions/:id (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        await db.collection('adoptions').doc(req.params.id).delete();
        res.json({ success: true, message: 'Adoption request deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
