import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.css']
})
export class FoodDetailComponent implements OnInit {
  food: any = null;
  quantity = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFood(id);
    }
  }

  loadFood(id: string) {
    this.loading = true;
    this.foodService.getFoodById(id).subscribe({
      next: (data) => {
        this.food = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading food:', err);
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart({
      foodId: this.food._id,
      name: this.food.name,
      price: this.food.price,
      quantity: this.quantity,
      image: this.food.image
    });

    alert(`${this.food.name} added to cart!`);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}







