// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ObjectivesListComponent } from './components/objectives/objectives-list/objectives-list.component';
import { CreateObjectiveComponent } from './components/objectives/create-objective/create-objective.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Auth routes (accessible only when NOT authenticated)
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [NoAuthGuard]
  },
  
  // Protected routes (require authentication)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'objectives', 
    component: ObjectivesListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'objectives/new', 
    component: CreateObjectiveComponent,
    canActivate: [AuthGuard]
  },
  
  // Wildcard route: any unknown URL redirects to login
  { path: '**', redirectTo: 'login' }
];