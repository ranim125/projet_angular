import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

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

  totalProducts = 0;
  totalCategories = 0;
  totalClients = 0;
  totalAgents = 0;
  totalSuppliers = 0;
  totalDeliverers = 0;
  ruptureProducts = 0;

  ngOnInit() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const agents = JSON.parse(localStorage.getItem('agents') || '[]');
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const deliverers = JSON.parse(localStorage.getItem('deliverers') || '[]');

    this.totalProducts = products.length;
    this.ruptureProducts = products.filter((p: any) => !p.inStock).length;
    this.totalCategories = categories.length;
    this.totalClients = clients.length;
    this.totalAgents = agents.length;
    this.totalSuppliers = suppliers.length;
    this.totalDeliverers = deliverers.length;
  }
}