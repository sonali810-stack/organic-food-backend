// ============================================
// MAIN SERVER FILE
// ============================================
// This is the entry point of your backend application
// It sets up Express server, connects to database, and defines routes

// Load environment variables from .env file
// This must be at the very top!
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

/**
 * INITIALIZE EXPRESS APP
 * 
 * Express is a web framework that makes it easy to create APIs
 * Think of it as the foundation of your backend
 */
const app = express();

/**
 * CONNECT TO DATABASE
 * 
 * This connects to MongoDB before starting the server
 * If connection fails, the app will exit
 */
connectDB();

/**
 * MIDDLEWARE
 * 
 * Middleware are functions that run for every request
 * They process the request before it reaches your routes
 */

// 1. CORS - Allow frontend to make requests to backend
// Without this, browser will block requests from different origin
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',  // Frontend URL
    credentials: true  // Allow cookies
}));

// 2. JSON Parser - Parse JSON request bodies
// This allows you to access req.body in your controllers
app.use(express.json());

// 3. URL Encoded Parser - Parse form data
app.use(express.urlencoded({ extended: true }));

// 4. Request Logger - Log every request (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

/**
 * ROUTES
 * 
 * Routes define the API endpoints
 * Format: app.use('/api/path', routeHandler)
 */

// Import route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');

// Mount routes
app.use('/api/auth', authRoutes);        // Authentication routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/cart', cartRoutes);        // Cart routes
app.use('/api/orders', orderRoutes);     // Order routes
app.use('/api/wishlist', wishlistRoutes); // Wishlist routes

/**
 * ROOT ROUTE
 * 
 * Test route to check if server is running
 * Visit: http://localhost:5000/
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Organic Food API is running! 🌱',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders'
        }
    });
});

/**
 * HEALTH CHECK ROUTE
 * 
 * Check if API and database are working
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        database: 'Connected',
        timestamp: new Date().toISOString()
    });
});

/**
 * 404 HANDLER
 * 
 * This runs if no route matches the request
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

/**
 * ERROR HANDLER
 * 
 * This catches any errors that occur in your routes
 */
app.use((err, req, res, next) => {
    console.error('Error:', err.stack); // err.stack = Error ka full detail

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

/**
 * START SERVER
 * 
 * Listen for incoming requests on specified port
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 SERVER STARTED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50) + '\n');

    console.log('📋 Available Routes:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/products`);
    console.log(`   GET  http://localhost:${PORT}/api/cart`);
    console.log(`   GET  http://localhost:${PORT}/api/orders`);
    console.log('\n💡 Press Ctrl+C to stop the server\n');
});

/**
 * GRACEFUL SHUTDOWN
 * 
 * Handle server shutdown gracefully
 */
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
