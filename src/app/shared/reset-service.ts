
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResetDataService {

  // Liste tous tes fichiers JSON ici
  private readonly defaults = [
    { key: 'categories', file: '/assets/data/categories.json' },
    { key: 'products',   file: '/assets/data/products.json' },
    { key: 'suppliers',  file: '/assets/data/suppliers.json' },
    { key: 'clients',    file: '/assets/data/clients.json' },
    { key: 'deliverers', file: '/assets/data/deliverers.json' },
    { key: 'agents', file: '/assets/data/agents.json' }
    
  ];

  constructor() {
    // À chaque chargement de l'app → on reset tout
    this.resetAllToDefaults();
  }

  private async resetAllToDefaults(): Promise<void> {
    for (const item of this.defaults) {
      try {
        const response = await fetch(item.file);
        const data = await response.json();
        localStorage.setItem(item.key, JSON.stringify(data));
        console.log(`Reset ${item.key} → ${data.length} éléments`);
      } catch (e) {
        console.warn(`Impossible de charger ${item.file}`);
      }
    }
  }
}