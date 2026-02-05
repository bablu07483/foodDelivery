# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

## Step-by-Step Setup

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system.

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/fooddelivery
# JWT_SECRET=your_secret_key
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm install -g @angular/cli
ng serve
```

### 4. Access Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### 5. Create Admin User
After registering, update user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Testing the Application

1. Register a new user
2. Browse foods and restaurants
3. Add items to cart
4. Place an order
5. Check Diet Section for nutritional info
6. Login as admin to manage foods and restaurants







