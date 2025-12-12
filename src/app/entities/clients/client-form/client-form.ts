import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Import des modules Material nécessaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // AJOUT IMPORTANT

import { ClientService, Client } from '../client-service/client-service';
import { isAdmin } from '../../../shared/role-utils';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, // AJOUTÉ ICI
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get isAdmin(): boolean {
    return isAdmin();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nom:      ['', [Validators.required, Validators.minLength(2)]],
      prenom:   ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(10)]],
      adresse:  ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.clientId = id;
        const client = this.clientService.getById(id);
        if (client) {
          this.form.patchValue(client);
        }
      }
    }

    if (!isAdmin()) {
      this.form.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !isAdmin()) return;

    const data = this.form.value as Omit<Client, 'id'>;

    if (this.isEdit && this.clientId !== undefined) {
      this.clientService.update({ ...data, id: this.clientId });
    } else {
      this.clientService.add(data);
    }

    this.goBack();
  }

  goBack(): void {
    window.history.back();
  }
}