import { Transporte } from './transporte.model';

export interface Operacion {
  id?: number;
  fecha: string;
  transporteId: number;
  transporte?: Transporte;
  trackingLink?: string;

  // --- ETAPA 1: SALIDA CREMER ---
  horaArriboCremer?: string;
  horaCargaNeutroCremer?: string;
  horaOutCremer?: string;
  taraCremer?: number;
  pesoCargadoCremer?: number; // Antes era pesoCremer
  pesoTotalCremer?: number;
  litrosCremer?: number; // Calculado al 92% en el Back

  // --- ETAPA 2: INGRESO GREEN OIL ---
  horaArriboGreen?: string;
  horaInPlantaGreen?: string;
  horaDescargaGreen?: string;
  volDescargadoGreen?: number; // Antes era litrosInGreen
  pesoGreenIngreso?: number;   // Calculado al 108.695% en el Back

  // --- ETAPA 3: SALIDA GREEN OIL ---
  horaEquipoListoGreen?: string;
  horaCargaBioGreen?: string;
  horaOutGreen?: string;
  volCargadoGreen?: number;    // Antes era litrosOutGreen
  pesoGreenEgreso?: number;    // Calculado al 113.636% en el Back

  // --- ETAPA 4: INGRESO A PUERTO ---
  horaArriboPuerto?: string;
  horaInUnidadPuerto?: string;
  pesajePuerto?: number;       // El bruto de balanza en puerto
  pesoRecibidoPuerto?: number; // Neto
  litrosRecibidosPuerto?: number; // Calculado al 88% en el Back
}
