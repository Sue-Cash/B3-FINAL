import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  signup(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/signup`,
      data
    ).pipe(tap(res => this.storeToken(res.token)));
  }

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/login`,
      data
    ).pipe(tap(res => this.storeToken(res.token)));
  }

  verify2FA(code: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/2fa/verify`,
      { code }
    ).pipe(tap(res => this.storeToken(res.token)));
  }

  signInWithGoogle(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(
      `${environment.apiUrl}/auth/google`
    ).pipe(tap(res => this.storeToken(res.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
