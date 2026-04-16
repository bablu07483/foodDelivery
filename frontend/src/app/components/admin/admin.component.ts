import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FoodService } from '../../services/food.service';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab = 'foods';
  foods: any[] = [];
  restaurants: any[] = [];
  orders: any[] = [];
  users: any[] = []; 
  loading = false;

  foodForm: any = {
    name: '',
    description: '',
    category: 'veg',
    price: 0,
    image: '',
    restaurant: '',
    nutrition: {
      calories: 0,
      protein: 0,
      fiber: 0,
      carbohydrates: 0,
      fats: 0
    }
  };

  restaurantForm: any = {
    name: '',
    description: '',
    cuisine: '',
    image: '',
    address: '',
    phone: '',
    rating: 0
  };

  editingFood: any = null;
  editingRestaurant: any = null;

  constructor(
    private adminService: AdminService,
    private foodService: FoodService,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this.loadFoods();
    this.loadRestaurants();
    this.loadOrders();
    this.loadUsers(); 
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users:', err)
    });
  }

  getUserOrders(userId: string) {
    if (!this.orders) return [];
    return this.orders.filter(order => {
      const orderUserId = order.user?._id || order.user;
      return orderUserId === userId;
    });
  }

  getUserOrderCount(userId: string) {
    return this.getUserOrders(userId).length;
  }

  loadFoods() {
    this.loading = true;
    this.foodService.getFoods().subscribe({
      next: (data) => {
        this.foods = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading foods:', err);
        this.loading = false;
      }
    });
  }

  loadRestaurants() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => this.restaurants = data,
      error: (err) => console.error('Error loading restaurants:', err)
    });
  }

  loadOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  createFood() {
    this.adminService.createFood(this.foodForm).subscribe({
      next: () => {
        alert('Food created successfully!');
        this.resetFoodForm();
        this.loadFoods();
      },
      error: (err) => {
        console.error('Create Error:', err);
        alert('Error: ' + (err.error?.message || 'Failed to create food item. Check your authorization.'));
      }
    });
  }

  updateFood() {
    if (!this.editingFood) return;
    this.adminService.updateFood(this.editingFood._id, this.foodForm).subscribe({
      next: () => {
        alert('Food updated successfully!');
        this.resetFoodForm();
        this.loadFoods();
      },
      error: (err) => {
        console.error('Update Error:', err);
        alert('Error: ' + (err.error?.message || 'Failed to update food.'));
      }
    });
  }

  deleteFood(id: string) {
    if (confirm('Delete this food item?')) {
      this.adminService.deleteFood(id).subscribe({
        next: () => this.loadFoods(),
        error: (err) => alert('Error: ' + (err.error?.message || 'Delete failed'))
      });
    }
  }

  editFood(food: any) {
    this.editingFood = food;
    this.foodForm = JSON.parse(JSON.stringify(food));
    if (food.restaurant && typeof food.restaurant === 'object') {
      this.foodForm.restaurant = food.restaurant._id;
    }
  }

  resetFoodForm() {
    this.foodForm = { name: '', description: '', category: 'veg', price: 0, image: '', restaurant: '', nutrition: { calories: 0, protein: 0, fiber: 0, carbohydrates: 0, fats: 0 } };
    this.editingFood = null;
  }

  createRestaurant() {
    this.adminService.createRestaurant(this.restaurantForm).subscribe({
      next: () => {
        alert('Restaurant created successfully!');
        this.resetRestaurantForm();
        this.loadRestaurants();
      },
      error: (err) => alert('Error: ' + (err.error?.message || 'Authorization denied.'))
    });
  }

  updateRestaurant() {
    if (!this.editingRestaurant) return;
    this.adminService.updateRestaurant(this.editingRestaurant._id, this.restaurantForm).subscribe({
      next: () => {
        alert('Restaurant updated successfully!');
        this.resetRestaurantForm();
        this.loadRestaurants();
      },
      error: (err) => alert('Error: ' + (err.error?.message || 'Update failed.'))
    });
  }

  deleteRestaurant(id: string) {
    if (confirm('Delete this restaurant?')) {
      this.adminService.deleteRestaurant(id).subscribe({
        next: () => this.loadRestaurants(),
        error: (err) => alert('Error: ' + (err.error?.message || 'Delete failed'))
      });
    }
  }

  editRestaurant(restaurant: any) {
    this.editingRestaurant = restaurant;
    this.restaurantForm = { ...restaurant };
  }

  resetRestaurantForm() {
    this.restaurantForm = { name: '', description: '', cuisine: '', image: '', address: '', phone: '', rating: 0 };
    this.editingRestaurant = null;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'primary',
      'out for delivery': 'info',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return statusClasses[status.toLowerCase()] || 'secondary';
  }
}