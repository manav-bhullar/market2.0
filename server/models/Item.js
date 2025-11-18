const mongoose = require('mongoose');

// Item Schema for marketplace listings
const itemSchema = new mongoose.Schema(
  {
    // Title of the item being sold
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Detailed description of the item
    description: {
      type: String,
      required: true,
    },
    // Selling price in rupees
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Category (e.g., Books, Electronics, Furniture, Clothing, etc.)
    category: {
      type: String,
      enum: ['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other'],
      required: true,
    },
    // URL to the item's image (stored on Cloudinary)
    imageURL: {
      type: String,
    },
    // Reference to the seller (User who posted the item)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Status of the listing (active, sold, removed)
    status: {
      type: String,
      enum: ['active', 'sold', 'removed'],
      default: 'active',
    },
    // Average rating for this item
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
