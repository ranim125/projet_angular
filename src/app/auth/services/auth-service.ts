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
  private readonly STORAGE_TOKEN = 'token';
  private readonly MAX_ATTEMPTS = 3;
  private readonly BLOCK_DURATION = 60 * 1000; // 60 secondes en millisecondes

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

      // Vérifier si le compte est bloqué pour cet email
      const blockStatus = this.checkIfAccountBlocked(email);
      if (blockStatus.isBlocked && blockStatus.remainingSeconds) {
        return { 
          success: false, 
          message: `Compte bloqué. Réessayez dans ${blockStatus.remainingSeconds} secondes.` 
        };
      }

      // Vérifier le mot de passe
      if (user.password !== password) {
        const attempts = this.getLoginAttempts(email) + 1;
        this.setLoginAttempts(email, attempts);
        
        if (attempts >= this.MAX_ATTEMPTS) {
          this.blockAccount(email);
          return { 
            success: false, 
            message: 'Trop de tentatives. Compte bloqué pendant 60 secondes.' 
          };
        }
        
        const remaining = this.MAX_ATTEMPTS - attempts;
        return { 
          success: false, 
          message: `Mot de passe incorrect. ${remaining} tentative(s) restante(s).` 
        };
      }

      // Connexion réussie
      this.resetLoginAttempts(email);
      const currentUser: CurrentUser = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        telephone: user.telephone
      };

      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.setItem(this.STORAGE_TOKEN, 'fake-token-2025');

      return { success: true, message: 'Connexion réussie', role: user.role };
    } catch (error) {
      console.error('Erreur AuthService login:', error);
      return { success: false, message: 'Erreur de chargement des utilisateurs.' };
    }
  }

  // Méthodes pour gérer les tentatives par email
  private getLoginAttempts(email: string): number {
    const attempts = localStorage.getItem(`loginAttempts_${btoa(email)}`);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  private setLoginAttempts(email: string, attempts: number): void {
    localStorage.setItem(`loginAttempts_${btoa(email)}`, attempts.toString());
  }

  private resetLoginAttempts(email: string): void {
    localStorage.removeItem(`loginAttempts_${btoa(email)}`);
    localStorage.removeItem(`blockedUntil_${btoa(email)}`);
  }

  private blockAccount(email: string): void {
    const blockedUntil = Date.now() + this.BLOCK_DURATION;
    localStorage.setItem(`blockedUntil_${btoa(email)}`, blockedUntil.toString());
  }

  // Méthode publique pour vérifier si un compte est bloqué
  checkIfAccountBlocked(email: string): { isBlocked: boolean; remainingSeconds?: number } {
    const blockedUntil = localStorage.getItem(`blockedUntil_${btoa(email)}`);
    if (!blockedUntil) return { isBlocked: false };

    const blockedUntilTime = parseInt(blockedUntil, 10);
    const remaining = Math.ceil((blockedUntilTime - Date.now()) / 1000);
    
    if (remaining > 0) {
      return { isBlocked: true, remainingSeconds: remaining };
    } else {
      // Si le temps de blocage est écoulé, nettoyer
      this.resetLoginAttempts(email);
      return { isBlocked: false };
    }
  }

  // Méthode pour obtenir les tentatives restantes (pour l'affichage)
  getRemainingAttempts(email: string): number {
    const attempts = this.getLoginAttempts(email);
    return Math.max(0, this.MAX_ATTEMPTS - attempts);
  }

  // Méthodes publiques existantes (inchangées)
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.STORAGE_TOKEN);
  }

  getRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role ?? null;
  }

  getCurrentUser(): CurrentUser | null {
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    sessionStorage.removeItem(this.STORAGE_TOKEN);
    sessionStorage.removeItem('currentUser');
  }
}