const authService = require('../services/authService');
const { success, error } = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error('[authController]: registerUser error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error('[authController]: loginUser error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Create anonymous guest session
 * @route   POST /api/v1/auth/guest
 * @access  Public
 */
const createGuestSession = async (req, res) => {
  try {
    const result = await authService.createGuest(req.body);
    return res.status(201).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error('[authController]: createGuestSession error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user._id || req.user.id);
    return success(res, { user });
  } catch (err) {
    console.error('[authController]: getMe error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  createGuestSession,
  getMe,
};
