const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Remove duplicate products
wishlistSchema.pre('save', function (next) {
    const seen = new Set();
    this.items = this.items.filter(item => {
        const productId = item.product.toString();
        if (seen.has(productId)) {
            return false;
        }
        seen.add(productId);
        return true;
    });
    next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
