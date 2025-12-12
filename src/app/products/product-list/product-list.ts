import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProductService, Product } from '../product-service/product-service';
import { CategoryService, Category } from '../../categories/category-service/category-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  // MODIFIÉ : Ajout de la colonne 'id'
  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'stock', 'actions'];

  allProducts: Product[] = [];
  filteredAndPaged: Product[] = [];

  categories: Category[] = [];

  searchTerm = '';
  filterCategoryId: any = '';
  filterStock = '';

  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getAll();
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
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
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
    this.router.navigate(['/products/edit', prod.id]);
  }

  delete(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.delete(id);
      this.loadProducts();
    }
  }

  goToAdd(): void {
    this.router.navigate(['/products/new']);
  }

  viewDetails(p: Product): void {
    this.selectedProduct = p;
  }

  closeDetails(): void {
    this.selectedProduct = null;
  }
}