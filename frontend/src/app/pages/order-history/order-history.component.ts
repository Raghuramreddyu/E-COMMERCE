import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="history-container">
      <h2>My Order History</h2>
      
      <div *ngIf="isLoading" class="loading-state">
        <p>Loading your orders...</p>
      </div>

      <div *ngIf="!isLoading && orders.length === 0" class="empty-state">
        <p>You haven't placed any orders yet.</p>
        <a routerLink="/products" class="btn-primary">Start Shopping</a>
      </div>

      <div *ngIf="!isLoading && orders.length > 0" class="orders-list">
        <!-- Loop through each order -->
        <div class="card order-card" *ngFor="let order of orders">
          <div class="order-summary">
            <div>
              <span class="label">Order ID:</span>
              <span class="value">#{{ order.public_order_id }}</span>
            </div>
            <div>
              <span class="label">Date:</span>
              <span class="value">{{ order.created_at | date:'longDate' }}</span>
            </div>
            <div>
              <span class="label">Total:</span>
              <span class="total-amount value">{{ order.total_amount | currency:'USD' }}</span>
            </div>
          </div>
          
          <!-- Loop through items within each order -->
          <div class="order-items">
            <div class="item" *ngFor="let item of order.items">
              <img [src]="item.image_url" [alt]="item.name" class="item-image">
              <div class="item-details">
                <span class="item-name">{{ item.name }}</span>
                <span>Quantity: {{ item.quantity }}</span>
                <span>Price: {{ item.price_at_purchase | currency:'USD' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; font-weight: 700; }
    .loading-state, .empty-state { text-align: center; padding: 4rem; background-color: var(--component-background); border: 1px solid var(--subtle-borders); border-radius: 8px; }
    .empty-state p { font-size: 1.2rem; margin-bottom: 2rem; }
    .orders-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .order-card { padding: 0; }
    .order-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 1.5rem; background-color: #2a2a2a; border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom: 1px solid var(--subtle-borders); }
    .label { color: #a0a0a0; margin-right: 0.5rem; font-weight: 500; }
    .value { font-weight: 700; }
    .total-amount { color: var(--primary-accent); }
    .order-items { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .item { display: flex; align-items: center; }
    .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 1rem; }
    .item-details { display: flex; flex-direction: column; font-size: 0.9rem; }
    .item-name { font-weight: 700; font-size: 1rem; }
  `]
})
export class OrderHistoryPageComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch order history', err);
        this.isLoading = false;
      }
    });
  }
}