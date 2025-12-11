import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService, UserRole } from '../services/auth-service'; // CORRIGÉ : import propre
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

  private blockTimer$!: Subscription;
  private readonly BLOCK_DURATION = 60; // 60 secondes
  private readonly MAX_ATTEMPTS = 3;

  // On déclare le FormGroup APRÈS l'injection du FormBuilder → plus d'erreur
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    // Initialisation ici, après que fb existe
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole();
    }
    this.checkIfBlocked();
  }

  ngOnDestroy(): void {
    this.blockTimer$?.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isBlocked) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.login(email!.trim(), password!);

      if (result.success) {
        this.resetAttempts();
        this.redirectByRole(result.role!);
      } else {
        this.handleFailedAttempt(result.message);
      }
    } catch {
      this.errorMessage = 'Erreur réseau. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  private redirectByRole(role?: UserRole): void {
    // Après login, on redirige vers /admin ou /agent → qui redirigent vers /dashboard
    const target = role === 'admin' ? '/admin' : '/agent';
    this.router.navigate([target]);
  }

  private handleFailedAttempt(message: string): void {
    const attempts = this.getAttempts() + 1;
    localStorage.setItem('loginAttempts', attempts.toString());

    if (attempts >= this.MAX_ATTEMPTS) {
      this.blockUser();
      this.errorMessage = 'Trop de tentatives. Compte bloqué 60 secondes.';
    } else {
      this.errorMessage = `${message} (${attempts}/${this.MAX_ATTEMPTS} tentatives)`;
    }
  }

  private blockUser(): void {
    const blockUntil = Date.now() + this.BLOCK_DURATION * 1000;
    localStorage.setItem('blockUntil', blockUntil.toString());

    this.isBlocked = true;
    this.blockRemainingSeconds = this.BLOCK_DURATION;

    this.blockTimer$ = interval(1000).subscribe(() => {
      this.blockRemainingSeconds--;
      if (this.blockRemainingSeconds <= 0) {
        this.unblockUser();
      }
    });
  }

  private checkIfBlocked(): void {
    const blockUntil = localStorage.getItem('blockUntil');
    if (!blockUntil) return;

    const remaining = Math.ceil((Number(blockUntil) - Date.now()) / 1000);
    if (remaining > 0) {
      this.isBlocked = true;
      this.blockRemainingSeconds = remaining;

      this.blockTimer$ = interval(1000).subscribe(() => {
        this.blockRemainingSeconds--;
        if (this.blockRemainingSeconds <= 0) {
          this.unblockUser();
        }
      });
    } else {
      this.unblockUser();
    }
  }

  private unblockUser(): void {
    localStorage.removeItem('blockUntil');
    localStorage.removeItem('loginAttempts');
    this.isBlocked = false;
    this.blockRemainingSeconds = 0;
    this.blockTimer$?.unsubscribe();
  }

  private getAttempts(): number {
    return Number(localStorage.getItem('loginAttempts') || '0');
  }

  private resetAttempts(): void {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('blockUntil');
    this.isBlocked = false;
  }
}