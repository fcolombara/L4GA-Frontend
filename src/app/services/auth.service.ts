import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Definimos la ruta base del controlador de usuarios
  private readonly endpoint = `${environment.apiUrl}/Usuarios`;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<AuthResponse> {
    // Apunta a: .../api/Usuarios/login
    return this.http.post<AuthResponse>(`${this.endpoint}/login`, credentials);
  }

  registrar(usuario: any): Observable<any> {
    // Apunta a: .../api/Usuarios
    return this.http.post<any>(this.endpoint, usuario);
  }

  getUsuarios(): Observable<any[]> {
    // Apunta a: .../api/Usuarios
    return this.http.get<any[]>(this.endpoint);
  }

  actualizarRol(id: number, nuevoRol: string): Observable<any> {
    const body = { nuevoRol: nuevoRol };
    // Corregido: Agregamos /Usuarios/ antes de la acción
    return this.http.put<any>(`${this.endpoint}/actualizar-rol/${id}`, body);
  }

  eliminarUsuario(id: number): Observable<any> {
    // Corregido: Agregamos /Usuarios/ antes del ID
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }
}
