export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number | null;
  packages: number;
  image: string;
}

/** Única fuente de precios. null impide confirmar una compra sin cotización. */
export const products: readonly Product[] = [
  {
    id: 'individual',
    name: 'Tu pausa de la noche',
    subtitle: 'Paquete individual · 10 galletas',
    description:
      'Galletas de mantequilla con valeriana, toronjil y pasiflora. Una forma deliciosa de acompañar tu ritual nocturno.',
    price: 35,
    packages: 1,
    image: '/images/cookies-concept.webp',
  },
  {
    id: 'caja',
    name: 'Más noches para compartir',
    subtitle: 'Caja · 10 paquetes de 10 galletas',
    description:
      'La misma pausa, en una presentación con diez paquetes individuales. Precio pendiente de confirmar.',
    price: null,
    packages: 10,
    image: '/images/seal-presentation.png',
  },
];

export const money = (amount: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);

export const productById = (id: string) => products.find((product) => product.id === id);
