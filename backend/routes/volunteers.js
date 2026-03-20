const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

// GET /api/volunteers — list active volunteers
router.get('/', async (req, res, next) => {
    try {
        const { city, limit = 50 } = req.query;
        let query = db.collection('volunteers').where('isActive', '==', true);

        if (city) {
            // Firestore doesn't support regex, using simple equality for city search
            query = query.where('city', '==', city);
        }

        const snapshot = await query.orderBy('totalRescues', 'desc').limit(parseInt(limit)).get();
        const volunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ success: true, data: volunteers });
    } catch (err) {
        next(err);
    }
});

// GET /api/volunteers/:id — single volunteer
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await db.collection('volunteers').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Volunteer not found' });
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (err) {
        next(err);
    }
});

// POST /api/volunteers — register a new volunteer
router.post('/', async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            isActive: true,
            totalRescues: 0,
            createdAt: new Date()
        };
        const docRef = await db.collection('volunteers').add(data);
        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/volunteers/:id — update volunteer info
router.patch('/:id', async (req, res, next) => {
    try {
        const volunteerRef = db.collection('volunteers').doc(req.params.id);
        const doc = await volunteerRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Volunteer not found' });

        await volunteerRef.update(req.body);
        res.json({ success: true, data: { id: doc.id, ...doc.data(), ...req.body } });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/volunteers/:id/location — update real-time location
router.patch('/:id/location', async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body;
        const volunteerRef = db.collection('volunteers').doc(req.params.id);
        const doc = await volunteerRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Volunteer not found' });

        await volunteerRef.update({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            lastUpdated: new Date()
        });

        // If volunteer is on an active rescue, update activeRescues as well
        const activeRescues = await db.collection('rescueRequests')
            .where('assignedVolunteerId', '==', req.params.id)
            .where('status', '==', 'accepted')
            .limit(1)
            .get();

        if (!activeRescues.empty) {
            const rescueId = activeRescues.docs[0].id;
            const rescueData = activeRescues.docs[0].data();

            await db.collection('activeRescues').doc(rescueId).set({
                rescueId,
                volunteerId: req.params.id,
                volunteerLocation: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                currentLat: parseFloat(latitude),
                currentLng: parseFloat(longitude),
                lastUpdated: new Date()
            }, { merge: true });
        }

        res.json({ success: true, message: 'Location updated' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
