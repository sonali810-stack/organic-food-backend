# Organic Food Website - Backend API

Backend REST API for the Organic Food E-commerce Website built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env` file and update the values
   - Set your MongoDB connection string
   - Generate a secure JWT secret

3. **Set up MongoDB:**
   
   **Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
   - Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a cluster
   - Get connection string and add to `.env`
   
   **Option B: Local MongoDB**
   - Install MongoDB Community Server
   - Start MongoDB service
   - Use: `MONGODB_URI=mongodb://localhost:27017/organic-food-db`

4. **Seed the database with products:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Cart.js            # Cart schema
│   └── Order.js           # Order schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── cart.js            # Cart routes
│   └── orders.js          # Order routes
├── middleware/
│   └── auth.js            # Authentication middleware
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── cartController.js
├── server.js              # Main server file
├── seedProducts.js        # Database seeder
├── .env                   # Environment variables
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update` - Update item quantity (Protected)
- `DELETE /api/cart/remove/:productId` - Remove item (Protected)
- `POST /api/cart/apply-coupon` - Apply coupon (Protected)
- `DELETE /api/cart/remove-coupon` - Remove coupon (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)
- `GET /api/orders/admin/all` - Get all orders (Admin only)

## 🧪 Testing API

### Using Thunder Client (VS Code Extension)
1. Install Thunder Client extension
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL (e.g., `http://localhost:5000/api/products`)
5. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer <your-token>`

### Example Requests

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Products:**
```
GET http://localhost:5000/api/products?category=fruits&minPrice=100&maxPrice=500
```

**Add to Cart:**
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "productId": "65abc123def456789",
  "quantity": 2
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Client stores token (localStorage)
4. Client includes token in Authorization header for protected routes
5. Server verifies token and allows/denies access

## 📦 Available Coupons

- `FIRST50` - ₹50 off (fixed)
- `SAVE100` - ₹100 off (fixed)
- `ORGANIC20` - 20% off (percentage)
- `WELCOME10` - 10% off (percentage)

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📚 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)

## 🐛 Common Issues

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- For Atlas: Check IP whitelist and credentials

### Port Already in Use
- Change PORT in .env
- Or kill process using port 5000

### JWT Error
- Make sure JWT_SECRET is set in .env
- Check if token is being sent correctly in headers

## 📝 Notes

- All passwords are hashed before storing in database
- JWT tokens expire after 7 days (configurable)
- Cart is automatically created when user registers
- Stock is decreased when order is placed
- Tax is calculated at 5% (GST)

## 🚀 Next Steps

1. Test all API endpoints
2. Integrate with frontend
3. Add payment gateway (Razorpay/Stripe)
4. Implement email notifications
5. Add admin dashboard
6. Deploy to production

## 📧 Support

For questions or issues, refer to the implementation plan document.
