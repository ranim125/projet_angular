import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './graphs.html',
  styleUrl: './graphs.css'
})
export class GraphsComponent implements AfterViewInit {

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieSuppliersCanvas') pieSuppliersCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieClientsCanvas') pieClientsCanvas!: ElementRef<HTMLCanvasElement>;

  // Palette de couleurs
  private colors = {
    deepSpaceBlue: '#162C44',
    tropicalMint: '#29F0B5',
    chartreuse: '#BAEF17',
    lightCoral: '#EE8781',
    tuscanSun: '#F3C150',
    charcoal: '#515659',
    platinum: '#F1F1F1'
  };

  ngAfterViewInit(): void {
    // Petit délai pour assurer que les canvas sont prêts
    setTimeout(() => {
      this.createCharts();
    }, 200);
  }

  private createCharts() {
    // Créer des données d'exemple si localStorage est vide
    this.ensureSampleData();
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');

    // 1. Graphique à barres - Produits par catégorie
    this.createBarChart(products, categories);
    
    // 2. Graphique doughnut - Rupture de stock
    this.createDoughnutChart(products, categories);
    
    // 3. Graphique camembert - Fournisseurs par région
    this.createPieChart(suppliers, this.pieSuppliersCanvas, 'Fournisseurs par région');
    
    // 4. Graphique camembert - Clients par région
    this.createPieChart(clients, this.pieClientsCanvas, 'Clients par région');
  }

  private ensureSampleData() {
    if (!localStorage.getItem('products')) {
      const sampleData = {
        products: [
          { id: 1, name: 'Produit A', categoryId: 1, inStock: true },
          { id: 2, name: 'Produit B', categoryId: 1, inStock: false },
          { id: 3, name: 'Produit C', categoryId: 2, inStock: true },
          { id: 4, name: 'Produit D', categoryId: 2, inStock: true },
          { id: 5, name: 'Produit E', categoryId: 3, inStock: false }
        ],
        categories: [
          { id: 1, name: 'Électronique' },
          { id: 2, name: 'Meubles' },
          { id: 3, name: 'Vêtements' }
        ],
        suppliers: [
          { id: 1, name: 'Fournisseur 1', region: 'Casablanca' },
          { id: 2, name: 'Fournisseur 2', region: 'Rabat' },
          { id: 3, name: 'Fournisseur 3', region: 'Casablanca' },
          { id: 4, name: 'Fournisseur 4', region: 'Marrakech' }
        ],
        clients: [
          { id: 1, name: 'Client 1', region: 'Casablanca' },
          { id: 2, name: 'Client 2', region: 'Rabat' },
          { id: 3, name: 'Client 3', region: 'Casablanca' },
          { id: 4, name: 'Client 4', region: 'Tanger' },
          { id: 5, name: 'Client 5', region: 'Rabat' }
        ]
      };

      localStorage.setItem('products', JSON.stringify(sampleData.products));
      localStorage.setItem('categories', JSON.stringify(sampleData.categories));
      localStorage.setItem('suppliers', JSON.stringify(sampleData.suppliers));
      localStorage.setItem('clients', JSON.stringify(sampleData.clients));
    }
  }

  private createBarChart(products: any[], categories: any[]) {
    if (!this.barCanvas?.nativeElement) return;

    const categoryCounts = new Map();
    categories.forEach(cat => categoryCounts.set(cat.id, 0));
    
    products.forEach(product => {
      if (product.inStock) {
        const count = categoryCounts.get(product.categoryId) || 0;
        categoryCounts.set(product.categoryId, count + 1);
      }
    });

    const labels = categories.map(c => c.name);
    const data = categories.map(c => categoryCounts.get(c.id) || 0);

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Produits en stock',
          data: data,
          backgroundColor: this.colors.tropicalMint,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  private createDoughnutChart(products: any[], categories: any[]) {
    if (!this.doughnutCanvas?.nativeElement) return;

    const ruptureCounts = new Map();
    categories.forEach(cat => ruptureCounts.set(cat.id, 0));
    
    products.forEach(product => {
      if (!product.inStock) {
        const count = ruptureCounts.get(product.categoryId) || 0;
        ruptureCounts.set(product.categoryId, count + 1);
      }
    });

    const labels = categories
      .filter(c => (ruptureCounts.get(c.id) || 0) > 0)
      .map(c => c.name);
    
    const data = categories
      .filter(c => (ruptureCounts.get(c.id) || 0) > 0)
      .map(c => ruptureCounts.get(c.id) || 0);

    if (labels.length === 0) {
      labels.push('Aucune rupture');
      data.push(1);
    }

    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            this.colors.lightCoral,
            this.colors.tuscanSun,
            this.colors.chartreuse,
            this.colors.deepSpaceBlue
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private createPieChart(items: any[], canvasRef: ElementRef<HTMLCanvasElement>, title: string) {
    if (!canvasRef?.nativeElement || items.length === 0) return;

    const regionCounts = new Map();
    items.forEach(item => {
      const region = item.region || 'Non spécifié';
      regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
    });

    const labels = Array.from(regionCounts.keys());
    const data = Array.from(regionCounts.values());

    new Chart(canvasRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            this.colors.deepSpaceBlue,
            this.colors.tropicalMint,
            this.colors.chartreuse,
            this.colors.tuscanSun,
            this.colors.lightCoral
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title
          }
        }
      }
    });
  }
}