// src/app/services/objective.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Objective }  from '../models/objective.model';          // unified interface
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  private baseUrl = `${environment.apiUrl}/api/v1/objectives`;

  constructor(private http: HttpClient) {}

  /** Fetch all objectives */
  getObjectives(): Observable<Objective[]> {
    return this.http.get<Objective[]>(this.baseUrl);
  }

  /** Fetch a single objective by ID */
  getObjective(id: string): Observable<Objective> {
    return this.http.get<Objective>(`${this.baseUrl}/${id}`);
  }

  /** Create a new objective */
  createObjective(data: Partial<Objective>): Observable<Objective> {
    return this.http.post<Objective>(this.baseUrl, { objective: data });
  }

  /** Update an existing objective */
  updateObjective(id: string, data: Partial<Objective>): Observable<Objective> {
    return this.http.put<Objective>(`${this.baseUrl}/${id}`, { objective: data });
  }

  /** Delete an objective */
  deleteObjective(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Create a task under a given objective */
  createTask(objectiveId: string, task: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/v1/tasks`,
      { ...task, objective_id: objectiveId }
    );
  }
}
