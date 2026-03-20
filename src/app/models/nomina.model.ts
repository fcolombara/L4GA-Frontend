import { Transporte } from '../services/transporte';

export interface Nomina {
  id: number; // Ahora es obligatorio para el PUT
  fechaCarga?: Date;
  fechaActividad: string;
  transportes?: any[];
  linkTracking?: string; // <--- La nueva columna
}

export interface NominaCreateDto {
  fechaActividad: string;
  transporteIds: number[];
  linkTracking?: string;
}
