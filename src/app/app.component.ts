import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- à ajouter

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule // <-- nécessaire pour *ngFor, *ngIf, etc.
  ],
  templateUrl: './app.html'
})
export class AppComponent {
  title() {
    return 'Mon Projet Angular';
  }
}
