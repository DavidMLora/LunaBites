import type { Order } from '../lib/types';

export const demoEmail = 'luna@ejemplo.test';
export const demoOrders: Order[] = [
  {
    id: 'LB-DEMO-001',
    customerId: demoEmail,
    customerName: 'Luna',
    createdAt: '2026-11-17T18:30:00-06:00',
    items: [
      {
        productId: 'individual',
        name: 'Paquete individual · 10 galletas',
        quantity: 2,
        unitPrice: 35,
      },
    ],
    total: 70,
    branchId: 'centro-demo',
    payment: 'Mercado Pago',
    status: 'En preparación',
    history: [
      { status: 'Recibido', at: '2026-11-17T18:30:00-06:00' },
      { status: 'En preparación', at: '2026-11-17T18:45:00-06:00' },
    ],
  },
  {
    id: 'LB-DEMO-002',
    customerId: demoEmail,
    customerName: 'Luna',
    createdAt: '2026-11-15T17:00:00-06:00',
    items: [
      {
        productId: 'individual',
        name: 'Paquete individual · 10 galletas',
        quantity: 1,
        unitPrice: 35,
      },
    ],
    total: 35,
    branchId: 'norte-demo',
    payment: 'PayPal',
    status: 'Entregado',
    history: [
      { status: 'Recibido', at: '2026-11-15T17:00:00-06:00' },
      { status: 'En preparación', at: '2026-11-15T17:15:00-06:00' },
      { status: 'Listo para recoger', at: '2026-11-15T18:00:00-06:00' },
      { status: 'Entregado', at: '2026-11-15T18:30:00-06:00' },
    ],
  },
];
