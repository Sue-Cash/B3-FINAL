import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  user?: any;
  message?: string;
  requires2FA?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  signup(data: { 
    email: string; 
    password: string;
    username: string;
    password_confirmation: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/v1/auth/register`,
      { user: data }
    ).pipe(tap(res => {
      if (res.token) {
        this.storeToken(res.token);
      }
    }));
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/v1/auth/login`,
      data
    ).pipe(tap(res => {
      if (res.token && !res.requires2FA) {
        this.storeToken(res.token);
      }
    }));
  }

  verify2FA(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/v1/auth/2fa/verify`,
      { code }
    ).pipe(tap(res => {
      if (res.token) {
        this.storeToken(res.token);
      }
    }));
  }

  signInWithGoogle(): Observable<AuthResponse> {
    // This would typically redirect to OAuth flow
    // For now, returning a placeholder
    return this.http.get<AuthResponse>(
      `${environment.apiUrl}/api/v1/auth/google`
    ).pipe(tap(res => {
      if (res.token) {
        this.storeToken(res.token);
      }
    }));
  }

  logout(): void {
    // Optionally call backend logout endpoint
    this.http.post(`${environment.apiUrl}/api/v1/auth/logout`, {}).subscribe();
    localStorage.removeItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // You could add token expiration check here
    return !!token;
  }
}