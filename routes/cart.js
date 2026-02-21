// ============================================
// CART ROUTES
// ============================================
// API endpoints for shopping cart operations

const express = require('express');
const router = express.Router();

// Import controllers
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
} = require('../controllers/cartController');

// Import middleware
const { protect } = require('../middleware/auth');

/**
 * CART ROUTES
 * All cart routes require authentication (protect middleware)
 */

// GET /api/cart - Get user's cart
router.get('/', protect, getCart);

// POST /api/cart/add - Add item to cart
router.post('/add', protect, addToCart);

// PUT /api/cart/update - Update item quantity
router.put('/update', protect, updateCartItem);

// DELETE /api/cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', protect, removeFromCart);

// POST /api/cart/apply-coupon - Apply coupon code
router.post('/apply-coupon', protect, applyCoupon);

// DELETE /api/cart/remove-coupon - Remove applied coupon
router.delete('/remove-coupon', protect, removeCoupon);

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', protect, clearCart);

/**
 * EXAMPLE API CALLS:
 * 
 * Get cart:
 * GET http://localhost:5000/api/cart
 * Headers: { "Authorization": "Bearer <token>" }
 * 
 * Add to cart:
 * POST http://localhost:5000/api/cart/add
 * Headers: { "Authorization": "Bearer <token>" }
 * Body: { "productId": "507f1f77bcf86cd799439011", "quantity": 2 }
 * 
 * Update quantity:
 * PUT http://localhost:5000/api/cart/update
 * Headers: { "Authorization": "Bearer <token>" }
 * Body: { "productId": "507f1f77bcf86cd799439011", "quantity": 3 }
 * 
 * Apply coupon:
 * POST http://localhost:5000/api/cart/apply-coupon
 * Headers: { "Authorization": "Bearer <token>" }
 * Body: { "couponCode": "SAVE100" }
 */

module.exports = router;
