import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TransporteService } from '../services/transporte';
import { NominaService } from '../services/nomina.service';
import { Nomina, NominaCreateDto } from '../models/nomina.model';
import { FormsModule } from '@angular/forms';
import { Transporte } from '../models/transporte.model';


// Librerías para PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // <-- No olvides agregar RouterLink aquí
  template: `
   
    <div *ngIf="seccionActiva === 'operaciones'" class="container mt-5">
    <div class="text-center mb-5">
        <h2 class="fw-bold" style="color: #0D2A1B;">REGISTRO DE ETAPAS</h2>
        <p class="text-muted">Seleccione la etapa correspondiente a la logística</p>
    </div>

    <div class="row g-4">
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 btn-posta"
                 routerLink="/operacion-cremer" (click)="seccionActiva = 'inicio'">
                <div class="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="bi bi-1-circle-fill display-4 mb-3" style="color: #FFC600;"></i>
                    <h5 class="fw-bold text-white text-center">SALIDA<br>CREMER</h5>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 btn-posta"
                 routerLink="/operacion-green"
                 (click)="seccionActiva = 'inicio'"
                 style="cursor: pointer;">
                <div class="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="bi bi-2-circle-fill display-4 mb-3" style="color: #FFC600;"></i>
                    <h5 class="fw-bold text-white text-center">INGRESO<br>GREEN OIL</h5>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 btn-posta"
                 (click)="irAPosta('green-out')">
                <div class="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="bi bi-3-circle-fill display-4 mb-3" style="color: #FFC600;"></i>
                    <h5 class="fw-bold text-white text-center">SALIDA<br>GREEN OIL</h5>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 btn-posta"
                 (click)="irAPosta('puerto')">
                <div class="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="bi bi-4-circle-fill display-4 mb-3" style="color: #FFC600;"></i>
                    <h5 class="fw-bold text-white text-center">INGRESO<br>PUERTO</h5>
                </div>
            </div>
        </div>
    </div> </div>


   <div *ngIf="seccionActiva === 'inicio'" class="container mt-5 animate__animated animate__fadeIn">

<div class="row mb-4 justify-content-center">

    <div class="col-lg-10">

      <div class="welcome-banner d-flex flex-column align-items-center justify-content-center text-center shadow-sm">

        <h1 class="welcome-title">¡Hola, {{ usuarioNombre }}!</h1>

        <p class="welcome-subtitle">Bienvenido al sistema de gestión logística de L4GA</p>

      </div>

    </div>

  </div>

<div class="row g-3 justify-content-center">

<div class="col-sm-6 col-md-4 col-lg-3">
  <div class="access-card d-flex align-items-start p-3 h-100"
       (click)="mostrarAlerta('Módulo de Operaciones en desarrollo para L4GA.')"
       style="cursor: pointer; background-color: #FFC600; border-radius: 8px; border: none;">
    <div class="icon-container me-3 mt-1">
      <img src="assets/Operaciones_Iconos.png" alt="Icono" style="height: 50px; width: auto;" class="animate__animated animate__fadeIn">
    </div>
    <div class="d-flex flex-column">
      <h3 class="card-title m-0 fw-bold" style="color: #0D2A1B; font-size: 1.15rem;">Operaciones</h3>
      <p class="card-text m-0 mt-1 small" style="color: #0D2A1B; line-height: 1.25;">Gestión diaria.<br>Carga de datos.</p>
    </div>
  </div>
</div>

<div class="col-sm-6 col-md-4 col-lg-3">
  <div class="access-card d-flex align-items-start p-3 h-100" routerLink="/transporte"
       style="cursor: pointer; background-color: #FFC600; border-radius: 8px; border: none;">
    <div class="icon-container me-3 mt-1">
      <img src="assets/Transporte_Icono.png" alt="Icono" style="height: 50px; width: auto;" class="animate__animated animate__bounceIn">
    </div>
    <div class="d-flex flex-column">
      <h3 class="card-title m-0 fw-bold" style="color: #0D2A1B; font-size: 1.1rem;">Transporte</h3>
      <p class="card-text m-0 mt-1 small" style="color: #0D2A1B; line-height: 1.25;">Carga de choferes, tractos y cisternas.<br>Carga de nóminas diarias.</p>
    </div>
  </div>
</div>

<div class="col-sm-6 col-md-4 col-lg-3" *ngIf="usuarioRol.toLowerCase() === 'admin'">
  <div class="access-card d-flex align-items-start p-3 h-100" routerLink="/usuarios"
       style="cursor: pointer; background-color: #FFC600; border-radius: 8px; border: none;">
    <div class="icon-container me-3 mt-1">
      <img src="assets/Users_Icono.png" alt="Icono" style="height: 50px; width: auto;" class="animate__animated animate__fadeIn">
    </div>
    <div class="d-flex flex-column">
      <h3 class="card-title m-0 fw-bold" style="color: #0D2A1B; font-size: 1.15rem;">Usuarios</h3>
      <p class="card-text m-0 mt-1 small" style="color: #0D2A1B; line-height: 1.25;">Gestión de acceso.<br>Roles de sistema.</p>
    </div>
  </div>
</div>
</div> </div>
      

     


  `,
  styles: [`
 /* Banner Superior */
.welcome-banner {
  background-color: #0D2A1B;
  color: #FFC600;
  padding: 60px 20px;
  border-radius: 0;
}
/* Banner Superior (Mantenemos la escala para el impacto) */
.welcome-title {
  font-size: 3rem; /* Bajamos un poco de 3.5 a 3 para balancear */
  font-weight: 800;
  margin-bottom: 5px;
}
.welcome-subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  color: #fff;
  letter-spacing: 1px;
}

/* Cards de Acceso - REDUCIDAS */
.access-card {
  background-color: #FFC600;
  color: #0D2A1B;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 120px; /* Bajamos de 140px a 120px */
  border-radius: 0;
  border: none;
  display: flex;
  align-items: center; /* Mantenemos el alineado horizontal si los cuadros son angostos */
}

.access-card:hover {
  transform: translateY(-5px);
  filter: brightness(0.95);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Tipografía de las Cards - ESCALADA HACIA ABAJO */
.card-title {
  font-weight: 800;
  font-size: 1.2rem; /* Bajamos de 1.6 a 1.2 */
  margin-bottom: 2px;
  text-transform: uppercase;
  line-height: 1;
}

.card-text {
  font-weight: 500;
  font-size: 0.8rem; /* Bajamos de 0.95 a 0.8 */
  line-height: 1.1;
  margin: 0;
}

/* Contenedor de íconos - MÁS COMPACTO */
.icon-container i {
  font-size: 2.2rem; /* Bajamos de 3.5 a 2.2 */
  display: flex;
  align-items: center;
}
`]
})
export class DashboardComponent implements OnInit {
  // CONFIGURACIÓN DE TIPOS EXPLÍCITA PARA EVITAR ERROR TS2367
  usuarioNombre: string = 'Usuario';
  usuarioRol: string = 'Visor';
  seccionActiva: string = 'inicio';

 

