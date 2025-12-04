export interface Category {
  id: number;
  name: string;
}

export class CategoryService {

  private storageKey = 'categories';

  getCategories(): Category[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addCategory(category: Category): void {
    const list = this.getCategories();
    list.push(category);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  updateCategory(category: Category): void {
    const list = this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    if (index !== -1) {
      list[index] = category;
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    }
  }

  deleteCategory(id: number): void {
    const list = this.getCategories();
    const newList = list.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(newList));
  }
}
