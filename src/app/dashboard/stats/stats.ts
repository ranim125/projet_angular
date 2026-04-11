import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../products/product-service/product-service';
import { CategoryService } from '../../categories/category-service/category-service';
import { ClientService } from '../../entities/clients/client-service/client-service';
import { AgentService } from '../../entities/agents/agent-service/agent-service';
import { SupplierService } from '../../entities/suppliers/supplier-service/supplier-service';
import { DelivererService } from '../../entities/deliverers/deliverer-service/deliverer-service';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.html',
  styleUrl: './stats.css',
  imports: [
  CommonModule,
  MatCardModule,
  MatIconModule,
  MatDividerModule
]
})
export class StatsComponent implements OnInit {

  totalCategories = 0;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public clientService: ClientService,
    public agentService: AgentService,
    public supplierService: SupplierService,
    public delivererService: DelivererService
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(c => this.totalCategories = c.length);
  }

  get totalProducts() { return this.productService.getAll().length; }
  get ruptureProducts() { return this.productService.getAll().filter(p => !p.inStock).length; }
  get totalClients() { return this.clientService.getAll().length; }
  get totalAgents() { return this.agentService.getAll().length; }
  get totalSuppliers() { return this.supplierService.getAll().length; }
  get totalDeliverers() { return this.delivererService.getAll().length; }
}