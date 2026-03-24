import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nomina, NominaCreateDto } from '../models/nomina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  // AJUSTE CLAVE: Agregamos /Nominas (o como se llame tu controller en C#)
  private readonly apiUrl = `${environment.apiUrl}/Nomina`;

  constructor(private http: HttpClient) { }

  getNominas(): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(this.apiUrl);
  }

  crearNomina(dto: NominaCreateDto): Observable<Nomina> {
    return this.http.post<Nomina>(this.apiUrl, dto);
  }

  actualizarTracking(id: number, link: string): Observable<void> {
    // El uso de `"${link}"` es correcto para enviar un string plano como JSON
    return this.http.put<void>(`${this.apiUrl}/${id}/tracking`, `"${link}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  actualizarNomina(id: number, nomina: Nomina): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, nomina);
  }
}
