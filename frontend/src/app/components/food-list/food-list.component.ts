import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {

  foods: any[] = [];
  filteredFoods: any[] = [];   // ✅ filtered list
  restaurants: any[] = [];

  selectedCategory: string = '';
  selectedRestaurant: string = '';
  searchTerm: string = '';

  loading: boolean = false;

  constructor(
    private foodService: FoodService,
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadFoods();
  }

  // ✅ Restaurants List
  loadRestaurants(): void {
    this.restaurants = [
      { _id: 'r1', name: 'Spice Hub' },
      { _id: 'r2', name: 'Royal Kitchen' },
      { _id: 'r3', name: 'Veg Treats' },
      { _id: 'r4', name: 'Hungry Bird' },
      { _id: 'r5', name: 'Veg Lovers' },
      { _id: 'r6', name: 'Non Veg Sport' },
      { _id: 'r7', name: 'Andhra Authentic' }
    ];
  }

  // ✅ Load Food Data
  loadFoods(): void {
    this.loading = true;

    this.foods = [
      {
        _id: '1',
        name: 'Veg Biryani',
        category: 'veg',
        price: 120,
        restaurant: { name: 'Spice Hub' },
        description: 'Aromatic rice with vegetables',
        image: 'https://tse1.mm.bing.net/th/id/OIP.8Wkn4WW-vynI2qw9iQZBBAHaFj?pid=Api&P=0&h=180'
      },
      {
        _id: '2',
        name: 'Chicken Biryani',
        category: 'non-veg',
        price: 180,
        restaurant: { name: 'Royal Kitchen' },
        description: 'Hyderabadi style chicken biryani',
        image: 'https://tse3.mm.bing.net/th/id/OIP.JbBpts8DpTwg1253grV3YAHaHa?pid=Api&P=0&h=180'
      },
      {
        _id: '3',
        name: 'Paneer Butter Masala',
        category: 'veg',
        price: 160,
        restaurant: { name: 'Veg Treats' },
        description: 'Creamy paneer curry',
        image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Paneer-Butter-Masala-Recipe-1.jpg'
      },
      {
        _id: '4',
        name: 'Chicken RRR',
        category: 'non-veg',
        price: 219,
        restaurant: { name: 'Hungry Bird' },
        description: 'Crispy fried chicken tossed in spicy South Indian masala with garlic and curry leaves',
        image: 'https://1.bp.blogspot.com/-8cgo-wGYsds/U5lgoQpzgMI/AAAAAAAAMTg/O61kwHAhEQs/s1600/chicken+starter+recipe..jpg'
      },
      {
        _id: '5',
        name: 'mushroom fried rice',
        category: 'veg',
        price: 160,
        restaurant: { name: 'Veg Lovers' },
        description: 'Healthy fried rice made with fresh mushrooms and no added salt',
        image: 'https://tse4.mm.bing.net/th/id/OIP.--HDPeaGCJ0MfYihIDGqegHaLH?pid=Api&P=0&h=180%27'
      },
      {
        _id: '6',
        name: 'mutton curry',
        category: 'non-veg',
        price: 360,
        restaurant: { name: 'Non Veg Sport' },
        description: 'Slow-cooked mutton curry made with tender meat and aromatic spices',
        image: 'https://tse2.mm.bing.net/th/id/OIP.xivvSDrDs6BqzP85zZ7LxQHaHa?pid=Api&P=0&h=180%27'
      },
      {
        _id: '7',
        name: 'veg fried rice',
        category: 'veg',
        price: 160,
        restaurant: { name: 'Andhra Authentic' },
        description: 'Veg fried rice is made with cooked rice stir-fried with fresh mixed vegetables and mild spices, keeping it light and simple without added salt.',
        image: 'https://tse1.mm.bing.net/th/id/OIP.VF7wi5xB8ZY1HfKpRNKv3QHaE8?pid=Api&P=0&h=180'
      },
      {
        _id: '8',
        name: 'butter naan',
        category: 'veg',
        price: 60,
        restaurant: { name: 'Royal kitchen' },
        description: 'Butter Naan is a soft Indian bread made from wheat flour. It is cooked and topped with butter. It is usually served with curry dishes.',
        image: 'https://glonfo.com/wp-content/uploads/2025/03/Best-Butter-Naan-Recipes.webp'
      },
      {
        _id: '9',
        name: 'BBQ chicken mandi',
        category: 'non-veg',
        price: 590,
        restaurant: { name: 'Non Veg Treats' },
        description: 'Chicken Mandi is a traditional Arabian rice dish made with long-grain rice and tender chicken. It is cooked with mild spices, giving it a smoky and rich flavor. It is usually served with sauces and salad.',
        image: 'https://www.yummyoyummy.com/wp-content/uploads/2019/09/DSC_0481.jpg'
      },
      
      
    ];

    this.filteredFoods = [...this.foods]; // ✅ copy
    this.applyFilters(); // ✅ filter

    this.loading = false;
  }

  // ✅ FILTER LOGIC
  applyFilters(): void {
    this.filteredFoods = this.foods.filter(food => {

      const matchSearch = this.searchTerm
        ? food.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchCategory = this.selectedCategory
        ? food.category === this.selectedCategory
        : true;

      const matchRestaurant = this.selectedRestaurant
        ? food.restaurant.name === this.selectedRestaurant
        : true;

      return matchSearch && matchCategory && matchRestaurant;
    });
  }

  // When user searches
  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onRestaurantChange(): void {
    this.applyFilters();
  }

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

    alert(food.name + ' added to cart');
  }

  viewDetails(id: string): void {
    this.router.navigate(['/foods', id]);
  }
}


   

    
  







