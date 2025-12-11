import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProfileService } from '../profile-service/profile.service';
import { CurrentUser } from '../../shared/role-utils';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // AJOUT : injection directe
import { firstValueFrom } from 'rxjs'; // AJOUT : import correct

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: CurrentUser | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditMode = false;
  isPasswordMode = false;
  successMessage = '';
  passwordError = '';
  passwordSuccess = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient // AJOUT : injection directe de HttpClient
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }]
    });

    // CORRIGÉ : validateurs passés correctement (non déprécié)
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator } // ← Bonne syntaxe
    );
  }

  // Validateur personnalisé pour confirmation mot de passe
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
      // CORRIGÉ : utilisation directe de http (injecté) + firstValueFrom importé
      const users = await firstValueFrom(this.http.get<any[]>('/assets/data/agents.json'));
      const currentUserEmail = this.user?.email;
      const foundUser = users.find(u => u.email === currentUserEmail);

      if (!foundUser || foundUser.password !== currentPassword) {
        this.passwordError = 'Mot de passe actuel incorrect.';
        return;
      }

      // Simulation de succès (en vrai projet : appel API pour update)
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
}