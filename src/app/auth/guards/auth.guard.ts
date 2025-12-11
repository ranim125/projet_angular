import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { getCurrentUser } from '../../shared/role-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['role'] as 'admin' | 'agent' | undefined;
    if (expectedRole && user.role !== expectedRole) {
      this.router.navigate([user.role === 'admin' ? '/admin' : '/agent']);
      return false;
    }

    return true;
  }
}