// ============================================
// AUTHENTICATION ROUTES
// ============================================
// This defines the API endpoints for user authentication
// Routes connect URLs to controller functions

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    register,
    login,
    getMe,
    updateProfile
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');

/**
 * ROUTE DEFINITIONS
 * 
 * Format: router.METHOD(PATH, [MIDDLEWARE], CONTROLLER)
 * 
 * METHOD: get, post, put, delete
 * PATH: URL endpoint
 * MIDDLEWARE: Optional functions that run before controller
 * CONTROLLER: Function that handles the request
 */

// POST /api/auth/register - Register new user
// Public route (no authentication required)
router.post('/register', register);

// POST /api/auth/login - Login user
// Public route
router.post('/login', login);

// GET /api/auth/me - Get current user info
// Private route (requires authentication)
// protect middleware runs first, then getMe controller
router.get('/me', protect, getMe);

// PUT /api/auth/update-profile - Update user profile
// Private route
router.put('/update-profile', protect, updateProfile);

/**
 * EXAMPLE API CALLS:
 * 
 * Register:
 * POST http://localhost:5000/api/auth/register
 * Body: { "name": "John", "email": "john@example.com", "password": "123456" }
 * 
 * Login:
 * POST http://localhost:5000/api/auth/login
 * Body: { "email": "john@example.com", "password": "123456" }
 * 
 * Get Me:
 * GET http://localhost:5000/api/auth/me
 * Headers: { "Authorization": "Bearer <token>" }
 */

// Export router
module.exports = router;
