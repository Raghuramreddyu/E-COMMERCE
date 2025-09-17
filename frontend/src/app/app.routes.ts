import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { ProductListPageComponent } from './pages/product-list/product-list.component';
import { ProductDetailsPageComponent } from './pages/product-details/product-details.component';
import { LoginPageComponent } from './pages/login/login.component';
import { RegisterPageComponent } from './pages/register/register.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CheckoutPageComponent } from './pages/checkout/checkout.component';

// 1. IMPORT ALL THE NECESSARY COMPONENTS
import { authGuard } from './guards/auth.guard';
import { OrderConfirmationPageComponent } from './pages/order-confirmation/order-confirmation.component';
import { OrderHistoryPageComponent } from './pages/order-history/order-history.component'; // <-- Add this import

export const appRoutes: Routes = [
    // --- Public Routes ---
    { path: '', component: HomePageComponent },
    { path: 'products', component: ProductListPageComponent },
    { path: 'products/category/:category', component: ProductListPageComponent },
    { path: 'product/:slug', component: ProductDetailsPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },

    // --- Protected Routes (require login) ---
    { 
        path: 'cart', 
        component: ShoppingCartComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'checkout', 
        component: CheckoutPageComponent,
        canActivate: [authGuard]
    },
    {
        path: 'order-confirmation/:publicOrderId',
        component: OrderConfirmationPageComponent,
        canActivate: [authGuard]
    },
    // 2. ADD THE NEW ROUTE FOR THE ORDER HISTORY PAGE
    // It must also be protected by the authGuard.
    {
        path: 'my-orders',
        component: OrderHistoryPageComponent,
        canActivate: [authGuard]
    },

    // --- Admin Module ---
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    
    // --- Wildcard Route ---
    { path: '**', redirectTo: '' }
];

