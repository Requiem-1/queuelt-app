const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Counter name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Counter code is required'],
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },
    currentServingToken: {
      type: String,
      default: '',
    },
    dailyTokenCounter: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Counter', counterSchema);
