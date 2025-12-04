import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../category-service/category-service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.css']
})
export class CategoryForm implements OnInit {
  form!: FormGroup;
  isEdit: boolean = false;
  categoryId!: number;

  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.categoryId = +params['id'];
        const cat = this.service.getCategories().find(c => c.id === this.categoryId);
        if (cat) {
          this.form.patchValue({ name: cat.name });
        }
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const category: Category = {
      id: this.isEdit ? this.categoryId : Date.now(),
      name: this.form.value.name
    };

    if (this.isEdit) this.service.updateCategory(category);
    else this.service.addCategory(category);

    this.router.navigate(['/categories']);
  }
}
