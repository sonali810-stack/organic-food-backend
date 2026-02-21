# 🚀 Backend Setup Guide - Step by Step

This guide will walk you through setting up the backend for your Organic Food Website.

## ✅ What We've Done So Far

1. ✅ Created complete backend structure
2. ✅ Installed all dependencies (Express, MongoDB, JWT, etc.)
3. ✅ Generated secure JWT secret
4. ✅ Configured environment variables

## 📋 Next Steps

### Step 1: Install MongoDB

You have **two options**:

#### Option A: Local MongoDB (Recommended for Learning)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service (check the box)
5. MongoDB will start automatically

**Verify Installation:**
```bash
# Open new terminal and run:
mongod --version
```

#### Option B: MongoDB Atlas (Cloud - Easier Setup)

1. Go to https://www.mongodb.com/atlas
2. Click "Try Free"
3. Create account
4. Create a FREE cluster (M0)
5. Create database user (username + password)
6. Add your IP to whitelist (or allow from anywhere: 0.0.0.0/0)
7. Click "Connect" → "Connect your application"
8. Copy connection string
9. Update `.env` file:
   ```
   # Comment out local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/organic-food-db
   
   # Add your Atlas connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/organic-food-db?retryWrites=true&w=majority
   ```

---

### Step 2: Seed the Database

This will add all 47 products to your database:

```bash
cd backend
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
🗑️  Deleting existing products...
✅ Existing products deleted
📦 Inserting products...
✅ 47 products inserted successfully!
```

---

### Step 3: Start the Backend Server

```bash
npm run dev
```

**Expected Output:**
```
==================================================
🚀 SERVER STARTED SUCCESSFULLY!
==================================================
📡 Server running on: http://localhost:5000
🌍 Environment: development
📅 Started at: [current date/time]
==================================================

✅ MongoDB Connected: localhost
📊 Database Name: organic-food-db
```

---

### Step 4: Test the API

#### Test 1: Check if server is running
Open browser and go to: http://localhost:5000

You should see:
```json
{
  "success": true,
  "message": "Organic Food API is running! 🌱",
  "version": "1.0.0"
}
```

#### Test 2: Get all products
Go to: http://localhost:5000/api/products

You should see all 47 products in JSON format.

#### Test 3: Register a user

**Using Thunder Client (VS Code Extension):**
1. Install "Thunder Client" extension in VS Code
2. Click Thunder Client icon in sidebar
3. Click "New Request"
4. Set method to `POST`
5. Enter URL: `http://localhost:5000/api/auth/register`
6. Click "Body" tab
7. Select "JSON"
8. Paste:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```
9. Click "Send"

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**IMPORTANT:** Copy the `token` value - you'll need it for protected routes!

#### Test 4: Login

POST to `http://localhost:5000/api/auth/login`
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Test 5: Get Cart (Protected Route)

1. Create new request: `GET http://localhost:5000/api/cart`
2. Click "Headers" tab
3. Add header:
   - Key: `Authorization`
   - Value: `Bearer <paste-your-token-here>`
4. Click "Send"

You should get an empty cart response.

#### Test 6: Add to Cart

1. POST to `http://localhost:5000/api/cart/add`
2. Headers: `Authorization: Bearer <your-token>`
3. Body:
```json
{
  "productId": "<copy-a-product-id-from-products-list>",
  "quantity": 2
}
```

---

## 🎯 Common Issues & Solutions

### Issue 1: "MongoDB connection error"

**Solution:**
- If using local MongoDB: Make sure MongoDB service is running
  ```bash
  # Windows: Check Services app for "MongoDB"
  # Or restart it:
  net start MongoDB
  ```
- If using Atlas: Check connection string, username, password, and IP whitelist

### Issue 2: "Port 5000 already in use"

**Solution:**
- Change PORT in `.env` to 5001 or any other port
- Or kill the process using port 5000

### Issue 3: "JWT_SECRET is not defined"

**Solution:**
- Make sure `.env` file exists in backend folder
- Check that `JWT_SECRET` is set in `.env`

### Issue 4: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

---

## 📊 Database Structure

After seeding, your MongoDB will have:

**Collections:**
- `users` - User accounts
- `products` - 47 organic products
- `carts` - Shopping carts
- `orders` - Completed orders

**Product Categories:**
- Vegetables (10 products)
- Fruits (8 products)
- Nuts & Seeds (6 products)
- Honey & Sweeteners (3 products)
- Grains & Cereals (4 products)
- Dairy & Eggs (5 products)
- Herbs & Spices (4 products)
- Oils & Vinegars (4 products)
- Beverages (3 products)

---

## 🔄 Development Workflow

1. **Make changes** to backend code
2. **Server auto-restarts** (thanks to nodemon)
3. **Test** using Thunder Client or browser
4. **Check logs** in terminal for errors

---

## 📝 Available NPM Scripts

```bash
npm start       # Start server (production)
npm run dev     # Start server with auto-restart (development)
npm run seed    # Populate database with products
```

---

## 🎓 What You've Learned

### Backend Concepts:
- ✅ **REST API** - Creating endpoints for frontend to call
- ✅ **Express.js** - Web framework for Node.js
- ✅ **MongoDB** - NoSQL database for storing data
- ✅ **Mongoose** - ODM for MongoDB (like ORM for SQL)
- ✅ **JWT** - Secure authentication with tokens
- ✅ **Middleware** - Functions that run before route handlers
- ✅ **CORS** - Allowing frontend to call backend
- ✅ **Environment Variables** - Storing secrets securely

### File Structure:
- ✅ **Models** - Define data structure (schemas)
- ✅ **Controllers** - Business logic (what happens when route is called)
- ✅ **Routes** - API endpoints (URLs)
- ✅ **Middleware** - Authentication, validation, etc.
- ✅ **Config** - Database connection, settings

---

## 🚀 Next: Integrate with Frontend

Once backend is running successfully, we'll:
1. Create API service in frontend
2. Connect Login/Signup to backend
3. Fetch products from database
4. Sync cart with backend
5. Implement real authentication

---

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Verify MongoDB is running
3. Check `.env` file configuration
4. Make sure all dependencies are installed
5. Try restarting the server

---

## ✨ Success Checklist

Before moving to frontend integration, make sure:

- [ ] MongoDB is installed and running
- [ ] Backend server starts without errors
- [ ] Database is seeded with 47 products
- [ ] Can access http://localhost:5000
- [ ] Can get products from /api/products
- [ ] Can register a new user
- [ ] Can login and receive JWT token
- [ ] Can access protected routes with token

Once all checked, you're ready for frontend integration! 🎉
