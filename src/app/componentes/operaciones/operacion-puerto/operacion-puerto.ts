import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionService } from '../../../services/operacion.service'; // Ajustá la cantidad de ../ según tu profundidad
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacion-puerto-ingreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacion-puerto-ingreso.html', // Asegurate que el nombre coincida con tu archivo
  styleUrls: ['./operacion-puerto.scss']
})
export class OperacionPuertoIngresoComponent implements OnInit {

  camionesEnCamino: any[] = [];
  seleccionado: any = null;

  // Modelo exacto para los campos del Puerto
  formPuerto = {
    horaInPuerto: '',
    pesoInPuerto: null,
    litrosInPuerto: null
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

  seleccionar(op: any) {
    this.seleccionado = op;
    const ahora = new Date();
    this.formPuerto.horaInPuerto = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  guardarIngresoPuerto() {
    // 1. Aseguramos el formato HH:mm:ss
    let horaConSegundos = this.formPuerto.horaInPuerto;

    // Si la hora viene como "11:32", le concatenamos ":00"
    if (horaConSegundos && horaConSegundos.length === 5) {
      horaConSegundos += ":00";
    }

    const datosParaEnviar = {
      horaInPuerto: horaConSegundos, // Ahora es "11:32:00"
      pesoInPuerto: Number(this.formPuerto.pesoInPuerto),
      litrosInPuerto: Number(this.formPuerto.litrosInPuerto)
    };

    this.operacionService.actualizarIngresoPuerto(this.seleccionado.id, datosParaEnviar)
      .subscribe({
        next: () => {
          alert('¡Arribo a Puerto registrado!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error("Error 400 detallado:", err.error);
          alert("Error al guardar. Verificá los datos.");
        }
      });
  }
}
