export interface CurrentUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'agent';
}

export const getCurrentUser = (): CurrentUser | null => {
  // CHANGÉ : sessionStorage au lieu de localStorage
  const data = sessionStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
};

export const isAdmin = (): boolean => {
  return getCurrentUser()?.role === 'admin';
};

export const isAgent = (): boolean => {
  return getCurrentUser()?.role === 'agent';
};

export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

export const getCurrentUserId = (): number | null => {
  return getCurrentUser()?.id ?? null;
};

export const getCurrentUserEmail = (): string | null => {
  return getCurrentUser()?.email ?? null;
};