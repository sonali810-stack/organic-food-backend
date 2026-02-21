// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
// This protects routes that require user to be logged in
// Middleware = Function that runs BEFORE your route handler

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * PROTECT MIDDLEWARE
 * 
 * This checks if user is authenticated (logged in)
 * 
 * How it works:
 * 1. Get token from request headers
 * 2. Verify token is valid
 * 3. Get user from database
 * 4. Attach user to request object
 * 5. Continue to next function (route handler)
 * 
 * Usage in routes:
 * router.get('/profile', protect, getUserProfile)
 *                        ^^^^^^^ This middleware runs first
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check if authorization header exists and starts with 'Bearer'
        // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token found, user is not authenticated
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login to access this resource.'
            });
        }

        // Verify token
        // jwt.verify() checks if token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded contains: { userId: '123abc', iat: 1234567890, exp: 1234567890 }
        // iat = issued at, exp = expiration time

        // Get user from database using ID from token
        // .select('-password') means don't include password field
        req.user = await User.findById(decoded.userId).select('-password');

        // If user not found (maybe deleted)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }

        // User is authenticated! Continue to next function
        next();

    } catch (error) {
        console.error('Auth middleware error:', error.message);

        // Token is invalid or expired
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Invalid or expired token.'
        });
    }
};

/**
 * ADMIN MIDDLEWARE
 * 
 * This checks if user is an admin
 * Use this AFTER protect middleware
 * 
 * Usage:
 * router.delete('/products/:id', protect, admin, deleteProduct)
 *                                ^^^^^^^ ^^^^^ Both run before deleteProduct
 */
const admin = (req, res, next) => {
    // req.user is set by protect middleware
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, continue
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

/**
 * OPTIONAL AUTH MIDDLEWARE
 * 
 * This attaches user if token exists, but doesn't require it
 * Useful for routes that work differently for logged in vs guest users
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
        }

        // Continue regardless of whether user was found
        next();

    } catch (error) {
        // If token is invalid, just continue without user
        next();
    }
};

// Export middleware functions
module.exports = { protect, admin, optionalAuth };
