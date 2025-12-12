import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService, UserRole } from '../services/auth-service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  isBlocked = false;
  blockRemainingSeconds = 0;
  attemptsCount = 0;
  MAX_ATTEMPTS = 3;

  private blockTimer$!: Subscription;
  private readonly BLOCK_DURATION = 60;

  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Écouter les changements d'email pour vérifier le statut de blocage
    this.loginForm.get('email')?.valueChanges.subscribe(email => {
      if (email && email.includes('@')) {
        this.updateAccountStatus(email);
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole();
    }
  }

  ngOnDestroy(): void {
    this.blockTimer$?.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isBlocked) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const trimmedEmail = email!.trim();

    try {
      const result = await this.authService.login(trimmedEmail, password!);

      if (result.success) {
        this.resetLocalState();
        this.redirectByRole(result.role!);
      } else {
        this.handleLoginError(result.message, trimmedEmail);
      }
    } catch {
      this.errorMessage = 'Erreur réseau. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  private redirectByRole(role?: UserRole): void {
    const target = role === 'admin' ? '/admin' : '/agent';
    this.router.navigate([target]);
  }

  private handleLoginError(message: string, email: string): void {
    // Vérifier le statut de blocage après la tentative échouée
    const blockStatus = this.authService.checkIfAccountBlocked(email);
    
    if (blockStatus.isBlocked && blockStatus.remainingSeconds) {
      this.activateBlockTimer(blockStatus.remainingSeconds);
      this.errorMessage = `Trop de tentatives. Compte bloqué pendant ${blockStatus.remainingSeconds} secondes.`;
    } else {
      // Mettre à jour le compteur d'essais
      this.updateAttemptsCount(email);
      this.errorMessage = message;
    }
  }

  private updateAccountStatus(email: string): void {
    const blockStatus = this.authService.checkIfAccountBlocked(email);
    
    if (blockStatus.isBlocked && blockStatus.remainingSeconds) {
      this.isBlocked = true;
      this.blockRemainingSeconds = blockStatus.remainingSeconds;
      this.activateBlockTimer(blockStatus.remainingSeconds);
    } else {
      this.isBlocked = false;
      this.blockRemainingSeconds = 0;
      this.blockTimer$?.unsubscribe();
    }
    
    // Mettre à jour le compteur d'essais
    this.updateAttemptsCount(email);
  }

  private updateAttemptsCount(email: string): void {
    const remaining = this.authService.getRemainingAttempts(email);
    this.attemptsCount = Math.max(0, this.MAX_ATTEMPTS - remaining);
  }

  private activateBlockTimer(seconds: number): void {
    this.isBlocked = true;
    this.blockRemainingSeconds = seconds;
    
    // Arrêter le timer précédent si existant
    this.blockTimer$?.unsubscribe();
    
    // Démarrer un nouveau timer
    this.blockTimer$ = interval(1000).subscribe(() => {
      this.blockRemainingSeconds--;
      
      // Vérifier si le blocage est terminé
      const email = this.loginForm.get('email')?.value;
      if (email) {
        const blockStatus = this.authService.checkIfAccountBlocked(email);
        if (!blockStatus.isBlocked) {
          this.resetLocalState();
        }
      }
      
      if (this.blockRemainingSeconds <= 0) {
        this.resetLocalState();
      }
    });
  }

  private resetLocalState(): void {
    this.isBlocked = false;
    this.blockRemainingSeconds = 0;
    this.errorMessage = '';
    this.blockTimer$?.unsubscribe();
    
    // Réinitialiser le compteur pour l'email actuel
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.updateAttemptsCount(email);
    }
  }

  // Méthode publique pour récupérer les tentatives (utilisée dans le template)
  getAttempts(): number {
    return this.attemptsCount;
  }
}