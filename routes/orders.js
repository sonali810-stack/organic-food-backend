// ============================================
// ORDER ROUTES
// ============================================
// API endpoints for order management

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

/**
 * @route   POST /api/orders
 * @desc    Create new order from cart
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Prepare order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.image
        }));

        // Calculate totals
        const subtotal = cart.calculateSubtotal();
        const discount = cart.calculateDiscount();
        const tax = (subtotal - discount) * 0.05;
        const total = cart.calculateTotal();

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            subtotal,
            discount,
            tax,
            total,
            couponCode: cart.appliedCoupon?.code || null,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod || 'cod'
        });

        // Update product stock
        for (const item of cart.items) {
            await item.product.decreaseStock(item.quantity);
        }

        // Clear cart after order
        await cart.clearCart();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })  // Newest first
            .populate('items.product');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure order belongs to user (or user is admin)
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        await order.cancelOrder();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error cancelling order'
        });
    }
});

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

module.exports = router;
