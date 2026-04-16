import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private cartService: CartService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: () => {
          this.loadOrders(); // Refresh list to show 'Cancelled' status
        },
        error: (err) => {
          console.error('Cancellation failed:', err);
          alert('Could not cancel order. It might already be out for delivery.');
        }
      });
    }
  }

  editOrder(order: any) {
    if (confirm('This will cancel the current order and move items to your cart for editing. Proceed?')) {
      // 1. Clear current cart
      this.cartService.clearCart();

      // 2. Add items back to cart using the service
      order.items.forEach((item: any) => {
        const cartItem: CartItem = {
          foodId: item.food || item.foodId || item._id, // Handles different ID names
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          ingredients: item.ingredients || ''
        };
        this.cartService.addToCart(cartItem);
      });

      // 3. Update status on backend AND navigate
      this.orderService.updateOrderStatus(order._id, 'cancelled').subscribe({
        next: () => {
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.warn('Backend update failed, but items are in cart. Redirecting anyway.');
          // CRITICAL: We navigate even on error so the button "works" for the user
          this.router.navigate(['/cart']);
        }
      });
    }
  }

  getStepStatus(orderStatus: string, step: string): string {
  // Added 'on the way' to the sequence
  const stages = ['pending', 'confirmed', 'preparing', 'pick-up', 'on the way', 'delivered'];
  const currentIdx = stages.indexOf(orderStatus.toLowerCase());
  const stepIdx = stages.indexOf(step.toLowerCase());

  if (orderStatus.toLowerCase() === 'cancelled') return 'cancelled';
  if (currentIdx >= stepIdx) return 'completed';
  return 'pending';
}

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'primary',
      'pick-up': 'info',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return statusClasses[status.toLowerCase()] || 'secondary';
  }
}