// src/app/components/objectives/objectives-list/objectives-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ObjectiveService, Objective } from '../../../services/objective.service';
import { CategoryService, Category } from '../../../services/category.service';
import { FilterPipe } from '../../../pipes/filter.pipe';

interface ObjectiveWithDetails extends Objective {
  category?: Category;
  completedTasks?: number;
  totalTasks?: number;
  progressPercentage?: number;
}

@Component({
  selector: 'app-objectives-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FilterPipe],
  templateUrl: './objectives-list.component.html',
  styleUrls: ['./objectives-list.component.scss']
})
export class ObjectivesListComponent implements OnInit {
  objectives: ObjectiveWithDetails[] = [];
  categories: Category[] = [];
  loading = true;
  filter = 'all'; // all, active, completed

  constructor(
    private objectiveService: ObjectiveService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const [objectives, categories] = await Promise.all([
        this.objectiveService.getUserObjectives().toPromise(),
        this.categoryService.getCategories().toPromise()
      ]);

      this.categories = categories || [];
      this.objectives = (objectives || []).map(obj => {
        const category = this.categories.find(c => c.id === obj.category_id);
        const totalTasks = obj.tasks?.length || 0;
        const completedTasks = obj.tasks?.filter(t => t.status === 'DONE').length || 0;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...obj,
          category,
          totalTasks,
          completedTasks,
          progressPercentage
        };
      });
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      this.loading = false;
    }
  }

  get filteredObjectives() {
    switch (this.filter) {
      case 'active':
        return this.objectives.filter(o => o.status !== 'DONE');
      case 'completed':
        return this.objectives.filter(o => o.status === 'DONE');
      default:
        return this.objectives;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-progress';
      case 'DONE': return 'status-done';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'TODO': return 'À FAIRE';
      case 'IN_PROGRESS': return 'EN COURS';
      case 'DONE': return 'TERMINÉ';
      default: return status;
    }
  }

  viewObjective(id: string) {
    this.router.navigate(['/objectives', id]);
  }

  editObjective(id: string) {
    this.router.navigate(['/objectives', id, 'edit']);
  }

  async deleteObjective(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await this.objectiveService.deleteObjective(id).toPromise();
        this.objectives = this.objectives.filter(o => o.id !== id);
      } catch (error) {
        console.error('Error deleting objective:', error);
      }
    }
  }

  createNewObjective() {
    this.router.navigate(['/objectives/new']);
  }
}