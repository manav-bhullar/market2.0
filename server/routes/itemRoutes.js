const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
// GET /items - Fetch all items with search/filter
router.get('/', itemController.getAllItems);

// GET /items/:id - Get single item details
router.get('/:id', itemController.getItemById);

// Protected routes (require JWT authentication)
// POST /items - Create new item listing
router.post('/', authMiddleware, upload.single('image'), itemController.createItem);

// PUT /items/:id - Update item (owner only)
router.put('/:id', authMiddleware, upload.single('image'), itemController.updateItem);

// DELETE /items/:id - Delete item (owner only)
router.delete('/:id', authMiddleware, itemController.deleteItem);

// GET /items/user/my-items - Get current user's listings
router.get('/user/my-items', authMiddleware, itemController.getUserItems);

module.exports = router;
