// ============================================
// PRODUCT ROUTES
// ============================================
// API endpoints for product operations

const express = require('express');
const router = express.Router();

// Import controllers
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
} = require('../controllers/productController');

// Import middleware
const { protect, admin } = require('../middleware/auth');

/**
 * PRODUCT ROUTES
 */

// GET /api/products - Get all products with filters
// Public route
// Query params: ?category=fruits&minPrice=100&maxPrice=500&search=apple
router.get('/', getProducts);

// GET /api/products/category/:category - Get products by category
// Public route
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id - Get single product
// Public route
router.get('/:id', getProduct);

// POST /api/products - Create new product
// Private route (Admin only)
router.post('/', protect, admin, createProduct);

// PUT /api/products/:id - Update product
// Private route (Admin only)
router.put('/:id', protect, admin, updateProduct);

// DELETE /api/products/:id - Delete product
// Private route (Admin only)
router.delete('/:id', protect, admin, deleteProduct);

/**
 * EXAMPLE API CALLS:
 * 
 * Get all products:
 * GET http://localhost:5000/api/products
 * 
 * Get filtered products:
 * GET http://localhost:5000/api/products?category=fruits&minPrice=100&maxPrice=500
 * 
 * Get single product:
 * GET http://localhost:5000/api/products/507f1f77bcf86cd799439011
 * 
 * Create product (Admin only):
 * POST http://localhost:5000/api/products
 * Headers: { "Authorization": "Bearer <admin-token>" }
 * Body: {
 *   "name": "Organic Mango",
 *   "category": "fruits",
 *   "price": 250,
 *   "image": "https://...",
 *   "stock": 20
 * }
 */

module.exports = router;
