// ============================================
// DATABASE SEEDER
// ============================================
// This script populates the database with initial product data
// Run this once to add all products from your frontend to the database

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

/**
 * PRODUCT DATA
 * 
 * This is the same product data from your Shop.js frontend
 * We'll insert this into MongoDB
 */
const products = [
    // VEGETABLES
    { name: "Organic Broccoli", category: "vegetables", price: 249, image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=400&fit=crop", rating: 4.8, reviews: 245, isNew: true, stock: 15 },
    { name: "Organic Tomatoes", category: "vegetables", price: 80, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop", rating: 4.7, reviews: 410, stock: 25 },
    { name: "Green Leafy Vegetables", category: "vegetables", price: 120, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop", rating: 4.5, reviews: 155, stock: 18 },
    { name: "Organic Carrots", category: "vegetables", price: 60, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop", rating: 4.6, reviews: 200, stock: 30 },
    { name: "Bell Peppers", category: "vegetables", price: 100, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop", rating: 4.7, reviews: 190, stock: 20 },
    { name: "Spinach", category: "vegetables", price: 45, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop", rating: 4.6, reviews: 140, stock: 24 },
    { name: "Fresh Lettuce", category: "vegetables", price: 55, image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop", rating: 4.5, reviews: 125, stock: 20 },
    { name: "Kale", category: "vegetables", price: 85, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop", rating: 4.7, reviews: 160, stock: 15 },
    { name: "Cucumber", category: "vegetables", price: 40, image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop", rating: 4.5, reviews: 180, stock: 28 },
    { name: "Cabbage", category: "vegetables", price: 35, image: "https://plus.unsplash.com/premium_photo-1661963465934-55eeb52f64d2?w=400&h=400&fit=crop", rating: 4.4, reviews: 150, stock: 22 },

    // FRUITS
    { name: "Fresh Avocado", category: "fruits", price: 189, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop", rating: 4.6, reviews: 180, isNew: true, stock: 8 },
    { name: "Organic Apples", category: "fruits", price: 160, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop", rating: 4.8, reviews: 200, stock: 22 },
    { name: "Fresh Bananas", category: "fruits", price: 50, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop", rating: 4.6, reviews: 175, isNew: true, stock: 32 },
    { name: "Strawberries", category: "fruits", price: 220, image: "https://images.unsplash.com/photo-1543528176-61b239494933?w=400&h=400&fit=crop", rating: 4.8, reviews: 240, stock: 9 },
    { name: "Blueberries", category: "fruits", price: 380, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop", rating: 4.9, reviews: 310, stock: 6 },
    { name: "Fresh Oranges", category: "fruits", price: 140, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop", rating: 4.7, reviews: 220, stock: 28 },
    { name: "Grapes", category: "fruits", price: 180, image: "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=400&h=400&fit=crop", rating: 4.7, reviews: 195, stock: 16 },
    { name: "Mangoes", category: "fruits", price: 250, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", rating: 4.9, reviews: 280, stock: 12 },

    // NUTS & SEEDS
    { name: "Mixed Nuts", category: "nuts", price: 450, image: "https://images.unsplash.com/photo-1543158181-1274e5362710?w=400&h=400&fit=crop", rating: 4.9, reviews: 320, stock: 20 },
    { name: "Almonds", category: "nuts", price: 650, image: "https://plus.unsplash.com/premium_photo-1675237626334-5cf9d9d8b30c?w=400&h=400&fit=crop", rating: 4.9, reviews: 350, stock: 10 },
    { name: "Cashews", category: "nuts", price: 720, image: "https://images.unsplash.com/photo-1686721635283-70e6344183e1?w=400&h=400&fit=crop", rating: 4.9, reviews: 265, stock: 7 },
    { name: "Walnuts", category: "nuts", price: 680, image: "https://images.unsplash.com/photo-1626012109496-21f579f648dd?w=400&h=400&fit=crop", rating: 4.8, reviews: 285, stock: 12 },
    { name: "Pumpkin Seeds", category: "nuts", price: 320, image: "https://plus.unsplash.com/premium_photo-1726862518740-c20771e4e832?w=400&h=400&fit=crop", rating: 4.7, reviews: 145, stock: 18 },
    { name: "Chia Seeds", category: "nuts", price: 280, image: "https://images.unsplash.com/photo-1604768802835-899055f0e245?w=400&h=400&fit=crop", rating: 4.8, reviews: 165, stock: 14 },

    // HONEY & SWEETENERS
    { name: "Raw Honey", category: "honey", price: 350, image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=400&fit=crop", rating: 4.9, reviews: 290, stock: 12 },
    { name: "Maple Syrup", category: "honey", price: 450, image: "https://plus.unsplash.com/premium_photo-1663854478296-dd00b6257021?w=400&h=400&fit=crop", rating: 4.9, reviews: 220, stock: 11 },
    { name: "Organic Jaggery", category: "honey", price: 120, image: "https://images.jdmagicbox.com/quickquotes/images_main/organic-jaggery-2227367956-ltxgg9d1.jpg", rating: 4.7, reviews: 165, stock: 15 },

    // GRAINS & CEREALS
    { name: "Quinoa", category: "grains", price: 320, image: "https://plus.unsplash.com/premium_photo-1705207702007-7c6a3872ef25?w=400&h=400&fit=crop", rating: 4.7, reviews: 165, stock: 11 },
    { name: "Organic Rice", category: "grains", price: 180, image: "https://plus.unsplash.com/premium_photo-1723925093264-40b6b957c44d?w=400&h=400&fit=crop", rating: 4.7, reviews: 310, stock: 35 },
    { name: "Oats", category: "grains", price: 140, image: "https://plus.unsplash.com/premium_photo-1671130295244-b058fc8d86fe?w=400&h=400&fit=crop", rating: 4.6, reviews: 180, stock: 22 },
    { name: "Brown Rice", category: "grains", price: 160, image: "https://images.unsplash.com/photo-1613728913341-8f29b02b8253?w=400&h=400&fit=crop", rating: 4.6, reviews: 195, stock: 26 },

    // DAIRY & EGGS
    { name: "Organic Milk", category: "dairy", price: 75, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop", rating: 4.8, reviews: 280, stock: 25 },
    { name: "Organic Eggs", category: "dairy", price: 120, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop", rating: 4.9, reviews: 295, stock: 28 },
    { name: "Fresh Cheese", category: "dairy", price: 340, image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop", rating: 4.8, reviews: 185, stock: 13 },
    { name: "Organic Yogurt", category: "dairy", price: 95, image: "https://static.wixstatic.com/media/4c4dcc_0e90722cd22c4c5c98b873a7ab82ac79~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg", rating: 4.7, reviews: 210, stock: 18 },
    { name: "Butter", category: "dairy", price: 280, image: "https://plus.unsplash.com/premium_photo-1700440539073-c769891a9e3f?w=400&h=400&fit=crop", rating: 4.7, reviews: 175, stock: 15 },

    // HERBS & SPICES
    { name: "Fresh Herbs Bundle", category: "herbs", price: 90, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfltOi3f-h4SdOvsuxcpIlS3O71ESp31h1kQ&s", rating: 4.7, reviews: 120, stock: 16 },
    { name: "Basil", category: "herbs", price: 70, image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop", rating: 4.6, reviews: 95, stock: 17 },
    { name: "Organic Turmeric", category: "herbs", price: 150, image: "https://plus.unsplash.com/premium_photo-1726876987962-17ef4dd597ff?w=400&h=400&fit=crop", rating: 4.8, reviews: 175, stock: 20 },
    { name: "Cinnamon", category: "herbs", price: 180, image: "https://plus.unsplash.com/premium_photo-1666174326693-8e0eb439d839?w=400&h=400&fit=crop", rating: 4.7, reviews: 155, stock: 18 },

    // OILS & VINEGARS
    { name: "Olive Oil", category: "oils", price: 580, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop", rating: 4.9, reviews: 310, stock: 14 },
    { name: "Coconut Oil", category: "oils", price: 380, image: "https://images.unsplash.com/photo-1588413333412-82148535db53?w=400&h=400&fit=crop", rating: 4.8, reviews: 275, stock: 16 },
    { name: "Sesame Oil", category: "oils", price: 420, image: "https://plus.unsplash.com/premium_photo-1663936756798-ead5c2609856?w=400&h=400&fit=crop", rating: 4.7, reviews: 145, stock: 11 },
    { name: "Mustard Oil", category: "oils", price: 320, image: "https://cdn.shopify.com/s/files/1/0552/5159/9557/files/iriola-mustard-oil_1024x1024.jpg?v=1680066130", rating: 4.6, reviews: 130, stock: 13 },

    // BEVERAGES
    { name: "Green Tea", category: "beverages", price: 280, image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop", rating: 4.8, reviews: 225, stock: 19 },
    { name: "Herbal Tea", category: "beverages", price: 220, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1KahhBr4-8sd1KO7IldTYpqFk0gEYX8rQEQ&s", rating: 4.7, reviews: 180, stock: 21 },
    { name: "Organic Coffee", category: "beverages", price: 350, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop", rating: 4.9, reviews: 290, stock: 13 }
];

/**
 * SEED FUNCTION
 * 
 * This function:
 * 1. Connects to database
 * 2. Deletes all existing products (optional)
 * 3. Inserts new products
 * 4. Exits
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to database
        await connectDB();

        // Delete all existing products (optional - comment out if you want to keep existing data)
        console.log('🗑️  Deleting existing products...');
        await Product.deleteMany();
        console.log('✅ Existing products deleted\n');

        // Insert new products
        console.log('📦 Inserting products...');
        const insertedProducts = await Product.insertMany(products);
        console.log(`✅ ${insertedProducts.length} products inserted successfully!\n`);

        // Display summary
        console.log('📊 Summary by category:');
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(category => {
            const count = products.filter(p => p.category === category).length;
            console.log(`   ${category}: ${count} products`);
        });

        console.log('\n✨ Database seeding completed successfully!');
        console.log('🚀 You can now start your server and fetch products from the database\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
seedDatabase();
