import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionService } from '../../../services/operacion.service';
import { Operacion } from '../../../models/operacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacion-green',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacion-green.html'
})
export class OperacionGreenComponent implements OnInit {
  operacionesPendientes: any[] = []; // Usamos any para incluir datos del Tracto/Chofer
  operacionSeleccionada: any = null;
  paso: number = 1; // 1: Seleccionar Camión, 2: Cargar Datos

  // Datos para el ingreso
  ingreso = {
    horaInGreen: '',
    litrosInGreen: 0
  };

  constructor(private operacionService: OperacionService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    // Llamamos al servicio para traer operaciones que NO tengan horaInGreen
    this.operacionService.getOperacionesPendientesGreen().subscribe({
      next: (res) => this.operacionesPendientes = res,
      error: (err) => console.error("Error al traer pendientes", err)
    });
  }

  seleccionar(op: any) {
    this.operacionSeleccionada = op;
    this.paso = 2; // Pasamos a la carga de datos
  }

  // En operacion-green.ts
  guardarIngreso() {
    // Forzamos a que sea un número entero
    const idLimpio = Number(this.operacionSeleccionada.id);

    const payload = {
      horaInGreen: this.ingreso.horaInGreen.length === 5 ? `${this.ingreso.horaInGreen}:00` : this.ingreso.horaInGreen,
      litrosInGreen: Number(this.ingreso.litrosInGreen)
    };

    // Usamos el ID limpio sin dos puntos ni nada extra
    this.operacionService.actualizarIngresoGreen(idLimpio, payload).subscribe({
      next: () => {
        alert('¡Ingreso registrado en Paraguay!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }
  
}
