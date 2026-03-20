const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { admin, db, auth: firebaseAdminAuth } = require('../config/firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');
const sendEmail = require('../utils/mail');
const crypto = require('crypto');

// In-memory fallback for OTPs during development if Firestore is slow/failing
const devOtpCache = new Map();

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @route  POST /api/auth/register
// @desc   Register a new user (Placeholder for Firebase, logic handled in verify-otp)
router.post('/register', async (req, res) => {
    res.status(400).json({ success: false, message: 'Please use the OTP verification flow to register.' });
});

// @route  POST /api/auth/login
// @desc   Login user with Email and Password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Use Firebase Auth REST API to verify password
        const apiKey = process.env.FIREBASE_API_KEY;
        const https = require('https');

        const postData = JSON.stringify({ email, password, returnSecureToken: true });

        const options = {
            hostname: 'identitytoolkit.googleapis.com',
            path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const verifyPassword = () => {
            return new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let body = '';
                    res.on('data', (d) => body += d);
                    res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
                });
                req.on('error', (e) => reject(e));
                req.write(postData);
                req.end();
            });
        };

        const result = await verifyPassword();
        const data = result.data;

        if (result.status !== 200) {
            return res.status(401).json({ success: false, message: data.error?.message || 'Invalid credentials' });
        }

        const uid = data.localId;
        const userDoc = await db.collection('users').doc(uid).get();

        let userData = null;
        if (userDoc.exists) {
            userData = userDoc.data();
            // Ensure roles is an array for backward compatibility during migration
            if (userData.role && !userData.roles) {
                userData.roles = [userData.role];
            }
        } else {
            userData = { uid, email, roles: ['user'] };
        }

        const token = signToken(uid);
        res.json({ success: true, token, user: userData, message: 'Login successful!' });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});

const bcrypt = require('bcryptjs');

