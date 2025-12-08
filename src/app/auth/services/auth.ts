import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private USERS = [
    { email: 'admin@app.com', password: 'admin123', role: 'ADMIN' },
    { email: 'agent@app.com', password: 'agent123', role: 'AGENT' },
  ];

  login(email: string, password: string) {
    if (this.isBlocked()) {
      return { success: false, message: 'Compte bloqué.' };
    }

    const user = this.USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      this.incrementFails();
      return { success: false, message: 'Identifiants incorrects.' };
    }

    // reset attempts
    localStorage.setItem('fails', '0');

    // save token + role
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('role', user.role);

    return { success: true, role: user.role };
  }

  isBlocked(): boolean {
    return Number(localStorage.getItem('fails')) >= 3;
  }

  incrementFails() {
    const fails = Number(localStorage.getItem('fails') || '0');
    localStorage.setItem('fails', (fails + 1).toString());
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  logout() {
    localStorage.clear();
  }
}
