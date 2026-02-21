# 🌐 MongoDB Atlas Setup Guide (Cloud Database)

Since MongoDB is not installed locally, let's use **MongoDB Atlas** - a free cloud database service. This is actually easier and recommended for beginners!

## 📋 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email
   - Or Google account
   - Or GitHub account

### Step 2: Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
   - 512 MB storage
   - Shared RAM
   - Perfect for learning!
3. Choose cloud provider: **AWS** (recommended)
4. Choose region: **Closest to your location** (e.g., Mumbai for India)
5. Cluster name: Leave default or name it `organic-food-cluster`
6. Click **"Create"**
7. Wait 1-3 minutes for cluster to be created

### Step 3: Create Database User

1. You'll see "Security Quickstart"
2. **Create a database user:**
   - Username: `organicfood` (or any name you want)
   - Password: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT:** Copy and save the password somewhere safe!
3. Click **"Create User"**

### Step 4: Set Up Network Access

1. **Add IP Address:**
   - For development, click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to whitelist
   - (For production, you'd add specific IPs)
2. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://organicfood:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

1. Open `backend/.env` file
2. Find the line:
   ```
   MONGODB_URI=mongodb://localhost:27017/organic-food-db
   ```
3. Replace it with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://organicfood:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/organic-food-db?retryWrites=true&w=majority
   ```
4. **IMPORTANT:** 
   - Replace `<password>` with your actual password
   - Add `/organic-food-db` before the `?` to specify database name
   - Remove `<>` brackets

### Example:
```
# Before:
MONGODB_URI=mongodb+srv://organicfood:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

# After:
MONGODB_URI=mongodb+srv://organicfood:MySecurePass123@cluster0.abc123.mongodb.net/organic-food-db?retryWrites=true&w=majority
```

---

## ✅ Verify Setup

### Test Connection:

```bash
cd backend
npm run dev
```

**If successful, you'll see:**
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database Name: organic-food-db
🚀 SERVER STARTED SUCCESSFULLY!
```

**If you see errors:**
- Check password is correct (no `<>` brackets)
- Check username is correct
- Verify IP whitelist includes 0.0.0.0/0
- Make sure connection string has `/organic-food-db` before `?`

---

## 🌱 Seed the Database

Once server starts successfully:

```bash
# Stop the server (Ctrl+C)
npm run seed
```

This will add all 47 products to your cloud database!

---

## 🎯 View Your Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. You'll see:
   - `products` collection (47 documents)
   - `users` collection (after you register)
   - `carts` collection (after adding to cart)
   - `orders` collection (after placing orders)

---

## 💡 Benefits of MongoDB Atlas

✅ **No installation needed** - Works immediately
✅ **Free tier** - 512 MB storage (enough for learning)
✅ **Automatic backups** - Data is safe
✅ **Accessible anywhere** - Work from any computer
✅ **Easy to share** - Can share database with team
✅ **Production ready** - Can upgrade when needed

---

## 🔐 Security Tips

1. **Never commit .env file** to Git (already in .gitignore)
2. **Don't share your password** publicly
3. **Use strong passwords** for production
4. **Restrict IP access** in production (not 0.0.0.0/0)

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Check username and password in connection string
- Make sure password doesn't contain special characters (or URL encode them)

### Error: "IP not whitelisted"
- Go to Network Access in Atlas
- Add 0.0.0.0/0 or your specific IP

### Error: "Could not connect to server"
- Check internet connection
- Verify connection string is correct
- Make sure cluster is active (not paused)

---

## 📞 Need Help?

- MongoDB Atlas Documentation: https://www.mongodb.com/docs/atlas/
- MongoDB University (Free Courses): https://university.mongodb.com/

---

## ✨ You're All Set!

Once you see "MongoDB Connected" in your terminal, you're ready to:
1. ✅ Seed the database
2. ✅ Test API endpoints
3. ✅ Integrate with frontend

Happy coding! 🚀
