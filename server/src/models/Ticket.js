const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
      trim: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue reference is required'],
    },
    counter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counter',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    guestName: {
      type: String,
      trim: true,
    },
    partySize: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['waiting', 'next', 'serving', 'served', 'skipped', 'left'],
      default: 'waiting',
    },
    qrCodeToken: {
      type: String,
      default: '',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    calledAt: {
      type: Date,
    },
    servedAt: {
      type: Date,
    },
    estimatedWaitMinutes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queue filtering & counter lookups
ticketSchema.index({ venue: 1, counter: 1, status: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
