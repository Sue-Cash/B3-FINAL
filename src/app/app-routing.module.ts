// src/app/app-routing.module.ts
import { NgModule }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }      from './components/auth/login/login.component';
import { RegisterComponent }   from './components/auth/register/register.component';
import { DashboardComponent }  from './components/dashboard/dashboard.component';
import { AuthGuard }           from './guards/auth.guard';
import { NoAuthGuard }         from './guards/no-auth.guard';

const routes: Routes = [
  { path: '',          redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',     component: LoginComponent,  canActivate: [NoAuthGuard] },
  { path: 'register',  component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // … vos autres routes
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
