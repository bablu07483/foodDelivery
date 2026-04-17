import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  user: any = null;
  cartItemsCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    // Calculates total quantity of items in the cart for the badge
    this.cartItemsCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  ngOnInit() {
    // Subscribe to currentUser$ to reactively update the UI
    this.authService.currentUser$.subscribe(user => {
      // 1. Capture the user object
      this.user = user;
      
      // 2. Determine authentication status
      // With the OTP fix, this token only exists AFTER verifyOtp succeeds
      const token = localStorage.getItem('token');
      this.isAuthenticated = !!token;
      
      // 3. Check Admin status
      this.isAdmin = this.isAuthenticated && user?.role === 'admin';
      
      console.log('Navbar Status:', { 
        name: this.user?.name, 
        auth: this.isAuthenticated 
      });
    });
  }

  logout() {
    // Standard logout procedure
    localStorage.clear();
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}