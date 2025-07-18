// src/app/components/objectives/create-objective/create-objective.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ObjectiveService } from '../../../services/objective.service';
import { CategoryService } from '../../../services/category.service';
import { Objective } from '../../../models/objective.model';

@Component({
  selector: 'app-create-objective',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-objective.component.html',
  styleUrls: ['./create-objective.component.scss']
})
export class CreateObjectiveComponent implements OnInit {
  objectiveForm!: FormGroup;
  categories: any[] = [];
  difficulties = ['FAIBLE', 'MOYEN', 'ÉLEVÉ'];
  frequencies = ['UNIQUE', 'QUOTIDIEN', 'HEBDOMADAIRE', 'MENSUEL'];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private objectiveService: ObjectiveService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadCategories();
  }

  initForm() {
    this.objectiveForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category_id: ['', Validators.required],
      due_date: ['', Validators.required],
      difficulty: ['MOYEN', Validators.required],
      frequency: ['UNIQUE', Validators.required],
      tasks: this.fb.array([])
    });
  }

  get tasks(): FormArray<FormGroup> {
    return this.objectiveForm.get('tasks') as FormArray<FormGroup>;
  }

  addTask() {
    const taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      priority: [2, [Validators.required, Validators.min(1), Validators.max(5)]],
      points: [10, [Validators.required, Validators.min(1)]],
      due_date: ['', Validators.required]
    });
    this.tasks.push(taskForm);
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  calculateTotalPoints(): number {
    let total = 0;
    this.tasks.controls.forEach(task => {
      total += task.get('points')?.value || 0;
    });
    return total;
  }

  onSubmit() {
    if (this.objectiveForm.invalid) {
      Object.keys(this.objectiveForm.controls).forEach(key => {
        const control = this.objectiveForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.objectiveForm.value;
    const objectiveData: Partial<Objective> = {
      title:        formValue.title,
      description:  formValue.description,
      category_id:  formValue.category_id,
      due_date:     formValue.due_date,
      status:       'TODO',
      priority:     this.getDifficultyPriority(formValue.difficulty),
      frequency:    formValue.frequency,
      total_points: this.calculateTotalPoints()
    };

    this.objectiveService.createObjective(objectiveData).subscribe({
      next: (objective) => {
        // Create tasks for this objective
        if (formValue.tasks.length > 0) {
          // Non-null assertion on id
          this.createTasks(objective.id!, formValue.tasks);
        } else {
          this.router.navigate(['/objectives']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'objectif';
      }
    });
  }

  createTasks(objectiveId: string, tasks: any[]) {
    const taskPromises = tasks.map(task => {
      const taskData = {
        ...task,
        objective_id: objectiveId,
        status: 'TODO',
        frequency: 'UNIQUE'
      };
      return this.objectiveService.createTask(objectiveId, taskData).toPromise();
    });

    Promise.all(taskPromises)
      .then(() => {
        this.loading = false;
        this.router.navigate(['/objectives']);
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la création des tâches';
      });
  }

  getDifficultyPriority(difficulty: string): number {
    switch (difficulty) {
      case 'FAIBLE': return 1;
      case 'MOYEN':  return 3;
      case 'ÉLEVÉ':  return 5;
      default:       return 3;
    }
  }

  cancel() {
    this.router.navigate(['/objectives']);
  }
}
