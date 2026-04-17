import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FoodService, Food } from '../../services/food.service';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diet',
  templateUrl: './diet-section.component.html',
  styleUrls: ['./diet-section.component.css']
})
export class DietComponent implements OnInit {
  isCustomize: boolean = false;
  loading: boolean = false;
  error: string = '';
  foods: any[] = []; 
  restaurants: Restaurant[] = [];
  selectedRestaurantId: string = '';

  selectedFood: any | null = null;
  quantity: number = 1;

  hoverTimer: any;
  hoveredFoodId: string | null = null;
  isFetchingUsda: boolean = false;
  isHovering: boolean = false;
  private usdaApiKey: string = '3L9YDuSRNwXsLJv8dzKgzdqR8WVvd5pT4wbr552I'; 

  isPureVeg = false; isHighProtein = false; isHighCalorie = false; isLowCarb = false; isHighFiber = false;

  unitMapping: any = {
    liquid: ['ml', 'lit'],
    weight: ['gm', 'kg'],
    count: ['piece', 'plate', 'dozen'],
    portion: ['full', 'half', 'bowl']
  };
  availableUnits: string[] = this.unitMapping.weight;

  userData: any = { 
    age: 22, gender: 'male', weight: 55, height: 158, 
    nutritionGoal: '', requestedQuantity: 100, unit: 'gm', healthCondition: 'standard' 
  };
  customResults: any = null;
  dailyTargetKcal: number = 0;

  constructor(
    private http: HttpClient, 
    private foodService: FoodService,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    this.loadRestaurants();
    this.loadStandardFoods(); 
  }

  onMouseEnter(food: any) {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(() => {
      this.hoveredFoodId = food._id; 
      if (!this.isCustomize) { this.isHovering = true; }
      this.fetchUsdaNutrition(food);
    }, 1200); 
  }

  onMouseLeave() {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.hoveredFoodId = null;
    this.isHovering = false;
    this.isFetchingUsda = false;
  }

