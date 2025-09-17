import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <!-- THE FIX: Added name and autocomplete attributes -->
          <input id="email" type="email" formControlName="email" name="email" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <!-- THE FIX: Added name and autocomplete attributes -->
          <input id="password" type="password" formControlName="password" name="password" autocomplete="current-password">
        </div>
        
        <div *ngIf="loginError" class="error-message">
          {{ loginError }}
        </div>
        
        <button class="btn-primary" type="submit" [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p class="auth-switch">Don't have an account? <a routerLink="/register">Register</a></p>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) { return; }
    
    this.isLoading = true;
    this.loginError = null;

    this.authService.login(this.loginForm.value as UserCredentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/kits']);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = 'Invalid email or password. Please try again.';
        console.error('Login failed', err);
      }
    });
  }
}

