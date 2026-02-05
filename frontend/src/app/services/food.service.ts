import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Food {
  _id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg';
  price: number;
  image: string;
  restaurant: any;
  nutrition?: {
    calories: number;
    protein: number;
    fiber: number;
    carbohydrates: number;
    fats: number;
  };
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFoods(category?: string, restaurant?: string, search?: string): Observable<Food[]> {
    let params = new HttpParams();
    
    if (category) {
      params = params.set('category', category);
    }
    if (restaurant) {
      params = params.set('restaurant', restaurant);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }

  getFoodById(id: string): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/foods/${id}`);
  }

  getDietFoods(filter?: string): Observable<Food[]> {
    let params = new HttpParams()
      .set('isDiet', 'true'); // 🔥 tells backend it's diet food
  
    if (filter && filter !== 'All Diet Foods') {
      params = params.set('dietType', filter); 
      // High Protein | Low Carb | Weight Loss
    }
  
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }
  
}


