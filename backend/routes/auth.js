const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/mail');
const crypto = require('crypto');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @route  POST /api/auth/register
// @desc   Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, city } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, phone: phone || '', city: city || '' });

        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
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

// @route  POST /api/auth/send-otp
// @desc   Generate and send OTP to email
router.post('/send-otp', async (req, res) => {
    try {
        const { email, type, password } = req.body; // type: 'login' | 'signup'

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (type === 'login') {
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found. Please sign up first.' });
            }
            if (!password || !(await user.matchPassword(password))) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        }

        if (type === 'signup' && user) {
            return res.status(409).json({ success: false, message: 'Email already registered. Please sign in.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        if (user) {
            // Update existing user with OTP
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            // For signup, we don't create the user yet, but we'll send the codes.
            // We'll verify everything in verify-otp.
            // To prevent misuse, we could store the OTP in a Redis/cache, 
            // but for this MVP we'll create a "Pending" user if needed 
            // OR just rely on the verify-otp step to take all fields.
            // Actually, creating a pending user is safer to prevent OTP spoofing for non-existent emails.
            const pendingUser = await User.findOne({ email, name: 'Pending User' });
            if (pendingUser) {
                pendingUser.otp = otp;
                pendingUser.otpExpiry = otpExpiry;
                await pendingUser.save();
            } else {
                await User.create({
                    name: 'Pending User',
                    email,
                    password: crypto.randomBytes(16).toString('hex'),
                    otp,
                    otpExpiry
                });
            }
        }

        const message = `Your PawSafe verification code is: ${otp}. It will expire in 10 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0D7377;">PawSafe Verification</h2>
                <p>Hello,</p>
                <p>Use the Following OTP to complete your verification process:</p>
                <div style="font-size: 32px; font-weight: bold; color: #0D7377; margin: 20px 0; letter-spacing: 5px;">${otp}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Protecting animals, one paw at a time. 🐾</p>
            </div>
        `;

        await sendEmail({
            email,
            subject: 'PawSafe Verification Code',
            message,
            html,
        });

        res.json({ success: true, message: 'Verification code sent to your email.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/verify-otp
// @desc   Verify OTP and return JWT
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type, name, phone, city, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email }).select('+otp +otpExpiry');

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(401).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpiry = undefined;

        // If it was a signup, finalize user data
        if (type === 'signup' && user.name === 'Pending User') {
            user.name = name;
            user.phone = phone;
            user.city = city;
            user.password = password; // User model has a pre-save hook for hashing
        }

        await user.save();

        const token = signToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
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
