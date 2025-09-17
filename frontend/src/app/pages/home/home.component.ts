import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero">
      <h1>Your One-Stop Shop for PC Parts</h1>
      <p>Building your dream PC starts here. High-quality components for every build and budget.</p>
    </div>
    <div class="category-grid">
      <a *ngFor="let category of categories" [routerLink]="['/products/category', category.name]" class="category-card">
        <img [src]="category.imageUrl" [alt]="category.name">
        <div class="card-body">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
        </div>
      </a>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomePageComponent {
  categories = [
    { name: 'CPU', description: 'The brain of your PC.', imageUrl: '/assets/images/category-cpu.jpg' },
    { name: 'Motherboard', description: 'The central hub connecting all components.', imageUrl: '/assets/images/category-mobo.jpg' },
    { name: 'RAM', description: 'Temporary memory for fast data access.', imageUrl: '/assets/images/category-ram.jpg' },
    { name: 'Graphic Card', description: 'Renders images and video for your display.', imageUrl: '/assets/images/category-gpu.jpg' },
    { name: 'Storage', description: 'Long-term storage for your OS and files.', imageUrl: '/assets/images/category-ssd.jpg' },
    { name: 'Power Supply', description: 'Provides electricity to your entire system.', imageUrl: '/assets/images/category-psu.jpg' },
    { name: 'Cabinet', description: 'The chassis that houses all your parts.', imageUrl: '/assets/images/category-case.jpg' }
  ];
}
