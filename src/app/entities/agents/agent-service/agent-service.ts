// src/app/entities/agents/agent-service/agent-service.ts
import { Injectable } from '@angular/core';
import { isAdmin } from '../../../shared/role-utils';

export interface Agent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'admin' | 'agent';
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly key = 'agents';

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;

    fetch('/assets/data/agents.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem(this.key, JSON.stringify(data));
        console.log('Agents chargés depuis JSON →', data.length, 'agents');
      })
      .catch(err => {
        console.warn('Impossible de charger agents.json, on met des valeurs par défaut', err);
        const fallback: Agent[] = [
          { id: 1, nom: 'Admin', prenom: 'Super', email: 'admin@depot.tn', telephone: '71 234 567', role: 'admin' },
          { id: 2, nom: 'Jarray', prenom: 'Karim', email: 'karim@depot.tn', telephone: '98 123 456', role: 'agent' },
          { id: 3, nom: 'Trabelsi', prenom: 'Amina', email: 'amina@depot.tn', telephone: '22 345 678', role: 'agent' }
        ];
        localStorage.setItem(this.key, JSON.stringify(fallback));
      });
  }

  getAll(): Agent[] {
    this.initDefaultsIfNeeded();
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: number): Agent | undefined {
    return this.getAll().find(a => a.id === id);
  }

  add(agent: Omit<Agent, 'id'>): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;
    list.push({ ...agent, id: newId } as Agent);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(agent: Agent): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const index = list.findIndex(a => a.id === agent.id);
    if (index > -1) {
      list[index] = agent;
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    const list = this.getAll().filter(a => a.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}