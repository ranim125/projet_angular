import { LoginPageComponent } from './auth/login-page/login-page.component';
import { CategoryList } from './categories/category-list/category-list';
import { CategoryForm } from './categories/category-form/category-form';
import { DashboardAdmin } from './dashboard/dashboard-admin/dashboard-admin';
import { DashboardAgent } from './dashboard/dashboard-agent/dashboard-agent';
import { AuthGuard } from './auth/guards/auth.guard';

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryList, canActivate: [AuthGuard] },
  { path: 'categories/add', component: CategoryForm, canActivate: [AuthGuard] },
  { path: 'categories/edit/:id', component: CategoryForm, canActivate: [AuthGuard] },
  { path: 'admin', component: DashboardAdmin, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'agent', component: DashboardAgent, canActivate: [AuthGuard], data: { role: 'AGENT' } },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
