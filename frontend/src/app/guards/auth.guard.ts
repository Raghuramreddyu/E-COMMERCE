import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the isLoggedIn$ observable from the service.
  // The guard will automatically update when login status changes.
  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        // If the user is logged in, allow access to the route
        return true;
      } else {
        // If not logged in, redirect to the login page
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
