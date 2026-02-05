import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Food Management
  createFood(foodData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/foods`, foodData, {
      headers: this.getHeaders()
    });
  }

  updateFood(id: string, foodData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/foods/${id}`, foodData, {
      headers: this.getHeaders()
    });
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/foods/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Restaurant Management
  createRestaurant(restaurantData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/restaurants`, restaurantData, {
      headers: this.getHeaders()
    });
  }

  updateRestaurant(id: string, restaurantData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/restaurants/${id}`, restaurantData, {
      headers: this.getHeaders()
    });
  }

  deleteRestaurant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/restaurants/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Order Management
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/orders`, {
      headers: this.getHeaders()
    });
  }
}





























