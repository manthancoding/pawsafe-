const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// POST /api/donations — record a donation
router.post('/', async (req, res, next) => {
    try {
        const { cause, amount, type, plan, donorName, donorEmail } = req.body;
        const doc = await Donation.create({ cause, amount, type, plan, donorName, donorEmail });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        next(err);
    }
});

// GET /api/donations/stats — aggregate totals
router.get('/stats', async (req, res, next) => {
    try {
        const [result] = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalDonations: { $sum: 1 },
                    byCause: {
                        $push: { cause: '$cause', amount: '$amount' },
                    },
                },
            },
        ]);
        res.json({ success: true, data: result || { totalAmount: 0, totalDonations: 0 } });
    } catch (err) {
        next(err);
    }
});

// GET /api/donations — recent donations list
router.get('/', async (req, res, next) => {
    try {
        const donations = await Donation.find()
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, data: donations });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
