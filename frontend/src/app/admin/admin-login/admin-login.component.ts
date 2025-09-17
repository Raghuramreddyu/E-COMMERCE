import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Admin Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" formControlName="username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password">
        </div>
        <button class="btn-primary" type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  `,
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.adminLogin(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('Admin login failed', err)
      });
    }
  }
}
