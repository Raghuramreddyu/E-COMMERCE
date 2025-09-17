import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// IMPROVEMENT: Define interfaces for strong typing.
export interface AuthResponse {
  token: string;
  email: string;
}

export interface UserCredentials {
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    this._isLoggedIn.next(!!token);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        this._isLoggedIn.next(true);
      })
    );
  }

  adminLogin(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        // IMPROVEMENT: REMOVED setting 'isAdmin' in localStorage. The JWT is the source of truth.
        this._isLoggedIn.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    // IMPROVEMENT: REMOVED removing 'isAdmin' from localStorage.
    this._isLoggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // IMPROVEMENT: This is now the secure way to check for admin privileges.
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      // Decode the token to read its payload
      const decodedToken: any = jwtDecode(token);
      return decodedToken.isAdmin === true;
    } catch (error) {
      console.error("Failed to decode token", error);
      return false;
    }
  }
}
