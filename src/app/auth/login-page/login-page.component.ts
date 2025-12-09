import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    const result = this.authService.login(email!, password!);

    if (!result.success) {
      this.errorMessage = result.message ?? 'Erreur inconnue';
      return;
    }

    // Redirection selon rôle
    if (result.role === 'ADMIN') this.router.navigate(['/admin']);
    else this.router.navigate(['/agent']);
  }
}
