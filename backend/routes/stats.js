const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Volunteer = require('../models/Volunteer');
const NGO = require('../models/NGO');

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

module.exports = router;
