// src/app/entities/suppliers/supplier-form/supplier-form.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'   
})
export class SupplierForm implements OnInit {

  
  form!: FormGroup;

  isEdit = false;
  supplierId?: number;
  get isAdmin(): boolean {
    return isAdmin();}

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

 ngOnInit(): void {
  this.form = this.fb.group({
    nom:       ['', [Validators.required, Validators.minLength(2)]],
    adresse:   ['', Validators.required],
    telephone: ['', [Validators.required, Validators.minLength(10)]],
    email:     ['', [Validators.required, Validators.email]],
    region:    ['', Validators.required]
  });

  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam && idParam !== 'add') {
    const id = Number(idParam);
    if (!isNaN(id)) {
      this.isEdit = true;
      this.supplierId = id;
      const supplier = this.supplierService.getById(id);
      if (supplier) {
        this.form.patchValue(supplier);
      }
    }
  }

  // On désactive APRÈS avoir rempli les données
  if (!isAdmin()) {
    this.form.disable();
  }
}

  onSubmit(): void {
    if (this.form.invalid || !isAdmin()) return;

    const data = this.form.value as Omit<Supplier, 'id'>;

    if (this.isEdit && this.supplierId !== undefined) {
  this.supplierService.update({ ...data, id: this.supplierId });
} else {
  this.supplierService.add(data);
}

    this.router.navigate(['/entities/suppliers']);
  }

  cancel(): void {
    this.router.navigate(['/entities/suppliers']);
  }
}