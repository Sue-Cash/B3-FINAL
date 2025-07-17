import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TaskService }       from '../../services/task.service';
import { ObjectiveService }  from '../../services/objective.service';
import { UserService }       from '../../services/user.service';
import { AuthService }       from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
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

  activeObjectives: (Objective & { progress: number })[] = [];
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
    } finally {
      this.loading = false;
    }
  }

  private async loadUserData() {
    this.user = await this.userService.getCurrentUser().toPromise();
  }

  private async loadDashboardData() {
    const [tasks, objectives, userStats] = await Promise.all([
      this.taskService.getUserTasks().toPromise(),
      this.objectiveService.getUserObjectives().toPromise(),
      this.userService.getUserStats().toPromise()
    ]);

    this.stats.totalTasks = tasks.length;
    this.stats.tasksCompleted = tasks.filter(t => t.completed).length;
    this.stats.totalObjectives = objectives.length;
    this.stats.objectivesActive = objectives.filter(o => o.status === 'IN_PROGRESS').length;

    this.stats.currentLevel = userStats.level;
    this.stats.currentPoints = userStats.points;
    this.stats.weeklyProgress = userStats.weeklyProgress;
    this.stats.monthlyProgress = userStats.monthlyProgress;

    this.activeObjectives = objectives
      .filter(o => o.status === 'IN_PROGRESS')
      .slice(0, 3)
      .map(o => ({
        ...o,
        progress: this.calculateProgress(o.tasks)
      }));
  }

  private calculateProgress(tasks: Task[]): number {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }

  getProgressPercentage(type: 'weekly' | 'monthly' | 'objectives'): string {
    if (type === 'weekly')   return `${this.stats.weeklyProgress}%`;
    if (type === 'monthly')  return `${this.stats.monthlyProgress}%`;
    // objectives
    return this.stats.totalObjectives
      ? `${Math.round((this.stats.objectivesActive / this.stats.totalObjectives) * 100)}%`
      : '0%';
  }

  navigateToObjectives() { this.router.navigate(['/objectives']); }
  navigateToTasks()      { this.router.navigate(['/tasks']); }
  createNewObjective()   { this.router.navigate(['/objectives/new']); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
