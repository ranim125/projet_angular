import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-graphs',
  standalone: true,
  templateUrl: './graphs.html'
})
export class GraphsComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.drawStockGraph();
    this.drawCategoriesGraph();
  }

  drawStockGraph() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');

    const inStock = products.filter((p: any) => p.inStock).length;
    const outStock = products.filter((p: any) => !p.inStock).length;

    const canvas: any = document.getElementById('stockChart');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 300, 200);

    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(20, 50, inStock * 20, 40);

    ctx.fillStyle = '#F44336';
    ctx.fillRect(20, 120, outStock * 20, 40);

    ctx.fillStyle = '#000';
    ctx.fillText(`En stock : ${inStock}`, 10, 45);
    ctx.fillText(`Rupture : ${outStock}`, 10, 115);
  }

  drawCategoriesGraph() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');

    const canvas: any = document.getElementById('categoryChart');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 300, 200);

    let y = 20;

    categories.forEach((cat: any) => {
      const count = products.filter((p: any) => p.categoryId === cat.id).length;
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(20, y, count * 20, 20);
      ctx.fillStyle = '#000';
      ctx.fillText(`${cat.name} (${count})`, 160, y + 15);
      y += 30;
    });
  }
}
