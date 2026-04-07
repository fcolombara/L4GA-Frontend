import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-registro-etapas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registro-etapas.html',
  styleUrls: ['./registro-etapas.scss']
})
export class RegistroEtapas {
  // Ya no necesitamos la función irAPosta() porque usamos routerLink directamente
}
