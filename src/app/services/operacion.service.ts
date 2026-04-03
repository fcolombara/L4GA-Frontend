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

  // 3. MÉTODO PARA SANTA FE (CREMER)
  // Cambiamos el nombre a 'registrarSalida' para que coincida con tu componente
  registrarSalida(operacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, operacion);
  }

  // 4. ACTUALIZAR (PUT genérico)
  actualizarOperacion(id: number, operacion: Operacion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, operacion);
  }

  // 5. FILTRAR PENDIENTES DE GREEN OIL (Paraguay)
  getOperacionesPendientesGreen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes-green`);
  }

  // 6. ACTUALIZAR INGRESO GREEN OIL (PATCH)
  actualizarIngresoGreen(id: number, datos: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/ingreso-green/${id}`, datos);
  }

  // 2. CORREGIDO: Quitamos "/Operaciones"
  getPendientesSalidaGreen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes-salida-green`);
  }

  // 3. CORREGIDO: Quitamos "/Operaciones"
  actualizarSalidaGreen(id: number, datos: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/salida-green/${id}`, datos);
  }

  // --- Lógica de Estados para el Dashboard ---
  obtenerEstado(op: Operacion): string {
    if (op.horaInPuerto) return 'Finalizado en Puerto';
    if (op.horaOutGreen) return 'En viaje a Puerto';
    if (op.horaInGreen) return 'En Planta Green Oil';
    if (op.horaOutCremer) return 'En viaje a Green Oil';
    return 'Pendiente de Salida';
  }

  getBadgeClass(op: Operacion): string {
    if (op.horaInPuerto) return 'bg-success';
    if (op.horaOutGreen) return 'bg-info text-white';
    if (op.horaInGreen) return 'bg-warning text-dark';
    if (op.horaOutCremer) return 'bg-primary';
    return 'bg-secondary';
  }

  getPendientesPuerto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes-puerto`);
  }

  actualizarIngresoPuerto(id: number, datos: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/ingreso-puerto/${id}`, datos);
  }
}
