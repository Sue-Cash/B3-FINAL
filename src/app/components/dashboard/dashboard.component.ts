import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TaskService, Task }    from '../../services/task.service';
import { ObjectiveService     } from '../../services/objective.service';
import { Objective            } from '../../models/objective.model';
import { UserService, UserProfile, UserStats } from '../../services/user.service';
import { AuthService          } from '../../services/auth.service';

interface DashboardStats {
  tasksCompleted: number;
  totalTasks: number;
  objectivesActive: number;
  totalObjectives: number;
  currentLevel: number;
  currentPoints: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

// Include both progress and a points alias
interface ObjectiveWithProgress extends Objective {
  progress: number;
  points: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user!: UserProfile;
  stats: DashboardStats = {
    tasksCompleted: 0,
    totalTasks: 0,
    objectivesActive: 0,
    totalObjectives: 0,
    currentLevel: 1,
    currentPoints: 0,
    weeklyProgress: 0,
    monthlyProgress: 0
  };

  activeObjectives: ObjectiveWithProgress[] = [];
  loading = true;
  currentDate = new Date();

  constructor(
    private taskService: TaskService,
    private objectiveService: ObjectiveService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      await this.loadUserData();
      await this.loadDashboardData();
    } catch (err) {
      console.error('Erreur dashboard:', err);
      if (err instanceof Error && err.message.includes('401')) {
        this.router.navigate(['/login']);
      }
    } finally {
      this.loading = false;
    }
  }

  private async loadUserData() {
    const user = await this.userService.getCurrentUser().toPromise();
    if (user) {
      this.user = user;
    } else {
      throw new Error('User not found');
    }
  }

  private async loadDashboardData() {
    const [tasks, objectives, userStats] = await Promise.all([
      this.taskService.getUserTasks().toPromise(),
      this.objectiveService.getObjectives().toPromise(), // ← updated
      this.userService.getUserStats().toPromise()
    ]);

    if (tasks) {
      this.stats.totalTasks    = tasks.length;
      this.stats.tasksCompleted = tasks.filter((t: Task) => t.completed).length;
    }

    if (objectives) {
      this.stats.totalObjectives = objectives.length;
      this.stats.objectivesActive = objectives.filter((o: Objective) => o.status === 'IN_PROGRESS').length;

      this.activeObjectives = objectives
        .filter((o: Objective) => o.status === 'IN_PROGRESS')
        .slice(0, 3)
        .map((o: Objective) => ({
          ...o,
          progress: this.calculateProgress(o.tasks || []),
          points:   o.total_points || 0      // ← alias for template’s `objective.points`
        }));
    }

    if (userStats) {
      this.stats.currentLevel   = userStats.level;
      this.stats.currentPoints  = userStats.points;
      this.stats.weeklyProgress = userStats.weeklyProgress;
      this.stats.monthlyProgress = userStats.monthlyProgress;
    }
  }

  private calculateProgress(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((t: Task) => t.completed).length / tasks.length) * 100);
  }

  getProgressPercentage(type: 'weekly' | 'monthly' | 'objectives'): string {
    if (type === 'weekly')  return `${this.stats.weeklyProgress}%`;
    if (type === 'monthly') return `${this.stats.monthlyProgress}%`;
    return this.stats.totalObjectives > 0
      ? `${Math.round((this.stats.objectivesActive / this.stats.totalObjectives) * 100)}%`
      : '0%';
  }

  navigateToObjectives() { 
    this.router.navigate(['/objectives']); 
  }

  navigateToTasks() { 
    this.router.navigate(['/tasks']); 
  }

  createNewObjective() { 
    console.log('🔔 createNewObjective clicked');
    this.router.navigate(['/objectives/new']); 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
