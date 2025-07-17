import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from './task.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
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
    return this.http.get<UserProfile>(`${environment.apiUrl}/me`);
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${environment.apiUrl}/me/stats`);
  }
}
