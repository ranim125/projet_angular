import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      this.router.navigate([role === 'admin' ? '/admin' : '/agent']);
    }
  }

  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  get password(): AbstractControl | null {
    return this.form.get('password');
  }

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;
    const lowerEmail = email.toLowerCase();

    // Vérifier si bloqué — CHANGÉ en sessionStorage
    const blockTimeStr = sessionStorage.getItem(`block_time_${lowerEmail}`);
    if (blockTimeStr) {
      const blockTime = parseInt(blockTimeStr, 10);
      if (Date.now() < blockTime) {
        const minutesLeft = Math.ceil((blockTime - Date.now()) / (1000 * 60));
        this.errorMessage = `Compte bloqué. Réessayez dans ${minutesLeft} minute(s).`;
        this.loading = false;
        return;
      } else {
        // Temps écoulé → déblocage automatique
        sessionStorage.removeItem(`block_time_${lowerEmail}`);
        sessionStorage.removeItem(`login_attempts_${lowerEmail}`);
      }
    }

    try {
      const result = await this.authService.login(email, password);

      if (!result.success) {
        // Incrémenter les tentatives — CHANGÉ en sessionStorage
        let attempts = (parseInt(sessionStorage.getItem(`login_attempts_${lowerEmail}`) || '0', 10)) + 1;
        sessionStorage.setItem(`login_attempts_${lowerEmail}`, attempts.toString());

        if (attempts >= 3) {
          const blockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
          sessionStorage.setItem(`block_time_${lowerEmail}`, blockUntil.toString());
          this.errorMessage = 'Trop de tentatives échouées. Compte bloqué pour 5 minutes.';
        } else {
          this.errorMessage = `${result.message} (${attempts}/3 tentatives)`;
        }
      } else {
        // Succès → reset des tentatives et blocage — CHANGÉ en sessionStorage
        sessionStorage.removeItem(`login_attempts_${lowerEmail}`);
        sessionStorage.removeItem(`block_time_${lowerEmail}`);
        this.router.navigate([result.role === 'admin' ? '/admin' : '/agent']);
      }
    } catch (error: any) {
      this.errorMessage = 'Erreur serveur. Veuillez réessayer.';
    } finally {
      this.loading = false;
    }
  }
}