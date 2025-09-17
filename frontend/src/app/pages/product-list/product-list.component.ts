import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <h2>{{ pageTitle }}</h2>
      <div *ngIf="isLoading" class="loading-indicator">Loading products...</div>
      
      <div *ngIf="!isLoading && products.length === 0">
        <p>No products are available in this category.</p>
      </div>

      <div class="product-grid" *ngIf="!isLoading && products.length > 0">
        <!-- Loop through each product and display it -->
        <div class="card product-card" *ngFor="let product of products">
          <a [routerLink]="['/product', product.slug]">
            <img [src]="product.image_url" [alt]="product.name" class="product-image" onError="this.src='https://placehold.co/600x400/1E1E1E/E0E0E0?text=Image+Not+Found'">
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">{{ product.price | currency:'USD' }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-list.component.css'] 
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  pageTitle = 'All Products';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      this.isLoading = true;

      if (category) {
        this.pageTitle = category;
        this.productService.getProducts(category).subscribe(this.handleProductResponse());
      } else {
        this.pageTitle = 'All Products';
        this.productService.getProducts().subscribe(this.handleProductResponse());
      }
    });
  }

  private handleProductResponse() {
    return {
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch products', err);
        this.isLoading = false;
      }
    };
  }
}

