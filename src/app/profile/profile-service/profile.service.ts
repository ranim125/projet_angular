import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/role-utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // Récupère l'utilisateur courant depuis sessionStorage
  getCurrentUser(): CurrentUser | null {
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  // Met à jour l'utilisateur courant dans sessionStorage
  updateUser(updatedUser: Partial<CurrentUser>): void {
    const current = this.getCurrentUser();
    if (current) {
      const newUser: CurrentUser = { ...current, ...updatedUser };
      sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    }
  }
}