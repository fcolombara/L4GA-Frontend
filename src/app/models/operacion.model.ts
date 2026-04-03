import { Transporte } from './transporte.model';

export interface Operacion {
  id?: number;
  fecha: string;
  transporteId: number;
  transporte?: Transporte;
  trackingLink?: string;

  // Cremer
  horaOutCremer?: string;
  pesoCremer?: number;
  litrosCremer?: number;
  taraCremer?: number;

  // Green Oil
  horaInGreen?: string;
  litrosInGreen?: number;
  horaOutGreen?: string;
  litrosOutGreen?: number;

  // Puerto
  horaInPuerto?: string;
  pesoInPuerto?: number;
  litrosInPuerto?: number;
}
