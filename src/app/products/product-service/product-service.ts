import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  inStock: boolean;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly key = 'products';

  private initDefaultsIfNeeded(): void {
    if (localStorage.getItem(this.key)) return;

    fetch('/assets/data/products.json')
      .then(r => r.json())
      .then(data => localStorage.setItem(this.key, JSON.stringify(data)))
      .catch(() => localStorage.setItem(this.key, JSON.stringify([])));
  }

  getAll(): Product[] {
    this.initDefaultsIfNeeded();
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: number): Product | undefined {
    return this.getAll().find(p => p.id === id);
  }

  add(prod: Omit<Product, 'id'>): void {
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
    list.push({ ...prod, id: newId } as Product);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(prod: Product): void {
    const list = this.getAll();
    const i = list.findIndex(p => p.id === prod.id);
    if (i > -1) {
      list[i] = prod;
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  delete(id: number): void {
    const list = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}
