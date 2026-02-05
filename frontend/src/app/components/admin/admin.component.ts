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
  loading = false;

  // Form data
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
  }

  // Foods
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
      next: (data) => {
        this.restaurants = data;
      },
      error: (err) => {
        console.error('Error loading restaurants:', err);
      }
    });
  }

  loadOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
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
        alert('Error creating food: ' + (err.error?.message || 'Unknown error'));
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
        alert('Error updating food: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  deleteFood(id: string) {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.adminService.deleteFood(id).subscribe({
        next: () => {
          alert('Food deleted successfully!');
          this.loadFoods();
        },
        error: (err) => {
          alert('Error deleting food: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  editFood(food: any) {
    this.editingFood = food;
    this.foodForm = { ...food };
    this.foodForm.restaurant = food.restaurant._id || food.restaurant;
  }

  resetFoodForm() {
    this.foodForm = {
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
    this.editingFood = null;
  }

  // Restaurants
  createRestaurant() {
    this.adminService.createRestaurant(this.restaurantForm).subscribe({
      next: () => {
        alert('Restaurant created successfully!');
        this.resetRestaurantForm();
        this.loadRestaurants();
      },
      error: (err) => {
        alert('Error creating restaurant: ' + (err.error?.message || 'Unknown error'));
      }
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
      error: (err) => {
        alert('Error updating restaurant: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  deleteRestaurant(id: string) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.adminService.deleteRestaurant(id).subscribe({
        next: () => {
          alert('Restaurant deleted successfully!');
          this.loadRestaurants();
        },
        error: (err) => {
          alert('Error deleting restaurant: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  editRestaurant(restaurant: any) {
    this.editingRestaurant = restaurant;
    this.restaurantForm = { ...restaurant };
  }

  resetRestaurantForm() {
    this.restaurantForm = {
      name: '',
      description: '',
      cuisine: '',
      image: '',
      address: '',
      phone: '',
      rating: 0
    };
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
    return statusClasses[status] || 'secondary';
  }
}






