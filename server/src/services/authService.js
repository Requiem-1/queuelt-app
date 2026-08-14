const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user
 */
const register = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    throw error;
  }

  // Sanitize role - allow admin/superadmin only if explicit or default to guest
  const assignedRole = ['guest', 'admin', 'superadmin'].includes(role) ? role : 'guest';

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
  });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedVenue: user.assignedVenue,
      guestId: user.guestId,
    },
  };
};

/**
 * Login existing user
 */
const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedVenue: user.assignedVenue,
      guestId: user.guestId,
    },
  };
};

/**
 * Create anonymous guest session
 */
const createGuest = async ({ guestName }) => {
  const name = guestName || 'Guest User';
  const guestId = `G-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const email = `${guestId.toLowerCase()}@guest.queueit.app`;

  const user = await User.create({
    name,
    email,
    role: 'guest',
    guestId,
  });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      guestId: user.guestId,
    },
  };
};

/**
 * Get user profile by ID
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  register,
  login,
  createGuest,
  getProfile,
};
