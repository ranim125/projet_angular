import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:3000/api/deliverers';

  constructor(private http: HttpClient) {}

  getAll(): Deliverer[] {
    const list: Deliverer[] = [];
    this.http.get<Deliverer[]>(this.apiUrl).subscribe(data => list.push(...data));
    return list;
  }

  getById(id: number): Deliverer | undefined {
    let item = {} as Deliverer;
    this.http.get<Deliverer>(`${this.apiUrl}/${id}`).subscribe(data => Object.assign(item, data));
    return item;
  }

  add(deliverer: Omit<Deliverer, 'id'>): void {
    if (!isAdmin()) return;
    this.http.post(this.apiUrl, deliverer).subscribe();
  }

  update(deliverer: Deliverer): void {
    if (!isAdmin()) return;
    this.http.put(`${this.apiUrl}/${deliverer.id}`, deliverer).subscribe();
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }
}