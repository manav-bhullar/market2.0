const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
// POST /auth/register - Register new user
router.post('/register', authController.register);

// POST /auth/login - Login user
router.post('/login', authController.login);

// Protected routes (require JWT token)
// GET /auth/me - Get current logged-in user
router.get('/me', authMiddleware, authController.getCurrentUser);

// GET /auth/profile/:userId - Get specific user's profile
router.get('/profile/:userId', authController.getUserProfile);

module.exports = router;
