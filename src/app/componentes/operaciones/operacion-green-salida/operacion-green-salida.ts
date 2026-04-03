import { Component, OnInit } from '@angular/core';
import { OperacionService } from '../../../services/operacion.service'; // Ruta ajustada
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacion-green-salida',
  standalone: true, // <--- Asegurate que diga true si el resto de tu app es así
  imports: [CommonModule, FormsModule], // <--- AGREGALOS ACÁ
  templateUrl: './operacion-green-salida.html',
  styleUrls: ['./operacion-green-salida.scss']
})
export class OperacionGreenSalidaComponent implements OnInit {

  operacionesEnPlanta: any[] = [];
  seleccionado: any = null;

  // Modelo que coincide con el DTO de C#
  formSalida = {
    horaOutGreen: '',
    litrosOutGreen: 0
  };

  constructor(
    private operacionService: OperacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCamionesEnPlanta();
  }
  seleccionar(op: any) {
    this.seleccionado = op;

    // Seteamos la hora actual automáticamente al seleccionar
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    this.formSalida.horaOutGreen = `${horas}:${minutos}`;

    console.log("Camión seleccionado para salida:", op);
  }

  
  cargarCamionesEnPlanta() {
    this.operacionService.getPendientesSalidaGreen().subscribe({
      next: (data) => {
        // Hacé este log para ver si los datos llegan al componente
        console.log("Camiones detectados:", data);
        this.operacionesEnPlanta = data;
      },
      error: (err) => {
        console.error("Error al traer datos:", err);
      }
    });
  }
  guardarSalida() {
    if (!this.seleccionado) return;

    this.operacionService.actualizarSalidaGreen(this.seleccionado.id, this.formSalida).subscribe({
      next: () => {
        alert('¡Salida de Planta Paraguay registrada!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert('Error al guardar: ' + err.error)
    });
  
  }
}
