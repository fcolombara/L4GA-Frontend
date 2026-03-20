export interface Transporte {
  id?: number;
  chofer: string;
  tracto: string;
  cisterna: string;
  anioTracto?: string;
  anioCisterna?: string;
  linkTracking?: string; // Lo agregamos aquí para que ya quede listo
}
