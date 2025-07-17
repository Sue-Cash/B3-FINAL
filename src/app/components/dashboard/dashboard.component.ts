// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ObjectiveService } from '../../services/objective.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

interface Objective {
  id: string;
  title: string;
  tasks: Task[];
  progress: number;
  status: 'IN_PROGRESS' | 'DONE_ON_TIME' | 'DONE_EARLY' | 'DONE_LATE';
  points: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
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
  
  activeObjectives: Objective[] = [];
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
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadUserData() {
    this.user = await this.userService.getCurrentUser();
  }

  async loadDashboardData() {
    // Charger les statistiques
    const [tasks, objectives, userStats] = await Promise.all([
      this.taskService.getUserTasks(),
      this.objectiveService.getUserObjectives(),
      this.userService.getUserStats()
    ]);

    // Calculer les statistiques
    this.stats.totalTasks = tasks.length;
    this.stats.tasksCompleted = tasks.filter(t => t.completed).length;
    this.stats.totalObjectives = objectives.length;
    this.stats.objectivesActive = objectives.filter(o => o.status === 'IN_PROGRESS').length;
    
    this.stats.currentLevel = userStats.level;
    this.stats.currentPoints = userStats.points;
    this.stats.weeklyProgress = userStats.weeklyProgress;
    this.stats.monthlyProgress = userStats.monthlyProgress;

    // Charger les objectifs actifs
    this.activeObjectives = objectives
      .filter(o => o.status === 'IN_PROGRESS')
      .slice(0, 3)
      .map(o => ({
        ...o,
        progress: this.calculateProgress(o.tasks)
      }));
  }

  calculateProgress(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }

  getProgressPercentage(type: 'weekly' | 'monthly' | 'objectives'): string {
    switch (type) {
      case 'weekly':
        return `${this.stats.weeklyProgress}%`;
      case 'monthly':
        return `${this.stats.monthlyProgress}%`;
      case 'objectives':
        return this.stats.totalObjectives > 0 
          ? `${Math.round((this.stats.objectivesActive / this.stats.totalObjectives) * 100)}%`
          : '0%';
      default:
        return '0%';
    }
  }

  navigateToObjectives() {
    this.router.navigate(['/objectives']);
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  createNewObjective() {
    this.router.navigate(['/objectives/new']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}