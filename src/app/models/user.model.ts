export interface AuthResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token?: string;
}

// AGREGÁ ESTA: Para el formulario de registro
export interface UsuarioRegistro {
  nombre: string;
  email: string;
  passwordHash: string;
  rol: string;
}
