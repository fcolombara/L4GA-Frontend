export interface Transporte {
  id?: number;
  chofer: string;
  tracto: string;
  cisterna: string;
  anioTracto?: string;
  anioCisterna?: string;
  contacto?: string;
  linkTracking?: string; // Ya lo dejamos listo como pediste
}
