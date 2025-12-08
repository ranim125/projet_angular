import { Injectable } from '@angular/core';
import { isAdmin } from '../../../shared/role-utils';

export interface Supplier {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  region: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly key = 'suppliers';

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;

    fetch('/assets/data/suppliers.json')
      .then(res => res.json())
      .then((data: Supplier[]) => {
        localStorage.setItem(this.key, JSON.stringify(data));
      })
      .catch(() => {
        localStorage.setItem(this.key, JSON.stringify([{
          id: 1, nom: "Fournisseur par défaut", adresse: "Casablanca",
          telephone: "0600000000", email: "default@exemple.ma", region: "Casablanca-Settat"
        }]));
      });
  }

  getAll(): Supplier[] {
    this.initDefaultsIfNeeded();
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: number): Supplier | undefined {
    return this.getAll().find(s => s.id === id);
  }

  add(supplier: Omit<Supplier, 'id'>): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(s => s.id)) + 1 : 1;
    list.push({ ...supplier, id: newId } as Supplier);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(supplier: Supplier): void {
    if (!isAdmin()) return;
    const list = this.getAll();
    const index = list.findIndex(s => s.id === supplier.id);
    if (index !== -1) {
      list[index] = supplier;
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    const list = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}