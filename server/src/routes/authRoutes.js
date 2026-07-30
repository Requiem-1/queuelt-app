const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  createGuestSession,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest', createGuestSession);
router.get('/me', protect, getMe);

module.exports = router;
