import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Custom validator function to check if the password and confirmPassword fields match.
export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  // Return an error object if passwords don't match, otherwise return null.
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <!-- Added name and autocomplete attributes for browser autofill and accessibility -->
          <input id="email" type="email" formControlName="email" name="email" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <!-- 'new-password' tells password managers this is for creating a new account -->
          <input id="password" type="password" formControlName="password" name="password" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" formControlName="confirmPassword" name="confirmPassword" autocomplete="new-password">
        </div>

        <!-- Display error messages for invalid inputs or API failures -->
        <div *ngIf="registerForm.errors?.['passwordsMismatch'] && registerForm.get('confirmPassword')?.touched" class="error-message">
          Passwords do not match.
        </div>
        <div *ngIf="registerError" class="error-message">{{ registerError }}</div>
        <div *ngIf="registerSuccess" class="success-message">{{ registerSuccess }}</div>

        <button class="btn-primary" type="submit" [disabled]="registerForm.invalid || isLoading">
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <p class="auth-switch">Already have an account? <a routerLink="/login">Login</a></p>
      </form>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterPageComponent {
  // Create the form group with validators for each field
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatchValidator }); // Apply the custom validator to the whole form

  isLoading = false;
  registerError: string | null = null;
  registerSuccess: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerForm.invalid) { return; }
    
    this.isLoading = true;
    this.registerError = null;
    this.registerSuccess = null;

    // Destructure email and password from the form's value
    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.registerSuccess = 'Registration successful! Redirecting to login...';
        // Redirect to the login page after a short delay
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        // Display a user-friendly error message from the API response
        this.registerError = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration failed', err);
      }
    });
  }
}

