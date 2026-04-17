import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Restaurant {
  _id: string;
  name: string;
  location: { coordinates: number[] };
  cuisine: string;
  image: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getRestaurants(lat?: number, lng?: number): Observable<Restaurant[]> {
    let params = new HttpParams();
    if (lat !== undefined && lng !== undefined) {
      params = params.set('lat', lat.toString()).set('lng', lng.toString());
    }
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`, { params });
  }
}