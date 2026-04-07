import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OperacionService } from '../../../services/operacion.service';

// IMPORTANTE: Esta declaración debe ir aquí, fuera de la clase.
declare var bootstrap: any;

@Component({
  selector: 'app-seguimiento-operaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seguimiento-operaciones.component.html',
  styleUrls: ['./seguimiento-operaciones.component.scss']
})
export class SeguimientoOperacionesComponent implements OnInit {

  operacionesEnCurso: any[] = [];
  hoy: Date = new Date();
  seleccionado: any = null;

  constructor(
    private operacionService: OperacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerSeguimiento();
  }

  obtenerSeguimiento() {
    this.operacionService.getOperaciones().subscribe({
      next: (res) => {
        // Filtramos las que aún no tienen hora de arribo al puerto (operaciones activas)
        this.operacionesEnCurso = res.filter((op: any) => !op.horaArriboPuerto);
      },
      error: (err) => console.error('Error al cargar seguimiento', err)
    });
  }

  obtenerEstadoTexto(op: any): string {
    if (!op) return 'Sin datos';

    // 1. Salió de Cremer pero no llegó a Green
    if (op.litrosCremer && !op.horaArriboGreen) {
      return 'En camino a PGORD';
    }

    // 2. Está en Green (entró pero no salió)
    if (op.horaArriboGreen && !op.horaOutGreen) {
      return 'En planta PGORD';
    }

    // 3. Salió de Green pero no llegó a Puerto
    if (op.horaOutGreen && !op.horaArriboPuerto) {
      return 'En camino al PUERTO de VILLETA';
    }

    return 'Procesando...';
  }

  irAlTracking(op: any) {
    // 1. Si ya tiene link, redirigimos directamente
    if (op.trackingLink && op.trackingLink.trim() !== '') {
      window.open(op.trackingLink, '_blank');
    }
    // 2. Si no tiene, solicitamos la carga
    else {
      const nuevoLink = prompt(`Pegue el link de seguimiento GPS para la unidad ${op.transporte?.tracto}:`);

      if (nuevoLink && nuevoLink.includes('http')) {
        // Llamamos al servicio para impactar en la columna TrackingLink de tu C#
        this.operacionService.actualizarTracking(op.id, nuevoLink).subscribe({
          next: () => {
            op.trackingLink = nuevoLink; // Actualizamos la vista sin recargar
            alert('Link de seguimiento vinculado con éxito.');
            // Opcional: abrirlo automáticamente ahora que se cargó
            window.open(nuevoLink, '_blank');
          },
          error: (err) => alert('Error al guardar el link: ' + err.message)
        });
      } else if (nuevoLink) {
        alert('Por favor, ingrese una URL válida (debe empezar con http o https)');
      }
    }
  }

  verDetalle(op: any) {
    this.seleccionado = op;

    // Abrimos el modal de Bootstrap usando la referencia del ID en el HTML
    const modalElement = document.getElementById('detalleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("No se encontró el elemento 'detalleModal' en el HTML.");
    }
  }
}
