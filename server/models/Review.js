const mongoose = require('mongoose');

// Review Schema for buyer ratings and feedback
const reviewSchema = new mongoose.Schema(
  {
    // Reference to the item being reviewed
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    // Reference to the buyer leaving the review
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Star rating (1-5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Written feedback or comment
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same item
reviewSchema.index({ itemId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
