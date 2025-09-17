import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a class="navbar-brand" routerLink="/">PC Parts</a>
        
        <div class="navbar-right">
          <a class="cart-icon" routerLink="/cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77143 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H18.4C18.8693 16.009 19.3268 15.8526 19.6925 15.5583C20.0581 15.264 20.3086 14.8504 20.4 14.39L23 6H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <ng-container *ngIf="itemCount$ | async as itemCount">
              <span class="cart-count" *ngIf="itemCount > 0">{{ itemCount }}</span>
            </ng-container>
          </a>

          <!-- Hamburger Menu Button -->
          <button class="hamburger" (click)="toggleMenu()" [class.is-active]="isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <!-- Desktop Links -->
        <div class="navbar-links">
        </div>

      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.is-active]="isMenuOpen">
        <a routerLink="/" (click)="closeMenu()">Home</a>
        <ng-container *ngIf="(isLoggedIn$ | async); else loggedOutMobile">
          <a routerLink="/my-orders" (click)="closeMenu()">My Orders</a>
          <a (click)="logout()">Logout</a>
        </ng-container>
        <ng-template #loggedOutMobile>
          <a routerLink="/login" (click)="closeMenu()">Login</a>
          <a routerLink="/register" (click)="closeMenu()">Register</a>
          <a routerLink="/admin/login" (click)="closeMenu()">Admin Login</a>
        </ng-template>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;
  itemCount$: Observable<number>;
  isMenuOpen = false;

  constructor(
    private authService: AuthService, 
    private cartService: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.itemCount$ = this.cartService.itemCount$;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
