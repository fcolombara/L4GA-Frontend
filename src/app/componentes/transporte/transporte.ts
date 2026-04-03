import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransporteService } from '../../services/transporte'; // Ajustá la ruta según tu carpetas
import { Transporte } from '../../models/transporte.model';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transporte.html',
  styleUrls: ['./transporte.scss']
})
export class TransporteComponent implements OnInit {

  listaTransportes: Transporte[] = [];
  mostrarFormTransporte: boolean = false;
  editandoTransporte: boolean = false;

  // Mantenemos la inicialización exacta que tenías
  nuevoTransporte: Transporte = {
    chofer: '',
    tracto: '',
    cisterna: '',
    anioTracto: '',
    anioCisterna: '',
    contacto: ''
  } as Transporte;

  constructor(private transporteService: TransporteService) { }

  ngOnInit(): void {
    this.cargarTransportes();
  }

  cargarTransportes() {
    this.transporteService.getTransportes().subscribe(d => this.listaTransportes = d);
  }

  guardarTransporte() {
    if (this.editandoTransporte && this.nuevoTransporte.id) {
      this.transporteService.actualizarTransporte(this.nuevoTransporte.id, this.nuevoTransporte).subscribe(() => {
        this.finalizarGuardado();
      });
    } else {
      this.transporteService.registrarTransporte(this.nuevoTransporte).subscribe(() => {
        this.finalizarGuardado();
      });
    }
  }

  finalizarGuardado() {
    this.cargarTransportes();
    this.mostrarFormTransporte = false;
    this.editandoTransporte = false;
    this.nuevoTransporte = {
      chofer: '',
      tracto: '',
      cisterna: '',
      anioTracto: '',
      anioCisterna: '',
      contacto: ''
    } as Transporte;
  }

  prepararEdicion(t: Transporte) {
    this.editandoTransporte = true;
    this.mostrarFormTransporte = true;
    this.nuevoTransporte = { ...t };
  }

  cancelarEdicion() {
    this.mostrarFormTransporte = false;
    this.editandoTransporte = false;
    this.nuevoTransporte = { chofer: '', tracto: '', cisterna: '' } as Transporte;
  }

  eliminarTransporte(id: number) {
    if (confirm('¿Eliminar unidad?')) {
      this.transporteService.eliminarTransporte(id).subscribe(() => this.cargarTransportes());
    }
  }

  limpiarTelefono(tel: string | undefined): string {
    if (!tel) return '';
    return tel.replace(/\D/g, '');
  }
}
