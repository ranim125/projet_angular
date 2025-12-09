import { Routes } from '@angular/router';
import { CategoryList } from './categories/category-list/category-list';
import { CategoryForm } from './categories/category-form/category-form';
/*import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';*/

import { SupplierList } from './entities/suppliers/supplier-list/supplier-list';
import { SupplierForm } from './entities/suppliers/supplier-form/supplier-form';

import { ClientList } from './entities/clients/client-list/client-list';
import { ClientForm } from './entities/clients/client-form/client-form';

import { DelivererList } from './entities/deliverers/deliverer-list/deliverer-list';
import { DelivererForm } from './entities/deliverers/deliverer-form/deliverer-form';
import { AgentList } from './entities/agents/agent-list/agent-list';
import { AgentForm } from './entities/agents/agent-form/agent-form';
import { ProductList } from './products/product-list/product-list';
import { ProductForm } from './products/product-form/product-form';
import { ProductDetails } from './products/product-details/product-details';


export const routes: Routes = [
  //{ path: 'login', component: LoginComponent },
  
  { path: 'categories', component: CategoryList },
  { path: 'categories/add', component: CategoryForm },
  { path: 'categories/edit/:id', component: CategoryForm },
  { path: 'entities/suppliers', component: SupplierList },
  { path: 'entities/suppliers/add', component: SupplierForm },
  { path: 'entities/suppliers/edit/:id', component: SupplierForm },
  { path: 'suppliers', redirectTo: 'entities/suppliers' },
  { path: 'entities/clients', component: ClientList },
  { path: 'entities/clients/add', component: ClientForm },
  { path: 'entities/clients/edit/:id', component: ClientForm },
  { path: 'clients', redirectTo: '/entities/clients' },
  { path: 'entities/deliverers', component: DelivererList },
  { path: 'entities/deliverers/add', component: DelivererForm },
  { path: 'entities/deliverers/edit/:id', component: DelivererForm },
  { path: 'entities/agents', component: AgentList },
{ path: 'entities/agents/add', component: AgentForm },
{ path: 'entities/agents/edit/:id', component: AgentForm },
{ path: 'agents', redirectTo: 'entities/agents' },
{ path: 'products', component: ProductList },
{ path: 'products/new', component: ProductForm },
{ path: 'products/edit/:id', component: ProductForm },
{ path: 'products/:id', component: ProductDetails }



  /*{
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

  { path: '**', redirectTo: 'login' }*/
];

