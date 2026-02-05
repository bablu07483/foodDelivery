import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-diet-section',
  templateUrl: './diet-section.component.html',
  styleUrls: ['./diet-section.component.css']
})
export class DietSectionComponent implements OnInit {

  foods: any[] = [];
  filteredFoods:any[]=[];
  selectedDiet:string= ''
  selectedCategory: string = 'All Diet Foods';   // 🔥 default to diet foods
  loading: boolean = true;

  constructor(
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = false;
  
    this.foods = [
      {
        _id: '1',
        name: 'Oats with Fruits',
        description: 'Healthy breakfast rich in fiber and vitamins',
        category: 'veg',
        price: 120,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        nutrition: {
          calories: 250,
          protein: 8,
          carbs: 45,
          fat: 4,
          fiber: 6
        },
        restaurant: {
          name: 'Fit Foods'
        }
      },
      {
        _id: '2',
        name: 'Grilled Chicken Salad',
        description: 'High protein meal ideal for gym users',
        category: 'non-veg',
        price: 220,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        nutrition: {
          calories: 320,
          protein: 35,
          carbs: 12,
          fat: 8,
          fiber: 5
        },
        restaurant: {
          name: 'Healthy Bites'
        }
      },
      {
        _id: '3',
        name: 'Paneer Protein Bowl',
        description: 'High-protein paneer with sautéed vegetables and spices.',
        category: 'veg',
        price: 120,
        image: 'https://tse3.mm.bing.net/th/id/OIP.2I3uCEHv6eSleORFjpxlrQHaHa?pid=Api&P=0&h=180',
        nutrition: {
          calories: 380,
          protein: 28,
          carbs: 20,
          fat: 18,
          fiber: 6
        },
        restaurant: {
          name: 'Fit chunks'
        }
      },
      {
        _id: '4',
        name: 'Sprouts Salad',
        description: 'Fresh sprouts mixed with vegetables and lemon dressing.',
        category: 'veg',
        price: 149,
        image: 'https://tse2.mm.bing.net/th/id/OIP.hIShnU-OfBXiotZfrAaEJQHaHa?pid=Api&P=0&h=180',
        nutrition: {
          calories: 220,
          protein: 16,
          carbs: 30,
          fat: 4,
          fiber: 10
        },
        restaurant: {
          name: 'Healthy Bites'
        }
      },
      {
        _id: '5',
        name: 'Oats with Banana & Peanut Butter',
        description: 'Quick breakfast rich in fiber and healthy fats.',
        category: 'veg',
        price: 120,
        image: 'https://tse4.mm.bing.net/th/id/OIP.Te2hjM2aMbqF5N_ri3bbTgHaI9?pid=Api&P=0&h=180',
        nutrition: {
          calories: 420,
          protein: 14,
          carbs: 55,
          fat: 14,
          fiber: 8
        },
        restaurant: {
          name: 'Healthy mawa'
        }
      },
      {
        _id: '6',
        name: 'Chicken Salad',
        description: 'Fresh veggies topped with grilled chicken and olive oil.',
        category: 'non-veg',
        price: 220,
        image: 'https://sundaysuppermovement.com/wp-content/uploads/2021/06/grilled-chicken-salad-1.jpg',
        nutrition: {
          calories: 340,
          protein: 30,
          carbs: 12,
          fat: 9,
          fiber: 5
        },
        restaurant: {
          name: 'Healthy heaven'
        }
      },
      {
        _id: '7',
        name: 'Boiled Eggs with Toast',
        description: 'Simple and quick protein-rich meal.',
        category: 'non-veg',
        price: 220,
        image: 'https://tse3.mm.bing.net/th/id/OIP.NezgYieZ-aME8SKM1a50RQHaDs?pid=Api&P=0&h=180',
        nutrition: {
          calories: 280,
          protein: 15,
          carbs: 20,
          fat: 12,
          fiber: 3
        },
        restaurant: {
          name: 'tasty toast'
        }
      },
      {
        _id: '8',
        name: 'Protein Shake',
        description: 'Whey protein blended with milk or water.',
        category: 'veg',
        price: 120,
        image: 'https://tse4.mm.bing.net/th/id/OIP.UfB9MY1QU_UiqXmuwunQpAHaE8?pid=Api&P=0&h=180',
        nutrition: {
          calories: 220,
          protein: 24,
          carbs: 8,
          fat: 3
        },
        restaurant: {
          name: 'Healthy Bites'
        }
      },
      {
        _id: '9',
        name: 'Greek Yogurt with Nuts',
        description: 'High protein yogurt with almonds and walnuts.',
        category: 'veg',
        price: 189,
        image: 'https://tse1.mm.bing.net/th/id/OIP.hHq8TKaFRvvO7EOKUIP_VgHaE8?pid=Api&P=0&h=180',
        nutrition: {
          calories: 260,
          protein: 18,
          carbs: 12,
          fat: 12
        },
        restaurant: {
          name: 'protein party'
        }
      }
      ];
      this.filteredFoods=this.foods;
  }
  

  // 🔥 Load ONLY diet-related foods
  loadDietFoods(): void {
    this.loading = true;
  
    this.foodService.getDietFoods(this.selectedCategory).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.foods = res;
        } else if (res.foods) {
          this.foods = res.foods;
        } else if (res.data) {
          this.foods = res.data;
        } else {
          this.foods = [];
        }
  
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  onCategoryChange(): void {
    this.loadDietFoods();
  }



  // 🔥 Add to cart (unchanged)
  addToCart(food: any): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart({
      foodId: food._id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image
    });

    alert(`${food.name} added to cart`);
  }

  // 🔥 View full nutrition details
  viewDetails(id: string): void {
    this.router.navigate(['/foods', id]);
  }

}