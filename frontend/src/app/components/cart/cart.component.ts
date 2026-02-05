import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice = 0;
  deliveryAddress = '';
  phone = '';
  loading = false;
  error = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCart();
    this.loadUserInfo();
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getMe().subscribe({
        next: (response) => {
          this.deliveryAddress = response.user?.address || '';
          this.phone = response.user?.phone || '';
        },
        error: (err) => {
          console.error('Error loading user info:', err);
        }
      });
    }
  }

  updateQuantity(foodId: string, quantity: number) {
    this.cartService.updateQuantity(foodId, quantity);
  }

  removeItem(foodId: string) {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeFromCart(foodId);
    }
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      this.error = 'Cart is empty';
      return;
    }

    if (!this.deliveryAddress) {
      this.error = 'Please provide delivery address';
      return;
    }

    if (!this.phone) {
      this.error = 'Please provide phone number';
      return;
    }

    this.loading = true;
    this.error = '';

    const orderData = {
      items: this.cartItems.map(item => ({
        foodId: item.foodId,
        quantity: item.quantity
      })),
      deliveryAddress: this.deliveryAddress,
      phone: this.phone
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.loading = false;
        this.cartService.clearCart();
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}







