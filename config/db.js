// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================
// This file handles connecting to MongoDB database
// MongoDB is a NoSQL database that stores data as JSON-like documents

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * 
 * What happens here:
 * 1. Reads the MongoDB connection string from .env file
 * 2. Attempts to connect to the database
 * 3. Logs success or error messages
 * 
 * @returns {Promise} - Returns a promise that resolves when connected
 */
const connectDB = async () => {
    try {
        // Get MongoDB URI from environment variables
        const mongoURI = process.env.MONGODB_URI;

        // Check if MongoDB URI is provided
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        // Connect to MongoDB
        // mongoose.connect() establishes connection to the database
        const conn = await mongoose.connect(mongoURI);

        // Log success message with host information
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);

        // Listen for connection events
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

    } catch (error) {
        // If connection fails, log the error and exit the application
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.error('💡 Make sure MongoDB is running and MONGODB_URI is correct in .env file');

        // Exit process with failure code
        process.exit(1);
    }
};

// Export the connectDB function so it can be used in server.js
module.exports = connectDB;
