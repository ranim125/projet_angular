import { Component } from '@angular/core';

import { StatsComponent } from '../stats/stats';

import { CategoryList } from '../../categories/category-list/category-list';
import { ClientList } from '../../entities/clients/client-list/client-list';
import { DelivererList } from '../../entities/deliverers/deliverer-list/deliverer-list';
import { SupplierList } from '../../entities/suppliers/supplier-list/supplier-list';
import { ProductList } from '../../products/product-list/product-list';

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [
    StatsComponent,
    CategoryList,
    ClientList,
    DelivererList,
    SupplierList,
    ProductList
  ],
  templateUrl: './dashboard-agent.html'
})
export class DashboardAgent {}
