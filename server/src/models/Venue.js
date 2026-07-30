const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Venue slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Dining', 'Healthcare', 'Gym', 'Library', 'Banking', 'Events'],
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'busy', 'closed'],
      default: 'open',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    estimatedAvgWaitTime: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Venue', venueSchema);
