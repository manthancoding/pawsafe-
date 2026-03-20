const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');
const upload = require('../middleware/upload');
const { findNearbyVolunteers } = require('../utils/matching');

// POST /api/emergencies — submit a new emergency report
router.post('/', upload.single('photo'), async (req, res, next) => {
    try {
        const { animalType, issueType, location, latitude, longitude, details, name, phone, reportedBy, urgency } = req.body;

        // Auto-detect priority
        let priority = 'low';
        if (issueType === 'injured' || details.toLowerCase().includes('bleeding') || details.toLowerCase().includes('hurt')) {
            priority = 'high';
        } else if (issueType === 'trapped') {
            priority = 'medium';
        }

        const data = {
            userId: reportedBy || 'anonymous', // Explicitly track the reporting user
            animalType,
            issueType,
            location: location || '',
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            details: details || '',
            name,
            phone,
            urgency: urgency || 'moderate',
            priority,
            status: 'pending',
            assignedVolunteerId: null,
            photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('rescueRequests').add(data);

        // Find nearby volunteers and notify (mock)
        const nearbyVolunteers = await findNearbyVolunteers(db, data.latitude, data.longitude, 10);

        if (nearbyVolunteers.length > 0) {
            await db.collection('notifications').add({
                rescueId: docRef.id,
                userId: data.userId,
                nearbyCount: nearbyVolunteers.length,
                volunteers: nearbyVolunteers.map(v => v.id),
                createdAt: FieldValue.serverTimestamp()
            });
        }

        res.status(201).json({ success: true, data: { id: docRef.id, ...data, nearbyCount: nearbyVolunteers.length } });
    } catch (err) {
        next(err);
    }
});


// GET /api/emergencies — list all (for volunteer dashboard)
router.get('/', async (req, res, next) => {
    try {
        const { status, limit = 50 } = req.query;
        let query = db.collection('rescueRequests');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.limit(parseInt(limit)).get();
        const emergencies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        res.json({ success: true, data: emergencies });
    } catch (err) {
        next(err);
    }
});

// GET /api/emergencies/:id — single emergency
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await db.collection('rescueRequests').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Emergency not found' });
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/emergencies/:id/status — accept / decline / resolve
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status, volunteerId } = req.body;
        const allowed = ['pending', 'active', 'accepted', 'completed', 'resolved', 'declined'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const emergencyRef = db.collection('rescueRequests').doc(req.params.id);

        if (status === 'accepted') {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(emergencyRef);
                if (!doc.exists) throw new Error('Rescue request not found');
                const rescueData = doc.data();
                if (rescueData.status !== 'pending') throw new Error('Rescue already matched or completed');

                transaction.update(emergencyRef, {
                    status: 'accepted',
                    assignedVolunteerId: volunteerId,
                    acceptedAt: FieldValue.serverTimestamp()
                });

                // Create Live Session in activeRescues
                const sessionRef = db.collection('activeRescues').doc(req.params.id);
                transaction.set(sessionRef, {
                    rescueId: req.params.id,
                    userId: rescueData.userId || 'anonymous',
                    volunteerId: volunteerId,
                    rescueLocation: {
                        latitude: rescueData.latitude ?? null,
                        longitude: rescueData.longitude ?? null
                    },
                    volunteerLocation: null,
                    currentLat: null,
                    currentLng: null,
                    status: 'on_the_way',
                    startedAt: FieldValue.serverTimestamp(),
                    lastUpdated: FieldValue.serverTimestamp()
                });

                // Update volunteer availability
                const volunteerRef = db.collection('volunteers').doc(volunteerId);
                transaction.update(volunteerRef, { availability: false });
            });
            res.json({ success: true, message: 'Rescue started! Live session initialized.' });
        } else {
            const doc = await emergencyRef.get();
            if (!doc.exists) return res.status(404).json({ success: false, message: 'Emergency not found' });

            const updates = { status };
            if (status === 'completed' || status === 'resolved') {
                updates.completedAt = FieldValue.serverTimestamp();
                // Release volunteer and cleanup activeRescues
                const volunteerId = doc.data().assignedVolunteerId;
                if (volunteerId) {
                    await db.collection('volunteers').doc(volunteerId).update({ availability: true });
                }
                await db.collection('activeRescues').doc(req.params.id).delete();
            }

            await emergencyRef.update(updates);
            res.json({ success: true, data: { id: doc.id, ...doc.data(), ...updates } });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PATCH /api/emergencies/:id/session-status — update granular progress
router.patch('/:id/session-status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['on_the_way', 'reached', 'completed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid session status' });
        }

        const sessionRef = db.collection('activeRescues').doc(req.params.id);
        const emergencyRef = db.collection('rescueRequests').doc(req.params.id);

        if (status === 'completed') {
            // Forward to general status update
            return res.redirect(307, `/api/emergencies/${req.params.id}/status`);
        }

        await sessionRef.update({
            status,
            lastUpdated: FieldValue.serverTimestamp()
        });

        // If status is reached, also update the main request status?
        // Actually, request stays 'accepted' until 'completed'

        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/emergencies/:id/location — update volunteer live location
router.patch('/:id/location', async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body;
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
        }

        const sessionRef = db.collection('activeRescues').doc(req.params.id);

        await sessionRef.update({
            currentLat: parseFloat(latitude),
            currentLng: parseFloat(longitude),
            lastUpdated: FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: 'Location updated' });
    } catch (err) {
        next(err);
    }
});

// GET /api/emergencies/active/:userId — find active rescues for a specific user
router.get('/active/:userId', async (req, res, next) => {
    try {
        const snapshot = await db.collection('rescueRequests')
            .where('userId', '==', req.params.userId)
            .where('status', 'in', ['pending', 'accepted'])
            .get();

        const active = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: active });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
