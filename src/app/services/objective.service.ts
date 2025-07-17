import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.service';
import { environment } from '../../environments/environment';

export interface Objective {
  id: string;
  title: string;
  tasks: Task[];
  status: 'IN_PROGRESS' | 'DONE_ON_TIME' | 'DONE_EARLY' | 'DONE_LATE';
  points: number;
}

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  constructor(private http: HttpClient) {}

  getUserObjectives(): Observable<Objective[]> {
    return this.http.get<Objective[]>(`${environment.apiUrl}/objectives`);
  }

  // ajouter create/update/delete si besoin…
}
