import { Injectable } from '@angular/core';
import { isAdmin } from '../../../shared/role-utils';

export interface Deliverer {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class DelivererService {
  private readonly key = 'deliverers';

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;
    fetch('/assets/data/deliverers.json')
      .then(r => r.json())
      .then(data => localStorage.setItem(this.key, JSON.stringify(data)))
      .catch(() => localStorage.setItem(this.key, JSON.stringify([])));
  }

  getAll(): Deliverer[] {
    this.initDefaultsIfNeeded();
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: number): Deliverer | undefined {
    return this.getAll().find(d => d.id === id);
  }

  add(deliverer: Omit<Deliverer, 'id'>): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(d => d.id)) + 1 : 1;
    list.push({ ...deliverer, id: newId } as Deliverer);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(deliverer: Deliverer): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const i = list.findIndex(d => d.id === deliverer.id);
    if (i > -1) { list[i] = deliverer; localStorage.setItem(this.key, JSON.stringify(list)); }
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    localStorage.setItem(this.key, JSON.stringify(this.getAll().filter(d => d.id !== id)));
  }
}