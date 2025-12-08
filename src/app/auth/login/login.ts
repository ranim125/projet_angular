import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.spec';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  errorMsg = '';
  blocked = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.blocked = this.auth.isBlocked();
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    const result = this.auth.login(email!, password!);

    if (result.success) {
      const role = result.role;
      this.router.navigate([role.toLowerCase(), 'dashboard']);
    } else {
      this.errorMsg = result.message;
      this.blocked = this.auth.isBlocked();
    }
  }
}
