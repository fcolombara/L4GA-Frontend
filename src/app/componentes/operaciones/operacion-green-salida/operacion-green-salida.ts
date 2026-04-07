import { Component, OnInit } from '@angular/core';
import { OperacionService } from '../../../services/operacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Operacion } from '../../../models/operacion.model';

@Component({
  selector: 'app-operacion-green-salida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacion-green-salida.html'
})
export class OperacionGreenSalidaComponent implements OnInit {

  operacionesEnPlanta: Operacion[] = [];
  seleccionado: Operacion | null = null;

  // Modelo actualizado con los nombres de las 4 etapas
  formSalida = {
    horaEquipoListoGreen: '',
    horaCargaBioGreen: '',
    horaOutGreen: '',
    volCargadoGreen: 0 // Antes litrosOutGreen
  };

  constructor(
    private operacionService: OperacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCamionesEnPlanta();
  }

  seleccionar(op: Operacion) {
    this.seleccionado = op;

    // Seteamos la hora actual automáticamente al seleccionar para agilizar la carga
    const ahora = new Date();
    const hhmm = ahora.toTimeString().slice(0, 5);

    this.formSalida.horaEquipoListoGreen = hhmm;
    this.formSalida.horaCargaBioGreen = hhmm;
    this.formSalida.horaOutGreen = hhmm;

    console.log("Camión seleccionado para salida:", op);
  }

  cargarCamionesEnPlanta() {
    this.operacionService.getPendientesSalidaGreen().subscribe({
      next: (data) => {
        console.log("Camiones en planta:", data);
        this.operacionesEnPlanta = data;
      },
      error: (err) => console.error("Error al traer datos:", err)
    });
  }

  guardarSalida() {
    if (!this.seleccionado || !this.seleccionado.id) return;

    // Preparamos el payload con formato HH:mm:ss para el Backend
    const payload = {
      horaEquipoListoGreen: this.formatTime(this.formSalida.horaEquipoListoGreen),
      horaCargaBioGreen: this.formatTime(this.formSalida.horaCargaBioGreen),
      horaOutGreen: this.formatTime(this.formSalida.horaOutGreen),
      volCargadoGreen: Number(this.formSalida.volCargadoGreen)
    };

    this.operacionService.actualizarSalidaGreen(this.seleccionado.id, payload).subscribe({
      next: () => {
        alert('¡Salida de Planta Paraguay registrada con éxito!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar: ' + (err.error || 'Verificá los datos.'));
      }
    });
  }

  private formatTime(time: string): string {
    if (!time) return '';
    return time.length === 5 ? `${time}:00` : time;
  }
}
