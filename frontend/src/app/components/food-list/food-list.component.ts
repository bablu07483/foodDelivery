import { Component, OnInit } from '@angular/core';
import { FoodService, Food } from '../../services/food.service';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {
  loading: boolean = false;
  foods: Food[] = [];
  groupedFoods: any[] = []; 
  restaurants: Restaurant[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedRestaurantId: string = '';

  selectedFood: Food | null = null;
  quantity: number = 1;

  constructor(
    private foodService: FoodService, 
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDropdown();
    this.route.queryParams.subscribe(params => {
      if (params['category']) { this.selectedCategory = params['category']; }
      if (params['restaurant']) { this.selectedRestaurantId = params['restaurant']; }
      this.loadStandardFoods();
    });
  }

  getSelectedRestaurant() { return this.restaurants.find(r => r._id === this.selectedRestaurantId); }
  getSelectedRestaurantName() { return this.getSelectedRestaurant()?.name || 'Restaurant'; }
  getSelectedRestaurantCuisine() { return this.getSelectedRestaurant()?.cuisine || 'Cuisine'; }
  getSelectedRestaurantImage() { return this.getSelectedRestaurant()?.image || 'assets/default-restaurant.jpg'; }

  addToCart(food: any) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.selectedFood = food; 
    this.quantity = 1;
  }

  confirmOrder() {
    if (this.selectedFood) {
      this.cartService.addToCart({
        foodId: this.selectedFood._id,
        name: this.selectedFood.name,
        price: this.selectedFood.price,
        quantity: this.quantity,
        image: this.selectedFood.image,
        ingredients: 'Standard Preparation'
      });
      this.selectedFood = null; 
    }
  }

  loadDropdown() { this.restaurantService.getRestaurants().subscribe(res => this.restaurants = res); }

  onRestaurantChange() { 
    if (this.selectedRestaurantId === 'nearby') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => { this.loadStandardFoods(pos.coords.latitude, pos.coords.longitude); },
          (err) => { alert("Location access denied."); this.selectedRestaurantId = ''; this.loadStandardFoods(); }
        );
      }
    } else { this.loadStandardFoods(); }
  }

  onSearch() { this.loadStandardFoods(); }
  onCategoryChange() { this.loadStandardFoods(); }
  clearDietFilter() { this.selectedRestaurantId = ''; this.loadStandardFoods(); }

  loadStandardFoods(lat?: number, lng?: number) {
    this.loading = true;
    this.foodService.getFoods(this.selectedCategory, this.searchTerm, this.selectedRestaurantId, undefined, lat, lng).subscribe({
      next: (res) => { 
        this.foods = res; 
        if (this.selectedRestaurantId !== '') {
          this.groupFoodsByRestaurant();
        } else {
          this.groupedFoods = []; 
        }
        this.loading = false; 
      },
      error: () => { this.loading = false; }
    });
  }

  groupFoodsByRestaurant() {
    const groups = new Map();
    this.foods.forEach(food => {
      const rId = food.restaurant?._id;
      if (rId) {
        if (!groups.has(rId)) {
          groups.set(rId, {
            details: food.restaurant,
            items: []
          });
        }
        groups.get(rId).items.push(food);
      }
    });
    this.groupedFoods = Array.from(groups.values());
  }
}