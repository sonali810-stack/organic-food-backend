// ============================================
// CART MODEL (DATABASE SCHEMA)
// ============================================
// This stores shopping cart data for each user

const mongoose = require('mongoose');

/**
 * Cart Item Schema
 * 
 * Each item in the cart has product details and quantity
 */
const cartItemSchema = new mongoose.Schema({
    // Reference to the product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  // Links to Product collection
        required: true
    },

    // Quantity of this product in cart
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        max: [20, 'Quantity cannot exceed 20'],
        default: 1
    },

    // Price at the time of adding to cart
    // (stored separately in case product price changes later)
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
});

/**
 * Cart Schema
 * 
 * Each user has one cart that contains multiple items
 */
const cartSchema = new mongoose.Schema(
    {
        // Which user does this cart belong to?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Links to User collection
            required: true,
            unique: true  // Each user can have only one cart
        },

        // Array of cart items
        items: [cartItemSchema],

        // Applied coupon code (if any)
        appliedCoupon: {
            code: String,
            discount: Number,
            type: {
                type: String,
                enum: ['fixed', 'percent']
            }
        }
    },
    {
        timestamps: true
    }
);

/**
 * METHOD: Calculate cart subtotal
 * 
 * Adds up the price of all items in the cart
 */
cartSchema.methods.calculateSubtotal = function () {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

/**
 * METHOD: Calculate discount amount
 */
cartSchema.methods.calculateDiscount = function () {
    if (!this.appliedCoupon) return 0;

    const subtotal = this.calculateSubtotal();

    if (this.appliedCoupon.type === 'percent') {
        return (subtotal * this.appliedCoupon.discount) / 100;
    }

    return this.appliedCoupon.discount;
};

/**
 * METHOD: Calculate total (subtotal - discount + tax)
 */
cartSchema.methods.calculateTotal = function () {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount();
    const tax = (subtotal - discount) * 0.05; // 5% GST

    return subtotal - discount + tax;
};

/**
 * METHOD: Add item to cart
 */
cartSchema.methods.addItem = async function (productId, quantity, price) {
    // Check if product already exists in cart
    const existingItem = this.items.find(
        item => item.product.toString() === productId.toString()
    );

    if (existingItem) {
        // Update quantity if product already in cart
        existingItem.quantity += quantity;
    } else {
        // Add new item to cart
        this.items.push({ product: productId, quantity, price });
    }

    await this.save();
    return this;
};

/**
 * METHOD: Remove item from cart
 */
cartSchema.methods.removeItem = async function (productId) {
    this.items = this.items.filter(
        item => item.product.toString() !== productId.toString()
    );
    await this.save();
    return this;
};

/**
 * METHOD: Update item quantity
 */
cartSchema.methods.updateQuantity = async function (productId, quantity) {
    const item = this.items.find(
        item => item.product.toString() === productId.toString()
    );

    if (item) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            return this.removeItem(productId);
        }
        item.quantity = quantity;
        await this.save();
    }

    return this;
};

/**
 * METHOD: Clear cart
 */
cartSchema.methods.clearCart = async function () {
    this.items = [];
    this.appliedCoupon = null;
    await this.save();
    return this;
};

// Create and export the Cart model
module.exports = mongoose.model('Cart', cartSchema);
