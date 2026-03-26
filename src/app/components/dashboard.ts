import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-custom shadow fixed-top">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" style="color: #FFC600;" (click)="seccionActiva = 'inicio'" role="button">
          L4GA System
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" style="filter: invert(1) sepia(100%) saturate(1000%) hue-rotate(10deg);"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" [class.active]="seccionActiva === 'inicio'" (click)="seccionActiva = 'inicio'" role="button">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" [class.active]="seccionActiva === 'nominas'" (click)="seccionActiva = 'nominas'" role="button">Nóminas</a>
            </li>
            <li class="nav-item">
              <a *ngIf="usuarioRol.toLowerCase() === 'admin' || usuarioRol.toLowerCase() === 'operario'"
                 class="nav-link" [class.active]="seccionActiva === 'transporte'"
                 (click)="seccionActiva = 'transporte'" role="button">Transporte</a>
            </li>
            <li class="nav-item" *ngIf="usuarioRol.toLowerCase() === 'admin'">
              <a class="nav-link" [class.active]="seccionActiva === 'usuarios'"
                 (click)="seccionActiva = 'usuarios'" role="button">Usuarios</a>
            </li>
          </ul>

          <div class="d-flex align-items-center flex-wrap mt-3 mt-lg-0 border-top border-lg-0 pt-2 pt-lg-0">
            <span class="text-white me-3 mb-2 mb-lg-0 small fw-bold">
              <i class="bi bi-person-circle" style="color: #FFC600;"></i> {{ usuarioNombre }}
              <span class="badge ms-1" style="background-color: #FFC600; color: #0D2A1B;">{{ usuarioRol }}</span>
            </span>
            <button class="btn btn-sm fw-bold shadow-sm"
                    style="background-color: #FFC600; color: #0D2A1B; border: none;"
                    (click)="logout()">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-5 pt-5 pb-5">
      <div *ngIf="seccionActiva === 'inicio'" class="animate__animated animate__fadeIn">
        <div class="jumbotron bg-white p-5 rounded shadow-sm border text-center">
          <h1 class="display-4 text-primary fw-bold">Bienvenido al sistema de gestión logística de L4GA.</h1>
          <p class="lead text-muted">¡Hola, {{ usuarioNombre }}!</p>
          <hr class="my-4">
          <div class="row g-4 justify-content-center">
            <div class="col-md-3" (click)="seccionActiva = 'nominas'" style="cursor: pointer">
              <div class="card border-0 shadow-sm bg-dark text-white p-4 h-100 btn-hover">
                <i class="bi bi-file-earmark-text fs-1 mb-2"></i>
                <h5>Nóminas</h5>
              </div>
            </div>
            <div *ngIf="usuarioRol.toLowerCase() === 'admin' || usuarioRol.toLowerCase() === 'operario'" 
                 class="col-md-3" (click)="seccionActiva = 'transporte'" style="cursor: pointer">
              <div class="card border-0 shadow-sm bg-info text-white p-4 h-100 btn-hover">
                <i class="bi bi-truck fs-1 mb-2"></i>
                <h5>Transporte</h5>
              </div>
            </div>
            <div class="col-md-3" *ngIf="usuarioRol.toLowerCase() === 'admin'" (click)="seccionActiva = 'usuarios'" style="cursor: pointer">
              <div class="card border-0 shadow-sm bg-danger text-white p-4 h-100 btn-hover">
                <i class="bi bi-people fs-1 mb-2"></i>
                <h5>Usuarios</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="seccionActiva === 'nominas'" class="animate__animated animate__fadeIn">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="fw-bold mb-0 text-dark"><i class="bi bi-file-earmark-text"></i> Nóminas</h3>
    <div class="btn-group shadow-sm">
      <button class="btn btn-danger" (click)="exportarNominasPDF()"><i class="bi bi-file-pdf"></i> PDF</button>
      <button *ngIf="usuarioRol.toLowerCase() === 'admin' || usuarioRol.toLowerCase() === 'operario'"
              type="button" class="btn btn-action-custom" (click)="mostrarFormNomina = !mostrarFormNomina">
        {{ mostrarFormNomina ? '✖ Cancelar' : '➕ Nueva' }}
      </button>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-4 bg-light">
  <div class="card-body">
    <div class="row g-3 align-items-end">
      <div class="col-md-3">
        <label class="small fw-bold text-muted">Desde:</label>
        <input type="date" class="form-control form-control-sm" [(ngModel)]="fechaInicio">
      </div>
      <div class="col-md-3">
        <label class="small fw-bold text-muted">Hasta:</label>
        <input type="date" class="form-control form-control-sm" [(ngModel)]="fechaFin">
      </div>
      <div class="col-md-3">
        <button class="btn btn-sm btn-primary-custom w-100" (click)="aplicarFiltro()"> Buscar </button>
      </div>
      <div class="col-md-3">
        <button class="btn btn-sm btn-outline-secondary w-100" (click)="limpiarFiltros()">
          <i class="bi bi-arrow-counterclockwise"></i> Limpiar
        </button>
      </div>
    </div>
  </div>
