import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';

// Dashboards
import { DashboardAdmin } from './dashboard/dashboard-admin/dashboard-admin';
import { DashboardAgent } from './dashboard/dashboard-agent/dashboard-agent';

// Catégories
import { CategoryList } from './categories/category-list/category-list';
import { CategoryForm } from './categories/category-form/category-form';

// Produits
import { ProductList } from './products/product-list/product-list';
import { ProductForm } from './products/product-form/product-form';
import { ProductDetails } from './products/product-details/product-details';

// Entities
import { SupplierList } from './entities/suppliers/supplier-list/supplier-list';
import { SupplierForm } from './entities/suppliers/supplier-form/supplier-form';

import { ClientList } from './entities/clients/client-list/client-list';
import { ClientForm } from './entities/clients/client-form/client-form';

import { DelivererList } from './entities/deliverers/deliverer-list/deliverer-list';
import { DelivererForm } from './entities/deliverers/deliverer-form/deliverer-form';

import { AgentList } from './entities/agents/agent-list/agent-list';
import { AgentForm } from './entities/agents/agent-form/agent-form';

// Profil — AJOUT
import { ProfilePageComponent } from './profile/profile-page/profile-page.component';

// Guard
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },

  // Dashboards protégés par rôle
  {
    path: 'admin',
    component: DashboardAdmin,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'agent',
    component: DashboardAgent,
    canActivate: [AuthGuard],
    data: { role: 'agent' }
  },

  // Toutes les autres routes protégées
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      // Profil — AJOUT (accessible à tous les utilisateurs connectés)
      { path: 'profile', component: ProfilePageComponent },

      // Catégories
      { path: 'categories', component: CategoryList },
      { path: 'categories/add', component: CategoryForm },
      { path: 'categories/edit/:id', component: CategoryForm },

      // Produits
      { path: 'products', component: ProductList },
      { path: 'products/new', component: ProductForm },
      { path: 'products/edit/:id', component: ProductForm },
      { path: 'products/:id', component: ProductDetails },

      // Fournisseurs
      { path: 'entities/suppliers', component: SupplierList },
      { path: 'entities/suppliers/add', component: SupplierForm },
      { path: 'entities/suppliers/edit/:id', component: SupplierForm },
      { path: 'suppliers', redirectTo: 'entities/suppliers', pathMatch: 'full' },

      // Clients
      { path: 'entities/clients', component: ClientList },
      { path: 'entities/clients/add', component: ClientForm },
      { path: 'entities/clients/edit/:id', component: ClientForm },
      { path: 'clients', redirectTo: 'entities/clients', pathMatch: 'full' },

      // Livreurs
      { path: 'entities/deliverers', component: DelivererList },
      { path: 'entities/deliverers/add', component: DelivererForm },
      { path: 'entities/deliverers/edit/:id', component: DelivererForm },
      { path: 'deliverers', redirectTo: 'entities/deliverers', pathMatch: 'full' },

      // Agents
      { path: 'entities/agents', component: AgentList },
      { path: 'entities/agents/add', component: AgentForm },
      { path: 'entities/agents/edit/:id', component: AgentForm },
      { path: 'agents', redirectTo: 'entities/agents', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];