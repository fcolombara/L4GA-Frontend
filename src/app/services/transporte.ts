import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ESTO ES LO QUE EL DASHBOARD NO VEÍA:
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
  private apiUrl = 'https://localhost:7048/api/Transporte';

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
