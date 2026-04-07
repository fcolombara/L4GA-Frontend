import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operacion } from '../models/operacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionService {

  private apiUrl = `${environment.apiUrl}/Operaciones`;

  constructor(private http: HttpClient) { }

  // 1. OBTENER TODAS
  getOperaciones(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(this.apiUrl);
  }

  // 2. OBTENER UNA
  getOperacion(id: number): Observable<Operacion> {
    return this.http.get<Operacion>(`${this.apiUrl}/${id}`);
  }

  // 3. ETAPA 1: REGISTRAR SALIDA CREMER (POST)
  registrarSalida(operacion: Operacion): Observable<Operacion> {
    return this.http.post<Operacion>(this.apiUrl, operacion);
  }

  // 4. ACTUALIZAR GENÉRICO
  actualizarOperacion(id: number, operacion: Operacion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, operacion);
  }

  // 5. ETAPA 2: GREEN OIL - PENDIENTES DE INGRESO
  getOperacionesPendientesGreen(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(`${this.apiUrl}/pendientes-green`);
  }

  // 6. ETAPA 2: GREEN OIL - REGISTRAR INGRESO (PATCH)
  // Cambiá la definición así:
  actualizarIngresoGreen(id: number, datos: any): Observable<void> {
    // Asegurate de que la URL coincida con tu Controller de C#
    // Si tu Controller tiene [Route("api/[controller]")], debería ser /api/Operaciones/ingreso-green/
    return this.http.patch<void>(`${this.apiUrl}/ingreso-green/${id}`, datos);
  }

  // 7. ETAPA 3: GREEN OIL - PENDIENTES DE SALIDA
  getPendientesSalidaGreen(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(`${this.apiUrl}/pendientes-salida-green`);
  }

  // 8. ETAPA 3: GREEN OIL - REGISTRAR SALIDA (PATCH)
  // En operacion.service.ts
  actualizarSalidaGreen(id: number, datos: {
    horaEquipoListoGreen: string,
    horaCargaBioGreen: string,
    horaOutGreen: string,
    volCargadoGreen: number
  }): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/salida-green/${id}`, datos);
  }

  // 9. ETAPA 4: PUERTO - PENDIENTES
  getPendientesPuerto(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(`${this.apiUrl}/pendientes-puerto`);
  }

  // 10. ETAPA 4: PUERTO - REGISTRAR INGRESO (PATCH)
  actualizarIngresoPuerto(id: number, datos: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/ingreso-puerto/${id}`, datos);
  }

  // --- Lógica de Estados Actualizada (Dashboard) ---
  obtenerEstado(op: Operacion): string {
    if (op.pesajePuerto) return 'Finalizado en Puerto';
    if (op.volCargadoGreen) return 'En viaje a Puerto';
    if (op.volDescargadoGreen) return 'En Planta Green Oil';
    if (op.pesoCargadoCremer) return 'En viaje a Green Oil';
    return 'Pendiente de Salida';
  }
  actualizarTracking(id: number, link: string): Observable<any> {
    // Agregamos la / antes de ActualizarTracking
    return this.http.put(`${this.apiUrl}/ActualizarTracking/${id}`, { trackingLink: link });
  }

  getBadgeClass(op: Operacion): string {
    if (op.pesajePuerto) return 'bg-success'; // Verde
    if (op.volCargadoGreen) return 'bg-info text-white'; // Celeste
    if (op.volDescargadoGreen) return 'bg-warning text-dark'; // Amarillo
    if (op.pesoCargadoCremer) return 'bg-primary'; // Azul
    return 'bg-secondary'; // Gris
  }
}
