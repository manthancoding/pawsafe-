const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Volunteer = require('../models/Volunteer');
const NGO = require('../models/NGO');
const Animal = require('../models/Animal');
const Donation = require('../models/Donation');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/stats — live counter data for RescueCounter component
router.get('/', async (req, res, next) => {
    try {
        const [rescuedCount, activeEmergencies, ngoCount, volunteerCount] = await Promise.all([
            Emergency.countDocuments({ status: { $in: ['resolved'] } }),
            Emergency.countDocuments({ status: { $in: ['active', 'accepted', 'pending'] } }),
            NGO.countDocuments({ verified: true }),
            Volunteer.countDocuments({ isActive: true }),
        ]);

        res.json({
            success: true,
            data: {
                rescued: rescuedCount,
                active: activeEmergencies,
                ngos: ngoCount,
                volunteers: volunteerCount,
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
            totalRescued,
            pendingRescue,
            adoptedCount,
            totalDonations,
            volunteerCount
        ] = await Promise.all([
            Emergency.countDocuments({ status: 'resolved' }),
            Emergency.countDocuments({ status: { $in: ['pending', 'active', 'accepted'] } }),
            Animal.countDocuments({ status: 'adopted' }),
            Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
            Volunteer.countDocuments({ isActive: true })
        ]);

        res.json({
            success: true,
            data: {
                totalRescued,
                pendingRescue,
                adoptedCount,
                totalDonations: totalDonations[0]?.total || 0,
                volunteerCount
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
