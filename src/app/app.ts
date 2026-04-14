import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <nav *ngIf="mostrarNav" class="navbar navbar-expand-lg fixed-top animate__animated animate__fadeInDown p-0" 
         style="background-color: #0D2A1B; border-bottom: 12px solid #FFC600; min-height: 90px;">
      <div class="container-fluid px-4">
        
        <a class="navbar-brand d-flex align-items-center" routerLink="/dashboard">
      <img src="/assets/Logis_logo.png"
     alt="L4GA"
     style="height: 40px; width: auto;"
     class="d-inline-block align-text-top me-2">
    </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-4 mb-2 mb-lg-0 gap-2">
            <li class="nav-item">
              <a class="nav-link text-white fw-light px-3 mt-2" routerLink="/dashboard" routerLinkActive="active-link">Inicio</a>
            </li>
            <li class="nav-item">
  <a class="nav-link text-white fw-light px-3 mt-2"
     routerLink="/operaciones"
     routerLinkActive="active-link"
     style="cursor: pointer;">
    Operaciones
  </a>
</li>
            <li class="nav-item" *ngIf="esAdmin || esOperario">
              <a class="nav-link text-white fw-light px-3 mt-2" routerLink="/transporte" routerLinkActive="active-link">Transporte</a>
            </li>
           <li class="nav-item" *ngIf="esAdmin">
  <a class="nav-link text-white fw-light px-3 mt-2"
     routerLink="/usuarios"
     routerLinkActive="active-link">Usuarios</a>
</li>
          </ul>

          <div class="d-flex align-items-center gap-3 ms-auto">
            <div class="d-flex align-items-center pe-2">
              <span class="text-white fw-bold me-2" style="font-size: 0.95rem;">{{ usuarioNombre }}</span>
              <span class="badge py-2 px-3" 
                    style="background-color: #FFC600; color: #0D2A1B; font-size: 0.8rem; border-radius: 0; font-weight: 700;">
                {{ usuarioRol | uppercase }}
              </span>
            </div>
            
            <button class="btn fw-bold px-3 py-2" (click)="logout()"
style="background-color: #FFC600; color: #0D2A1B; border-radius: 0; font-size: 0.85rem; border: none; min-height: 30px;">
Cerrar Sesión
</button>
          </div>
        </div>
      </div>
    </nav>

    <main [style.margin-top]="mostrarNav ? '105px' : '0px'">
      <router-outlet></router-outlet>
    </main>

    <style>
      .active-link {
        font-weight: 700 !important;
        color: #FFC600 !important;
        border-bottom: 2px solid #FFC600;
        padding-bottom: 5px;
      }
      .nav-link:hover {
        color: #FFC600 !important;
      }
    </style>
  `
})
export class App {
  private router = inject(Router);
  mostrarNav: boolean = true;

  constructor() {
    // Detectamos cambios de ruta para ocultar/mostrar el Nav
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la ruta contiene 'login', ocultamos el Nav
      this.mostrarNav = !event.urlAfterRedirects.includes('/login');
    });
  }

  get usuarioNombre(): string {
    return localStorage.getItem('userName') || 'Usuario';
  }

  get usuarioRol(): string {
    return (localStorage.getItem('userRol') || 'Operario').trim();
  }
  mostrarAlerta(mensaje: string) {
    window.alert(mensaje);
  }
  get esAdmin(): boolean {
    return this.usuarioRol.toLowerCase() === 'admin';
  }

  get esOperario(): boolean {
    const rol = this.usuarioRol.toLowerCase();
    return rol === 'operario' || rol === 'admin';
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
