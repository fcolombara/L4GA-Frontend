import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionService } from '../../../services/operacion.service';
import { TransporteService } from '../../../services/transporte';
import { Operacion } from '../../../models/operacion.model';
import { Transporte } from '../../../models/transporte.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacion-cremer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacion-cremer.html'
})
export class OperacionCremerComponent implements OnInit {
  listaTransportes: Transporte[] = [];

  // Inicializamos con los nuevos nombres de la interface
  op: Operacion = {
    fecha: new Date().toISOString().split('T')[0],
    transporteId: 0,
    horaArriboCremer: '',
    horaCargaNeutroCremer: '',
    horaOutCremer: '',
    pesoCargadoCremer: 0,
    taraCremer: 0,
    pesoTotalCremer: 0,
    litrosCremer: 0
  };

  constructor(
    private operacionService: OperacionService,
    private transporteService: TransporteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.transporteService.getTransportes().subscribe({
      next: (res) => this.listaTransportes = res,
      error: (err) => console.error("Error cargando transportes", err)
    });
  }

  calcularLitros() {
    if (this.op.pesoCargadoCremer && this.op.pesoCargadoCremer > 0) {
      // El peso es el 100%, los litros son el 92%
      // Usamos toFixed(3) para ser consistentes con la DB
      const calculo = this.op.pesoCargadoCremer * 0.92;
      this.op.litrosCremer = Number(calculo.toFixed(3));
    } else {
      this.op.litrosCremer = 0;
    }
  }

  registrarSalida() {
    if (!this.op.transporteId || this.op.transporteId === 0) {
      alert("Debe seleccionar un transporte (patente).");
      return;
    }

    // Mapeo para enviar al Backend (C#)
    // Aseguramos que las horas tengan el formato HH:mm:ss que pide TimeSpan
    const dataParaEnviar: Operacion = {
      ...this.op,
      transporteId: Number(this.op.transporteId),
      // Formateo de horas para evitar errores de validación en el Back
      horaArriboCremer: this.formatTime(this.op.horaArriboCremer),
      horaCargaNeutroCremer: this.formatTime(this.op.horaCargaNeutroCremer),
      horaOutCremer: this.formatTime(this.op.horaOutCremer),
      // Limpiamos objetos circulares
      transporte: undefined
    };

    console.log("Enviando datos a la API (Etapa 1):", dataParaEnviar);

    this.operacionService.registrarSalida(dataParaEnviar).subscribe({
      next: () => {
        alert("¡Salida de Cremer registrada con éxito!");
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("Error en el registro:", err);
        alert("Error al registrar. Verificá que todos los campos sean correctos.");
      }
    });
  }

  // Helper para asegurar formato HH:mm:ss
  private formatTime(time?: string): string | undefined {
    if (!time) return undefined;
    if (time.length === 5) return `${time}:00`;
    return time;
  }
}
