import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurants: any[] = [];
  featuredFoods: any[] = [];
  loading = true;

  // Complete list of categories for the Home Page cards
  categories = [
    { id: 'veg', name: 'Vegetarian', icon: 'https://img.icons8.com/color/96/vegetarian-food.png' },
    { id: 'non-veg', name: 'Non-Vegetarian', icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png' },
    { id: 'beverages', name: 'Beverages', icon: 'https://img.icons8.com/color/96/cocktail.png' },
    { id: 'snacks & starters', name: 'Snacks & Starters', icon: 'https://img.icons8.com/color/96/nachos.png' },
    { id: 'desserts', name: 'Desserts', icon: 'https://img.icons8.com/color/96/cupcake.png' },
    { id: 'breakfast', name: 'Breakfast', icon: 'https://cdn-icons-png.flaticon.com/512/8230/8230325.png' },
    { id: 'fastfood', name: 'Fast Food', icon: 'https://img.icons8.com/color/96/hamburger.png' },
    { id: 'south-indian', name: 'South Indian', icon: 'https://cdn-icons-png.flaticon.com/128/1816/1816041.png' },
    { id: 'diet', name: 'Diet Section', icon: 'https://img.icons8.com/color/96/salad.png' }
  ];

  constructor(
    private restaurantService: RestaurantService,
    private foodService: FoodService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRestaurants();
    this.loadFeaturedFoods();
  }

  loadRestaurants() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data.slice(0, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading restaurants:', err);
        this.loading = false;
      }
    });
  }

  loadFeaturedFoods() {
    this.foodService.getFoods().subscribe({
      next: (data) => {
        this.featuredFoods = data.slice(0, 6);
      },
      error: (err) => {
        console.error('Error loading foods:', err);
      }
    });
  }
  getBadgeClass(category: string): string {
  if (!category) return 'bg-secondary';

  // Normalize to lowercase to ensure it matches the backend enum
  const cat = category.toLowerCase();

  switch (cat) {
    case 'veg':
      return 'bg-success';
    case 'non-veg':
      return 'bg-danger';
    case 'beverages':
      return 'bg-info text-dark';
    case 'breakfast':
      return 'bg-warning text-dark';
    case 'desserts':
      return 'bg-primary';
    case 'snacks & starters':
      return 'bg-dark';
    case 'fastfood':
      return 'bg-warning text-dark';
    case 'south-indian':
      return 'bg-secondary';
    default:
      return 'bg-secondary';
  }
}

  navigateToCategory(category: string) {
    if (category === 'diet') {
      this.router.navigate(['/diet']);
    } else {
      // Navigates to food list and filters automatically via query params
      this.router.navigate(['/foods'], { queryParams: { category: category } });
    }
  }

  viewRestaurant(id: string) {
    this.router.navigate(['/foods'], { queryParams: { restaurant: id } });
  }

  viewFood(id: string) {
    this.router.navigate(['/foods', id]);
  }
}