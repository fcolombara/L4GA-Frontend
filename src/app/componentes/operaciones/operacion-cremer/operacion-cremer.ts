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

  // 1. Agregamos usuarioId: 1 por defecto para que no sea undefined
  op: any = {
    fecha: new Date().toISOString().split('T')[0],
    transporteId: 0,
    usuarioId: 1, // <--- ID del operador de Santa Fe
    horaOutCremer: '',
    pesoCremer: 0,
    taraCremer: 0,
    litrosCremer: 0,
    estado: 'Salida Cremer'
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
    if (this.op.pesoCremer && this.op.pesoCremer > 0) {
      const factor = 0.92;
      this.op.litrosCremer = Math.round(this.op.pesoCremer / factor);
    } else {
      this.op.litrosCremer = 0;
    }
  }

  registrarSalida() {
    // 2. Validación rápida: evitar mandar transporteId en 0
    if (!this.op.transporteId || this.op.transporteId === 0) {
      alert("Debe seleccionar un transporte (patente).");
      return;
    }

    // 3. Mapeo limpio para C#
    const dataParaEnviar = {
      fecha: this.op.fecha,
      transporteId: Number(this.op.transporteId),
      usuarioId: Number(this.op.usuarioId) || 1,
      litrosCremer: Number(this.op.litrosCremer) || 0,
      pesoCremer: Number(this.op.pesoCremer) || 0,
      taraCremer: Number(this.op.taraCremer) || 0,
      horaOutCremer: this.op.horaOutCremer.includes(':') && this.op.horaOutCremer.length === 5
        ? `${this.op.horaOutCremer}:00`
        : this.op.horaOutCremer,
      estado: 'Salida Cremer',
      // IMPORTANTE: Mandar estos como null para evitar conflictos de navegación en EF
      transporte: null,
      usuario: null
    };

    console.log("Enviando datos al Backend:", dataParaEnviar);

    this.operacionService.registrarSalida(dataParaEnviar).subscribe({
      next: (res: any) => { // <--- Agregamos ": any" explícitamente
        alert("¡Operación registrada con éxito en Cremer!");
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => { // <--- Agregamos ": any" acá también
        console.error("Detalle del error:", err);
        alert("Error de validación. Revisá la consola.");
      }
    });
  }
}
