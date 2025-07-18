// src/app/models/objective.model.ts
import { Task } from '../services/task.service';  

export interface Objective {
  id?: string;
  title: string;
  description?: string;
  category_id: string;
  due_date: string;

  // Rails only allows these three statuses
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  // Optional per Rails validations
  priority?: number;
  frequency?: 'UNIQUE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  total_points?: number;

  // Rails calculates this on save
  progress_percentage?: number;

  // If your API includes nested tasks
  tasks?: Task[];  
}
