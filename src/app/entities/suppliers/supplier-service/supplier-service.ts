import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isAdmin } from '../../../shared/role-utils';

export interface Supplier {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  region: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiUrl = 'http://localhost:3000/api/suppliers';

  constructor(private http: HttpClient) {}

  getAll(): Supplier[] {
    const list: Supplier[] = [];
    this.http.get<Supplier[]>(this.apiUrl).subscribe(data => list.push(...data));
    return list;
  }

  getById(id: number): Supplier | undefined {
    let item = {} as Supplier;
    this.http.get<Supplier>(`${this.apiUrl}/${id}`).subscribe(data => Object.assign(item, data));
    return item;
  }

  add(supplier: Omit<Supplier, 'id'>): void {
    if (!isAdmin()) return;
    this.http.post(this.apiUrl, supplier).subscribe();
  }

  update(supplier: Supplier): void {
    if (!isAdmin()) return;
    this.http.put(`${this.apiUrl}/${supplier.id}`, supplier).subscribe();
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }
}