// @route  POST /api/auth/send-otp
// @desc   Generate and send OTP to email
router.post('/send-otp', async (req, res) => {
    try {
        const { email, type } = req.body; // type: 'login' | 'signup'

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        if (!db) {
            return res.status(500).json({ success: false, message: 'Firebase not initialized. Check serviceAccountKey.json' });
        }

        // Rate limiting: 1 request per 30 seconds
        const otpDocRef = db.collection('verification_codes').doc(email);
        const existingDoc = await otpDocRef.get();
        if (existingDoc.exists) {
            const data = existingDoc.data();
            const lastSent = data.createdAt ? data.createdAt.toDate() : 0;
            const now = new Date();
            const diffSeconds = (now - lastSent) / 1000;
            if (diffSeconds < 30) {
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${Math.ceil(30 - diffSeconds)} seconds before requesting a new code.`
                });
            }
        }

        let userRecord = null;
        try {
            userRecord = await firebaseAdminAuth.getUserByEmail(email);
        } catch (e) {
            // User not found in Firebase Auth
        }

        // If type is login, we don't send OTP anymore (reverted to password)
        if (type === 'login') {
            return res.status(400).json({ success: false, message: 'Please login using your email and password.' });
        }

        if (type === 'signup' && userRecord) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please sign in to your PawSafe account to add your volunteer profile.'
            });
        }

        // 1. Generate a 6-digit OTP on the server
        const otp = crypto.randomInt(100000, 999999).toString();

        // 2. Hash the OTP using bcrypt before saving
        const hashedOtp = await bcrypt.hash(otp, 10);
        const now = Date.now();
        const expiresAt = now + 5 * 60 * 1000; // 5 mins validity

        // 3. Store OTP in Firestore 'verification_codes' collection
        await otpDocRef.set({
            otpHash: hashedOtp, // Use otpHash instead of otp
            createdAt: FieldValue.serverTimestamp(),
            expiresAt: expiresAt,
            attempts: 0,
            type
        });

        // 4. Send the SAME OTP to the user via email using Nodemailer (HTML template)
        const message = `Your PawSafe verification code is: ${otp}. It will expire in 5 minutes.`;
        console.log('-----------------------------------------');
        console.log('📧 FOR TESTING PURPOSES (OTP FLOW):');
        console.log('TO:', email);
        console.log('MESSAGE:', message);
        console.log('-----------------------------------------');
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #0D7377; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <span style="font-size: 30px;">🐾</span>
                    </div>
                    <h1 style="color: #0D7377; margin: 0; font-size: 28px; letter-spacing: 1px;">PawSafe</h1>
                    <p style="color: #7f8c8d; margin: 5px 0; font-weight: 500;">SECURE AUTHENTICATION</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #edf2f7;">
                    <p style="margin-top: 0; font-size: 16px; color: #4a5568;">Hello,</p>
                    <p style="font-size: 16px; color: #4a5568;">Use the following code to complete your verification:</p>
                    <div style="font-size: 42px; font-weight: 800; color: #0D7377; margin: 25px 0; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; background: #fff; padding: 15px; border-radius: 8px; border: 2px dashed #0D7377;">${otp}</div>
                    <p style="color: #e53e3e; font-size: 14px; font-weight: 600;">⚠️ This code expires in 5 minutes.</p>
                </div>
                <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #f0f0f0; text-align: center;">
                    <p style="color: #718096; font-size: 13px;">If you didn't request this code, please ignore this email.</p>
                    <p style="font-size: 14px; color: #0D7377; font-weight: 600; margin-top: 20px;">
                        Helping every paw find its way home. 🐾
                    </p>
                </div>
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
        // Log error status but NOT the OTP
        console.error('Send OTP Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to send verification code' });
    }
});

// @route  POST /api/auth/verify-otp
// @desc   Verify OTP and return Auth data
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type, name, location, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        if (type === 'signup' && !password) {
            return res.status(400).json({ success: false, message: 'Password is required for registration' });
        }

        const otpDocRef = db.collection('verification_codes').doc(email);
        const otpDoc = await otpDocRef.get();

        if (!otpDoc.exists) {
            return res.status(401).json({ success: false, message: 'Verification session expired. Please request a new OTP.' });
        }

        const data = otpDoc.data();
        const now = Date.now();

        // 1. Check if expiresAt is still valid
        if (data.expiresAt < now) {
            await otpDocRef.delete().catch(() => { });
            return res.status(401).json({ success: false, message: 'OTP expired, please resend' });
        }

        // 2. Check maximum attempts (Max 3)
        if (data.attempts >= 3) {
            await otpDocRef.delete().catch(() => { });
            return res.status(401).json({ success: false, message: 'Too many incorrect attempts. Please request a new OTP.' });
        }

        // 3. Compare OTP using bcrypt.compare()
        const isMatch = await bcrypt.compare(otp, data.otpHash);

        if (!isMatch) {
            const newAttempts = (data.attempts || 0) + 1;

            if (newAttempts >= 3) {
                await otpDocRef.delete().catch(() => { });
                return res.status(401).json({ success: false, message: 'Access Denied' });
            } else {
                await otpDocRef.update({ attempts: newAttempts }).catch(() => { });
                return res.status(401).json({
                    success: false,
                    message: `Access Denied. ${3 - newAttempts} attempts remaining.`,
                    attemptsRemaining: 3 - newAttempts
                });
            }
        }

        // 4. OTP is correct -> DELETE the OTP from database immediately
        await otpDocRef.delete().catch(() => { });

        if (type === 'login') {
            return res.status(400).json({ success: false, message: 'Please login using your email and password.' });
        }

        let userData = null;
        const initialRole = req.body.role || 'user';
        const roles = [initialRole];
        if (initialRole !== 'user' && !roles.includes('user')) {
            roles.push('user'); // All accounts should have 'user' role by default
        }

        if (type === 'signup') {
            // Check if user already exists in Firebase Auth to be safe
            try {
                await firebaseAdminAuth.getUserByEmail(email);
                return res.status(409).json({ success: false, message: 'User already exists. Please log in.' });
            } catch (e) {
                // User doesn't exist, proceed
            }

            const userRecord = await firebaseAdminAuth.createUser({
                email,
                password: password,
                displayName: name,
            });

            userData = {
                uid: userRecord.uid,
                name,
                email,
                location: location || '',
                roles: roles,
                createdAt: FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(userRecord.uid).set(userData);

            // If volunteer, also store in 'volunteers' collection
            if (roles.includes('volunteer')) {
                const volunteerData = {
                    userId: userRecord.uid,
                    name: name || userRecord.displayName || email || 'Volunteer',
                    email: email || userRecord.email,
                    phone: req.body.phone || '',
                    latitude: req.body.latitude || 0,
                    longitude: req.body.longitude || 0,
                    availability: req.body.availability || 'available',
                    role: 'volunteer',
                    isActive: true,
                    totalRescues: 0,
                    createdAt: FieldValue.serverTimestamp()
                };

                // Cleanup undefined values just in case
                Object.keys(volunteerData).forEach(key => {
                    if (volunteerData[key] === undefined) delete volunteerData[key];
                });

                await db.collection('volunteers').doc(userRecord.uid).set(volunteerData, { merge: true });
            }
        }

        const token = signToken(userData.uid);

        res.json({
            success: true,
            token,
            user: userData,
            message: 'Registration successful! 🐾'
        });
    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
    }
});

// @route  GET /api/auth/me
// @desc   Get current user (protected)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userDoc = await db.collection('users').doc(decoded.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found in Firestore' });
        }

        const userData = userDoc.data();
        res.json({
            success: true,
            user: {
                id: decoded.id,
                ...userData,
                // Ensure roles array exists for frontend
                roles: userData.roles || (userData.role ? [userData.role] : ['user'])
            }
        });
    } catch (err) {
        console.error('Auth check error:', err.message);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

module.exports = router;
