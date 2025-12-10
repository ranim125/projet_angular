import { Component } from '@angular/core';
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
export class LoginPageComponent {
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

  // Getters pour accès propre aux contrôles du formulaire
  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  get password(): AbstractControl | null {
    return this.form.get('password');
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // met à jour les erreurs de tous les champs
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      const result = await this.authService.login(email, password);

      if (!result.success) {
        this.errorMessage = result.message;
      } else {
        this.router.navigate([result.role === 'admin' ? '/admin' : '/agent']);
      }
    } catch (error: any) {
      this.errorMessage = 'Erreur serveur. Veuillez réessayer.';
    } finally {
      this.loading = false;
    }
  }
}
