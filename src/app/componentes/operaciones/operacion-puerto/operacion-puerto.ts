import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionService } from '../../../services/operacion.service';
import { Operacion } from '../../../models/operacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacion-puerto-ingreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacion-puerto-ingreso.html',
  styleUrls: ['./operacion-puerto.scss']
})
export class OperacionPuertoIngresoComponent implements OnInit {

  camionesEnCamino: Operacion[] = [];
  seleccionado: Operacion | null = null;

  // Modelo actualizado para los campos de la Etapa 4
  formPuerto = {
    horaArriboPuerto: '',
    horaInUnidadPuerto: '',
    pesajePuerto: null as number | null,       // Bruto puerto
    pesoRecibidoPuerto: null as number | null, // Neto puerto
    litrosRecibidosPuerto: null as number | null // Volumen final
  };

  constructor(private operacionService: OperacionService, private router: Router) { }

  ngOnInit(): void {
    this.cargarCamionesEnCamino();
  }

  cargarCamionesEnCamino() {
    this.operacionService.getPendientesPuerto().subscribe({
      next: (data) => {
        this.camionesEnCamino = data;
        console.log("Camiones rumbo al puerto:", data);
      },
      error: (err) => console.error('Error al traer camiones:', err)
    });
  }

  seleccionar(op: Operacion) {
    this.seleccionado = op;

    // Sugerimos la hora actual para agilizar la carga
    const ahora = new Date();
    const hhmm = ahora.toTimeString().slice(0, 5);

    this.formPuerto.horaArriboPuerto = hhmm;
    this.formPuerto.horaInUnidadPuerto = hhmm;
  }

  guardarPuerto() {
    // 1. Usamos 'this.seleccionado' (así lo declaraste arriba)
    if (!this.seleccionado || !this.seleccionado.id) return;

    const idLimpio = Number(this.seleccionado.id);

    // 2. Usamos 'this.formPuerto' y respetamos las MAYÚSCULAS del Backend
    const payload = {
      // Usamos 'horaArriboPuerto' o 'horaInUnidadPuerto' según lo que espere tu C#
      HoraInPuerto: this.formatTime(this.formPuerto.horaArriboPuerto),
      PesajePuerto: Number(this.formPuerto.pesajePuerto),
      PesoRecibidoPuerto: Number(this.formPuerto.pesoRecibidoPuerto)
    };

    console.log("Enviando al puerto con ID:", idLimpio, payload);

    this.operacionService.actualizarIngresoPuerto(idLimpio, payload).subscribe({
      next: () => {
        alert('¡Operación en Puerto cerrada con éxito!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Si el error 400 persiste, acá veremos el detalle
        console.error("Error en Puerto:", err.error || err);
        alert('Error al guardar. Revisar formato de hora.');
      }
    });
  }
  
  // Helper para el formato de hora que pide el Backend (HH:mm:ss)
  private formatTime(time: string): string {
    if (!time) return '';
    return time.length === 5 ? `${time}:00` : time;
  }
}
