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
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { ClientService, Client } from '../client-service/client-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-client-list',
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
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {

  // MODIFIÉ : Colonne email supprimée
  displayedColumns: string[] = ['client', 'telephone', 'adresse', 'actions'];
  allClients: Client[] = [];
  filteredClients: Client[] = [];
  filteredAndPaged: Client[] = [];

  searchNom = '';
  filterAdresse = '';
  
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedClient: Client | null = null;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.allClients = this.clientService.getAll();
    this.applyFilters();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.allClients];

    // Filtre par recherche nom/prénom
    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(c =>
        c.nom.toLowerCase().includes(term) ||
        c.prenom.toLowerCase().includes(term)
      );
    }

    // Filtre par adresse
    if (this.filterAdresse.trim()) {
      temp = temp.filter(c =>
        c.adresse.toLowerCase().includes(this.filterAdresse.toLowerCase())
      );
    }

    this.filteredClients = temp;
    this.totalItems = temp.length;
    this.paginateClients();
  }

  paginateClients(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAndPaged = this.filteredClients.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateClients();
  }

  sortByName(): void {
    this.filteredClients.sort((a, b) => a.nom.localeCompare(b.nom));
    this.paginateClients();
  }

  viewDetails(client: Client): void {
    this.selectedClient = client;
  }

  closeDetails(): void {
    this.selectedClient = null;
  }

  edit(id: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/clients/edit', id]);
    }
  }

  delete(id: number): void {
    if (this.isAdmin && confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.delete(id);
      this.loadClients();
    }
  }

  goToAdd(): void {
    if (this.isAdmin) {
      this.router.navigate(['/entities/clients/add']);
    }
  }

  get isAdmin(): boolean {
    return isAdmin();
  }
}