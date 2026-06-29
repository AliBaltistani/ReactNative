/**
 * RasaanGo — Simple Auth Middleware
 */
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    // For MVP: accept any token, just check it exists
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    req.userId = token; // In real app, decode JWT
    next();
}

module.exports = authMiddleware;
