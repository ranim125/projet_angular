import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Product[] {
    const list: Product[] = [];
    this.http.get<Product[]>(this.apiUrl).subscribe(data => {
      list.push(...data);
    });
    return list;
  }

  getById(id: number): Product | undefined {
    let item = {} as Product;
    this.http.get<Product>(`${this.apiUrl}/${id}`).subscribe(data => {
      Object.assign(item, data);
    });
    return item;
  }

  add(prod: Omit<Product, 'id'>): void {
    this.http.post(this.apiUrl, prod).subscribe();
  }

  update(prod: Product): void {
    this.http.put(`${this.apiUrl}/${prod.id}`, prod).subscribe();
  }

  delete(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }
}
