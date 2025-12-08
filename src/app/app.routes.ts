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
  { path: 'entities/deliverers/edit/:id', component: DelivererForm }

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

