const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[server]: Connected to MongoDB successfully. Host: ${conn.connection.host}`);
  } catch (error) {
    console.error('[server]: MongoDB connection warning:', error.message);
    console.warn('[server]: Continuing server execution without active DB connection.');
  }
};

module.exports = connectDB;