</div>

  <div *ngIf="mostrarFormNomina" class="card border-dark mb-4 shadow-sm animate__animated animate__fadeIn">
    <div class="card-body bg-light">
      <h5 class="fw-bold text-dark mb-3"><i class="bi bi-plus-circle"></i> Registrar Nueva Nómina</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="small fw-bold">Fecha de Actividad:</label>
          <input type="date" class="form-control" [(ngModel)]="nuevaNomina.fechaActividad">
          <div class="mt-3">
            <label class="small fw-bold text-dark">Link de Tracking (Opcional):</label>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-geo-alt-fill" style="color: #0D2A1B;"></i></span>
              <input type="text" class="form-control" [(ngModel)]="nuevaNomina.linkTracking" placeholder="Pegar URL...">
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <label class="small fw-bold mb-2">Seleccionar Unidades:</label>
          <div class="border rounded p-3 bg-white shadow-sm" style="max-height: 230px; overflow-y: auto;">
            <div *ngFor="let t of listaTransportes" class="form-check mb-2">
              <input class="form-check-input" type="checkbox" [id]="'check-' + t.id"
                     [checked]="nuevaNomina.transporteIds.includes(t.id!)"
                     (change)="toggleTransporte(t.id!)">
              <label class="form-check-label small" [for]="'check-' + t.id">
                <span class="fw-bold text-dark">{{ t.chofer }}</span> | {{ t.tracto }}
              </label>
            </div>
          </div>
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-dark fw-bold" (click)="guardarNomina()"
                  [disabled]="!nuevaNomina.fechaActividad || nuevaNomina.transporteIds.length === 0">
            Guardar Nómina
          </button>
        </div>
      </div>
    </div>
  </div>
        <div class="card shadow-sm border-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
  <thead class="thead-custom">
    <tr>
      <th>ID</th>
      <th>Carga</th>
      <th>Actividad</th>
      <th>Unidades</th>
      <th>Tracking</th>
      <th class="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let n of listaNominas">
      <td class="fw-bold">#{{ n.id }}</td>
      <td class="small text-muted">{{ n.fechaCarga | date:'dd/MM/yyyy HH:mm' }}</td>
      <td class="fw-bold" style="color: #0D2A1B;">{{ n.fechaActividad | date:'dd/MM/yyyy' }}</td>
      <td>
        <span class="badge bg-light text-dark border">
          {{ n.transportes?.length || 0 }} Unidades
        </span>
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <div *ngFor="let t of n.transportes; let i = index" class="d-flex align-items-center gap-1">
            <div class="input-group input-group-sm" style="max-width: 250px;">
              <span class="input-group-text bg-white p-1" style="font-size: 0.65rem; min-width: 25px;" [title]="t.chofer">
                {{ i + 1 }}°
              </span>
              <input type="text"
                     [ngModel]="getLinkEspecifico(n.linkTracking, i)"
                     (ngModelChange)="actualizarLinkEnPosicion(n, i, $event)"
                     class="form-control form-control-sm border-0 bg-light"
                     [placeholder]="'Link para ' + t.chofer"
                     style="font-size: 0.7rem; height: 24px;">
            </div>

            <button *ngIf="getLinkEspecifico(n.linkTracking, i)"
                    class="btn btn-sm btn-warning"
                    style="font-size: 0.6rem; padding: 1px 4px;"
                    (click)="abrirLink(getLinkEspecifico(n.linkTracking, i))">
              <i class="bi bi-truck">Link</i>
            </button>
          </div>

          <span *ngIf="!n.transportes || n.transportes.length === 0" class="text-muted small italic">
            Sin unidades
          </span>
        </div>
      </td>
      <td class="text-center">
        <button class="btn btn-sm btn-primary-custom" (click)="verDetalleNomina(n)"
                data-bs-toggle="modal" data-bs-target="#detalleNominaModal">Ver</button>
      </td>
    </tr>
  </tbody>
