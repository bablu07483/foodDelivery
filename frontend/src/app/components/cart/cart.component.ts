import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

declare const L: any; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild('mapContainer') mapElement!: ElementRef;
  
  cartItems: any[] = [];
  totalPrice = 0;
  deliveryAddress = '';
  phone = '';
  paymentMode = 'COD';
  loading = false;
  error = '';
  
  // Map Variables
  map: any;
  marker: any;
  showMapModal = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient 
  ) { }

  ngOnInit() {
    this.loadCart();
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getMe().subscribe({
        next: (response) => {
          this.deliveryAddress = response.user?.address || '';
          this.phone = response.user?.phone || '';
        },
        error: (err) => console.error('Error loading user info:', err)
      });
    }
  }

  openMap() {
    this.showMapModal = true;
    setTimeout(() => this.initMap(), 100);
  }

  initMap() {
    const defaultCoords = [17.6868, 83.2185]; 
    
    if (this.map) {
      this.map.remove(); 
    }
    
    this.map = L.map(this.mapElement.nativeElement).setView(defaultCoords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.marker = L.marker(defaultCoords, { draggable: true }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = [position.coords.latitude, position.coords.longitude];
        this.map.setView(pos, 15);
        this.marker.setLatLng(pos);
      });
    }
  }

  confirmMapLocation() {
    const pos = this.marker.getLatLng();
    const lat = pos.lat;
    const lng = pos.lng;
    
    this.loading = true; 
    
    // Free Reverse Geocoding API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.loading = false;
        if (data && data.display_name) {
          // Success: Real street address!
          this.deliveryAddress = data.display_name;
        } else {
          // Fallback
          this.deliveryAddress = `📍 Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        }
        this.showMapModal = false;
      },
      error: (err) => {
        this.loading = false;
        this.deliveryAddress = `📍 Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        this.showMapModal = false;
      }
    });
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  updateQuantity(foodId: string, quantity: number) {
    this.cartService.updateQuantity(foodId, quantity);
  }

  removeItem(foodId: string) {
    if (confirm('Remove this item?')) this.cartService.removeFromCart(foodId);
  }

  placeOrder() {
    if (!this.deliveryAddress) {
      this.error = 'Please provide a delivery address';
      return;
    }
    this.loading = true;
    const orderData = {
      items: this.cartItems,
      deliveryAddress: this.deliveryAddress,
      phone: this.phone,
      paymentMode: this.paymentMode
    };
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => { 
        this.loading = false; 
        this.error = err.error?.message || "Order failed."; 
      }
    });
  }
}