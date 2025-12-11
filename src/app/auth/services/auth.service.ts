import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../../shared/role-utils';

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
  private readonly STORAGE_TOKEN = 'token'; // fake token pour compatibilité

  constructor(private http: HttpClient) {}

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> {
    try {
      const users = await firstValueFrom(this.http.get<AgentUser[]>('/assets/data/agents.json'));

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { success: false, message: 'Email introuvable.' };
      }

      if (user.password !== password) {
        return { success: false, message: 'Mot de passe incorrect.' };
      }

      const currentUser: CurrentUser = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      };

      // CHANGÉ : sessionStorage au lieu de localStorage
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.setItem(this.STORAGE_TOKEN, 'fake-token-2025');

      return { success: true, message: 'Connexion réussie', role: user.role };
    } catch (error) {
      console.error('Erreur AuthService login:', error);
      return { success: false, message: 'Erreur de chargement des utilisateurs.' };
    }
  }

  isLoggedIn(): boolean {
    // CHANGÉ : sessionStorage
    return !!sessionStorage.getItem(this.STORAGE_TOKEN);
  }

  getRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role ?? null;
  }

  getCurrentUser(): CurrentUser | null {
    // CHANGÉ : sessionStorage
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    // CHANGÉ : sessionStorage
    sessionStorage.removeItem(this.STORAGE_TOKEN);
    sessionStorage.removeItem('currentUser');
  }
}