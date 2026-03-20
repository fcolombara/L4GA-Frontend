import { Routes } from '@angular/router';
import { LoginComponent } from './components/login';
import { DashboardComponent } from './components/dashboard';
import { authGuard } from './guards/auth-guard'; // Importalo

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // <--- Aquí activamos la protección
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
