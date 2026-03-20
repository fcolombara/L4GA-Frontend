import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<AuthResponse> {
    // Agregamos /Usuarios/ antes de login para que coincida con el Backend
    return this.http.post<AuthResponse>(`${this.apiUrl}/Usuarios/login`, credentials);
  }

  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  getUsuarios(): Observable<any[]> {
    // Agregamos /Usuarios al final de la ruta base
    return this.http.get<any[]>(`${this.apiUrl}/Usuarios`);
  }

  actualizarRol(id: number, nuevoRol: string): Observable<any> {
    const body = { nuevoRol: nuevoRol };
    return this.http.put<any>(`${this.apiUrl}/actualizar-rol/${id}`, body);
  }

  // --- NUEVO MÉTODO AGREGADO ---
  // Permite al Admin eliminar un usuario por su ID
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
