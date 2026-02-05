import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItemsSubject.next(JSON.parse(cart));
    }
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(i => i.foodId === item.foodId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage(currentItems);
  }

  removeFromCart(foodId: string) {
    const currentItems = this.cartItemsSubject.value.filter(item => item.foodId !== foodId);
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage(currentItems);
  }

  updateQuantity(foodId: string, quantity: number) {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.foodId === foodId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(foodId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage(currentItems);
      }
    }
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
}





























