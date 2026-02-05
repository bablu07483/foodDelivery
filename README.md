# Food Delivery Application - MEAN Stack

A comprehensive web-based food delivery application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring an enhanced Diet Section with detailed nutritional information.

## Features

### User Module
- User registration and login with JWT authentication
- Browse restaurants and food items
- Add items to cart and place orders
- View order history
- Search and filter foods by category and restaurant

### Food Listing Module
- Categorized food menu (Vegetarian / Non-Vegetarian)
- Search and filter options
- Food item details with images and pricing
- Restaurant listings

### Diet Section (Core Feature)
- Separate Diet Section for fitness-focused users
- Complete nutritional information for each item:
  - Calories
  - Protein
  - Fiber
  - Carbohydrates
  - Fats
- Ideal for gym users and diet-conscious individuals

### Admin Module
- Add, update, and delete food items
- Manage diet information and nutritional data
- Manage restaurant listings
- View and manage all orders

## Technology Stack

- **Frontend**: Angular 16
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Bootstrap 5, Custom CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (free tier available)
- Angular CLI (v16 or higher)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fooddelivery
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fooddelivery?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
```

**Setting up MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (choose the free tier)
3. Create a database user (Database Access → Add New Database User)
4. Whitelist your IP address (Network Access → Add IP Address → Add Current IP Address)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `fooddelivery` (or your preferred database name)
6. Paste the connection string into your `.env` file as `MONGODB_URI`

**Note:** No need to install or run MongoDB locally when using MongoDB Atlas!

Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:3000`

**Optional: Seed the database with sample data:**
```bash
npm run seed
```
This will create:
- Admin user: admin@fooddelivery.com / admin123
- Test user: user@fooddelivery.com / user123
- Sample restaurants and foods with nutritional data

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Install Angular CLI globally (if not already installed):
```bash
npm install -g @angular/cli
```

Start the development server:
```bash
ng serve
# or
npm start
```

The frontend application will run on `http://localhost:4200`

## Default Admin Account


To create an admin account, you can either:
1. Register a new user and manually update the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Or use MongoDB Compass/CLI to directly insert an admin user

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Foods
- `GET /api/foods` - Get all foods (with optional query params: category, restaurant, search)
- `GET /api/foods/:id` - Get food by ID
- `GET /api/foods/diet/all` - Get all foods with nutritional info

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID with foods

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Admin
- `POST /api/admin/foods` - Create food (admin only)
- `PUT /api/admin/foods/:id` - Update food (admin only)
- `DELETE /api/admin/foods/:id` - Delete food (admin only)
- `POST /api/admin/restaurants` - Create restaurant (admin only)
- `PUT /api/admin/restaurants/:id` - Update restaurant (admin only)
- `DELETE /api/admin/restaurants/:id` - Delete restaurant (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)

## Project Structure

```
fooddelivery/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Angular components
│   │   │   ├── services/      # Angular services
│   │   │   ├── guards/        # Route guards
│   │   │   └── interceptors/  # HTTP interceptors
│   │   ├── environments/      # Environment config
│   │   └── styles.css        # Global styles
│   └── package.json
└── README.md
```

## Usage

1. **Start MongoDB** (if not running as a service)
2. **Start the backend server** (port 3000)
3. **Start the frontend server** (port 4200)
4. Open your browser and navigate to `http://localhost:4200`

### User Flow
1. Register a new account or login
2. Browse foods or restaurants
3. Add items to cart
4. Place an order
5. View order history

### Admin Flow
1. Login with an admin account
2. Navigate to Admin Dashboard
3. Manage foods, restaurants, and orders
4. Add nutritional information to foods

## Future Enhancements

- Personalized diet plans (bulking, cutting, weight loss)
- Calorie tracking per day
- Subscription-based diet meals
- Mobile application version
- AI-based food recommendations
- Payment gateway integration
- Real-time order tracking

## Troubleshooting

### MongoDB Atlas Connection Issues
- Ensure your MongoDB Atlas connection string is correct in `.env` file
- Verify your IP address is whitelisted in MongoDB Atlas Network Access
- Check that your database user credentials are correct
- Ensure the database name in the connection string matches your cluster
- Verify your cluster is running (check MongoDB Atlas dashboard)

### Port Already in Use
- Change the port in backend `.env` file
- Update `environment.ts` in frontend to match the new port

### CORS Issues
- Ensure CORS is enabled in `backend/server.js`
- Check that frontend is making requests to the correct backend URL

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

