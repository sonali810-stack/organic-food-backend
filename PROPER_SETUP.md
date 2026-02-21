# 🔧 PROPER SETUP - MongoDB Atlas with 'food' Collection

## ⚠️ Current Issue
Data was added to **local MongoDB** instead of **MongoDB Atlas cluster**.

## ✅ Solution - Follow These Steps

---

## Step 1: Get Your MongoDB Atlas Connection String

1. In MongoDB Atlas dashboard (your screenshot), click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@organic-food-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2: Update .env File

Open `backend/.env` and update line 10:

**BEFORE:**
```bash
MONGODB_URI=mongodb://localhost:27017/organic-food-db
```

**AFTER:**
```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@organic-food-cluster.xxxxx.mongodb.net/organic-food?retryWrites=true&w=majority
```

**IMPORTANT:**
- Replace `YOUR_USERNAME` with your MongoDB username
- Replace `YOUR_PASSWORD` with your MongoDB password
- Replace `xxxxx` with your actual cluster URL
- Notice: Database name is now `organic-food` (not `organic-food-db`)
- The collection will automatically be named `food`

---

## Step 3: Clean Up Old Data (Optional)

If you want to remove data from local MongoDB:

```bash
node cleanup.js
```

---

## Step 4: Restart the Server

1. Stop the current server (Ctrl+C in the terminal running `npm run dev`)
2. Start it again:
   ```bash
   npm run dev
   ```

You should see:
```
✅ MongoDB Connected: organic-food-cluster-shard-00-00.xxxxx.mongodb.net
📊 Database Name: organic-food
```

---

## Step 5: Seed the Database

Now add all 47 products to the `food` collection:

```bash
npm run seed
```

You should see:
```
🌱 Starting database seeding...
🗑️  Deleting existing products...
✅ Existing products deleted
📦 Inserting products...
✅ 47 products inserted successfully!
```

---

## Step 6: Verify in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. You should see:
   - **Database:** `organic-food`
   - **Collection:** `food` (with 47 documents)

---

## 📊 Final Structure

```
MongoDB Atlas
└── organic-food-cluster
    └── organic-food (database)
        ├── food (collection) ← 47 products here
        ├── users (collection) ← Will be created when users register
        ├── carts (collection) ← Will be created when adding to cart
        └── orders (collection) ← Will be created when placing orders
```

---

## 🧪 Test

After seeding, test in browser:
```
http://localhost:5000/api/products
```

You should see all 47 products from the `food` collection!

---

## ❓ Need Your Connection String?

In MongoDB Atlas:
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Copy the connection string
5. Paste it in `.env` file

---

## 🎯 Summary

1. ✅ Updated Product model to use `food` collection
2. ⏭️ You need to: Update `.env` with Atlas connection string
3. ⏭️ Restart server
4. ⏭️ Run `npm run seed`
5. ✅ Data will be in: `organic-food` database → `food` collection

Let me know when you've updated the `.env` file and I'll help you with the next steps!
