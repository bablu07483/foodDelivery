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
  showRestaurants: boolean = false;
  showFoods: boolean = false;


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

  viewRestaurant(id: string) {
    this.router.navigate(['/foods'], { queryParams: { restaurant: id } });
  }

  viewFood(id: string) {
    this.router.navigate(['/foods', id]);
  }
}









