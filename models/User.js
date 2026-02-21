// ============================================
// USER MODEL (DATABASE SCHEMA)
// ============================================
// This defines the structure of User data in MongoDB
// Think of it as a blueprint for how user information is stored

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * 
 * Schema = Structure of the data
 * Each field defines what type of data it stores and validation rules
 */
const userSchema = new mongoose.Schema(
    {
        // User's full name
        name: {
            type: String,           // Data type: text
            required: [true, 'Please provide a name'],  // Validation: must be provided
            trim: true,             // Remove extra spaces
            maxlength: [50, 'Name cannot be more than 50 characters']
        },

        // User's email (used for login)
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,           // No two users can have the same email
            lowercase: true,        // Convert to lowercase before saving
            trim: true,
            match: [              // Validation: must be valid email format
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },

        // User's password (will be encrypted)
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false         // Don't include password when fetching user data (security)
        },

        // User role (for future admin features)
        role: {
            type: String,
            enum: ['user', 'admin'],  // Can only be 'user' or 'admin'
            default: 'user'           // Default value is 'user'
        },

        // User's wishlist (array of product IDs)
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,  // Reference to Product model
            ref: 'Product'                          // Links to Product collection
        }]
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

/**
 * MIDDLEWARE: Hash password before saving to database
 * 
 * This runs automatically before saving a user
 * It encrypts the password so it's not stored in plain text (SECURITY!)
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it's new or modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt (random data for extra security)
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

/**
 * METHOD: Compare entered password with hashed password
 * 
 * This is used during login to check if password is correct
 * 
 * @param {String} enteredPassword - Password user entered
 * @returns {Boolean} - true if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    // bcrypt.compare() checks if plain password matches hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * METHOD: Add product to wishlist
 */
userSchema.methods.addToWishlist = async function (productId) {
    // Check if product is already in wishlist
    if (!this.wishlist.includes(productId)) {
        this.wishlist.push(productId);
        await this.save();
    }
    return this.wishlist;
};

/**
 * METHOD: Remove product from wishlist
 */
userSchema.methods.removeFromWishlist = async function (productId) {
    this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
    await this.save();
    return this.wishlist;
};

// Create and export the User model
// 'User' is the collection name in MongoDB
module.exports = mongoose.model('User', userSchema);
