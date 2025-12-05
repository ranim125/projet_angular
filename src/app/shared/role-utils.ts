// src/app/shared/role.utils.ts
export interface CurrentUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'agent';
}

export const getCurrentUser = (): CurrentUser | null => {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
};

export const isAdmin = (): boolean => {
  return getCurrentUser()?.role === 'admin';
};

export const getCurrentUserId = (): number | null => {
  return getCurrentUser()?.id ?? null;
};