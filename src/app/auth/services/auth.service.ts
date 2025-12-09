import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[] = [
    { email: 'admin@demo.com', password: '123456', role: 'ADMIN' },
    { email: 'agent@demo.com', password: '123456', role: 'AGENT' }
  ];

  private attempts = 0;
  private maxAttempts = 3;
  private isBlocked = false;

  constructor() { }

  login(email: string, password: string) {
    if (this.isBlocked) {
      return { success: false, message: 'Compte temporairement bloqué' };
    }

    const user = this.users.find(u => u.email === email && u.password === password);

    if (!user) {
      this.attempts++;
      if (this.attempts >= this.maxAttempts) {
        this.isBlocked = true;
        return { success: false, message: 'Compte bloqué après 3 tentatives' };
      }
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Login successful
    const token = 'fake-token-' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);

    this.attempts = 0;
    return { success: true, role: user.role };
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.clear();
    this.isBlocked = false;
    this.attempts = 0;
  }
}
