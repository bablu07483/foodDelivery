const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set');
  console.error('Please create a .env file with your MongoDB Atlas connection string');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Clear existing data
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Food.deleteMany({});
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@fooddelivery.com',
    password: adminPassword,
    role: 'admin',
    phone: '1234567890',
    address: 'Admin Address'
  });
  console.log('Admin user created:', admin.email);
  
  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await User.create({
    name: 'Test User',
    email: 'user@fooddelivery.com',
    password: userPassword,
    role: 'user',
    phone: '9876543210',
    address: 'Test Address'
  });
  console.log('Test user created:', user.email);
  
  // Create restaurants
  const restaurant1 = await Restaurant.create({
    name: 'Healthy Bites',
    description: 'Fresh and healthy vegetarian food',
    cuisine: 'Vegetarian',
    address: '123 Main Street',
    phone: '111-222-3333',
    rating: 4.5,
    image: 'https://via.placeholder.com/400x300?text=Healthy+Bites'
  });
  
  const restaurant2 = await Restaurant.create({
    name: 'Protein Palace',
    description: 'High protein meals for fitness enthusiasts',
    cuisine: 'Fitness Food',
    address: '456 Fitness Avenue',
    phone: '444-555-6666',
    rating: 4.8,
    image: 'https://via.placeholder.com/400x300?text=Protein+Palace'
  });
  
  const restaurant3 = await Restaurant.create({
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine',
    cuisine: 'Indian',
    address: '789 Spice Road',
    phone: '777-888-9999',
    rating: 4.3,
    image: 'https://via.placeholder.com/400x300?text=Spice+Garden'
  });
  
  console.log('Restaurants created');
  
  // Create foods with nutritional information
  const foods = [
    {
      name: 'Grilled Chicken Breast',
      description: 'Lean protein source, perfect for muscle building',
      category: 'non-veg',
      price: 350,
      restaurant: restaurant2._id,
      image: 'https://via.placeholder.com/300x200?text=Grilled+Chicken',
      nutrition: {
        calories: 231,
        protein: 43.5,
        fiber: 0,
        carbohydrates: 0,
        fats: 5.0
      }
    },
    {
      name: 'Quinoa Salad Bowl',
      description: 'Nutritious vegetarian meal with complete proteins',
      category: 'veg',
      price: 280,
      restaurant: restaurant1._id,
      image: 'https://via.placeholder.com/300x200?text=Quinoa+Salad',
      nutrition: {
        calories: 320,
        protein: 12.0,
        fiber: 5.2,
        carbohydrates: 58.0,
        fats: 6.5
      }
    },
    {
      name: 'Protein Smoothie Bowl',
      description: 'High protein breakfast option with fruits',
      category: 'veg',
      price: 200,
      restaurant: restaurant2._id,
      image: 'https://via.placeholder.com/300x200?text=Smoothie+Bowl',
      nutrition: {
        calories: 280,
        protein: 25.0,
        fiber: 8.0,
        carbohydrates: 35.0,
        fats: 4.0
      }
    },
    {
      name: 'Dal Makhani',
      description: 'Creamy lentil curry, rich in protein and fiber',
      category: 'veg',
      price: 180,
      restaurant: restaurant3._id,
      image: 'https://via.placeholder.com/300x200?text=Dal+Makhani',
      nutrition: {
        calories: 250,
        protein: 12.5,
        fiber: 8.5,
        carbohydrates: 35.0,
        fats: 7.0
      }
    },
    {
      name: 'Grilled Fish Fillet',
      description: 'Omega-3 rich fish, low in calories',
      category: 'non-veg',
      price: 400,
      restaurant: restaurant2._id,
      image: 'https://via.placeholder.com/300x200?text=Grilled+Fish',
      nutrition: {
        calories: 206,
        protein: 35.0,
        fiber: 0,
        carbohydrates: 0,
        fats: 6.5
      }
    },
    {
      name: 'Brown Rice Bowl with Vegetables',
      description: 'High fiber meal with essential nutrients',
      category: 'veg',
      price: 220,
      restaurant: restaurant1._id,
      image: 'https://via.placeholder.com/300x200?text=Brown+Rice+Bowl',
      nutrition: {
        calories: 340,
        protein: 8.0,
        fiber: 6.5,
        carbohydrates: 65.0,
        fats: 5.5
      }
    },
    {
      name: 'Chicken Biryani',
      description: 'Flavorful rice dish with tender chicken',
      category: 'non-veg',
      price: 320,
      restaurant: restaurant3._id,
      image: 'https://via.placeholder.com/300x200?text=Chicken+Biryani',
      nutrition: {
        calories: 450,
        protein: 28.0,
        fiber: 2.0,
        carbohydrates: 55.0,
        fats: 12.0
      }
    },
    {
      name: 'Greek Yogurt Parfait',
      description: 'High protein breakfast with fruits and nuts',
      category: 'veg',
      price: 150,
      restaurant: restaurant1._id,
      image: 'https://via.placeholder.com/300x200?text=Yogurt+Parfait',
      nutrition: {
        calories: 220,
        protein: 18.0,
        fiber: 3.5,
        carbohydrates: 28.0,
        fats: 5.0
      }
    }
  ];
  
  await Food.insertMany(foods);
  console.log('Foods created');
  
  console.log('\n✅ Database seeded successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin - Email: admin@fooddelivery.com, Password: admin123');
  console.log('User - Email: user@fooddelivery.com, Password: user123');
  
  process.exit(0);
})
.catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});






