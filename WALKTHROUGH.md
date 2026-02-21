# 🎯 Complete Backend Walkthrough

## 📦 What You Have Now

Your backend folder contains **21 files** organized into a professional structure:

```
backend/
│
├── 📄 Configuration Files (4)
│   ├── package.json           - Dependencies & scripts
│   ├── .env                   - Environment variables (MongoDB, JWT)
│   ├── .gitignore            - Files to exclude from Git
│   └── server.js             - Main server entry point
│
├── 📁 config/ (1 file)
│   └── db.js                 - MongoDB connection setup
│
├── 📁 models/ (4 files)       - Database Schemas
│   ├── User.js               - User accounts with auth
│   ├── Product.js            - Product catalog
│   ├── Cart.js               - Shopping cart logic
│   └── Order.js              - Order management
│
├── 📁 controllers/ (3 files)  - Business Logic
│   ├── authController.js     - Registration, login, JWT
│   ├── productController.js  - Product CRUD operations
│   └── cartController.js     - Cart & coupon management
│
├── 📁 routes/ (4 files)       - API Endpoints
│   ├── auth.js               - /api/auth routes
│   ├── products.js           - /api/products routes
│   ├── cart.js               - /api/cart routes
│   └── orders.js             - /api/orders routes
│
├── 📁 middleware/ (1 file)
│   └── auth.js               - JWT authentication
│
├── 🌱 seedProducts.js        - Database seeder (47 products)
│
└── 📚 Documentation (5 files)
    ├── README.md             - Complete API docs
    ├── SETUP_GUIDE.md        - Setup instructions
    ├── MONGODB_ATLAS_SETUP.md - Cloud DB setup
    ├── BACKEND_SUMMARY.md    - Feature overview
    └── QUICK_REFERENCE.md    - Quick commands
```

**Total: 21 files, ~2,500 lines of well-commented code!**

---

## 🔄 How Everything Connects

### Request Flow Example: "User adds item to cart"

```
1. Frontend sends request:
   POST http://localhost:5000/api/cart/add
   Headers: { Authorization: "Bearer <token>" }
   Body: { productId: "123", quantity: 2 }
   
   ↓

2. server.js receives request
   - Parses JSON body
   - Applies CORS
   - Routes to /api/cart
   
   ↓

3. routes/cart.js matches route
   - POST /add → protect middleware → addToCart controller
   
   ↓

4. middleware/auth.js (protect)
   - Verifies JWT token
   - Gets user from database
   - Attaches user to request
   
   ↓

5. controllers/cartController.js (addToCart)
   - Validates product exists
   - Checks stock availability
   - Finds/creates user's cart
   - Adds item to cart
   - Saves to MongoDB
   
   ↓

6. Response sent back:
   {
     "success": true,
     "message": "Item added to cart",
     "data": { cart with items }
   }
```

---

## 🗂️ File Explanations

### **server.js** - The Heart
```javascript
// What it does:
1. Loads environment variables (.env)
2. Connects to MongoDB
3. Sets up Express middleware (CORS, JSON parser)
4. Mounts all routes
5. Starts server on port 5000
6. Handles errors

// Key lines:
require('dotenv').config();        // Load .env
connectDB();                       // Connect to MongoDB
app.use(cors());                   // Enable CORS
app.use('/api/auth', authRoutes);  // Mount routes
app.listen(PORT);                  // Start server
```

### **models/User.js** - User Schema
```javascript
// What it defines:
- name: String
- email: String (unique)
- password: String (hashed)
- role: 'user' or 'admin'
- wishlist: Array of product IDs

// Special features:
- Automatically hashes password before saving
- Method to compare passwords (for login)
- Methods to add/remove from wishlist
```

### **models/Product.js** - Product Schema
```javascript
// What it defines:
- name, category, price, image
- description, rating, reviews
- stock, isNew, isActive

// Special features:
- Indexes for fast searching
- Methods to check stock
- Methods to increase/decrease stock
```

### **models/Cart.js** - Cart Schema
```javascript
// What it defines:
- user: Reference to User
- items: Array of { product, quantity, price }
- appliedCoupon: { code, discount, type }

// Special features:
- Methods to calculate subtotal
- Methods to calculate discount
- Methods to calculate total (with tax)
- Methods to add/remove/update items
```

### **controllers/authController.js**
```javascript
// Functions:
1. register() - Create new user, hash password, return JWT
2. login() - Verify credentials, return JWT
3. getMe() - Get current user info
4. updateProfile() - Update user details

// Key concept: JWT (JSON Web Token)
- User logs in → Server creates token → User stores token
- User makes request → Includes token → Server verifies
```

### **middleware/auth.js**
```javascript
// protect middleware:
1. Checks if Authorization header exists
2. Extracts token from "Bearer <token>"
3. Verifies token with JWT_SECRET
4. Gets user from database
5. Attaches user to req.user
6. Calls next() to continue to route handler

// Usage:
router.get('/cart', protect, getCart)
                    ^^^^^^^ Runs before getCart
```

---

## 🎓 Key Backend Concepts Explained

### 1. **REST API**
```
REST = Representational State Transfer
API = Application Programming Interface

It's a way for frontend and backend to communicate:
- Frontend: "Hey backend, give me all products"
- Backend: "Here's the data in JSON format"

HTTP Methods:
GET    - Read data
POST   - Create data
PUT    - Update data
DELETE - Remove data
```

