import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (data: any) => { // Added : any
        this.user = data;
        this.loading = false;
      },
      error: (err: any) => { // Added : any
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);

      this.loading = true;
      this.userService.updateProfilePic(formData).subscribe({
        next: (data: any) => { // Added : any
          this.user = data;
          this.loading = false;
          alert('Profile picture updated!');
        },
        error: (err: any) => { // Added : any
          console.error('Profile pic update failed:', err);
          this.loading = false;
          alert('Failed to upload image.');
        }
      });
    }
  }

  triggerFileInputClick() {
    const fileInput = document.getElementById('profilePicInput') as HTMLElement;
    if (fileInput) fileInput.click();
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}