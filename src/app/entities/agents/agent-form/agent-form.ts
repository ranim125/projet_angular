import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AgentService, Agent } from '../agent-service/agent-service';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
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
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
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
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value as Omit<Agent, 'id'>;

    if (this.isEdit && this.agentId !== undefined) {
      this.agentService.update({ ...data, id: this.agentId });
    } else {
      this.agentService.add(data);
    }

this.goBack();  }

 
  goBack(): void {
  window.history.back();
}
}
