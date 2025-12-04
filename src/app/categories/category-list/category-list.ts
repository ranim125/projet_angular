import { CategoryService, Category } from '../category-service/category-service';

export class CategoryList {

  categories: Category[] = [];
  newCategoryName: string = '';
  editedCategory: Category | null = null;

  service = new CategoryService();

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.service.getCategories();
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    const newCat: Category = { id: Date.now(), name: this.newCategoryName };
    this.service.addCategory(newCat);
    this.newCategoryName = '';
    this.loadCategories();
  }

  startEdit(category: Category) {
    this.editedCategory = { ...category };
  }

  saveEdit() {
    if (this.editedCategory) {
      this.service.updateCategory(this.editedCategory);
      this.editedCategory = null;
      this.loadCategories();
    }
  }

  deleteCategory(id: number) {
    this.service.deleteCategory(id);
    this.loadCategories();
  }
}
