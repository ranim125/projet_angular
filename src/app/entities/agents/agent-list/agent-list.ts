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
    MatIconModule
  ],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css'
})
export class AgentList implements OnInit {

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'telephone', 'role', 'actions'];

  allAgents: Agent[] = [];
  filteredAgents: Agent[] = [];

  searchNom = '';
  filterRole = '';

  pageIndex = 0;
  pageSize = 10;
  total = 0;

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

  applyFilters(): void {
    let temp = [...this.allAgents];

    if (this.searchNom.trim()) {
      const t = this.searchNom.toLowerCase();
      temp = temp.filter(a =>
        a.nom.toLowerCase().includes(t) ||
        a.prenom.toLowerCase().includes(t)
      );
    }

    if (this.filterRole.trim()) {
      temp = temp.filter(a =>
        a.role.toLowerCase().includes(this.filterRole.toLowerCase())
      );
    }

    this.total = temp.length;
    const start = this.pageIndex * this.pageSize;
    this.filteredAgents = temp.slice(start, start + this.pageSize);
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
    this.router.navigate(['/entities/agents/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Supprimer cet agent ?')) {
      this.agentService.delete(id);
      this.loadAgents();
    }
  }

  goToAdd(): void {
    this.router.navigate(['/entities/agents/add']);
  }
}