</table>
          </div>
        </div>
      </div>

      <div *ngIf="seccionActiva === 'transporte'" class="animate__animated animate__fadeIn">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="fw-bold mb-0 text-dark"><i class="bi bi-truck"></i> Unidades de Transporte</h3>
    <button class="btn btn-action-custom" (click)="mostrarFormTransporte = !mostrarFormTransporte">
      {{ mostrarFormTransporte ? '✖ Cancelar' : '➕ Nuevo Transporte' }}
    </button>
  </div>

  <div *ngIf="mostrarFormTransporte" class="card border-info mb-4 shadow-sm animate__animated animate__slideInDown">
  <div class="card-header bg-info text-white d-flex justify-content-between align-items-center py-2">
    <h6 class="mb-0 fw-bold">
      <i class="bi" [ngClass]="editandoTransporte ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
      {{ editandoTransporte ? ' Actualizar Unidad' : ' Registrar Nuevo Transporte' }}
    </h6>
    <button class="btn-close btn-close-white" (click)="cancelarEdicion()" aria-label="Close"></button>
  </div>

  <div class="card-body bg-light">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="small fw-bold text-dark">Chofer</label>
        <input type="text" class="form-control mb-2" [(ngModel)]="nuevoTransporte.chofer" placeholder="Nombre completo">

        <label class="small fw-bold text-success"><i class="bi bi-whatsapp"></i> Contacto (Tel/WhatsApp)</label>
        <input type="text" class="form-control" [(ngModel)]="nuevoTransporte.contacto" placeholder="Ej: +54 9 342...">
      </div>

      <div class="col-md-4">
        <label class="small fw-bold">Tracto (Patente)</label>
        <div class="input-group">
          <input type="text" class="form-control" [(ngModel)]="nuevoTransporte.tracto" placeholder="Patente">
          <input type="text" class="form-control" style="width: 80px;" [(ngModel)]="nuevoTransporte.anioTracto" placeholder="Año">
        </div>
      </div>

      <div class="col-md-4">
        <label class="small fw-bold">Cisterna (Patente)</label>
        <div class="input-group">
          <input type="text" class="form-control" [(ngModel)]="nuevoTransporte.cisterna" placeholder="Patente">
          <input type="text" class="form-control" style="width: 80px;" [(ngModel)]="nuevoTransporte.anioCisterna" placeholder="Año">
        </div>
      </div>

      <div class="col-12 text-end mt-3 border-top pt-3">
        <button class="btn btn-secondary btn-sm me-2 px-3" (click)="cancelarEdicion()" *ngIf="editandoTransporte">
          Cancelar
        </button>
        <button class="btn btn-primary-custom px-4" (click)="guardarTransporte()"
                [disabled]="!nuevoTransporte.chofer || !nuevoTransporte.tracto">
          <i class="bi" [ngClass]="editandoTransporte ? 'bi-arrow-clockwise' : 'bi-save'"></i>
          {{ editandoTransporte ? ' Actualizar Cambios' : ' Guardar Unidad' }}
        </button>
      </div>
    </div>
  </div>
