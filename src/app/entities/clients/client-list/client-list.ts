// src/app/entities/clients/client-list/client-list.ts

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
    MatIconModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'telephone', 'adresse', 'actions'];

  allClients: Client[] = [];
  filteredClients: Client[] = [];

  searchNom = '';
  filterAdresse = '';

  pageIndex = 0;
  pageSize = 10;
  total = 0;

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

  applyFilters(): void {
    let temp = [...this.allClients];

    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(c =>
        c.nom.toLowerCase().includes(term) ||
        c.prenom.toLowerCase().includes(term)
      );
    }

    if (this.filterAdresse.trim()) {
      temp = temp.filter(c =>
        c.adresse.toLowerCase().includes(this.filterAdresse.toLowerCase())
      );
    }

    this.total = temp.length;
    const start = this.pageIndex * this.pageSize;
    this.filteredClients = temp.slice(start, start + this.pageSize);
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
    this.router.navigate(['/entities/clients/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Supprimer ce client ?') && isAdmin()) {
      this.clientService.delete(id);
      this.loadClients();
    }
  }

  goToAdd(): void {
    this.router.navigate(['/entities/clients/add']);
  }

  // Pour le template
  get isAdmin(): boolean {
    return isAdmin();
  }
}