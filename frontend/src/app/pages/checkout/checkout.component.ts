import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, take } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card checkout-container">
      <h2>Checkout Summary</h2>
      <div *ngIf="(cartItems$ | async) as items">
        <div *ngIf="items.length === 0; else summaryContent" class="empty-summary">
          <p>Your cart is empty. Nothing to check out.</p>
          <a routerLink="/kits" class="btn-primary">Go Shopping</a>
        </div>
        
        <ng-template #summaryContent>
          <!-- List of items in the cart -->
          <div class="summary-items-list">
            <div class="summary-item" *ngFor="let item of items">
              <span>{{ item.product.name }} (x{{ item.quantity }})</span>
              <span>{{ (item.product.price * item.quantity) | currency:'USD' }}</span>
            </div>
          </div>
          
          <!-- Total price -->
          <div class="summary-total">
            <strong>Total:</strong>
            <strong>{{ (totalPrice$ | async) | currency:'USD' }}</strong>
          </div>
          
          <!-- Place Order Button with loading state -->
          <button (click)="placeOrder()" [disabled]="isPlacingOrder" class="btn-primary place-order-btn">
            {{ isPlacingOrder ? 'Placing Order...' : 'Place Order' }}
          </button>
          
          <!-- Error message display -->
          <p *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./checkout.component.css']
})
export class CheckoutPageComponent {
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  isPlacingOrder = false;
  errorMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.totalPrice$ = this.cartService.totalPrice$;
  }

  placeOrder(): void {
    this.isPlacingOrder = true;
    this.errorMessage = null;

    this.cartItems$.pipe(take(1)).subscribe({
      next: (items) => {
        if (items.length === 0) {
          this.errorMessage = 'Your cart is empty.';
          this.isPlacingOrder = false;
          return;
        }

        this.orderService.placeOrder(items).subscribe({
          next: (response) => {
            console.log('Order placed successfully!', response);
            
            // --- THIS IS THE CHANGE ---
            // 1. REMOVE the old alert box:
            // alert('Thank you for your order! It has been placed successfully.');
            
            this.cartService.clearCart(); 

            // 2. REDIRECT to the new confirmation page with the orderId from the backend.
            this.router.navigate(['/order-confirmation', response.publicOrderId]);
            // -------------------------

            this.isPlacingOrder = false;
          },
          error: (err) => {
            console.error('Failed to place order', err);
            this.errorMessage = 'There was a problem placing your order. Please try again.';
            this.isPlacingOrder = false;
          }
        });
      }
    });
  }
}

