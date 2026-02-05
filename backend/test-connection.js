require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('Connection String (password hidden):', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Connection failed!');
  console.error('Error:', err.message);
  
  if (err.message.includes('ENOTFOUND')) {
    console.error('\n💡 This usually means:');
    console.error('   - DNS resolution failed (check your internet connection)');
    console.error('   - Incorrect cluster name in connection string');
    console.error('   - Network/firewall blocking the connection');
  } else if (err.message.includes('authentication')) {
    console.error('\n💡 Authentication failed:');
    console.error('   - Check your username and password');
    console.error('   - Make sure password is URL-encoded if it has special characters');
  } else if (err.message.includes('IP')) {
    console.error('\n💡 IP address not whitelisted:');
    console.error('   - Go to MongoDB Atlas → Network Access');
    console.error('   - Add your current IP address (or 0.0.0.0/0 for development)');
  }
  
  process.exit(1);
});


