const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Make sure to replace <db_password> with your actual MongoDB Atlas password
    const conn = await mongoose.connect('mongodb+srv://226m1a05a9_db_user:Bablu071234cluster0.x9bz79x.mongodb.net/');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;