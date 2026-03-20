const admin = require('firebase-admin');
const path = require('path');

// NOTE: You must generate a Service Account Key from Firebase Console
// Settings -> Service Accounts -> Generate new private key
// Save it to backend/config/serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin Initialized');
} catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    console.warn('⚠️ Please ensure you have placed serviceAccountKey.json in the backend/config directory.');
}

const db = admin.firestore?.() || null;
const auth = admin.auth?.() || null;

module.exports = { admin, db, auth };
