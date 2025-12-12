import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // AJOUTER CETTE LIGNE
import { MatTooltipModule } from '@angular/material/tooltip'; // AJOUTER CETTE LIGNE
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../category-service/category-service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, // AJOUTER CETTE LIGNE
    MatTooltipModule // AJOUTER CETTE LIGNE
  ],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css']
})
export class CategoryList implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];

  categories: Category[] = [];
  filteredAndPaged: Category[] = [];

  pageSize = 5;
  pageIndex = 0;
  searchTerm = '';
  totalItems = 0;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.categoryService.getAll();
    this.applyFilterAndPage();
  }

  applyFilterAndPage() {
    let temp = [...this.categories];

    if (this.searchTerm) {
      temp = temp.filter(c =>
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const start = this.pageIndex * this.pageSize;
    this.filteredAndPaged = temp.slice(start, start + this.pageSize);
    this.totalItems = temp.length;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilterAndPage();
  }

  onSearch() {
    this.pageIndex = 0;
    this.applyFilterAndPage();
  }

  edit(cat: Category) {
    this.router.navigate(['/categories/edit', cat.id]);
  }

  delete(id: number) {
    if (confirm('Supprimer cette catégorie ?')) {
      this.categoryService.delete(id);
      this.loadCategories();
    }
  }

  goToAdd() {
    this.router.navigate(['/categories/add']);
  }
}