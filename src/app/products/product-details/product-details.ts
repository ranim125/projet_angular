import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, Product } from '../product-service/product-service';
import { CategoryService, Category } from '../../categories/category-service/category-service';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  loading = true;
  error = false;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Charger les catégories
    this.loadCategories();
    
    // Récupérer l'ID du produit depuis l'URL
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        // Convertir l'ID de string à number
        const numericId = Number(id);
        if (!isNaN(numericId)) {
          this.loadProduct(numericId);
        } else {
          this.showError('ID de produit invalide');
          this.router.navigate(['/products']);
        }
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  loadCategories(): void {
    try {
      this.categories = this.categoryService.getAll();
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      this.categories = [];
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = false;
    
    try {
      const foundProduct = this.productService.getById(id);
      
      if (foundProduct) {
        this.product = foundProduct;
        this.loading = false;
      } else {
        this.error = true;
        this.loading = false;
        this.showError('Produit non trouvé');
        
        // Rediriger après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      this.error = true;
      this.loading = false;
      this.showError('Erreur lors du chargement du produit');
    }
  }

  getCategoryName(categoryId: number): string {
    if (!categoryId || !this.categories.length) return 'Non catégorisé';
    
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Non catégorisé';
  }

  getCategoryById(categoryId: number): Category | undefined {
    return this.categories.find(c => c.id === categoryId);
  }

  getSupplierName(): string {
    // Simulation - À remplacer par un vrai service de fournisseurs
    const suppliers = [
      'Fournisseur Principal',
      'Fournisseur Premium', 
      'Fournisseur Standard',
      'Partenaire Commercial',
      'Grossiste Régional'
    ];
    
    // Générer un nom basé sur l'ID du produit pour la cohérence
    if (this.product) {
      const index = this.product.id % suppliers.length;
      return suppliers[index];
    }
    return suppliers[0];
  }

  onEdit(): void {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  onPrint(): void {
    // Masquer temporairement les boutons d'action pour l'impression
    const actionButtons = document.querySelector('.product-actions') as HTMLElement;
    const originalDisplay = actionButtons?.style.display;
    
    if (actionButtons) {
      actionButtons.style.display = 'none';
    }
    
    // Ajouter un style d'impression
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .product-details-container, 
        .product-details-container * {
          visibility: visible;
        }
        .product-details-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          box-shadow: none !important;
          border: none !important;
        }
        .product-actions,
        .btn-print,
        .btn-edit,
        .btn-delete,
        .btn-share,
        .btn-back {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Lancer l'impression
    window.print();
    
    // Nettoyer après impression
    setTimeout(() => {
      if (actionButtons) {
        actionButtons.style.display = originalDisplay;
      }
      document.head.removeChild(style);
    }, 100);
  }

  onShare(): void {
    if (this.product) {
      const productUrl = `${window.location.origin}/products/${this.product.id}`;
      const textToCopy = `Produit: ${this.product.name}\nPrix: ${this.product.price} DT\n\n${productUrl}`;
      
      // Utiliser l'API Web Share si disponible
      if (navigator.share) {
        navigator.share({
          title: this.product.name,
          text: `Découvrez ${this.product.name} - ${this.product.price} DT`,
          url: productUrl
        })
        .then(() => {
          this.showSuccess('Produit partagé avec succès');
        })
        .catch((error: Error) => {
          console.log('Partage annulé ou erreur:', error);
          this.copyToClipboard(textToCopy);
        });
      } else {
        // Fallback: copie dans le presse-papier
        this.copyToClipboard(textToCopy);
      }
    }
  }

  private copyToClipboard(text: string): void {
    if (navigator.clipboard && window.isSecureContext) {
      // Méthode moderne
      navigator.clipboard.writeText(text)
        .then(() => {
          this.showSuccess('Lien copié dans le presse-papier');
        })
        .catch((error: Error) => {
          console.error('Erreur lors de la copie:', error);
          this.showError('Impossible de copier le lien');
        });
    } else {
      // Fallback pour HTTP ou anciens navigateurs
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        this.showSuccess('Lien copié dans le presse-papier');
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
        this.showError('Impossible de copier le lien');
      }
      
      document.body.removeChild(textArea);
    }
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  onDelete(): void {
    if (this.product) {
      const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le produit "${this.product.name}" ?`);
      
      if (confirmation) {
        try {
          this.productService.delete(this.product.id);
          this.showSuccess('Produit supprimé avec succès');
          
          // Rediriger vers la liste après un court délai
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          this.showError('Erreur lors de la suppression du produit');
        }
      }
    }
  }

  formatDate(): string {
    // Simulation de date de création
    const today = new Date();
    return today.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRandomStats() {
    // Générer des statistiques basées sur l'ID du produit pour la cohérence
    const base = this.product ? this.product.id * 123.456 : Math.random() * 100;
    
    return {
      orders: Math.floor((base % 100) * 0.8),
      sales: Math.floor((base % 500) * 1.5),
      returns: Math.floor((base % 20) * 0.3),
      satisfaction: Math.floor((base % 30) + 70) // Entre 70% et 100%
    };
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  // Méthode pour convertir un string en nombre
  private parseId(id: string | number): number {
    if (typeof id === 'number') return id;
    
    const num = Number(id);
    return isNaN(num) ? 0 : num;
  }
}