import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SupplierService, Supplier } from '../supplier-service/supplier-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './supplier-list.html',
  styleUrls: ['./supplier-list.css']
})
export class SupplierList implements OnInit {

  displayedColumns: string[] = ['id', 'nom', 'adresse', 'telephone', 'email', 'region', 'actions'];

  allSuppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];

  // filtres
  searchNom = '';
  filterAdresse = '';

  // pagination
  pageIndex = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.allSuppliers = this.supplierService.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.allSuppliers];

    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(s => s.nom.toLowerCase().includes(term));
    }

    if (this.filterAdresse.trim()) {
      const term = this.filterAdresse.toLowerCase();
      temp = temp.filter(s => s.adresse.toLowerCase().includes(term));
    }

    this.total = temp.length;
    const start = this.pageIndex * this.pageSize;
    this.filteredSuppliers = temp.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  resetPageAndFilter(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  edit(id: number): void {
    this.router.navigate(['/entities/suppliers/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Supprimer ce fournisseur ?')) {
      this.supplierService.delete(id);
      this.loadSuppliers();
    }
  }

  goToAdd(): void {
    this.router.navigate(['/entities/suppliers/add']);
  }

  // pour le template
  get isAdmin() { return isAdmin(); }
}