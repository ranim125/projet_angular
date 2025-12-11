import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../product-service/product-service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  productId?: number;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');

    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      inStock: [true],
      description: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'add') {
      const id = Number(idParam);
      const prod = this.productService.getById(id);
      if (prod) {
        this.isEdit = true;
        this.productId = id;
        this.form.patchValue(prod);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.isEdit && this.productId !== undefined) {
      this.productService.update({ ...data, id: this.productId });
    } else {
      this.productService.add(data);
    }

this.goBack();  }

  
  goBack(): void {
  window.history.back();
}
}
