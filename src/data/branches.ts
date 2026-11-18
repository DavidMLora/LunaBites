export interface Branch {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

/** Coordenadas de zonas de referencia, NO establecimientos comerciales. */
export const branches: readonly Branch[] = [
  {
    id: 'centro-demo',
    name: 'Zona Centro',
    area: 'Aguascalientes · punto de referencia de demostración',
    lat: 21.8803,
    lng: -102.296,
  },
  {
    id: 'norte-demo',
    name: 'Zona Norte',
    area: 'Aguascalientes · punto de referencia de demostración',
    lat: 21.919,
    lng: -102.301,
  },
  {
    id: 'oriente-demo',
    name: 'Zona Oriente',
    area: 'Aguascalientes · punto de referencia de demostración',
    lat: 21.884,
    lng: -102.26,
  },
];
export const branchById = (id: string) => branches.find((branch) => branch.id === id);
