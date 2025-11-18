const Review = require('../models/Review');
const Item = require('../models/Item');
const User = require('../models/User');

/**
 * Add a review/rating for an item
 * One review per user per item (unique constraint enforced)
 */
exports.addReview = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Prevent seller from reviewing their own item
    if (item.sellerId.toString() === userId) {
      return res.status(403).json({
        message: 'You cannot review your own items',
      });
    }

    // Create or update review
    let review = await Review.findOne({ itemId, userId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment || '';
      await review.save();
    } else {
      // Create new review
      review = new Review({
        itemId,
        userId,
        rating,
        comment: comment || '',
      });
      await review.save();
    }

    // Recalculate item's average rating
    const reviews = await Review.find({ itemId });
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
        : 0;

    item.averageRating = avgRating;
    await item.save();

    // Recalculate seller's average rating
    const sellerItems = await Item.find({ sellerId: item.sellerId });
    const sellerReviews = await Review.find({
      itemId: { $in: sellerItems.map((i) => i._id) },
    });
    const sellerAvgRating =
      sellerReviews.length > 0
        ? (
            sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length
          ).toFixed(2)
        : 0;

    await User.findByIdAndUpdate(item.sellerId, { averageRating: sellerAvgRating });

    await review.populate('userId', 'name photoURL');

    res.status(201).json({
      message: 'Review added successfully',
      review,
      itemAverageRating: avgRating,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already reviewed this item',
      });
    }
    res.status(500).json({
      message: 'Failed to add review',
      error: error.message,
    });
  }
};

/**
 * Get all reviews for an item
 */
exports.getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;

    const reviews = await Review.find({ itemId })
      .populate('userId', 'name photoURL email')
      .sort({ createdAt: -1 });

    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    res.status(200).json({
      reviews,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Get seller's average rating and stats
 */
exports.getSellerStats = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Get all items by seller
    const items = await Item.find({ sellerId });

    // Get all reviews for seller's items
    const reviews = await Review.find({
      itemId: { $in: items.map((i) => i._id) },
    });

    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
          : 0,
      itemsListed: items.length,
      itemsSold: items.filter((i) => i.status === 'sold').length,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch seller stats',
      error: error.message,
    });
  }
};
