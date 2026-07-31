const express = require('express');
const router = express.Router();
const { getPublicKey, subscribePush } = require('../controllers/notificationController');

router.get('/vapid-public-key', getPublicKey);
router.post('/subscribe', subscribePush);

module.exports = router;
