import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.ADMIN_ROUTES),
  },

  {
    path: 'agent',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'AGENT' },
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.AGENT_ROUTES),
  },

  { path: '**', redirectTo: 'login' }
];
