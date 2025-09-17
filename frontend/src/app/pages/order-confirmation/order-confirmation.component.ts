import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-container">
      <div class="card confirmation-card">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Thank You For Your Order!</h1>
        <p class="subtitle">Your order has been placed successfully and is being processed.</p>
        <div *ngIf="orderId" class="order-id-box">
          Your Order ID is: <strong>#{{ orderId }}</strong>
        </div>
        <a routerLink="/products" class="btn-primary">Continue Shopping</a>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 1rem;
      text-align: center;
    }
    .confirmation-card {
      padding: 3rem;
      max-width: 550px;
    }
    .icon-container {
      margin-bottom: 1.5rem;
    }
    .success-icon {
      width: 6rem;
      height: 6rem;
      color: var(--primary-accent);
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.1rem;
      color: #a0a0a0;
      margin-bottom: 2rem;
    }
    .order-id-box {
      background-color: #2a2a2a;
      border: 1px solid var(--subtle-borders);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
      font-size: 1rem;
    }
  `]
})
export class OrderConfirmationPageComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('publicOrderId');
  }
}
