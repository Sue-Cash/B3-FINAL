// src/app/services/objective.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.service';
import { environment } from '../../environments/environment';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'DONE_ON_TIME' | 'DONE_EARLY' | 'DONE_LATE';
  points: number;
  priority?: number;
  due_date?: string;
  category_id?: string;
  total_points?: number;
  progress_percentage?: number;
  frequency?: string;
}

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  constructor(private http: HttpClient) {}

  getUserObjectives(): Observable<Objective[]> {
    return this.http.get<Objective[]>(`${environment.apiUrl}/api/v1/objectives`);
  }

  getObjective(id: string): Observable<Objective> {
    return this.http.get<Objective>(`${environment.apiUrl}/api/v1/objectives/${id}`);
  }

  createObjective(objective: Partial<Objective>): Observable<Objective> {
    return this.http.post<Objective>(`${environment.apiUrl}/api/v1/objectives`, objective);
  }

  updateObjective(id: string, objective: Partial<Objective>): Observable<Objective> {
    return this.http.put<Objective>(`${environment.apiUrl}/api/v1/objectives/${id}`, objective);
  }

  deleteObjective(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/v1/objectives/${id}`);
  }

  // Method to create a task for an objective
  createTask(objectiveId: string, task: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/v1/tasks`, {
      ...task,
      objective_id: objectiveId
    });
  }
}