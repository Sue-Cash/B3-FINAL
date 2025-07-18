import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { RegisterComponent }  from './components/auth/register/register.component';
import { LoginComponent }     from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Guards
import { AuthGuard }   from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Registration & Login (only accessible when NOT authenticated)
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'login',    component: LoginComponent,    canActivate: [NoAuthGuard] },

  // Dashboard (requires authentication)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // Catch-all redirects to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
