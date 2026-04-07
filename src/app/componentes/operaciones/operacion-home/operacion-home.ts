import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operacion-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operacion-home.html',
  styleUrls: ['./operacion-home.scss']
})
export class OperacionHomeComponent {
  // Por ahora es un componente de navegación pura, 
  // no necesita lógica pesada en el TS.
}
