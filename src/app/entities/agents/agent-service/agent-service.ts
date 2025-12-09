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

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;

    fetch('/assets/data/agents.json')
      .then(r => r.json())
      .then(data => localStorage.setItem(this.key, JSON.stringify(data)))
      .catch(() => localStorage.setItem(this.key, JSON.stringify([])));
  }

  getAll(): Agent[] {
    this.initDefaultsIfNeeded();
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: number): Agent | undefined {
    return this.getAll().find(a => a.id === id);
  }

  add(agent: Omit<Agent, 'id'>): void {
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;
    list.push({ ...agent, id: newId } as Agent);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(agent: Agent): void {
    const list = this.getAll();
    const i = list.findIndex(a => a.id === agent.id);
    if (i > -1) {
      list[i] = agent;
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  delete(id: number): void {
    localStorage.setItem(
      this.key,
      JSON.stringify(this.getAll().filter(a => a.id !== id))
    );
  }
}
