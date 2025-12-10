import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async submit() {
    this.errorMessage = '';
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    const result = await this.authService.login(email, password);

    this.loading = false;

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    // role vient de JSON : "admin" ou "agent"
    this.router.navigate([result.role === 'admin' ? '/admin' : '/agent']);
  }
}
