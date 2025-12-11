import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  templateUrl: './deliverer-form.html',
  styleUrl: './deliverer-form.css'
})
export class DelivererForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  delivererId?: number;
  get isAdmin(): boolean {
    return isAdmin();}


  constructor(
    private fb: FormBuilder,
    private delivererService: DelivererService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom:       ['', [Validators.required, Validators.minLength(2)]],
      prenom:    ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(10)]],
      adresse:   ['', Validators.required],
      disponible: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.delivererId = id;
        const deliverer = this.delivererService.getById(id);
        if (deliverer) {
          this.form.patchValue(deliverer);
        }
      }
    }

    if (!isAdmin()) {
      this.form.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !isAdmin()) return;

    const data = this.form.value as Omit<Deliverer, 'id'>;

    if (this.isEdit && this.delivererId !== undefined) {
      this.delivererService.update({ ...data, id: this.delivererId });
    } else {
      this.delivererService.add(data);
    }

this.goBack();  }

  
  goBack(): void {
  window.history.back();
}
}