</div>

  <div class="card shadow-sm border-0">
    <div class="table-responsive">
     <table class="table table-hover align-middle mb-0">
  <thead class="thead-custom">
    <tr>
      <th class="ps-4">Chofer / Contacto</th>
      <th>Tracto / Año</th>
      <th>Cisterna / Año</th>
      <th class="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let t of listaTransportes">
      <td class="ps-4">
        <div class="fw-bold">{{ t.chofer }}</div>

        <div *ngIf="t.contacto" class="d-flex align-items-center gap-2 mt-1">
          <small class="text-success fw-bold">{{ t.contacto }}</small>

          <div class="d-flex gap-1">
            <a [href]="'tel:' + t.contacto" class="text-primary" title="Llamar">
              <i class="bi bi-telephone" style="font-size: 0.8rem;"></i>
            </a>
            <a [href]="'https://wa.me/' + limpiarTelefono(t.contacto)" target="_blank" class="text-success" title="WhatsApp">
              <i class="bi bi-whatsapp" style="font-size: 0.8rem;"></i>
            </a>
          </div>
        </div>

        <small *ngIf="!t.contacto" class="text-muted fst-italic" style="font-size: 0.7rem;">Sin tel.</small>
      </td>

      <td>
        <span class="badge bg-secondary me-2">{{ t.tracto }}</span>
        <small class="text-muted" *ngIf="t.anioTracto">Mod. {{ t.anioTracto }}</small>
      </td>

      <td>
        <span class="badge bg-secondary me-2">{{ t.cisterna }}</span>
        <small class="text-muted" *ngIf="t.anioCisterna">Mod. {{ t.anioCisterna }}</small>
      </td>

      <td class="text-center">
  <div class="d-flex justify-content-center gap-2">

    <button class="btn btn-sm btn-primary btn-hover shadow-sm"
            (click)="prepararEdicion(t)"
            title="Editar">
      <i class="bi bi-pencil-square">editar</i>
    </button>

    <button class="btn btn-sm btn-danger btn-hover shadow-sm"
            (click)="eliminarTransporte(t.id!)"
            title="Eliminar">
      <i class="bi bi-trash">eliminar</i>
    </button>

  </div>
</td>
    </tr>
  </tbody>
</table>
    </div>
  </div>
</div>

      <div *ngIf="seccionActiva === 'usuarios' && usuarioRol.toLowerCase() === 'admin'" class="animate__animated animate__fadeIn">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h3 class="fw-bold mb-0 text-dark"><i class="bi bi-people"></i> Usuarios</h3>
          <button class="btn btn-action-custom" (click)="mostrarFormUsuario = !mostrarFormUsuario">
            {{ mostrarFormUsuario ? '✖ Cancelar' : '➕ Nuevo' }}
          </button>
        </div>

       <div *ngIf="mostrarFormUsuario" class="card border-danger mb-4 shadow-sm">
  <div class="card-body bg-light">
    <div class="row g-3">
      <div class="col-md-3">
        <label class="small fw-bold">Nombre</label>
        <input type="text" class="form-control" [(ngModel)]="nuevoUsuario.Nombre">
      </div>
      <div class="col-md-3">
        <label class="small fw-bold">Email</label>
        <input type="email" class="form-control" [(ngModel)]="nuevoUsuario.Email">
      </div>
      <div class="col-md-3">
        <label class="small fw-bold">Contraseña</label>
        <input type="password" class="form-control" [(ngModel)]="nuevoUsuario.PasswordHash">
      </div>
      <div class="col-md-3">
        <label class="small fw-bold">Rol</label>
        <select class="form-select" [(ngModel)]="nuevoUsuario.Rol">
          <option value="Admin">Admin</option>
          <option value="Visor">Visor</option>
          <option value="Operario">Operario</option>
        </select>
      </div>
      <div class="col-12 text-end">
        <hr>
        <button class="btn btn-danger px-4" (click)="registrarUsuario()"
                [disabled]="!nuevoUsuario.Nombre || !nuevoUsuario.Email || !nuevoUsuario.PasswordHash">
          Guardar Usuario
        </button>
      </div>
    </div>
  </div>
