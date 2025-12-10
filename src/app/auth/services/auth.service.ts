import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type UserRole = 'admin' | 'agent';

export interface AgentUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_TOKEN = 'token';
  private readonly STORAGE_ROLE = 'role';
  private readonly STORAGE_USER_EMAIL = 'userEmail';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<{ success: boolean; message: string; role?: UserRole }> {
    try {
      const users = await firstValueFrom(this.http.get<AgentUser[]>('/assets/data/agents.json'));

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, message: 'Email introuvable.' };
      }

      if (user.password !== password) {
        return { success: false, message: 'Mot de passe incorrect.' };
      }

      // Persist simple (suffisant pour un TP front)
      localStorage.setItem(this.STORAGE_TOKEN, 'fake-token');
      localStorage.setItem(this.STORAGE_ROLE, user.role);
      localStorage.setItem(this.STORAGE_USER_EMAIL, user.email);

      return { success: true, message: 'Connexion réussie', role: user.role };
    } catch {
      return { success: false, message: 'Erreur de chargement des utilisateurs (assets JSON).' };
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_TOKEN);
  }

  getRole(): UserRole | null {
    return (localStorage.getItem(this.STORAGE_ROLE) as UserRole) ?? null;
  }

  getCurrentEmail(): string | null {
    return localStorage.getItem(this.STORAGE_USER_EMAIL);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_TOKEN);
    localStorage.removeItem(this.STORAGE_ROLE);
    localStorage.removeItem(this.STORAGE_USER_EMAIL);
  }
}
