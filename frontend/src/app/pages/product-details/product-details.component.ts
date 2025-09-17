import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="product$ | async as product" class="product-details-container">
      <div class="product-image">
        <img [src]="product.image_url" [alt]="product.name">
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">{{ product.price | currency }}</p>
        <p class="description">{{ product.description }}</p>
        <button class="btn-primary" (click)="addToCart(product)">Add to Cart</button>
      </div>
    </div>
  `,
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsPageComponent implements OnInit {
  product$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.product$ = this.productService.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
