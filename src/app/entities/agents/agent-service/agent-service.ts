import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:3000/api/agents';

  constructor(private http: HttpClient) {}

  getAll(): Agent[] {
    const list: Agent[] = [];
    this.http.get<Agent[]>(this.apiUrl).subscribe(data => list.push(...data));
    return list;
  }

  getById(id: number): Agent | undefined {
    let item = {} as Agent;
    this.http.get<Agent>(`${this.apiUrl}/${id}`).subscribe(data => Object.assign(item, data));
    return item;
  }

  add(agent: Omit<Agent, 'id'>): void {
    if (!isAdmin()) return;
    this.http.post(this.apiUrl, agent).subscribe();
  }

  update(agent: Agent): void {
    if (!isAdmin()) return;
    this.http.put(`${this.apiUrl}/${agent.id}`, agent).subscribe();
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }
}