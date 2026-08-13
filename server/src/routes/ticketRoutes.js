const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getMyTicket,
  getLiveQueueStatus,
  updateTicketStatus,
  leaveQueue,
} = require('../controllers/ticketController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.post('/join', optionalAuth, joinQueue);
router.get('/my-ticket', optionalAuth, getMyTicket);
router.get('/live/:counterId', getLiveQueueStatus);
router.patch('/:ticketId/status', protect, authorize('admin', 'superadmin'), updateTicketStatus);
router.delete('/:ticketId/leave', optionalAuth, leaveQueue);

module.exports = router;
