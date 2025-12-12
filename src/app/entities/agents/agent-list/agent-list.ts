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

import { AgentService, Agent } from '../agent-service/agent-service';

@Component({
  selector: 'app-agent-list',
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
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css'
})
export class AgentList implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'telephone', 'role', 'actions'];
  allAgents: Agent[] = [];
  filteredAgents: Agent[] = [];
  filteredAndPaged: Agent[] = [];

  searchNom = '';
  filterRole = '';
  
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  selectedAgent: Agent | null = null;

  constructor(
    private agentService: AgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.allAgents = this.agentService.getAll();
    this.applyFilters();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.allAgents];

    // Filtre par recherche nom/prénom
    if (this.searchNom.trim()) {
      const term = this.searchNom.toLowerCase();
      temp = temp.filter(a =>
        a.nom.toLowerCase().includes(term) ||
        a.prenom.toLowerCase().includes(term)
      );
    }

    // Filtre par rôle
    if (this.filterRole.trim()) {
      temp = temp.filter(a =>
        a.role.toLowerCase().includes(this.filterRole.toLowerCase())
      );
    }

    this.filteredAgents = temp;
    this.totalItems = temp.length;
    this.paginateAgents();
  }

  paginateAgents(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAndPaged = this.filteredAgents.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateAgents();
  }

  sortByName(): void {
    this.filteredAgents.sort((a, b) => a.nom.localeCompare(b.nom));
    this.paginateAgents();
  }

  viewDetails(agent: Agent): void {
    this.selectedAgent = agent;
  }

  closeDetails(): void {
    this.selectedAgent = null;
  }

  edit(id: number): void {
    this.router.navigate(['/entities/agents/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      this.agentService.delete(id);
      this.loadAgents();
    }
  }

  goToAdd(): void {
    this.router.navigate(['/entities/agents/add']);
  }
}