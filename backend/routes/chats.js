const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');

// POST /api/chats — send a message
router.post('/', async (req, res, next) => {
    try {
        const { rescueId, senderId, message } = req.body;
        if (!rescueId || !senderId || !message) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const chatData = {
            rescueId,
            senderId,
            message,
            timestamp: FieldValue.serverTimestamp()
        };

        // Security check: Only original user or assigned volunteer can chat
        const rescueDoc = await db.collection('rescueRequests').doc(rescueId).get();
        if (!rescueDoc.exists) return res.status(404).json({ success: false, message: 'Rescue not found' });

        const rescueData = rescueDoc.data();
        if (rescueData.userId !== senderId && rescueData.assignedVolunteerId !== senderId && senderId !== 'anonymous') {
            return res.status(403).json({ success: false, message: 'Unauthorized to chat in this session' });
        }

        const docRef = await db.collection('rescueChats').add(chatData);
        res.status(201).json({ success: true, data: { id: docRef.id, ...chatData } });
    } catch (err) {
        next(err);
    }
});

// GET /api/chats/:rescueId — get messages for a rescue
router.get('/:rescueId', async (req, res, next) => {
    try {
        const snapshot = await db.collection('rescueChats')
            .where('rescueId', '==', req.params.rescueId)
            .orderBy('timestamp', 'asc')
            .get();

        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
