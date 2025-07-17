import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  total_points?: number;
  level?: number;
}

export interface UserStats {
  level: number;
  points: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/api/v1/users/me`);
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${environment.apiUrl}/api/v1/users/me/stats`);
  }
}