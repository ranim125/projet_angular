import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) {}

  getAll(): Client[] {
    const list: Client[] = [];
    this.http.get<Client[]>(this.apiUrl).subscribe(data => list.push(...data));
    return list;
  }

  getById(id: number): Client | undefined {
    let item = {} as Client;
    this.http.get<Client>(`${this.apiUrl}/${id}`).subscribe(data => Object.assign(item, data));
    return item;
  }

  add(client: Omit<Client, 'id'>): void {
    if (!isAdmin()) return;
    this.http.post(this.apiUrl, client).subscribe();
  }

  update(client: Client): void {
    if (!isAdmin()) return;
    this.http.put(`${this.apiUrl}/${client.id}`, client).subscribe();
  }

  delete(id: number): void {
    if (!isAdmin()) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }
}