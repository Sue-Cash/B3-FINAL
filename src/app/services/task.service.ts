import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  points?: number;
  priority?: number;
  due_date?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  objective_id?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getUserTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/api/v1/tasks`);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${environment.apiUrl}/api/v1/tasks/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/api/v1/tasks`, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrl}/api/v1/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/v1/tasks/${id}`);
  }
}