import { Routes } from '@angular/router';
import { LoginComponent } from './components/login';
import { DashboardComponent } from './components/dashboard';
import { OperacionCremerComponent } from './componentes/operaciones/operacion-cremer/operacion-cremer';
import { OperacionGreenComponent } from './componentes/operaciones/operacion-green/operacion-green';
import { OperacionGreenSalidaComponent } from './componentes/operaciones/operacion-green-salida/operacion-green-salida';
import { authGuard } from './guards/auth-guard';
import { OperacionPuertoIngresoComponent } from './componentes/operaciones/operacion-puerto/operacion-puerto';
import { UsuariosComponent } from './components/usuarios/usuarios';

// --- NUEVOS IMPORTS ---
import { TransporteMenuComponent } from './componentes/transporte/transporte-menu/transporte-menu';
import { TransporteComponent } from './componentes/transporte/transporte';
import { NominaComponent } from './componentes/nomina/nomina';
// Nota: Si ya creaste el TransporteMenuComponent (el de los 2 botones), importalo también.

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // --- RUTAS DE TRANSPORTE NUEVAS ---
  {
    path: 'transporte/nomina',
    component: TransporteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transporte/asignacion',
    component: NominaComponent,
    canActivate: [authGuard]
  },
  // Si querés que al hacer clic en "Transporte" se vea el menú de 2 botones:
  // { path: 'transporte', component: TransporteMenuComponent, canActivate: [authGuard] },

  {
    path: 'operacion-cremer',
    component: OperacionCremerComponent,
    canActivate: [authGuard]
  },
  { path: 'ingreso-puerto', component: OperacionPuertoIngresoComponent },
  {
    path: 'operacion-green',
    component: OperacionGreenComponent,
    canActivate: [authGuard]
  },
  { path: 'salida-green', component: OperacionGreenSalidaComponent },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  {
    path: 'transporte',
    component: TransporteMenuComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transporte/nomina',
    component: TransporteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transporte/asignacion',
    component: NominaComponent,
    canActivate: [authGuard]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
