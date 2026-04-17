import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Replace with your actual Node.js backend URL
  private apiUrl = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  // This handles the photo upload from the system
  updateProfilePic(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/photo`, formData);
  }
}