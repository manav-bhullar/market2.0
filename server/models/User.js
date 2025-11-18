const mongoose = require('mongoose');

// User Schema for storing Thapar users (students and teachers)
const userSchema = new mongoose.Schema(
  {
    // Google unique identifier
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    // User's full name from Google account
    name: {
      type: String,
      required: true,
    },
    // Email address (must be @thapar.edu)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // Profile photo URL from Google
    photoURL: {
      type: String,
    },
    // Average rating based on reviews received
    averageRating: {
      type: Number,
      default: 0,
    },
    // Number of items sold
    itemsSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
