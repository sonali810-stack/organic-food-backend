// ============================================
// CLEANUP SCRIPT - Delete Old Data
// ============================================
// This script deletes data from the wrong location

require('dotenv').config();
const mongoose = require('mongoose');

const cleanup = async () => {
    try {
        console.log('🧹 Starting cleanup...\n');

        // Connect to local MongoDB (where data was incorrectly added)
        const localURI = 'mongodb://localhost:27017/organic-food-db';
        await mongoose.connect(localURI);

        console.log('✅ Connected to local MongoDB');

        // Drop the entire database
        await mongoose.connection.dropDatabase();
        console.log('✅ Deleted all data from local database\n');

        console.log('✨ Cleanup complete!');
        console.log('📝 Next: Update .env to use MongoDB Atlas connection string\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
        process.exit(1);
    }
};

cleanup();
