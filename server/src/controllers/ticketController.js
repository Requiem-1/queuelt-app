const ticketService = require('../services/ticketService');
const { success, error } = require('../utils/apiResponse');

/**
 * @desc    Join queue / Create new ticket
 * @route   POST /api/v1/tickets/join
 * @access  Public / Guest / User
 */
const joinQueue = async (req, res) => {
  try {
    const io = req.app.get('io');
    const ticket = await ticketService.joinQueue({
      venueId: req.body.venueId,
      counterId: req.body.counterId,
      partySize: req.body.partySize,
      guestName: req.body.guestName,
      user: req.user,
      io,
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully joined the queue!',
      ticket,
    });
  } catch (err) {
    console.error('[ticketController]: joinQueue error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Get active ticket for logged in user or guest
 * @route   GET /api/v1/tickets/my-ticket
 * @access  Public / User
 */
const getMyTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getMyTicket({
      ticketId: req.query.ticketId,
      userId: req.query.userId,
      guestName: req.query.guestName,
      user: req.user,
    });

    return success(res, { ticket });
  } catch (err) {
    console.error('[ticketController]: getMyTicket error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Get real-time live queue status for a counter
 * @route   GET /api/v1/tickets/live/:counterId
 * @access  Public
 */
const getLiveQueueStatus = async (req, res) => {
  try {
    const data = await ticketService.getLiveQueueStatus(req.params.counterId);
    return success(res, data);
  } catch (err) {
    console.error('[ticketController]: getLiveQueueStatus error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Update ticket status (Serving, Served, Skipped, Left)
 * @route   PATCH /api/v1/tickets/:ticketId/status
 * @access  Private (Admin, Superadmin)
 */
const updateTicketStatus = async (req, res) => {
  try {
    const io = req.app.get('io');
    const ticket = await ticketService.updateTicketStatus({
      ticketId: req.params.ticketId,
      status: req.body.status,
      io,
    });

    return res.json({
      success: true,
      message: `Ticket status updated to '${req.body.status}'`,
      ticket,
    });
  } catch (err) {
    console.error('[ticketController]: updateTicketStatus error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Leave queue / Cancel active ticket
 * @route   DELETE /api/v1/tickets/:ticketId/leave
 * @access  Public / Guest / User
 */
const leaveQueue = async (req, res) => {
  try {
    const io = req.app.get('io');
    const ticket = await ticketService.leaveQueue({
      ticketId: req.params.ticketId,
      io,
    });

    return res.json({
      success: true,
      message: 'Successfully left the queue',
      ticket,
    });
  } catch (err) {
    console.error('[ticketController]: leaveQueue error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  joinQueue,
  getMyTicket,
  getLiveQueueStatus,
  updateTicketStatus,
  leaveQueue,
};
