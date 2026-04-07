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

// AGREGAR ESTA LÍNEA (Asegurate que la ruta al archivo sea la correcta)
import { OperacionHomeComponent } from './componentes/operaciones/operacion-home/operacion-home';
import { RegistroEtapas } from './componentes/operaciones/registro-etapas/registro-etapas';
import { ConsultaOperacionesComponent } from './componentes/operaciones/consulta-operaciones/consulta-operaciones';
import { SeguimientoOperacionesComponent } from './componentes/operaciones/seguimiento-operaciones/seguimiento-operaciones.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // --- RUTAS DE OPERACIONES ---
  {
    path: 'operaciones',
    component: OperacionHomeComponent, // <--- ACÁ TENÉS QUE AGREGAR "Component"
    canActivate: [authGuard]
  },
  { path: 'operaciones/registro', component: RegistroEtapas, canActivate: [authGuard] },
  
  {
    path: 'operacion-cremer',
    component: OperacionCremerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'operacion-green',
    component: OperacionGreenComponent,
    canActivate: [authGuard]
  },
  { path: 'seguimiento-operaciones', component: SeguimientoOperacionesComponent },
  {
    path: 'salida-green',
    component: OperacionGreenSalidaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ingreso-puerto',
    component: OperacionPuertoIngresoComponent,
    canActivate: [authGuard]
  },
  { path: 'consultar-operaciones', component: ConsultaOperacionesComponent },

  // --- RUTAS DE TRANSPORTE ---
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

  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
