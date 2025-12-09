import { Routes } from '@angular/router';

import { LoginPageComponent } from './auth/login-page/login-page.component';
import { CategoryList } from './categories/category-list/category-list';
import { CategoryForm } from './categories/category-form/category-form';

import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [

  // --- LOGIN ---
  { path: 'login', component: LoginPageComponent },

  // --- REDIRECTION PAR DÉFAUT ---
  { path: '', redirectTo: 'categories', pathMatch: 'full' },

  // --- CATEGORIES ---
  { path: 'categories', component: CategoryList, canActivate: [AuthGuard] },
  { path: 'categories/add', component: CategoryForm, canActivate: [AuthGuard] },
  { path: 'categories/edit/:id', component: CategoryForm, canActivate: [AuthGuard] },

  // --- DASHBOARD ADMIN ---
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.ADMIN_ROUTES),
  },

  // --- DASHBOARD AGENT ---
  {
    path: 'agent',
    canActivate: [AuthGuard],
    data: { role: 'AGENT' },
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.AGENT_ROUTES),
  },

  // --- PAGE INCONNUE ---
  { path: '**', redirectTo: 'login' }
];
