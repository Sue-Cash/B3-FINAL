// src/app/components/objectives/objectives-list/objectives-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ObjectiveService }  from '../../../services/objective.service';
import { Objective           } from '../../../models/objective.model';
import { CategoryService, Category } from '../../../services/category.service';
import { FilterPipe }        from '../../../pipes/filter.pipe';

interface ObjectiveWithDetails extends Objective {
  category?: Category;
  completedTasks?: number;
  totalTasks?: number;
  progressPercentage?: number;
  points: number;             // ← add points alias
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
  filter = 'all';

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
        this.objectiveService.getObjectives().toPromise(),
        this.categoryService.getCategories().toPromise()
      ]);

      this.categories = categories || [];
      this.objectives = (objectives || []).map((obj: Objective) => {
        const totalTasks = obj.tasks?.length || 0;
        const completedTasks = obj.tasks?.filter(t => t.status === 'DONE').length || 0;
        const progressPercentage = totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        return {
          ...obj,
          category: this.categories.find(c => c.id === obj.category_id),
          totalTasks,
          completedTasks,
          progressPercentage,
          points: obj.total_points || 0   // ← alias for template
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
      case 'active':    return this.objectives.filter(o => o.status !== 'DONE');
      case 'completed': return this.objectives.filter(o => o.status === 'DONE');
      default:          return this.objectives;
    }
  }

  viewObjective(id?: string) {
    if (id) this.router.navigate(['/objectives', id]);
  }

  editObjective(id?: string) {
    if (id) this.router.navigate(['/objectives', id, 'edit']);
  }

  async deleteObjective(id?: string) {
    if (!id || !confirm('Êtes-vous sûr ?')) return;
    try {
      await this.objectiveService.deleteObjective(id).toPromise();
      this.objectives = this.objectives.filter(o => o.id !== id);
    } catch (error) {
      console.error('Error deleting objective:', error);
    }
  }

  createNewObjective() {
    this.router.navigate(['/objectives/new']);
  }
}
