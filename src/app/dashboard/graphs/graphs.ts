// src/app/dashboard/graphs/graphs.component.ts
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

  ngAfterViewInit(): void {
    this.createCharts();
  }

  private createCharts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');

    // 1. PRODUITS EN STOCK PAR CATÉGORIE (barres)
    const stockCountByCat = new Map<number, number>();
    categories.forEach((cat: any) => stockCountByCat.set(cat.id, 0));

    products.forEach((p: any) => {
      if (p.inStock === true) {  // seulement ceux en stock
        const catId = Number(p.categoryId);
        if (!isNaN(catId) && stockCountByCat.has(catId)) {
          stockCountByCat.set(catId, (stockCountByCat.get(catId) || 0) + 1);
        }
      }
    });

    const barLabels = categories.map((c: any) => c.name || 'Inconnue');
    const barData = categories.map((c: any) => stockCountByCat.get(c.id) || 0);

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{
          label: 'Produits en stock',
          data: barData,
          backgroundColor: '#4caf50',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    // 2. PRODUITS EN RUPTURE PAR CATÉGORIE (doughnut)
    const ruptureCountByCat = new Map<number, number>();
    categories.forEach((cat: any) => ruptureCountByCat.set(cat.id, 0));

    products.forEach((p: any) => {
      if (p.inStock === false) {
        const catId = Number(p.categoryId);
        if (!isNaN(catId) && ruptureCountByCat.has(catId)) {
          ruptureCountByCat.set(catId, (ruptureCountByCat.get(catId) || 0) + 1);
        }
      }
    });

    const doughnutLabels = categories
      .filter((c: any) => (ruptureCountByCat.get(c.id) || 0) > 0)
      .map((c: any) => c.name);

    const doughnutData = categories
      .filter((c: any) => (ruptureCountByCat.get(c.id) || 0) > 0)
      .map((c: any) => ruptureCountByCat.get(c.id) || 0);

    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: doughnutLabels.length ? doughnutLabels : ['Aucune rupture'],
        datasets: [{
          data: doughnutData.length ? doughnutData : [1],
          backgroundColor: doughnutData.length ? ['#f44336', '#ff5722', '#ff9800'] : ['#e0e0e0']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // 3. FOURNISSEURS PAR RÉGION
    const supplierRegionMap = new Map<string, number>();
    suppliers.forEach((s: any) => {
      const region = s.region || 'Non défini';
      supplierRegionMap.set(region, (supplierRegionMap.get(region) || 0) + 1);
    });

    new Chart(this.pieSuppliersCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Array.from(supplierRegionMap.keys()),
        datasets: [{ data: Array.from(supplierRegionMap.values()), backgroundColor: ['#1976d2', '#42a5f5', '#764ba2', '#f093fb', '#9c27b0'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // 4. CLIENTS PAR RÉGION (NOUVEAU)
    const clientRegionMap = new Map<string, number>();
    clients.forEach((c: any) => {
      const region = c.region || c.adresse?.split(',')[1]?.trim() || 'Non défini';
      clientRegionMap.set(region, (clientRegionMap.get(region) || 0) + 1);
    });

    new Chart(this.pieClientsCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Array.from(clientRegionMap.keys()),
        datasets: [{ data: Array.from(clientRegionMap.values()), backgroundColor: ['#ff9800', '#ff5722', '#e91e63', '#9c27b0', '#673ab7'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}