import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsComponent } from '../stats/stats';

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [
    CommonModule,
    StatsComponent
  ],
  templateUrl: './dashboard-agent.html',
  styleUrls: ['../dashboard.css']
})
export class DashboardAgent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Même chose pour l'agent → stats chargées direct
    setTimeout(() => this.cdr.detectChanges(), 150);
  }
}