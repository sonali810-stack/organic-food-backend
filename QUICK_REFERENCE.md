# 🚀 Quick Reference Guide

## ⚡ Quick Start (3 Steps)

### 1️⃣ Setup MongoDB Atlas (5 minutes)
```
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP (0.0.0.0/0)
6. Get connection string
7. Update backend/.env file
```

### 2️⃣ Start Backend (1 minute)
```bash
cd backend
npm run dev
```

### 3️⃣ Seed Database (30 seconds)
```bash
# In new terminal
cd backend
npm run seed
```

---

## 📋 Common Commands

```bash
# Install dependencies
npm install

# Start server (development with auto-restart)
npm run dev

# Start server (production)
npm start

# Seed database with products
npm run seed

# Check Node version
node --version

# Check npm version
npm --version
```

---

## 🔌 API Endpoints Cheat Sheet

### Base URL: `http://localhost:5000`

### Authentication (Public)
```
POST /api/auth/register
POST /api/auth/login
```

### User (Protected - Need Token)
```
GET  /api/auth/me
PUT  /api/auth/update-profile
```

### Products (Public)
```
GET  /api/products
GET  /api/products/:id
GET  /api/products/category/:category
```

### Cart (Protected)
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove/:productId
POST   /api/cart/apply-coupon
DELETE /api/cart/remove-coupon
```

### Orders (Protected)
```
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
PUT  /api/orders/:id/cancel
```

---

## 🧪 Testing with Thunder Client

### 1. Register User
```
Method: POST
URL: http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```
Method: POST
URL: http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Response: Copy the "token" value
```

### 3. Get Products
```
Method: GET
URL: http://localhost:5000/api/products
```

### 4. Get Cart (Protected)
```
Method: GET
URL: http://localhost:5000/api/cart
Headers:
  Authorization: Bearer <paste-token-here>
```

### 5. Add to Cart (Protected)
```
Method: POST
URL: http://localhost:5000/api/cart/add
Headers:
  Authorization: Bearer <your-token>
Body (JSON):
{
  "productId": "<product-id-from-products-list>",
  "quantity": 2
}
```

---

## 🎟️ Available Coupons

```
FIRST50    - ₹50 off (fixed)
SAVE100    - ₹100 off (fixed)
ORGANIC20  - 20% off (percentage)
WELCOME10  - 10% off (percentage)
```

---

## 📁 File Structure Quick Reference

```
backend/
├── server.js              ← Main entry point
├── .env                   ← Environment variables (MongoDB, JWT)
├── package.json           ← Dependencies
│
├── config/
│   └── db.js             ← MongoDB connection
│
├── models/               ← Database schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
│
├── controllers/          ← Business logic
│   ├── authController.js
│   ├── productController.js
│   └── cartController.js
│
├── routes/              ← API endpoints
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
│
└── middleware/          ← Authentication
    └── auth.js
```

---

## 🔧 Environment Variables (.env)

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/organic-food-db
JWT_SECRET=c60f409ed19692731f7fac0060b53592b5211b0151597a0d23aee400b25
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

---

## ❌ Common Errors & Fixes

### "MongoDB connection error"
```
✓ Check MongoDB Atlas connection string
✓ Verify username and password
✓ Check IP whitelist (0.0.0.0/0)
✓ Ensure database name is in connection string
```

### "Port 5000 already in use"
```
✓ Change PORT in .env to 5001
✓ Or kill process: netstat -ano | findstr :5000
```

### "Cannot find module"
```
✓ Run: npm install
✓ Check you're in backend folder
```

### "JWT_SECRET is not defined"
```
✓ Check .env file exists
✓ Verify JWT_SECRET is set
✓ Restart server after changing .env
```

---

## 📊 Database Collections

After seeding, you'll have:

```
users      - User accounts
products   - 47 organic products
carts      - Shopping carts
orders     - Completed orders
```

---

## 🎯 Success Indicators

Server started successfully when you see:
```
✅ MongoDB Connected: cluster0...
📊 Database Name: organic-food-db
🚀 SERVER STARTED SUCCESSFULLY!
📡 Server running on: http://localhost:5000
```

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend creates JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. Frontend sends token in headers for protected routes
   ↓
5. Backend verifies token
   ↓
6. If valid: Allow access
   If invalid: Return 401 error
```

---

## 📝 Request/Response Examples

### Register Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Products Response
```json
{
  "success": true,
  "count": 47,
  "data": [
    {
      "_id": "65abc...",
      "name": "Organic Broccoli",
      "category": "vegetables",
      "price": 249,
      "image": "https://...",
      "rating": 4.8,
      "reviews": 245,
      "stock": 15,
      "isNew": true
    }
  ]
}
```

### Cart Response
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "product": {...},
          "quantity": 2,
          "price": 249
        }
      ],
      "appliedCoupon": null
    },
    "summary": {
      "subtotal": 498,
      "discount": 0,
      "tax": 24.9,
      "total": 522.9
    }
  }
}
```

---

## 🎓 Key Concepts

### REST API
- **GET** - Retrieve data
- **POST** - Create new data
- **PUT** - Update data
- **DELETE** - Remove data

### HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

### Middleware
Functions that run before route handlers:
```javascript
app.get('/api/cart', protect, getCart)
                     ^^^^^^^ middleware
```

### JWT Token
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "123", "exp": 1234567890 }
Signature: HMACSHA256(header + payload, secret)
```

---

## 🚀 Next Steps

1. ✅ Backend is ready
2. ⏭️ Set up MongoDB Atlas
3. ⏭️ Start server and seed database
4. ⏭️ Test API endpoints
5. ⏭️ Integrate with React frontend

---

## 📚 Documentation Files

- `README.md` - Full API documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `MONGODB_ATLAS_SETUP.md` - Cloud database setup
- `BACKEND_SUMMARY.md` - Complete overview
- `QUICK_REFERENCE.md` - This file!

---

## 💡 Pro Tips

1. **Keep server running** while developing
2. **Check terminal** for error messages
3. **Use Thunder Client** for testing
4. **Save tokens** when testing protected routes
5. **Read error messages** carefully
6. **Check MongoDB Atlas** dashboard to view data

---

## ✨ You're Ready!

Everything is set up and ready to go. Just:
1. Set up MongoDB Atlas
2. Start the server
3. Seed the database
4. Start building! 🚀

**Happy coding!** 🎉
