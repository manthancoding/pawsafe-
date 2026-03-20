const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/stats — live counter data for RescueCounter component
router.get('/', async (req, res, next) => {
    try {
        const [rescuedSnapshot, activeSnapshot, ngoSnapshot, volunteerSnapshot] = await Promise.all([
            db.collection('emergencies').where('status', '==', 'resolved').count().get(),
            db.collection('emergencies').where('status', 'in', ['active', 'accepted', 'pending']).count().get(),
            db.collection('ngos').where('verified', '==', true).count().get(),
            db.collection('volunteers').where('isActive', '==', true).count().get(),
        ]);

        res.json({
            success: true,
            data: {
                rescued: rescuedSnapshot.data().count,
                active: activeSnapshot.data().count,
                ngos: ngoSnapshot.data().count,
                volunteers: volunteerSnapshot.data().count,
            },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/stats/admin — Comprehensive stats for Dashboard (Admin only)
router.get('/admin', protect, admin, async (req, res, next) => {
    try {
        const [
            totalRescuedSnap,
            pendingRescueSnap,
            adoptedCountSnap,
            volunteerCountSnap,
            donationSnapshot
        ] = await Promise.all([
            db.collection('emergencies').where('status', '==', 'resolved').count().get(),
            db.collection('emergencies').where('status', 'in', ['pending', 'active', 'accepted']).count().get(),
            db.collection('animals').where('status', '==', 'adopted').count().get(),
            db.collection('volunteers').where('isActive', '==', true).count().get(),
            db.collection('donations').get()
        ]);

        let totalDonationsAmount = 0;
        donationSnapshot.forEach(doc => {
            totalDonationsAmount += (parseFloat(doc.data().amount) || 0);
        });

        res.json({
            success: true,
            data: {
                totalRescued: totalRescuedSnap.data().count,
                pendingRescue: pendingRescueSnap.data().count,
                adoptedCount: adoptedCountSnap.data().count,
                totalDonations: totalDonationsAmount,
                volunteerCount: volunteerCountSnap.data().count
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
