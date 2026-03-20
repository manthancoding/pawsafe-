const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userDoc = await db.collection('users').doc(decoded.id).get();

        let userData = { id: decoded.id };

        if (userDoc.exists) {
            userData = { ...userData, ...userDoc.data() };
            // Ensure roles is an array for backward compatibility
            if (userData.role && !userData.roles) {
                userData.roles = [userData.role];
            }
            // Ensure email is present if it's missing in Firestore but available in Auth
            if (!userData.email) {
                try {
                    const userRecord = await admin.auth().getUser(decoded.id);
                    userData.email = userRecord.email;
                } catch (authErr) {
                    console.error('Auth fetch error (email recovery):', authErr.message);
                }
            }
        } else {
            // Fallback if no Firestore doc exists yet (e.g. first login/signup)
            try {
                const userRecord = await admin.auth().getUser(decoded.id);
                userData.email = userRecord.email;
                userData.name = userRecord.displayName || userRecord.email;
            } catch (authErr) {
                console.error('Auth fetch error:', authErr.message);
            }
            userData.roles = ['user'];
        }

        req.user = userData;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// @route  GET /api/users/me/adoptions
router.get('/me/adoptions', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('adoptions').where('userId', '==', req.user.id).get();
        const adoptions = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                ...d,
                createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt
            };
        });
        res.json({ success: true, count: adoptions.length, data: adoptions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/reports
router.get('/me/reports', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('emergencies').where('reportedBy', '==', req.user.id).get();
        const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: reports.length, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/favorites
router.get('/me/favorites', protect, async (req, res) => {
    try {
        // Favorites are stored as an array of animal IDs in the user document
        const userDoc = await db.collection('users').doc(req.user.id).get();
        const favorites = userDoc.data().favorites || [];

        // Fetch animal details for each favorite
        const animalPromises = favorites.map(id => db.collection('animals').doc(id).get());
        const animalDocs = await Promise.all(animalPromises);
        const data = animalDocs.filter(d => d.exists).map(d => ({ id: d.id, ...d.data() }));

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/users/me/favorites/:id
router.post('/me/favorites/:id', protect, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.user.id);
        const userDoc = await userRef.get();
        let favorites = userDoc.data().favorites || [];
        const index = favorites.indexOf(req.params.id);

        if (index === -1) {
            favorites.push(req.params.id);
        } else {
            favorites.splice(index, 1);
        }

        await userRef.update({ favorites });
        res.json({ success: true, data: favorites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  PUT /api/users/me/profile
router.put('/me/profile', protect, async (req, res) => {
    try {
        const { name, phone, city, avatar } = req.body;
        const userRef = db.collection('users').doc(req.user.id);

        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (city) updates.city = city;
        if (avatar) updates.avatar = avatar;

        await userRef.update(updates);
        const updatedDoc = await userRef.get();

        res.json({ success: true, data: { id: updatedDoc.id, ...updatedDoc.data() } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/volunteer
router.get('/me/volunteer', protect, async (req, res) => {
    try {
        const userEmail = req.user.email || req.user.data?.email;
        if (!userEmail) return res.json({ success: true, count: 0, data: [] });

        const snapshot = await db.collection('volunteers').where('email', '==', userEmail).get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: data.length, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/users/me/donations
router.get('/me/donations', protect, async (req, res) => {
    try {
        const userEmail = req.user.email || req.user.data?.email;
        if (!userEmail) return res.json({ success: true, count: 0, data: [] });

        const snapshot = await db.collection('donations').where('donorEmail', '==', userEmail).get();
        const donations = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                ...d,
                createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt
            };
        });
        res.json({ success: true, count: donations.length, data: donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/users/become-volunteer
router.post('/become-volunteer', protect, async (req, res) => {
    try {
        const { name, phone, latitude, longitude, availability } = req.body;
        const userRef = db.collection('users').doc(req.user.id);
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : { roles: ['user'], email: req.user.email };

        let roles = userData.roles || (userData.role ? [userData.role] : ['user']);

        if (!roles.includes('volunteer')) {
            roles.push('volunteer');
        }

        if (userDoc.exists) {
            await userRef.update({ roles });
        } else {
            await userRef.set({ ...userData, roles });
        }

        // Create/update volunteer document
        const volunteerData = {
            userId: req.user.id,
            name: name || userData.name || userData.email || req.user.email,
            email: userData.email || req.user.email,
            phone: phone || '',
            latitude: latitude || 0,
            longitude: longitude || 0,
            availability: availability || 'available',
            isActive: true,
            totalRescues: userData.totalRescues || 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Filter out any undefined values to prevent Firestore errors
        Object.keys(volunteerData).forEach(key => {
            if (volunteerData[key] === undefined) {
                delete volunteerData[key];
            }
        });

        await db.collection('volunteers').doc(req.user.id).set(volunteerData, { merge: true });

        res.json({
            success: true,
            message: 'You are now a volunteer! 🐾',
            user: { ...userData, roles }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
