import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('StreetSnapAuthorizationToken');

  // Check for token for protected routes
  if (!token) {
    // Redirect to login if no token exists
    router.navigate(['/login']);
    return false;
  }

  // Allow access if token exists
  return true;
};
