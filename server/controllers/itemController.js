const Item = require('../models/Item');
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * Get all items with optional search and filter
 * Supports: search query, category filter, price range, sort
 */
exports.getAllItems = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    // Build filter object
    let filter = { status: 'active' };

    // Search filter (search in title and description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };

    // Fetch items with seller info populated
    const items = await Item.find(filter)
      .populate('sellerId', 'name email photoURL averageRating')
      .sort(sortOption)
      .lean();

    res.status(200).json({
      message: 'Items fetched successfully',
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch items',
      error: error.message,
    });
  }
};

/**
 * Get single item details with seller and reviews
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate(
      'sellerId',
      'name email photoURL averageRating itemsSold createdAt'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get reviews for this item
    const reviews = await Review.find({ itemId: id })
      .populate('userId', 'name photoURL')
      .sort({ createdAt: -1 });

    res.status(200).json({
      item,
      reviews,
      reviewCount: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch item',
      error: error.message,
    });
  }
};

/**
 * Create new item listing (authenticated users only)
 */
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const sellerId = req.userId;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, price, category',
      });
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Get image URL from uploaded file
    const imageURL = req.file ? req.file.path : null;

    // Create new item
    const item = new Item({
      title,
      description,
      price: parseFloat(price),
      category,
      imageURL,
      sellerId,
      status: 'active',
    });

    await item.save();

    // Populate seller info before returning
    await item.populate('sellerId', 'name email photoURL');

    res.status(201).json({
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create item',
      error: error.message,
    });
  }
};

/**
 * Update item (only by item owner)
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, status } = req.body;
    const userId = req.userId;

    // Find item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership
    if (item.sellerId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own items' });
    }

    // Update fields if provided
    if (title) item.title = title;
    if (description) item.description = description;
    if (price) item.price = parseFloat(price);
    if (category) item.category = category;
    if (status) item.status = status;

    // Update image if new one uploaded
    if (req.file) {
      item.imageURL = req.file.path;
    }

    await item.save();
    await item.populate('sellerId', 'name email photoURL');

    res.status(200).json({
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update item',
      error: error.message,
    });
  }
};

/**
 * Delete item (only by item owner)
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership
    if (item.sellerId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own items' });
    }

    // Mark as removed instead of hard delete (preserves review history)
    item.status = 'removed';
    await item.save();

    res.status(200).json({
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete item',
      error: error.message,
    });
  }
};

/**
 * Get user's listings
 */
exports.getUserItems = async (req, res) => {
  try {
    const userId = req.userId;

    const items = await Item.find({ sellerId: userId })
      .populate('sellerId', 'name email photoURL')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user items',
      error: error.message,
    });
  }
};
