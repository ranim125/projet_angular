import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // Utilisateur non connecté → redirection login
      this.router.navigate(['/login']);
      return false;
    }

    // Vérification du rôle si défini dans la route
    const expectedRole = route.data['role']; // 'ADMIN' ou 'AGENT'
    const currentRole = this.authService.getRole();

    if (expectedRole && currentRole !== expectedRole) {
      // Redirection automatique selon rôle de l’utilisateur
      this.router.navigate([currentRole === 'ADMIN' ? '/admin' : '/agent']);
      return false;
    }

    return true;
  }
}
