import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SupplierService, Supplier } from '../supplier-service/supplier-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  supplierId?: number;
  isLoading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSupplierData();
    
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
        Validators.maxLength(100)
      ]],
      adresse: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      telephone: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9+\s\-()]*$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      region: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });
  }

  private loadSupplierData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      
      if (!isNaN(id)) {
        this.isEdit = true;
        this.supplierId = id;
        this.isLoading = true;
        
        // Simuler un chargement
        setTimeout(() => {
          const supplier = this.supplierService.getById(id);
          
          if (supplier) {
            this.form.patchValue(supplier);
          } else {
            // Rediriger si le fournisseur n'existe pas
            this.router.navigate(['/entities/suppliers']);
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
      const data = this.form.value as Omit<Supplier, 'id'>;

      if (this.isEdit && this.supplierId !== undefined) {
        // Mettre à jour le fournisseur
        this.supplierService.update({ ...data, id: this.supplierId });
        this.successMessage = 'Fournisseur mis à jour avec succès !';
      } else {
        // Ajouter un nouveau fournisseur
        this.supplierService.add(data);
        this.successMessage = 'Fournisseur ajouté avec succès !';
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
    this.router.navigate(['/entities/suppliers']);
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
    
    if (control.hasError('email')) {
      return 'Format d\'email invalide';
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
    if (this.isEdit && this.supplierId !== undefined) {
      const supplier = this.supplierService.getById(this.supplierId);
      if (supplier) {
        this.form.reset(supplier);
      }
    } else {
      this.form.reset({
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        region: ''
      });
    }
  }
}