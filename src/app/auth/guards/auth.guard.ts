import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getRole();
  const expectedRole = route.data['expectedRole'] as string;

  // Si la route attend un rôle précis et que l'utilisateur n'a pas le bon rôle → on le redirige vers son bon dashboard
  if (expectedRole && userRole !== expectedRole) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};