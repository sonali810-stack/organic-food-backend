// ============================================
// PRODUCT MODEL (DATABASE SCHEMA)
// ============================================
// This defines the structure of Product data in MongoDB

const mongoose = require('mongoose');

/**
 * Product Schema Definition
 * 
 * This matches the product structure from your frontend Shop.js
 */
const productSchema = new mongoose.Schema(
    {
        // Product name (e.g., "Organic Broccoli")
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters']
        },

        // Product category (vegetables, fruits, nuts, etc.)
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            enum: [
                'vegetables',
                'fruits',
                'nuts',
                'honey',
                'grains',
                'dairy',
                'herbs',
                'oils',
                'beverages'
            ],
            lowercase: true
        },

        // Product price (stored as number, not string)
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: [0, 'Price cannot be negative']
        },

        // Product image URL
        image: {
            type: String,
            required: [true, 'Please provide an image URL']
        },

        // Product description
        description: {
            type: String,
            default: '100% organic, farm-fresh product. Sourced directly from local farmers. No pesticides, no chemicals. Pure natural goodness.'
        },

        // Product rating (1-5 stars)
        rating: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },

        // Number of reviews
        reviews: {
            type: Number,
            default: 0,
            min: [0, 'Reviews cannot be negative']
        },

        // Stock quantity
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0
        },

        // Is this a new product?
        isNew: {
            type: Boolean,
            default: false
        },

        // Is product active/available?
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

/**
 * INDEXES for faster queries
 * 
 * Indexes make database searches faster
 * Like an index in a book - helps find things quickly
 */
productSchema.index({ category: 1 });  // Index on category
productSchema.index({ price: 1 });     // Index on price
productSchema.index({ name: 'text' }); // Text index for search functionality

/**
 * METHOD: Check if product is in stock
 */
productSchema.methods.isInStock = function () {
    return this.stock > 0;
};

/**
 * METHOD: Decrease stock when product is purchased
 */
productSchema.methods.decreaseStock = async function (quantity) {
    if (this.stock >= quantity) {
        this.stock -= quantity;
        await this.save();
        return true;
    }
    return false;
};

/**
 * METHOD: Increase stock when product is restocked
 */
productSchema.methods.increaseStock = async function (quantity) {
    this.stock += quantity;
    await this.save();
    return this.stock;
};

// Create and export the Product model
// Collection name will be 'food' in MongoDB
module.exports = mongoose.model('Product', productSchema, 'food');
