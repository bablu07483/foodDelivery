import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  otp = ''; // NEW field for OTP
  showOtpInput = false; // NEW toggle for UI
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.otpSent) {
          this.showOtpInput = true; // Switch to OTP view
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  // NEW Method to verify OTP
  onVerifyOtp() {
    if (!this.otp) {
      this.error = 'Please enter the OTP';
      return;
    }

    this.loading = true;
    // Note: You need to add verifyOtp(data) to your auth.service.ts
   // Inside onVerifyOtp()
this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
  next: (response: any) => { // Added : any
    this.loading = false;
    localStorage.setItem('userRole', response.user.role);
    const redirectUrl = localStorage.getItem('redirectUrl') || (response.user.role === 'admin' ? '/admin' : '/home');
    localStorage.removeItem('redirectUrl');
    this.router.navigateByUrl(redirectUrl);
  },
  error: (err: any) => { // Added : any
    this.loading = false;
    this.error = err.error?.message || 'Invalid OTP. Please try again.';
  }
});
  }
}