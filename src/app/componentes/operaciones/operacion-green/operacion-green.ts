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
  operacionesPendientes: Operacion[] = [];
  operacionSeleccionada: Operacion | null = null;
  paso: number = 1; // 1: Seleccionar Camión, 2: Cargar Datos

  // Objeto para capturar los datos del formulario (Etapa 2)
  ingreso = {
    horaArriboGreen: '',
    horaInPlantaGreen: '',
    horaDescargaGreen: '',
    volDescargadoGreen: 0
  };

  constructor(private operacionService: OperacionService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    // Traemos camiones que salieron de Cremer pero no entraron a Green
    this.operacionService.getOperacionesPendientesGreen().subscribe({
      next: (res) => this.operacionesPendientes = res,
      error: (err) => console.error("Error al traer pendientes", err)
    });
  }

  seleccionar(op: Operacion) {
    this.operacionSeleccionada = op;
    this.paso = 2;
  }

  guardarIngreso() {
    if (!this.operacionSeleccionada) return;

    const idLimpio = Number(this.operacionSeleccionada.id);

    // Armamos el objeto tal cual es la clase Operacion.cs
    const payload = {
      Id: idLimpio,
      HoraArriboGreen: this.formatTime(this.ingreso.horaArriboGreen),
      HoraInPlantaGreen: this.formatTime(this.ingreso.horaInPlantaGreen),
      HoraDescargaGreen: this.formatTime(this.ingreso.horaDescargaGreen),
      VolDescargadoGreen: Number(this.ingreso.volDescargadoGreen)
    };

    this.operacionService.actualizarIngresoGreen(idLimpio, payload).subscribe({
      next: () => {
        alert('¡Guardado con éxito!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("Error detallado:", err);
      }
    });
  }

  private formatTime(time?: string): string | undefined {
    if (!time) return undefined;
    // Si viene "14:30", lo transforma en "14:30:00"
    return time.length === 5 ? `${time}:00` : time;
  }
}