  fetchUsdaNutrition(food: any) {
    if (food.usdaLoaded) return;
    this.isFetchingUsda = true;
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food.name)}&pageSize=1&api_key=${this.usdaApiKey}`;
    
    this.http.get(url).subscribe({
      next: (data: any) => {
        if (data.foods && data.foods.length > 0) {
          const result = data.foods[0];
          food.nutrition = {
            calories: this.getNutrient(result.foodNutrients, 1008),
            protein: this.getNutrient(result.foodNutrients, 1003),
            carbs: this.getNutrient(result.foodNutrients, 1005),
            fiber: this.getNutrient(result.foodNutrients, 1079)
          };
          food.ingredients = result.ingredients || 'Prepared with fresh, standard culinary ingredients.';
        } else {
          this.applyFallbackNutrition(food);
        }
        food.usdaLoaded = true;
        this.isFetchingUsda = false;
      },
      error: () => { 
        this.applyFallbackNutrition(food);
        food.usdaLoaded = true; 
        this.isFetchingUsda = false;
      }
    });
  }

  applyFallbackNutrition(food: any) {
    const isVeg = food.category?.toLowerCase() === 'veg';
    food.nutrition = {
      calories: food.nutrition?.calories || (isVeg ? 250 : 450),
      protein: food.nutrition?.protein || (isVeg ? 8 : 25),
      carbs: food.nutrition?.carbs || 35,
      fiber: food.nutrition?.fiber || 5
    };
    food.ingredients = food.ingredients || 'Recipe-specific local ingredients and traditional spices.';
  }

  private getNutrient(nutrients: any[], id: number): number {
    const nutrient = nutrients.find(n => n.nutrientId === id);
    return nutrient ? Math.round(nutrient.value) : 0;
  }

  getCategoryLabel(category: string): string {
    if (!category) return 'Food';
    const labels: any = {
      'veg': 'Vegetarian', 'non-veg': 'Non-Veg', 'beverages': 'Beverages',
      'snacks & starters': 'Snacks & Starters', 'desserts': 'Desserts',
      'breakfast': 'Breakfast', 'fastfood': 'Fast Food', 'south-indian': 'South Indian'
    };
    return labels[category.toLowerCase()] || category;
  }

  getCategoryClass(category: string): string {
    if (!category) return 'bg-primary';
    const cat = category.toLowerCase();
    return cat === 'veg' ? 'bg-success' : cat === 'non-veg' ? 'bg-danger' : 'bg-dark';
  }

  loadRestaurants() { this.restaurantService.getRestaurants().subscribe(res => this.restaurants = res); }

  onRestaurantChange() { this.loadStandardFoods(); }

  addToCart(food: any) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.selectedFood = food;
    this.quantity = 1;
    this.hoveredFoodId = null; 
  }

  confirmOrder() {
    if (this.selectedFood) {
      const item: CartItem = {
        foodId: this.selectedFood._id || `diet-${Date.now()}`,
        name: this.selectedFood.name,
        price: this.selectedFood.price,
        quantity: this.quantity,
        image: this.selectedFood.image || 'assets/default-food.jpg',
        ingredients: this.selectedFood.ingredients || 'Diet Plan Preparation'
      };
      this.cartService.addToCart(item);
      this.selectedFood = null;
    }
  }

  toggleMode(mode: string) {
    this.isCustomize = (mode === 'customize');
    if (!this.isCustomize) this.loadStandardFoods();
  }

  onFoodInputChange() {
    const input = this.userData.nutritionGoal.toLowerCase().trim();
    if (!input) return;
    const liquidKeys = ['milk', 'water', 'juice', 'drink', 'cola', 'soda', 'tea', 'coffee', 'oil', 'soup', 'shake', 'lassi', 'smoothie', 'wine', 'beer'];
    const countKeys = ['pizza', 'burger', 'egg', 'roti', 'naan', 'samosa', 'dosa', 'idli', 'vada', 'nugget', 'wing', 'leg', 'sandwich', 'taco', 'pau', 'bun', 'roll'];
    const portionKeys = ['biryani', 'rice', 'noodles', 'pasta', 'maggie', 'curry', 'dal', 'manchurian', 'spaghetti', 'chowmein'];

    if (liquidKeys.some(key => input.includes(key))) { this.availableUnits = this.unitMapping.liquid; this.userData.unit = 'ml'; }
    else if (countKeys.some(key => input.includes(key))) { this.availableUnits = this.unitMapping.count; this.userData.unit = 'piece'; }
    else if (portionKeys.some(key => input.includes(key))) { this.availableUnits = this.unitMapping.portion; this.userData.unit = 'full'; }
    else { this.availableUnits = this.unitMapping.weight; this.userData.unit = 'gm'; }
  }

  toggleStandardFilter(type: string) {
    if (type === 'veg') this.isPureVeg = !this.isPureVeg;
    if (type === 'pro') this.isHighProtein = !this.isHighProtein;
    if (type === 'cal') this.isHighCalorie = !this.isHighCalorie;
    if (type === 'carb') this.isLowCarb = !this.isLowCarb;
    if (type === 'fiber') this.isHighFiber = !this.isHighFiber;
    this.loadStandardFoods();
  }

  resetStandardFilters() {
    this.isPureVeg = false; this.isHighProtein = false; this.isHighCalorie = false;
    this.isLowCarb = false; this.isHighFiber = false;
    this.selectedRestaurantId = '';
    this.loadStandardFoods();
  }

  loadStandardFoods() {
    this.loading = true;
    const dietParams = {
      minProtein: this.isHighProtein ? 20 : null,
      minCalories: this.isHighCalorie ? 700 : null,
      maxCarbs: this.isLowCarb ? 15 : null,
      minFiber: this.isHighFiber ? 8 : null
    };
    this.foodService.getFoods(this.isPureVeg ? 'veg' : '', '', this.selectedRestaurantId, dietParams).subscribe({
      next: (res) => { this.foods = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  submitCustomDiet() {
    this.loading = true;
    this.customResults = null;
    let bmr = (10 * this.userData.weight) + (6.25 * this.userData.height) - (5 * this.userData.age);
    bmr = this.userData.gender === 'male' ? bmr + 5 : bmr - 161;
    this.dailyTargetKcal = Math.round(this.userData.healthCondition === 'weight_loss' ? bmr * 0.8 : bmr * 1.2);

    const payload = { userId: localStorage.getItem('userId'), dietType: 'customize', dietProfile: this.userData };
    this.http.post('http://localhost:3000/api/diet/update-diet', payload).subscribe({
      next: (res: any) => { this.fetchUsdaForCustomPlan(res.recommendations || res.results || []); },
      error: () => { this.error = "Plan error."; this.loading = false; }
    });
  }

  async fetchUsdaForCustomPlan(items: any[]) {
    const enrichedResults = [];
    for (const item of items) {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(item.name)}&pageSize=1&api_key=${this.usdaApiKey}`;
      try {
        const data: any = await this.http.get(url).toPromise();
        if (data.foods && data.foods.length > 0) {
          const result = data.foods[0];
          item.nutrition = {
            calories: this.getNutrient(result.foodNutrients, 1008),
            protein: this.getNutrient(result.foodNutrients, 1003),
            carbs: this.getNutrient(result.foodNutrients, 1005)
          };
          item.ingredients = result.ingredients || 'Recipe-specific fresh ingredients.';
        } else {
          item.nutrition = item.nutrition || { calories: 300, protein: 15, carbs: 40 };
          item.ingredients = item.ingredients || 'Standard prepared ingredients.';
        }
      } catch (err) {}
      enrichedResults.push(item);
    }
    this.customResults = enrichedResults;
    this.loading = false;
  }
}