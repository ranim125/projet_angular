import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ProductService, Product } from '../product-service/product-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'category', 'stock', 'actions'];

  allProducts: Product[] = [];
  filteredAndPaged: Product[] = [];

  categories: any[] = [];

  searchTerm = '';
  filterCategoryId: any = '';
  filterStock = '';

  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
    this.loadProducts();
  }

  loadProducts(): void {
    this.allProducts = this.productService.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let data = [...this.allProducts];

    if (this.searchTerm.trim()) {
      data = data.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterCategoryId) {
      data = data.filter(p => p.categoryId == this.filterCategoryId);
    }

    if (this.filterStock === 'in') {
      data = data.filter(p => p.inStock);
    }
    if (this.filterStock === 'out') {
      data = data.filter(p => !p.inStock);
    }

    this.totalItems = data.length;
    const start = this.pageIndex * this.pageSize;
    this.filteredAndPaged = data.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onPageChange(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.applyFilters();
  }

  sortPriceAsc(): void {
    this.allProducts.sort((a, b) => a.price - b.price);
    this.applyFilters();
  }

  sortPriceDesc(): void {
    this.allProducts.sort((a, b) => b.price - a.price);
    this.applyFilters();
  }

  getCategoryName(id: number): string {
    const c = this.categories.find(x => x.id === id);
    return c ? c.name : '---';
  }

  edit(prod: Product): void {
    location.href = `/products/edit/${prod.id}`;
  }

  delete(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.delete(id);
      this.loadProducts();
    }
  
  }

  goToAdd(): void {
    location.href = `/products/new`;
  }

  viewDetails(p: Product): void {
    this.selectedProduct = p;
  }

  closeDetails(): void {
    this.selectedProduct = null;
  }
}
