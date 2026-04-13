import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionService } from '../../../services/operacion.service';
import { Operacion } from '../../../models/operacion.model';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-consulta-operaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta-operaciones.html',
  styleUrls: ['./consulta-operaciones.scss']
})
export class ConsultaOperacionesComponent implements OnInit {
  operaciones: Operacion[] = [];
  filtradas: Operacion[] = [];

  // Filtros
  fechaDesde: string = '';
  fechaHasta: string = '';
  tractoFiltro: string = '';

  constructor(private operacionService: OperacionService) { }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this.operacionService.getOperaciones().subscribe({
      next: (res) => {
        this.operaciones = res;
        this.filtradas = res;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  aplicarFiltros() {
    this.filtradas = this.operaciones.filter(op => {
      // Limpiamos la fecha de la DB para comparar (YYYY-MM-DD)
      const fechaOp = op.fecha ? op.fecha.toString().split('T')[0] : '';

      // Lógica de Rango de Fechas
      const coincideDesde = !this.fechaDesde || fechaOp >= this.fechaDesde;
      const coincideHasta = !this.fechaHasta || fechaOp <= this.fechaHasta;

      // Filtro por Tracto (Patente/Unidad)
      const coincideTracto = !this.tractoFiltro ||
        op.transporte?.tracto?.toLowerCase().includes(this.tractoFiltro.toLowerCase());

      return coincideDesde && coincideHasta && coincideTracto;
    });
  }
  exportarPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');

    // ... (títulos y configuración igual)

    // MAPEADO SEGURO PARA TYPESCRIPT
    const filas = this.filtradas.map(op => [
      op.id?.toString() || '', // Convertimos a string y evitamos undefined
      op.fecha ? new Date(op.fecha).toLocaleDateString() : '',
      op.transporte?.tracto || 'N/A', // Si no hay tracto, ponemos N/A
      op.transporte?.chofer || 'N/A',
      op.litrosCremer || 0,
      op.volCargadoGreen || 0,
      op.volDescargadoGreen || 0,
      op.litrosRecibidosPuerto || 0
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Fecha', 'Tracto', 'Chofer', 'Cremer (Lts)', 'PGORD In (Lts)', 'PGORD Out (Lts)', 'Puerto (Lts)']],
      body: filas as any[], // El 'as any[]' ayuda a jspdf-autotable a no renegar con los tipos
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69] },
      styles: { fontSize: 8 }
    });

    doc.save(`Reporte_L4GA_${new Date().getTime()}.pdf`);
  }

}
