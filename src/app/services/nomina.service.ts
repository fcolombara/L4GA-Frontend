import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nomina, NominaCreateDto } from '../models/nomina.model';

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  private apiUrl = 'https://localhost:7048/api/Nomina'; // Ajustá el puerto si es necesario

  constructor(private http: HttpClient) { }

  getNominas(): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(this.apiUrl);
  }

  crearNomina(dto: NominaCreateDto): Observable<Nomina> {
    return this.http.post<Nomina>(this.apiUrl, dto);
  }
  // En tu NominaService
  actualizarTracking(id: number, link: string): Observable<void> {
    // Enviamos el string directamente. 
    // Nota: Si el backend se pone estricto con el formato JSON, 
    // usaremos { link } en lugar de solo link.
    return this.http.put<void>(`${this.apiUrl}/${id}/tracking`, `"${link}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  actualizarNomina(id: number, nomina: Nomina): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, nomina);
  }
}
