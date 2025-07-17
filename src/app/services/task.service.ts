import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getUserTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks`);
  }

  // vous pouvez ajouter create/update/delete ici…
}
