import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  signup(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/signup`, data
    ).pipe(
      tap(res => this.storeToken(res.token))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/login`, data
    ).pipe(
      tap(res => this.storeToken(res.token))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
