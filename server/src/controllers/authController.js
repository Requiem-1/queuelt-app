const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * @desc    Register a new user (admin / superadmin / guest)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'guest',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedVenue: user.assignedVenue,
        guestId: user.guestId,
      },
    });
  } catch (error) {
    console.error('[auth]: Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error registering user',
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user (include password field which has select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedVenue: user.assignedVenue,
        guestId: user.guestId,
      },
    });
  } catch (error) {
    console.error('[auth]: Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error logging in',
      error: error.message,
    });
  }
};

/**
 * @desc    Create anonymous guest session
 * @route   POST /api/v1/auth/guest
 * @access  Public
 */
const createGuestSession = async (req, res) => {
  try {
    const { guestName } = req.body;
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

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        guestId: user.guestId,
      },
    });
  } catch (error) {
    console.error('[auth]: Guest session error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating guest session',
      error: error.message,
    });
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('[auth]: GetMe error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createGuestSession,
  getMe,
};
