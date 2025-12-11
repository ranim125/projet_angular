import { Component } from '@angular/core';

import { StatsComponent } from '../stats/stats';
import { GraphsComponent } from '../graphs/graphs';

import { CategoryList } from '../../categories/category-list/category-list';
import { AgentList } from '../../entities/agents/agent-list/agent-list';
import { ClientList } from '../../entities/clients/client-list/client-list';
import { DelivererList } from '../../entities/deliverers/deliverer-list/deliverer-list';
import { SupplierList } from '../../entities/suppliers/supplier-list/supplier-list';
import { ProductList } from '../../products/product-list/product-list';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    StatsComponent,
    GraphsComponent,
    CategoryList,
    AgentList,
    ClientList,
    DelivererList,
    SupplierList,
    ProductList
  ],
  templateUrl: './dashboard-admin.html'
})
export class DashboardAdmin {}
