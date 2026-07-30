const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate a signed JWT token
 * @param {string} userId - Database ID of the user
 * @param {string} role - User role (guest, admin, superadmin)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_queueit_2026',
    { expiresIn: '7d' }
  );
};

/**
 * Protect routes by verifying JWT Bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_queueit_2026'
      );

      // Fetch user from DB if available, fallback to decoded payload
      const user = await User.findById(decoded.id).select('-password');
      req.user = user || { _id: decoded.id, id: decoded.id, role: decoded.role };

      return next();
    } catch (error) {
      console.error('[auth]: Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Optional authentication middleware: attaches req.user if Bearer token is provided, but does not block if omitted
 */
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_queueit_2026'
      );
      const user = await User.findById(decoded.id).select('-password');
      req.user = user || { _id: decoded.id, id: decoded.id, role: decoded.role };
    } catch (error) {
      console.warn('[auth]: Optional token verification skipped:', error.message);
    }
  }
  return next();
};

/**
 * Authorize middleware for role-based access control
 * @param  {...string} roles - Allowed roles e.g. ('admin', 'superadmin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = {
  generateToken,
  protect,
  optionalAuth,
  authorize,
};
