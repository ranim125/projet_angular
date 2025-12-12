import { Injectable } from '@angular/core';
import { isAdmin } from '../../../shared/role-utils';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  
  adresse: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly key = 'clients';

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;
    fetch('/assets/data/clients.json')
      .then(r => r.json())
      .then(data => localStorage.setItem(this.key, JSON.stringify(data)))
      .catch(() => localStorage.setItem(this.key, JSON.stringify([])));
  }

  getAll(): Client[] {
    this.initDefaultsIfNeeded();
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: number): Client | undefined {
    return this.getAll().find(c => c.id === id);
  }

  add(client: Omit<Client, 'id'>): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    list.push({ ...client, id: newId } as Client);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(client: Client): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const i = list.findIndex(c => c.id === client.id);
    if (i > -1) { list[i] = client; localStorage.setItem(this.key, JSON.stringify(list)); }
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    localStorage.setItem(this.key, JSON.stringify(this.getAll().filter(c => c.id !== id)));
  }
}