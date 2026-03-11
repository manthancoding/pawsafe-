const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token verification failed' });
    }
};

// Middleware to restrict access to ADMINS only
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Requires Admin role' });
    }
};
