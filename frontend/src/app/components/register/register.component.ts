import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  address = '';
  
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Registration successful!');
        // Redirect to login so they can perform the OTP verification
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }
}