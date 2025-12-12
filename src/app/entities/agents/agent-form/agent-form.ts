import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AgentService, Agent } from '../agent-service/agent-service';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './agent-form.html',
  styleUrl: './agent-form.css'
})
export class AgentForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  agentId?: number;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.minLength(10)]],
      role: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.agentId = id;
        const agent = this.agentService.getById(id);
        if (agent) {
          this.form.patchValue(agent);
        }
      }
    }

    // Définir une valeur par défaut pour le rôle si c'est une création
    if (!this.isEdit && !this.form.get('role')?.value) {
      this.form.get('role')?.setValue('Agent');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Toucher tous les champs pour afficher les erreurs
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as Omit<Agent, 'id'>;

    if (this.isEdit && this.agentId !== undefined) {
      this.agentService.update({ ...data, id: this.agentId });
    } else {
      this.agentService.add(data);
    }

    this.goBack();
  }

  goBack(): void {
    window.history.back();
  }

  // Méthode utilitaire pour obtenir les erreurs d'un champ
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control.hasError('minlength')) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.hasError('email')) {
      return 'Format d\'email invalide';
    }
    return '';
  }
}