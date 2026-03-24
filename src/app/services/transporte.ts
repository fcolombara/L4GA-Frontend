import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// 1. Aseguramos que la importación sea correcta
import { environment } from '../../environments/environment';

export interface Transporte {
  id?: number;
  chofer: string;
  tracto: string;
  cisterna: string;
  anioTracto?: string;
  anioCisterna?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  // 2. CAMBIO CLAVE: Reemplazamos el localhost por la variable de entorno
  private apiUrl = `${environment.apiUrl}/Transporte`;

  constructor(private http: HttpClient) { }

  getTransportes(): Observable<Transporte[]> {
    return this.http.get<Transporte[]>(this.apiUrl);
  }

  registrarTransporte(transporte: Transporte): Observable<Transporte> {
    return this.http.post<Transporte>(this.apiUrl, transporte);
  }

  eliminarTransporte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
