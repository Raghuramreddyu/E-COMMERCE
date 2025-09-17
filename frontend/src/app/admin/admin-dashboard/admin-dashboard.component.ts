import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
        <aside class="sidebar">
            <h2>Admin Panel</h2>
            <nav>
                <a routerLink="/admin/dashboard/products" routerLinkActive="active">Product Management</a>
            </nav>
            <button class="btn-secondary" (click)="logout()">Logout</button>
        </aside>
        <main class="dashboard-content">
            <router-outlet></router-outlet>
        </main>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
    constructor(private authService: AuthService, private router: Router) {}

    logout() {
        this.authService.logout();
        this.router.navigate(['/admin/login']);
    }
}
