const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Adoption = require('../models/Adoption');
const Emergency = require('../models/Emergency');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(404).json({ success: false, message: 'User not found' });
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// @route  GET /api/users/me/adoptions
router.get('/me/adoptions', protect, async (req, res) => {
    try {
        const adoptions = await Adoption.find({ user: req.user._id }).populate('animal');
        res.json({ success: true, count: adoptions.length, data: adoptions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/reports
router.get('/me/reports', protect, async (req, res) => {
    try {
        const reports = await Emergency.find({ reportedBy: req.user._id });
        res.json({ success: true, count: reports.length, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/favorites
router.get('/me/favorites', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json({ success: true, data: user.favorites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/users/me/favorites/:animalId
router.post('/me/favorites/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const index = user.favorites.indexOf(req.params.id);

        if (index === -1) {
            user.favorites.push(req.params.id);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json({ success: true, data: user.favorites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  PUT /api/users/me/profile
router.put('/me/profile', protect, async (req, res) => {
    try {
        const { name, phone, city, avatar } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/donations
router.get('/me/donations', protect, async (req, res) => {
    try {
        const donations = await Donation.find({ email: req.user.email }); // Matching by email for history
        res.json({ success: true, count: donations.length, data: donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
