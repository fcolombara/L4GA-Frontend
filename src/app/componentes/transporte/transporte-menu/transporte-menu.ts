import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transporte-menu',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importante tener RouterLink para los botones
  templateUrl: './transporte-menu.html',
  styleUrls: ['./transporte-menu.scss']
})
// FIJATE ACÁ: Debe decir "export class TransporteMenuComponent"
export class TransporteMenuComponent {
  constructor() { }
}
