// ============================================
// ORDER MODEL (DATABASE SCHEMA)
// ============================================
// This stores completed orders (after checkout)

const mongoose = require('mongoose');

/**
 * Order Item Schema
 * 
 * Snapshot of product details at time of purchase
 */
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    name: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    price: {
        type: Number,
        required: true
    },

    image: String
});

/**
 * Order Schema
 */
const orderSchema = new mongoose.Schema(
    {
        // Which user placed this order?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Order items (snapshot from cart)
        items: [orderItemSchema],

        // Pricing details
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        tax: {
            type: Number,
            required: true,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        // Coupon used (if any)
        couponCode: {
            type: String,
            default: null
        },

        // Order status
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },

        // Shipping address (for future implementation)
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },

        // Payment details (for future implementation)
        paymentMethod: {
            type: String,
            enum: ['cod', 'card', 'upi', 'netbanking'],
            default: 'cod'
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },

        // Delivery date (estimated)
        estimatedDelivery: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

/**
 * METHOD: Mark order as delivered
 */
orderSchema.methods.markAsDelivered = async function () {
    this.status = 'delivered';
    await this.save();
    return this;
};

/**
 * METHOD: Cancel order
 */
orderSchema.methods.cancelOrder = async function () {
    if (this.status === 'delivered') {
        throw new Error('Cannot cancel delivered order');
    }
    this.status = 'cancelled';
    await this.save();
    return this;
};

// Create and export the Order model
module.exports = mongoose.model('Order', orderSchema);
