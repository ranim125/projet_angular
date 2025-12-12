import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DelivererService, Deliverer } from '../deliverer-service/deliverer-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-deliverer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './deliverer-form.html',
  styleUrl: './deliverer-form.css'
})
export class DelivererForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  delivererId?: number;
  isLoading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private delivererService: DelivererService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDelivererData();
    
    // Désactiver le formulaire si l'utilisateur n'est pas admin
    if (!this.isAdmin) {
      this.form.disable();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      prenom: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      telephone: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9+\s\-()]*$/)
      ]],
      adresse: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      disponible: [true]
    });
  }

  private loadDelivererData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      
      if (!isNaN(id)) {
        this.isEdit = true;
        this.delivererId = id;
        this.isLoading = true;
        
        // Simuler un chargement
        setTimeout(() => {
          const deliverer = this.delivererService.getById(id);
          
          if (deliverer) {
            this.form.patchValue(deliverer);
          } else {
            // Rediriger si le livreur n'existe pas
            this.router.navigate(['/entities/deliverers']);
          }
          
          this.isLoading = false;
        }, 300);
      }
    }
  }

  onSubmit(): void {
    // Vérifier que l'utilisateur est admin
    if (!this.isAdmin) {
      return;
    }

    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simuler un délai pour l'enregistrement
    setTimeout(() => {
      const data = this.form.value as Omit<Deliverer, 'id'>;

      if (this.isEdit && this.delivererId !== undefined) {
        // Mettre à jour le livreur
        this.delivererService.update({ ...data, id: this.delivererId });
        this.successMessage = 'Livreur mis à jour avec succès !';
      } else {
        // Ajouter un nouveau livreur
        this.delivererService.add(data);
        this.successMessage = 'Livreur ajouté avec succès !';
      }

      this.isLoading = false;

      // Afficher le message de succès temporairement
      const successTimeout = setTimeout(() => {
        this.goBack();
        clearTimeout(successTimeout);
      }, 1500);
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/entities/deliverers']);
  }

  // Méthodes utilitaires pour le template
  get isAdmin(): boolean {
    return isAdmin();
  }

  // Méthodes pour obtenir les messages d'erreur
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères`;
    }
    
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères`;
    }
    
    if (control.hasError('pattern')) {
      if (fieldName === 'telephone') {
        return 'Format de téléphone invalide';
      }
      return 'Format invalide';
    }
    
    return 'Valeur invalide';
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    if (this.isEdit && this.delivererId !== undefined) {
      const deliverer = this.delivererService.getById(this.delivererId);
      if (deliverer) {
        this.form.reset(deliverer);
      }
    } else {
      this.form.reset({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        disponible: true
      });
    }
  }
}