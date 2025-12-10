// src/app/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';
import { DashboardAdmin } from './dashboard-admin/dashboard-admin';
import { DashboardAgent } from './dashboard-agent/dashboard-agent';

// Routes pour admin
export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardAdmin }
];

// Routes pour agent
export const AGENT_ROUTES: Routes = [
  { path: '', component: DashboardAgent }
];