  filasTracking: number[] = [0, 1, 2, 3, 4, 5];

  constructor(
    private router: Router,
    private authService: AuthService,
    private nominaService: NominaService
  ) { }

  ngOnInit(): void {
    // Leemos del localStorage lo que seteó el login
    this.usuarioNombre = localStorage.getItem('userName') || 'Usuario';
    this.usuarioRol = localStorage.getItem('userRol') || 'Visor';
    this.seccionActiva = 'inicio';
  }

  
    logout() { localStorage.clear(); this.router.navigate(['/login']); }

  limpiarTelefono(tel: string | undefined): string {
    if (!tel) return '';
    return tel.replace(/\D/g, '');
  }
  mostrarAlerta(msg: string) {
    window.alert(msg);
  }
  irAPosta(posta: string) {
    // Limpiamos la sección activa para que se cierre el menú si es necesario
    this.seccionActiva = 'inicio';

    switch (posta) {
      case 'green-in':
        // Esta ya la tenías funcionando ✅
        this.router.navigate(['/operacion-green']);
        break;

      case 'green-out':
        // REEMPLAZAMOS EL ALERT POR LA NAVEGACIÓN:
        // Asegurate de que '/salida-green' sea el path que pusiste en app-routing
        this.router.navigate(['/salida-green']);
        break;

      case 'puerto':
        this.router.navigate(['/ingreso-puerto']);
        break;

      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  
  
  }
}
