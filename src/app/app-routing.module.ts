import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { RegisterComponent }        from './components/auth/register/register.component';
import { LoginComponent }           from './components/auth/login/login.component';
import { DashboardComponent }       from './components/dashboard/dashboard.component';

import { ListObjective }   from './components/objectives/list-objective/list-objective';
import { CreateObjectiveComponent } from './components/objectives/create-objective/create-objective.component';

import { ListTask }        from './components/tasks/list-task/list-task';
import { Points }          from './components/points/points/points';
import { Settings }        from './components/settings/settings/settings';

// Guards
import { AuthGuard }   from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { path: '',            redirectTo: 'login',    pathMatch: 'full' },
  { path: 'register',    component: RegisterComponent,   canActivate: [NoAuthGuard] },
  { path: 'login',       component: LoginComponent,      canActivate: [NoAuthGuard] },
  { path: 'dashboard',   component: DashboardComponent,  canActivate: [AuthGuard] },

  // Objectives
  { path: 'objectives',     component: ListObjective,   canActivate: [AuthGuard] },
  { path: 'objectives/new', component: CreateObjectiveComponent, canActivate: [AuthGuard] },

  // Tasks
  { path: 'tasks',          component: ListTask,        canActivate: [AuthGuard] },

  // Points
  { path: 'points',         component: Points,          canActivate: [AuthGuard] },

  // Settings
  { path: 'settings',       component: Settings,        canActivate: [AuthGuard] },

  // Fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
