// ============================================
// PRODUCT CONTROLLER
// ============================================
// This handles all product-related operations

const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filters
 * @access  Public
 * 
 * Query parameters:
 * - category: Filter by category
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - search: Search in product name
 * - sort: Sort by field (price, rating, name)
 */
const getProducts = async (req, res) => {
    try {
        // Build query object based on filters
        const query = { isActive: true };  // Only show active products

        // Filter by category
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) {
                query.price.$gte = Number(req.query.minPrice);  // Greater than or equal
            }
            if (req.query.maxPrice) {
                query.price.$lte = Number(req.query.maxPrice);  // Less than or equal
            }
        }

        // Search by name
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };  // Case-insensitive search
        }

        // Build sort object
        let sortBy = {};
        if (req.query.sort) {
            const sortField = req.query.sort;
            sortBy[sortField] = 1;  // 1 for ascending, -1 for descending
        } else {
            sortBy.createdAt = -1;  // Default: newest first
        }

        // Execute query
        const products = await Product.find(query).sort(sortBy);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,           // Return updated document
                runValidators: true  // Run schema validations
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            isActive: true
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Export controller functions
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};
