const { db } = require('../config/firebaseAdmin');

// Middleware to protect routes (verify JWT)
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from Firestore
        const userDoc = await db.collection('users').doc(decoded.id).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = { id: userDoc.id, ...userDoc.data() };

        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token verification failed' });
    }
};

// Middleware to restrict access to ADMINS only
exports.admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || (req.user.roles && req.user.roles.includes('admin')))) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Requires Admin role' });
    }
};

// Middleware to restrict access to VOLUNTEERS only
exports.volunteer = (req, res, next) => {
    if (req.user && (req.user.role === 'volunteer' || (req.user.roles && req.user.roles.includes('volunteer')))) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Requires Volunteer role' });
    }
};
