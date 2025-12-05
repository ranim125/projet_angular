// src/app/categories/category-service/category-service.ts
import { Injectable } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly key = 'categories';

  getAll(): Category[] {
    // Si localStorage vide → on charge directement le JSON en dur
    if (!localStorage.getItem(this.key)) {
      const defaults: Category[] = [
        { id: 1, name: "Électronique" },
        { id: 2, name: "Vêtements" },
        { id: 3, name: "Alimentaire" },
        { id: 4, name: "Mobilier" },
        { id: 5, name: "Livres" }
      ];
      localStorage.setItem(this.key, JSON.stringify(defaults));
    }

    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: number): Category | undefined {
    return this.getAll().find(c => c.id === id);
  }

  add(name: string): void {
    const list = this.getAll();
    const newId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    list.push({ id: newId, name });
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  update(cat: Category): void {
    const list = this.getAll();
    const i = list.findIndex(c => c.id === cat.id);
    if (i > -1) list[i] = cat;
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  delete(id: number): void {
    const list = this.getAll().filter(c => c.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}