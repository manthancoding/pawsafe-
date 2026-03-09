const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @route  POST /api/auth/register
// @desc   Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });

        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/login
// @desc   Login user & return JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = signToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/auth/me
// @desc   Get current user (protected)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

module.exports = router;
