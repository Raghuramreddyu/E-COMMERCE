import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from './product.service';

// Defines the structure of an item in the cart
export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // A BehaviorSubject holds the current list of cart items.
  // Components can subscribe to this to get real-time updates.
  private _cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this._cartItems.asObservable();

  // An observable for the total number of items in the cart
  itemCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  // An observable for the total price of all items in the cart
  totalPrice$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
  );

  constructor() {
    // Optional: Load cart from localStorage if you want it to persist
  }

  // Adds a product to the cart or increments its quantity
  addToCart(product: Product): void {
    const currentItems = this._cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product: product, quantity: 1 });
    }
    this._cartItems.next([...currentItems]); // Emit a new array to trigger change detection
  }

  // Removes an item completely from the cart
  removeFromCart(productId: number): void {
    const currentItems = this._cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this._cartItems.next(updatedItems);
  }

  // Updates the quantity of a specific item
  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeFromCart(productId);
      return;
    }
    const currentItems = this._cartItems.getValue();
    const itemToUpdate = currentItems.find(item => item.product.id === productId);
    if (itemToUpdate) {
      itemToUpdate.quantity = newQuantity;
    }
    this._cartItems.next([...currentItems]);
  }

  // Empties the entire cart
  clearCart(): void {
    this._cartItems.next([]);
  }
}

