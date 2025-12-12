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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

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
    MatIconModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './supplier-list.html',
  styleUrls: ['./supplier-list.css']
})
export class SupplierList implements OnInit {

  displayedColumns: string[] = ['id', 'supplier', 'telephone', 'email', 'region', 'actions'];
  allSuppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  filteredAndPaged: Supplier[] = [];

  searchNom = '';
  filterAdresse = '';
  
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedSupplier: Supplier | null = null;

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

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.allSuppliers];

    // Filtre par recherche nom
    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(s => s.nom.toLowerCase().includes(term));
    }

    // Filtre par adresse/région
    if (this.filterAdresse.trim()) {
      const term = this.filterAdresse.toLowerCase();
      temp = temp.filter(s => 
        s.adresse.toLowerCase().includes(term) ||
        s.region.toLowerCase().includes(term)
      );
    }

    this.filteredSuppliers = temp;
    this.totalItems = temp.length;
    this.paginateSuppliers();
  }

  paginateSuppliers(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAndPaged = this.filteredSuppliers.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateSuppliers();
  }

  sortByName(): void {
    this.filteredSuppliers.sort((a, b) => a.nom.localeCompare(b.nom));
    this.paginateSuppliers();
  }

  viewDetails(supplier: Supplier): void {
    this.selectedSupplier = supplier;
  }

  closeDetails(): void {
    this.selectedSupplier = null;
  }

  edit(id: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/suppliers/edit', id]);
    }
  }

  delete(id: number): void {
    if (this.isAdmin && confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.supplierService.delete(id);
      this.loadSuppliers();
    }
  }

  goToAdd(): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/suppliers/add']);
    }
  }

  get isAdmin(): boolean {
    return isAdmin();
  }
}