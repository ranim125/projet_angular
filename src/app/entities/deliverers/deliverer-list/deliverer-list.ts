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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { DelivererService, Deliverer } from '../deliverer-service/deliverer-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-deliverer-list',
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
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './deliverer-list.html',
  styleUrl: './deliverer-list.css'
})
export class DelivererList implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'telephone', 'adresse', 'disponible', 'actions'];
  allDeliverers: Deliverer[] = [];
  filteredDeliverers: Deliverer[] = [];
  filteredAndPaged: Deliverer[] = [];

  searchNom = '';
  filterAdresse = '';
  onlyAvailable = false;
  
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedDeliverer: Deliverer | null = null;

  constructor(
    private delivererService: DelivererService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeliverers();
  }

  loadDeliverers(): void {
    this.allDeliverers = this.delivererService.getAll();
    this.applyFilters();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.allDeliverers];

    // Filtre par recherche nom/prénom
    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(d =>
        d.nom.toLowerCase().includes(term) ||
        d.prenom.toLowerCase().includes(term)
      );
    }

    // Filtre par adresse
    if (this.filterAdresse.trim()) {
      temp = temp.filter(d =>
        d.adresse.toLowerCase().includes(this.filterAdresse.toLowerCase())
      );
    }

    // Filtre par disponibilité
    if (this.onlyAvailable) {
      temp = temp.filter(d => d.disponible);
    }

    this.filteredDeliverers = temp;
    this.totalItems = temp.length;
    this.paginateDeliverers();
  }

  paginateDeliverers(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAndPaged = this.filteredDeliverers.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateDeliverers();
  }

  sortByName(): void {
    this.filteredDeliverers.sort((a, b) => a.nom.localeCompare(b.nom));
    this.paginateDeliverers();
  }

  viewDetails(deliverer: Deliverer): void {
    this.selectedDeliverer = deliverer;
  }

  closeDetails(): void {
    this.selectedDeliverer = null;
  }

  edit(id: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/deliverers/edit', id]);
    }
  }

  delete(id: number): void {
    if (this.isAdmin && confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      this.delivererService.delete(id);
      this.loadDeliverers();
    }
  }

  goToAdd(): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/deliverers/add']);
    }
  }

  get isAdmin(): boolean {
    return isAdmin();
  }
}