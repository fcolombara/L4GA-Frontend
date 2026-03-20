import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  // Variable para capturar el error y mostrarlo en el HTML
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    // Limpiamos el mensaje de error antes de intentar loguear
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response: AuthResponse) => {
        // Guardamos la sesión
        localStorage.setItem('token', 'session_active');
        localStorage.setItem('userName', response.nombre);
        localStorage.setItem('userRol', response.rol);
        localStorage.setItem('userEmail', response.email);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Captura el mensaje de .NET (401 o 403 para usuarios de baja)
        console.error('Error en el login:', err);

        // Si el backend envía un objeto con { mensaje: "..." }, lo mostramos
        this.errorMessage = err.error?.mensaje || 'Credenciales inválidas o error de servidor';
      }
    });
  }
}