</div>

    <div class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="thead-custom">
            <tr>
              <th class="ps-3">Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of listaUsuarios">
              <td class="ps-3">{{ u.nombre }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-danger': u.rol === 'Admin',
                  'bg-info text-dark': u.rol === 'Operario',
                  'bg-secondary': u.rol === 'Visor',
                  'bg-dark': u.rol === 'Baja'
                }">{{ u.rol }}</span>
              </td>
              <td class="text-center">
                <button class="btn btn-outline-danger btn-sm border-0" (click)="eliminarUsuario(u.id)">
                  <i class="bi bi-trash">Eliminar</i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="detalleNominaModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg shadow">
    <div class="modal-content" *ngIf="nominaSeleccionada">
      <div class="modal-header bg-dark text-white border-0">
        <h5 class="modal-title fw-bold"><i class="bi bi-file-earmark-text text-warning"></i> Detalle Nómina #{{ nominaSeleccionada.id }}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body p-4">
        <div class="mb-3">
          <p class="mb-1 text-muted small text-uppercase fw-bold">Fecha de Actividad</p>
          <h5 class="text-dark fw-bold">{{ nominaSeleccionada.fechaActividad | date:'fullDate' }}</h5>
        </div>
        <div class="table-responsive rounded border">
          <table class="table table-sm table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3">Chofer</th>
                <th>Tracto / Patente</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tr of nominaSeleccionada.transportes">
                <td class="ps-3 fw-bold">{{ tr.chofer }}</td>
                <td><span class="badge bg-secondary">{{ tr.tracto }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer border-0">
        <button class="btn btn-light fw-bold" data-bs-dismiss="modal">Cerrar</button>
        <button class="btn btn-danger fw-bold" (click)="exportarDetalleNominaPDF()">
          <i class="bi bi-file-pdf"></i> Descargar PDF
        </button>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
  .btn-hover {
    transition: all 0.2s ease-in-out; /* Suaviza el regreso a la posición original */
    opacity: 1 !important;           /* Fuerza la visibilidad total siempre */
  }
  
  .btn-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Le da profundidad al "saltar" */
    filter: brightness(1.1);               /* Lo aclara un poquito al tocarlo */
  }
