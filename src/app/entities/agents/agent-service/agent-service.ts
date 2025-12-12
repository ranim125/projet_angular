import { Injectable } from '@angular/core';

export interface Agent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly key = 'agents';

  getAll(): Agent[] {
    // Initialiser avec des données par défaut si localStorage est vide
    if (!localStorage.getItem(this.key)) {
      const defaults: Agent[] = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', telephone: '0123456789', role: 'Admin' },
        { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@example.com', telephone: '0234567891', role: 'Agent' },
        { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@example.com', telephone: '0345678912', role: 'Agent' }
      ];
      localStorage.setItem(this.key, JSON.stringify(defaults));
    }

    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: number): Agent | undefined {
    return this.getAll().find(a => a.id === id);
  }

  add(agent: Omit<Agent, 'id'>): void {
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;
    list.push({ ...agent, id: newId });
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(agent: Agent): void {
    const list = this.getAll();
    const index = list.findIndex(a => a.id === agent.id);
    if (index > -1) {
      list[index] = agent;
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  delete(id: number): void {
    const list = this.getAll().filter(a => a.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}