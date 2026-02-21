// ============================================
// CART CONTROLLER
// ============================================
// This handles shopping cart operations

const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
const getCart = async (req, res) => {
    try {
        // Find cart for logged-in user
        // .populate() fetches full product details instead of just ID
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        // If cart doesn't exist, create empty cart
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        // Calculate totals
        const subtotal = cart.calculateSubtotal();
        const discount = cart.calculateDiscount();
        const total = cart.calculateTotal();

        res.status(200).json({
            success: true,
            data: {
                cart,
                summary: {
                    subtotal,
                    discount,
                    tax: (subtotal - discount) * 0.05,
                    total
                }
            }
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Validate input
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide product ID'
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

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        // Add item to cart
        await cart.addItem(productId, quantity, product.price);

        // Populate product details and return
        cart = await Cart.findById(cart._id).populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/cart/update
 * @desc    Update item quantity in cart
 * @access  Private
 */
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide product ID and quantity'
            });
        }

        // Find cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Update quantity
        await cart.updateQuantity(productId, quantity);

        // Populate and return
        cart = await Cart.findById(cart._id).populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: cart
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Remove item
        await cart.removeItem(productId);

        // Populate and return
        cart = await Cart.findById(cart._id).populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/cart/apply-coupon
 * @desc    Apply coupon to cart
 * @access  Private
 */
const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({
                success: false,
                message: 'Please provide coupon code'
            });
        }

        // Available coupons (same as frontend)
        const coupons = {
            'FIRST50': { discount: 50, type: 'fixed', description: 'First time user' },
            'SAVE100': { discount: 100, type: 'fixed', description: '₹100 off on orders over ₹500' },
            'ORGANIC20': { discount: 20, type: 'percent', description: '20% off organic products' },
            'WELCOME10': { discount: 10, type: 'percent', description: '10% welcome discount' }
        };

        const coupon = coupons[couponCode.toUpperCase()];

        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Find cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Apply coupon
        cart.appliedCoupon = {
            code: couponCode.toUpperCase(),
            discount: coupon.discount,
            type: coupon.type
        };
        await cart.save();

        // Calculate new totals
        const subtotal = cart.calculateSubtotal();
        const discount = cart.calculateDiscount();
        const total = cart.calculateTotal();

        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                cart,
                summary: {
                    subtotal,
                    discount,
                    tax: (subtotal - discount) * 0.05,
                    total
                }
            }
        });

    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Error applying coupon',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/cart/remove-coupon
 * @desc    Remove applied coupon
 * @access  Private
 */
const removeCoupon = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.appliedCoupon = null;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Coupon removed',
            data: cart
        });

    } catch (error) {
        console.error('Remove coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing coupon',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        await cart.clearCart();

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

// Export controller functions
module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
};
