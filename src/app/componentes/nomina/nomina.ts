import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NominaService } from '../../services/nomina.service';
import { Nomina, NominaCreateDto } from '../../models/nomina.model'; // Ajustá las rutas según tus archivos
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TransporteService } from '../../services/transporte';
import { Transporte } from '../../models/transporte.model';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nomina.html',
  styleUrls: ['./nomina.scss']
})
export class NominaComponent implements OnInit {
  // Variables de Estado
  listaNominas: Nomina[] = [];
  listaTransportes: Transporte[] = [];
  listaNominasFiltrada: Nomina[] = [];
  nominaSeleccionada: Nomina | null = null;
  mostrarFormNomina: boolean = false;

  // Variables de Filtro
  fechaInicio: string = '';
  fechaFin: string = '';

  // DTO para el formulario
  nuevaNomina: NominaCreateDto = {
    fechaActividad: '',
    transporteIds: [] as number[],
    linkTracking: ''
  };

  usuarioRol: string = localStorage.getItem('userRol') || 'Visor';

  constructor(
    private nominaService: NominaService,
    private transporteService: TransporteService // <--- INYECTADO
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // Cargamos las dos listas al mismo tiempo
    this.cargarNominas();
    this.cargarTransportes();
  }
  cargarTransportes() {
    this.transporteService.getTransportes().subscribe({
      next: (data) => {
        this.listaTransportes = data;
        console.log('Transportes cargados para nómina:', data.length);
      },
      error: (e) => console.error('Error cargando unidades:', e)
    });
  }

  cargarNominas() {
    this.nominaService.getNominas().subscribe(d => {
      this.listaNominas = d;
      this.listaNominasFiltrada = d;
    });
  }

  guardarNomina() {
    this.nominaService.crearNomina(this.nuevaNomina).subscribe({
      next: () => {
        alert('Nómina guardada con éxito');
        this.cargarNominas();
        this.mostrarFormNomina = false;
        this.nuevaNomina = { fechaActividad: '', transporteIds: [], linkTracking: '' };
      },
      error: (e) => console.error("Error al guardar nómina:", e)
    });
  }

  toggleTransporte(id: number) {
    const idx = this.nuevaNomina.transporteIds.indexOf(id);
    if (idx > -1) {
      // Si ya estaba, lo saco (un-check)
      this.nuevaNomina.transporteIds.splice(idx, 1);
    } else {
      // Si no estaba, lo agrego (check)
      this.nuevaNomina.transporteIds.push(id);
    }
  }

  aplicarFiltro() {
    this.nominaService.getNominasFiltradas(this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => this.listaNominas = data,
        error: (e) => console.error('Error en el filtro:', e)
      });
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarNominas();
  }

  // Agregá esto a tu clase NominaComponent:

  getLinkEspecifico(links: any, i: number): string {
    if (!links || typeof links !== 'string') return '';
    return links.split(',')[i] || '';
  }

  actualizarLinkEnPosicion(n: Nomina, i: number, val: string) {
    let arr = (n.linkTracking || '').split(',');
    const totalTransportes = n.transportes?.length || 0;
    while (arr.length < totalTransportes) arr.push('');
    arr[i] = val.trim();
    n.linkTracking = arr.join(',');
    this.nominaService.actualizarTracking(n.id!, n.linkTracking).subscribe();
  }

  verDetalleNomina(n: Nomina) {
    this.nominaSeleccionada = n;
    // Si usás el modal, aquí podés disparar la lógica para abrirlo
  }

  // LÓGICA DE EXPORTACIÓN PDF (Tu código original mejorado)
  exportarNominasPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte General de Nóminas - L4GA', 14, 20);

    const cuerpoTabla = this.listaNominas.map(n => [
      n.id,
      n.fechaActividad ? new Date(n.fechaActividad).toLocaleDateString('es-AR') : 'N/A',
      n.transportes?.map(t => `${t.chofer} (${t.tracto})`).join(', ') || 'Sin unidades',
      n.linkTracking || 'Sin link'
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Fecha', 'Transportes', 'Tracking']],
      body: cuerpoTabla,
      headStyles: { fillColor: [13, 42, 27] } // Verde L4GA
    });

    doc.save(`Reporte_Nominas_${new Date().getTime()}.pdf`);
  }

  // Métodos de ayuda
  abrirLink(url: string) {
    if (!url) return;
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  }
}
