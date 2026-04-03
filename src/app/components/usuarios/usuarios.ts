import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {
    private authService = inject(AuthService);

    listaUsuarios: any[] = [];
    mostrarFormUsuario: boolean = false;

    // Flags para el estado de edición
    editando: boolean = false;
    usuarioIdEditando: number | null = null;

    nuevoUsuario: any = {
        Nombre: '',
        Email: '',
        PasswordHash: '',
        Rol: 'Visor'
    };

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios() {
        this.authService.getUsuarios().subscribe(d => this.listaUsuarios = d);
    }

    // 1. Prepara el form con los datos del usuario seleccionado
    prepararEdicion(u: any) {
        this.editando = true;
        this.mostrarFormUsuario = true;
        this.usuarioIdEditando = u.id;

        this.nuevoUsuario = {
            Nombre: u.nombre,
            Email: u.email,
            Rol: u.rol, // Asegurate que el valor coincida con los 'value' del <select>
            PasswordHash: '' // La dejamos vacía por seguridad
        };

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Método para limpiar todo y cerrar el form
    cancelarEdicion() {
        this.mostrarFormUsuario = !this.mostrarFormUsuario;
        if (!this.mostrarFormUsuario) {
            this.editando = false;
            this.usuarioIdEditando = null;
            this.nuevoUsuario = { Nombre: '', Email: '', PasswordHash: '', Rol: 'Visor' };
        }
    }

    registrarUsuario() {
        this.authService.registrar(this.nuevoUsuario).subscribe({
            next: () => {
                alert('Usuario creado con éxito');
                this.cargarUsuarios();
                this.cancelarEdicion();
            },
            error: (e) => alert("Error al registrar.")
        });
    }

    // 3. Nuevo método para actualizar (PUT)
    actualizarUsuario() {
        if (!this.usuarioIdEditando) return;

        // Creamos el body exacto que espera tu RolUpdateDto en .NET
        const request = {
            NuevoRol: this.nuevoUsuario.Rol
        };

        this.authService.actualizarRol(this.usuarioIdEditando, request.NuevoRol).subscribe({
            next: () => {
                alert('Rol actualizado con éxito en el sistema L4GA');
                this.cargarUsuarios();
                this.cancelarEdicion();
            },
            error: (e) => {
                console.error("Error API:", e);
                alert("No se pudo actualizar el rol. Revisá la consola.");
            }
        });
    }

    eliminarUsuario(id: number) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            this.authService.eliminarUsuario(id).subscribe(() => this.cargarUsuarios());
        }
    }
}
