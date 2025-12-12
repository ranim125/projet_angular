import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProfileService } from '../profile-service/profile.service';
import { CurrentUser } from '../../shared/role-utils';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: CurrentUser | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditMode = false;
  isPasswordMode = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  successMessage = '';
  passwordError = '';
  passwordSuccess = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  };

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.user = this.profileService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        nom: this.user.nom,
        prenom: this.user.prenom,
        telephone: this.user.telephone || '',
        email: this.user.email,
        role: this.user.role === 'admin' ? 'Administrateur' : 'Agent'
      });
    }
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.isPasswordMode = false;
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.loadUser();
  }

  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedData = {
      nom: this.profileForm.get('nom')?.value.trim(),
      prenom: this.profileForm.get('prenom')?.value.trim(),
      telephone: this.profileForm.get('telephone')?.value
    };

    this.profileService.updateUser(updatedData);
    this.loadUser();
    this.isEditMode = false;
    this.successMessage = 'Profil mis à jour avec succès !';
    setTimeout(() => this.successMessage = '', 3000);
  }

  enablePasswordChange(): void {
    this.isPasswordMode = true;
    this.isEditMode = false;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.passwordForm.reset();
  }

  cancelPasswordChange(): void {
    this.isPasswordMode = false;
  }

  async changePassword(): Promise<void> {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    try {
      const users = await firstValueFrom(this.http.get<any[]>('/assets/data/agents.json'));
      const currentUserEmail = this.user?.email;
      const foundUser = users.find(u => u.email === currentUserEmail);

      if (!foundUser || foundUser.password !== currentPassword) {
        this.passwordError = 'Mot de passe actuel incorrect.';
        return;
      }

      // Simulation de succès
      this.passwordSuccess = 'Mot de passe changé avec succès !';
      this.passwordForm.reset();
      setTimeout(() => {
        this.passwordSuccess = '';
        this.isPasswordMode = false;
      }, 3000);

    } catch (error) {
      this.passwordError = 'Erreur lors du changement de mot de passe.';
    }
  }

  // Méthodes pour la force du mot de passe
  getPasswordStrength(): string {
    const password = this.passwordForm.get('newPassword')?.value;
    if (!password) return 'none';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (password.length < 8) return 'weak';
    if (score >= 3) return 'strong';
    if (score >= 2) return 'medium';
    return 'weak';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch(strength) {
      case 'weak': return 'Faible - Ajoutez des majuscules, chiffres ou caractères spéciaux';
      case 'medium': return 'Moyen - Peut être amélioré';
      case 'strong': return 'Fort - Très sécurisé';
      default: return 'Entrez un mot de passe';
    }
  }
}