const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handle Google OAuth login/signup
 * Verifies Google token and creates/updates user in database
 * Returns JWT token for session management
 */
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        googleId,
        name,
        email,
        photoURL: picture,
      });
      await user.save();
    } else {
      // Update existing user's photo and name if changed
      user.name = name;
      user.photoURL = picture;
      await user.save();
    }

    // Generate JWT token with user ID (valid for 7 days)
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        averageRating: user.averageRating,
        itemsSold: user.itemsSold,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

/**
 * Get current user profile from JWT token
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        averageRating: user.averageRating,
        itemsSold: user.itemsSold,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

/**
 * Get seller's profile and stats
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's active listings
    const Item = require('../models/Item');
    const items = await Item.find({ sellerId: userId, status: 'active' });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        averageRating: user.averageRating,
        itemsSold: user.itemsSold,
        itemsCount: items.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};
