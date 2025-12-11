// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // ================ REDIRECTIONS PAR RÔLE ================
      { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
      { path: 'agent', redirectTo: 'agent/dashboard', pathMatch: 'full' },

      // ================ DASHBOARD ADMIN ======================
      {
        path: 'admin/dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard-admin/dashboard-admin')
            .then(m => m.DashboardAdmin),
        data: { expectedRole: 'admin' }
      },

      // ================ DASHBOARD AGENT ======================
      {
        path: 'agent/dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard-agent/dashboard-agent')
            .then(m => m.DashboardAgent),
        data: { expectedRole: 'agent' }
      },

      // ================ PROFILE ===========================
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-page/profile-page.component')
            .then(m => m.ProfilePageComponent)
      },

      // ================ (RESTE DE TES ROUTES) ================
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/category-list/category-list')
            .then(m => m.CategoryList)
      },
      {
        path: 'categories/add',
        loadComponent: () =>
          import('./categories/category-form/category-form')
            .then(m => m.CategoryForm)
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./categories/category-form/category-form')
            .then(m => m.CategoryForm)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list/product-list')
            .then(m => m.ProductList)
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./products/product-form/product-form')
            .then(m => m.ProductForm)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./products/product-form/product-form')
            .then(m => m.ProductForm)
      },

      // ==================== FOURNISSEURS ====================
      {
        path: 'entities/suppliers',
        loadComponent: () =>
          import('./entities/suppliers/supplier-list/supplier-list')
            .then(m => m.SupplierList)
      },
      {
        path: 'entities/suppliers/add',
        loadComponent: () =>
          import('./entities/suppliers/supplier-form/supplier-form')
            .then(m => m.SupplierForm)
      },
      {
        path: 'entities/suppliers/edit/:id',
        loadComponent: () =>
          import('./entities/suppliers/supplier-form/supplier-form')
            .then(m => m.SupplierForm)
      },
      { path: 'suppliers', redirectTo: 'entities/suppliers', pathMatch: 'full' },

      // ==================== CLIENTS ====================
      {
        path: 'entities/clients',
        loadComponent: () =>
          import('./entities/clients/client-list/client-list')
            .then(m => m.ClientList)
      },
      {
        path: 'entities/clients/add',
        loadComponent: () =>
          import('./entities/clients/client-form/client-form')
            .then(m => m.ClientForm)
      },
      {
        path: 'entities/clients/edit/:id',
        loadComponent: () =>
          import('./entities/clients/client-form/client-form')
            .then(m => m.ClientForm)
      },
      { path: 'clients', redirectTo: 'entities/clients', pathMatch: 'full' },

      // ==================== LIVREURS ====================
      {
        path: 'entities/deliverers',
        loadComponent: () =>
          import('./entities/deliverers/deliverer-list/deliverer-list')
            .then(m => m.DelivererList)
      },
      {
        path: 'entities/deliverers/add',
        loadComponent: () =>
          import('./entities/deliverers/deliverer-form/deliverer-form')
            .then(m => m.DelivererForm)
      },
      {
        path: 'entities/deliverers/edit/:id',
        loadComponent: () =>
          import('./entities/deliverers/deliverer-form/deliverer-form')
            .then(m => m.DelivererForm)
      },
      { path: 'deliverers', redirectTo: 'entities/deliverers', pathMatch: 'full' },

      // ==================== AGENTS ====================
      {
        path: 'entities/agents',
        loadComponent: () =>
          import('./entities/agents/agent-list/agent-list')
            .then(m => m.AgentList)
      },
      {
        path: 'entities/agents/add',
        loadComponent: () =>
          import('./entities/agents/agent-form/agent-form')
            .then(m => m.AgentForm)
      },
      {
        path: 'entities/agents/edit/:id',
        loadComponent: () =>
          import('./entities/agents/agent-form/agent-form')
            .then(m => m.AgentForm)
      },
      { path: 'agents', redirectTo: 'entities/agents', pathMatch: 'full' },

      // Page par défaut selon rôle
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: '/login' }
];
