const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');

// POST /api/donations — record a donation
router.post('/', async (req, res, next) => {
    try {
        const { cause, amount, type, plan, donorName, donorEmail } = req.body;
        const data = {
            cause,
            amount: parseFloat(amount),
            type,
            plan,
            donorName,
            donorEmail,
            createdAt: FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('donations').add(data);
        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (err) {
        next(err);
    }
});

// GET /api/donations/stats — aggregate totals
router.get('/stats', async (req, res, next) => {
    try {
        const snapshot = await db.collection('donations').get();
        let totalAmount = 0;
        const byCauseMap = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            const amount = parseFloat(data.amount) || 0;
            totalAmount += amount;

            if (data.cause) {
                byCauseMap[data.cause] = (byCauseMap[data.cause] || 0) + amount;
            }
        });

        const byCause = Object.entries(byCauseMap).map(([cause, amount]) => ({ cause, amount }));

        res.json({
            success: true,
            data: {
                totalAmount,
                totalDonations: snapshot.size,
                byCause
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/donations — recent donations list
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await db.collection('donations').orderBy('createdAt', 'desc').limit(20).get();
        const donations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: donations });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
