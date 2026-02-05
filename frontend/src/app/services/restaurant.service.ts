import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  image: string;
  address: string;
  phone: string;
  rating: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  getRestaurantById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurants/${id}`);
  }
}





























