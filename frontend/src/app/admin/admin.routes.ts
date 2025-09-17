import { Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { AuthGuard } from './auth.guard';

export const ADMIN_ROUTES: Routes = [
    { path: 'login', component: AdminLoginComponent },
    {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'products', component: ProductManagementComponent },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
