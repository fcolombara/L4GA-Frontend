import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  registerData = {
    nombre: '',
    email: '',
    passwordHash: '',
    rol: 'Visor' // Rol por defecto
  };

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    this.authService.registrar(this.registerData).subscribe({
      next: (res) => {
        alert('Usuario creado con éxito. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar', err);
        alert('No se pudo crear el usuario. Verifica los datos.');
      }
    });
  }
}
