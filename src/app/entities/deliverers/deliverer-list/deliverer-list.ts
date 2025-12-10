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
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DelivererService, Deliverer } from '../deliverer-service/deliverer-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-deliverer-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './deliverer-list.html',
  styleUrl: './deliverer-list.css'
})
export class DelivererList implements OnInit {

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'telephone', 'adresse', 'disponible', 'actions'];

  allDeliverers: Deliverer[] = [];
  filtered: Deliverer[] = [];

  searchNom = '';
  filterAdresse = '';
  onlyAvailable = false;

  pageIndex = 0;
  pageSize = 10;
  total = 0;

  constructor(private service: DelivererService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.allDeliverers = this.service.getAll();
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.allDeliverers];

    if (this.searchNom) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(d => (d.nom + ' ' + d.prenom).toLowerCase().includes(term));
    }

    if (this.filterAdresse) {
      temp = temp.filter(d => d.adresse.toLowerCase().includes(this.filterAdresse.toLowerCase()));
    }

    if (this.onlyAvailable) {
      temp = temp.filter(d => d.disponible);
    }

    this.total = temp.length;
    const start = this.pageIndex * this.pageSize;
    this.filtered = temp.slice(start, start + this.pageSize);
  }

  onPageChange(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.applyFilters();
  }

  resetFilters() {
    this.pageIndex = 0;
    this.applyFilters();
  }

  edit(id: number) { this.router.navigate(['/entities/deliverers/edit', id]); }
  delete(id: number) {
    if (confirm('Supprimer ?') && isAdmin()) {
      this.service.delete(id);
      this.load();
    }
  }
  goToAdd() { this.router.navigate(['/entities/deliverers/add']); }

  get isAdmin() { return isAdmin(); }
}