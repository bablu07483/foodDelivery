import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Food {
  _id: string; 
  name: string; 
  description: string; 
  // Added expanded categories here
  category: 'veg' | 'non-veg' | 'beverages' | 'snacks' | 'desserts' | 'breakfast' | 'healthy' | 'fast-food' | 'south-indian';
  price: number; 
  image: string; 
  restaurant: { _id: string; name: string; cuisine?: string; image?: string; };
  nutrition?: { calories: number; protein: number; fiber: number; carbohydrates: number; fats: number; };
  isAvailable: boolean;
  ingredients?: string; // Support for ingredients
}

@Injectable({ providedIn: 'root' })
export class FoodService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getFoods(
    category?: string, 
    search?: string, 
    restaurantId?: string, 
    dietParams?: { minProtein?: number | null, minCalories?: number | null, maxCarbs?: number | null, minFiber?: number | null },
    lat?: number,
    lng?: number
  ): Observable<Food[]> {
    let params = new HttpParams();
    
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    if (restaurantId) params = params.set('restaurant', restaurantId);
    
    if (lat) params = params.set('lat', lat.toString());
    if (lng) params = params.set('lng', lng.toString());
    
    if (dietParams) {
      if (dietParams.minProtein) params = params.set('minProtein', dietParams.minProtein.toString());
      if (dietParams.minCalories) params = params.set('minCalories', dietParams.minCalories.toString());
      if (dietParams.maxCarbs) params = params.set('maxCarbs', dietParams.maxCarbs.toString());
      if (dietParams.minFiber) params = params.set('minFiber', dietParams.minFiber.toString());
    }
    
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }

  getFoodById(id: string): Observable<Food> { 
    return this.http.get<Food>(`${this.apiUrl}/foods/${id}`); 
  }
}