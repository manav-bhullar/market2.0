const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
// GET /reviews/item/:itemId - Get all reviews for an item
router.get('/item/:itemId', reviewController.getItemReviews);

// GET /reviews/seller/:sellerId - Get seller's rating stats
router.get('/seller/:sellerId', reviewController.getSellerStats);

// Protected routes (require JWT authentication)
// POST /reviews/:itemId - Add review for an item
router.post('/:itemId', authMiddleware, reviewController.addReview);

module.exports = router;