`]
})
export class DashboardComponent implements OnInit {
  // CONFIGURACIÓN DE TIPOS EXPLÍCITA PARA EVITAR ERROR TS2367
  usuarioNombre: string = 'Usuario';
  usuarioRol: string = 'Visor';
  seccionActiva: string = 'inicio';
  editandoTransporte: boolean = false;

  listaNominas: Nomina[] = [];
  listaNominasFiltrada: Nomina[] = [];
  fechaFiltroCarga: string = '';
  fechaFiltroActividad: string = '';
  nominaSeleccionada: Nomina | null = null;
  mostrarFormNomina: boolean = false;
  nuevaNomina: NominaCreateDto = {
    fechaActividad: '',
    transporteIds: [] as number[],
    linkTracking: ''
  };

  listaTransportes: Transporte[] = [];
  mostrarFormTransporte: boolean = false;
  nuevoTransporte: Transporte = { chofer: '', tracto: '', cisterna: '', anioTracto: '', anioCisterna: '', contacto: '' } as Transporte;

  listaUsuarios: any[] = [];
  mostrarFormUsuario: boolean = false;
  nuevoUsuario: any = {
    Nombre: '',
    Email: '',
    PasswordHash: '',
    Rol: 'Visor'
  };

  filasTracking: number[] = [0, 1, 2, 3, 4, 5];

  constructor(
    private router: Router,
    private authService: AuthService,
    private transporteService: TransporteService,
    private nominaService: NominaService
  ) { }

  ngOnInit(): void {
    this.usuarioNombre = localStorage.getItem('userName') || 'Usuario';
    this.usuarioRol = localStorage.getItem('userRol') || 'Visor';

    // Pequeño delay para asegurar que el DOM y los servicios estén listos
    setTimeout(() => {
      this.cargarNominas();
      this.cargarTransportes();
      if (this.usuarioRol.toLowerCase() === 'admin') {
        this.cargarUsuarios();
      }
      this.seccionActiva = 'nominas';
    }, 100);
  }

  // MÉTODOS DE USUARIOS
  cargarUsuarios() { this.authService.getUsuarios().subscribe(d => this.listaUsuarios = d); }
  registrarUsuario() {
    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado con éxito');
        this.cargarUsuarios();
        this.mostrarFormUsuario = false;
        // Reseteo con Mayúsculas
        this.nuevoUsuario = {
          Nombre: '',
          Email: '',
          PasswordHash: '',
          Rol: 'Visor'
        };
      },
      error: (e) => {
        console.error("Error completo de la API:", e);
        alert("Error al registrar. Revisar consola.");
      }
    });
  }
  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar?')) this.authService.eliminarUsuario(id).subscribe(() => this.cargarUsuarios());
  }

  // MÉTODOS DE NÓMINAS
  cargarNominas() {
    this.nominaService.getNominas().subscribe(d => {
      this.listaNominas = d;
      this.listaNominasFiltrada = d;
    });
  }
  guardarNomina() {
    this.nominaService.crearNomina(this.nuevaNomina).subscribe({
      next: () => {
        alert('Nómina guardada');
        this.cargarNominas();
        this.mostrarFormNomina = false;
        this.nuevaNomina = { fechaActividad: '', transporteIds: [], linkTracking: '' };
      }
    });
  }
  toggleTransporte(id: number) {
    const idx = this.nuevaNomina.transporteIds.indexOf(id);
    idx > -1 ? this.nuevaNomina.transporteIds.splice(idx, 1) : this.nuevaNomina.transporteIds.push(id);
  }
  verDetalleNomina(n: Nomina) { this.nominaSeleccionada = n; }


  // TRACKING MÚLTIPLE
  getLinkEspecifico(links: any, i: number): string {
    if (!links || typeof links !== 'string') return '';
    return links.split(',')[i] || '';
  }
  actualizarLinkEnPosicion(n: Nomina, i: number, val: string) {
    let arr = (n.linkTracking || '').split(',');

    // Aseguramos que el array tenga espacio para todos los transportes actuales
    const totalTransportes = n.transportes?.length || 0;
    while (arr.length < totalTransportes) arr.push('');

    arr[i] = val.trim();
    n.linkTracking = arr.join(',');
    this.nominaService.actualizarTracking(n.id!, n.linkTracking).subscribe();
  }
  abrirLink(url: string) {
    if (!url) return;
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  }

  fechaInicio: string = '';
  fechaFin: string = '';

  aplicarFiltro() {
    console.log('¡Botón presionado!');
    console.log('Fecha Inicio:', this.fechaInicio);
    console.log('Fecha Fin:', this.fechaFin);

    this.nominaService.getNominasFiltradas(this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.listaNominas = data;
        },
        error: (e) => console.error('Error en la llamada:', e)
      });
  }

  // AGREGADO PARA EVITAR EL ERROR DE COMPILACIÓN TS2339
  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.aplicarFiltro(); // Recarga la lista completa al limpiar los inputs
  }

  // TRANSPORTES
  cargarTransportes() { this.transporteService.getTransportes().subscribe(d => this.listaTransportes = d); }
  guardarTransporte() {
    if (this.editandoTransporte && this.nuevoTransporte.id) {
      // --- LÓGICA DE ACTUALIZACIÓN (PUT) ---
      this.transporteService.actualizarTransporte(this.nuevoTransporte.id, this.nuevoTransporte).subscribe(() => {
        this.finalizarGuardado();
      });
    } else {
      // --- LÓGICA DE CREACIÓN (POST) ---
      this.transporteService.registrarTransporte(this.nuevoTransporte).subscribe(() => {
        this.finalizarGuardado();
      });
    }
  }

  // Función auxiliar para no repetir código de limpieza
  finalizarGuardado() {
    this.cargarTransportes();
    this.mostrarFormTransporte = false;
    this.editandoTransporte = false;
    this.nuevoTransporte = {
      chofer: '',
      tracto: '',
      cisterna: '',
      anioTracto: '',
      anioCisterna: '',
      contacto: ''
    } as Transporte;
  }
  // Función para cargar los datos en el formulario
  prepararEdicion(t: Transporte) {
    this.editandoTransporte = true;
    this.mostrarFormTransporte = true;
    // Usamos {...t} para crear una copia y que no se modifique la tabla 
    // mientras el usuario escribe en el formulario.
    this.nuevoTransporte = { ...t };
  }

  // Modificá tu función cancelar para limpiar el estado
  cancelarEdicion() {
    this.mostrarFormTransporte = false;
    this.editandoTransporte = false;
    this.nuevoTransporte = { chofer: '', tracto: '', cisterna: '' } as Transporte;
  }
 
  eliminarTransporte(id: number) {
    if (confirm('¿Eliminar unidad?')) this.transporteService.eliminarTransporte(id).subscribe(() => this.cargarTransportes());
  }

  // 1. Exportar la lista COMPLETA de nóminas (la tabla principal)
  // Exportar la lista completa de nóminas
  exportarNominasPDF() {
    const doc = new jsPDF();

    // Título y encabezado
    doc.setFontSize(18);
    doc.text('Reporte General de Nóminas con Detalle', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, 14, 28);

    // Mapeo de datos: Transformamos la lista de transportes en un texto legible
    const cuerpoTabla = this.listaNominas.map(n => {
      // Concatenamos los transportes: "Chofer (Patente)" uno debajo del otro
      const detalleTransportes = n.transportes && n.transportes.length > 0
        ? n.transportes.map(t => `- ${t.chofer} (${t.tracto})`).join('\n')
        : 'Sin unidades';

      return [
        n.id,
        n.fechaActividad ? new Date(n.fechaActividad).toLocaleDateString('es-AR') : 'N/A',
        detalleTransportes, // Esta es la nueva columna detallada
        n.linkTracking || 'Sin link'
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Fecha', 'Transportes Detallados', 'Link de Tracking']],
      body: cuerpoTabla,
      theme: 'grid',
      headStyles: {
        fillColor: [33, 37, 41],
        halign: 'center',
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        overflow: 'linebreak', // Clave para que el detalle de transportes no se amontone
        cellPadding: 3,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 70 }, // Espacio generoso para ver bien los choferes y patentes
        3: { cellWidth: 'auto' }
      }
    });

    doc.save(`Reporte_Nominas_Detallado_${new Date().getTime()}.pdf`);
  }

  // Exportar el detalle de la nómina seleccionada
  exportarDetalleNominaPDF() {
    if (!this.nominaSeleccionada) return;

    const doc = new jsPDF();
    const n = this.nominaSeleccionada;

    // Encabezado con estética de la marca
    doc.setFillColor(220, 53, 69); // Rojo
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(`DETALLE DE NÓMINA #${n.id}`, 14, 20);

    // Info básica
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const fecha = n.fechaActividad ? new Date(n.fechaActividad).toLocaleDateString() : '---';
    doc.text(`Fecha de Actividad: ${fecha}`, 14, 40);

    if (n.linkTracking) {
      doc.setFontSize(9);
      doc.setTextColor(0, 100, 255);
      doc.text(`Tracking: ${n.linkTracking}`, 14, 46);
    }

    // Tabla de transportes
    const filasTransporte = (n.transportes || []).map(t => [
      t.chofer || '---',
      t.tracto || '---',
      t.cisterna || '---',
      t.anioTracto ? `Mod. ${t.anioTracto}` : '-',
      t.anioCisterna ? `Mod. ${t.anioCisterna}` : '-'
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Chofer', 'Tracto', 'Cisterna', 'Año T.', 'Año C.']],
      body: filasTransporte,
      theme: 'striped',
      headStyles: { fillColor: [52, 58, 64] },
      styles: { fontSize: 9, cellPadding: 2 }
    });

    doc.save(`Detalle_Nomina_${n.id}.pdf`);
  }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }

  limpiarTelefono(tel: string | undefined): string {
    if (!tel) return '';
    return tel.replace(/\D/g, '');
  }
}
