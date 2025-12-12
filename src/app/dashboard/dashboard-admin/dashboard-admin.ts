import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsComponent } from '../stats/stats';
import { GraphsComponent } from '../graphs/graphs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    StatsComponent,
    GraphsComponent
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['../dashboard.css']
})
export class DashboardAdmin implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Force le rafraîchissement après login → les données des stats s'affichent immédiatement
    setTimeout(() => this.cdr.detectChanges(), 150);
  }
}