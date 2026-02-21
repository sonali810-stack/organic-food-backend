// ============================================
// AUTHENTICATION CONTROLLER
// ============================================
// This handles user registration, login, and authentication logic
// Controllers contain the actual business logic for routes

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');

/**
 * HELPER FUNCTION: Generate JWT Token
 * 
 * JWT (JSON Web Token) is used for authentication
 * It's like a digital ID card that proves user is logged in
 * 
 * @param {String} userId - User's database ID
 * @returns {String} - JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },                    // Payload: data stored in token
        process.env.JWT_SECRET,        // Secret key to sign token
        { expiresIn: process.env.JWT_EXPIRE || '7d' }  // Token expires in 7 days
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (anyone can access)
 */
const register = async (req, res) => {
    try {
        // Get data from request body
        const { name, email, password } = req.body;

        // Validation: Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        // Password will be automatically hashed by User model middleware
        const user = await User.create({
            name,
            email,
            password
        });

        // Create empty cart for new user
        await Cart.create({
            user: user._id,
            items: []
        });

        // Generate JWT token
        const token = generateToken(user._id);

        // Send response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password field
        // (password is normally excluded, but we need it to verify)
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        // comparePassword() is a method we defined in User model
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (requires authentication)
 */
const getMe = async (req, res) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user._id).populate('wishlist');

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    wishlist: user.wishlist,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Find user and update
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Export controller functions
module.exports = {
    register,
    login,
    getMe,
    updateProfile
};
