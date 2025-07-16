import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authService = inject(AuthService);
  const token = localStorage.getItem('auth_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
