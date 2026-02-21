const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('items.product');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: []
            });
        }

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching wishlist'
        });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: [{ product: productId }]
            });
        } else {
            // Check if product already in wishlist
            const exists = wishlist.items.some(
                item => item.product.toString() === productId
            );

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist'
                });
            }

            wishlist.items.push({ product: productId });
            await wishlist.save();
        }

        wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('items.product');

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to wishlist'
        });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('items.product');

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from wishlist'
        });
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
exports.clearWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = [];
        await wishlist.save();

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing wishlist'
        });
    }
};
