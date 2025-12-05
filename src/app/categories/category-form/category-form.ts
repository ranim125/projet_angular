// src/app/categories/category-form/category-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService, Category } from '../category-service/category-service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  categoryId?: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'add') {
      this.isEdit = true;
      this.categoryId = +id;
      const cat = this.categoryService.getById(this.categoryId);
      if (cat) this.form.patchValue({ name: cat.name });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const name = this.form.value.name.trim();

    if (this.isEdit && this.categoryId) {
      this.categoryService.update({ id: this.categoryId, name });
    } else {
      this.categoryService.add(name);
    }

    this.router.navigate(['/categories']);
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}