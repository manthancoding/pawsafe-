/**
 * Middleware to sanitize request bodies before logging
 * Prevents sensitive data like OTPs, passwords, and tokens from being logged
 */
const sanitizeBody = (body) => {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['otp', 'otpHash', 'password', 'tokens', 'token', 'hashedOtp'];

    sensitiveFields.forEach(field => {
        if (field in sanitized) {
            sanitized[field] = '[MASKED]';
        }
    });

    return sanitized;
};

const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

    // Log only safe info initially
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', sanitizeBody(req.body));
    }

    // Capture response to log completion
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });

    next();
};

module.exports = loggerMiddleware;
