import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Nomina, NominaCreateDto } from '../models/nomina.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  getNominasFiltradas(inicio?: string, fin?: string): Observable<Nomina[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicioActividad', inicio);
    if (fin) params = params.set('finActividad', fin);

    return this.http.get<Nomina[]>(this.apiUrl, { params });
  }

  actualizarNomina(id: number, nomina: Nomina): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, nomina);
  }
}
