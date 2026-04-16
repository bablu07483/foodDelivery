import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // Force a fresh check of the token from storage
    const token = localStorage.getItem('token');
    
    // Create the header object
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Only attach Authorization if the token actually exists
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error("AdminService: Attempted a request without a token!");
    }

    return headers;
  }

  // --- Food Management ---
  createFood(foodData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/foods`, foodData, { headers: this.getHeaders() });
  }

  updateFood(id: string, foodData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/foods/${id}`, foodData, { headers: this.getHeaders() });
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/foods/${id}`, { headers: this.getHeaders() });
  }

  // --- Restaurant Management ---
  createRestaurant(restaurantData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/restaurants`, restaurantData, { headers: this.getHeaders() });
  }

  updateRestaurant(id: string, restaurantData: any): Observable<any> {
    // Ensure ID is passed correctly in the URL
    return this.http.put(`${this.apiUrl}/admin/restaurants/${id}`, restaurantData, { 
      headers: this.getHeaders() 
    });
  }

  deleteRestaurant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/restaurants/${id}`, { headers: this.getHeaders() });
  }

  // --- User & Order Management ---
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/orders`, { headers: this.getHeaders() });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() });
  }
}