### 2. **Middleware**
```javascript
// Middleware = Function that runs BEFORE route handler

Request → Middleware 1 → Middleware 2 → Route Handler → Response

Example:
app.use(express.json())  // Parses JSON body
app.use(cors())          // Enables CORS
router.get('/cart', protect, getCart)
                    ^^^^^^^ Auth middleware
```

### 3. **MongoDB & Mongoose**
```
MongoDB = Database (stores data)
Mongoose = Library to interact with MongoDB

Schema = Blueprint for data structure
Model = Class to create/read/update/delete documents

const User = mongoose.model('User', userSchema);
await User.create({ name: 'John' });  // Create
await User.find();                     // Read all
await User.findById(id);              // Read one
await User.findByIdAndUpdate(id, {});  // Update
await User.findByIdAndDelete(id);      // Delete
```

### 4. **JWT Authentication**
```
JWT = JSON Web Token

Structure:
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.signature

How it works:
1. User logs in with email/password
2. Server verifies credentials
3. Server creates JWT with user ID
4. Server signs JWT with secret key
5. Server sends JWT to frontend
6. Frontend stores JWT (localStorage)
7. Frontend sends JWT with every request
8. Server verifies JWT signature
9. Server allows/denies access
```

### 5. **Password Hashing**
```javascript
// NEVER store passwords in plain text!

Plain password: "password123"
Hashed password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

How it works:
1. User registers with password
2. bcrypt generates salt (random data)
3. bcrypt hashes password + salt
4. Hashed password stored in database

Login:
1. User enters password
2. bcrypt hashes entered password
3. Compare with stored hash
4. If match → Login success
```

### 6. **Async/Await**
```javascript
// Database operations take time
// async/await waits for them to complete

// Without async/await (callback hell):
User.findById(id, (err, user) => {
  if (err) { /* handle error */ }
  Cart.findOne({ user: user._id }, (err, cart) => {
    if (err) { /* handle error */ }
    // More nested callbacks...
  });
});

// With async/await (clean):
const user = await User.findById(id);
const cart = await Cart.findOne({ user: user._id });
```

---

## 🔍 Code Examples Explained

### Example 1: User Registration

```javascript
// controllers/authController.js - register function

const register = async (req, res) => {
  try {
    // 1. Get data from request
    const { name, email, password } = req.body;
    
    // 2. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields'
      });
    }
    
    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // 4. Create new user (password auto-hashed by model)
    const user = await User.create({ name, email, password });
    
    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user._id },      // Payload
      process.env.JWT_SECRET,    // Secret key
      { expiresIn: '7d' }        // Expires in 7 days
    );
    
    // 6. Send response
    res.status(201).json({
      success: true,
      data: { user, token }
    });
    
  } catch (error) {
    // 7. Handle errors
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Example 2: Protected Route

```javascript
// middleware/auth.js - protect middleware

const protect = async (req, res, next) => {
  try {
    // 1. Get token from headers
    // Format: "Authorization: Bearer eyJhbGciOiJI..."
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized. Please login.'
      });
    }
    
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: '123', iat: 1234567890, exp: 1234567890 }
    
    // 4. Get user from database
    req.user = await User.findById(decoded.userId);
    
    // 5. Continue to next middleware/route handler
    next();
    
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};
```

### Example 3: Cart Calculation

```javascript
// models/Cart.js - calculateTotal method

cartSchema.methods.calculateTotal = function() {
  // 1. Calculate subtotal (sum of all items)
  const subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // 2. Calculate discount
  let discount = 0;
  if (this.appliedCoupon) {
    if (this.appliedCoupon.type === 'percent') {
      discount = (subtotal * this.appliedCoupon.discount) / 100;
    } else {
      discount = this.appliedCoupon.discount;
    }
  }
  
  // 3. Calculate tax (5% GST)
  const tax = (subtotal - discount) * 0.05;
  
  // 4. Calculate total
  const total = subtotal - discount + tax;
  
  return total;
};
```

---

## 🎯 What Each Technology Does

| Technology | Purpose | Example |
|------------|---------|---------|
| **Node.js** | Run JavaScript on server | `node server.js` |
| **Express** | Create web server & routes | `app.get('/api/products')` |
| **MongoDB** | Store data | Database with collections |
| **Mongoose** | Interact with MongoDB | `User.create()`, `Product.find()` |
| **JWT** | Secure authentication | Token for logged-in users |
| **bcryptjs** | Hash passwords | Encrypt passwords before storing |
| **CORS** | Allow cross-origin requests | Frontend can call backend |
| **dotenv** | Load environment variables | Read `.env` file |

---

## 🚀 Ready to Start!

You now understand:
- ✅ How the backend is structured
- ✅ How requests flow through the system
- ✅ What each file does
- ✅ Key backend concepts
- ✅ How authentication works
- ✅ How data is stored and retrieved

**Next steps:**
1. Set up MongoDB Atlas (follow MONGODB_ATLAS_SETUP.md)
2. Start the server (`npm run dev`)
3. Seed the database (`npm run seed`)
4. Test with Thunder Client
5. Integrate with React frontend!

You've got this! 🎉
