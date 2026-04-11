import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService, Product } from '../product-service/product-service';
import { CategoryService, Category } from '../../categories/category-service/category-service';

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
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {

  form!: FormGroup;
  isEdit = false;
  productId?: number;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => this.categories = c);

    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      price: [0, [
        Validators.required, 
        Validators.min(0),
        Validators.max(1000000)
      ]],
      categoryId: ['', Validators.required],
      inStock: [true],
      description: ['', Validators.maxLength(500)]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'add' && idParam !== 'new') {
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;

    if (this.isEdit && this.productId !== undefined) {
      this.productService.update({ ...data, id: this.productId });
    } else {
      this.productService.add(data);
    }

    this.router.navigate(['/products']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  // Méthode utilitaire pour obtenir les messages d'erreur
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
    
    if (control.hasError('min')) {
      return 'La valeur doit être positive';
    }
    
    if (control.hasError('max')) {
      return 'La valeur est trop élevée';
    }
    
    return 'Valeur invalide';
  }
}