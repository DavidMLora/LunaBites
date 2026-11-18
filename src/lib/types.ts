export const orderStatuses = [
  'Recibido',
  'En preparación',
  'Listo para recoger',
  'Entregado',
] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentMethod = 'PayPal' | 'Mercado Pago';
export interface CartItem {
  productId: string;
  quantity: number;
}
export interface OrderLine extends CartItem {
  name: string;
  unitPrice: number;
}
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  createdAt: string;
  items: OrderLine[];
  total: number;
  branchId: string;
  payment: PaymentMethod;
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
}
export interface Session {
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
export interface DemoState {
  version: 1;
  cart: CartItem[];
  orders: Order[];
  session: Session | null;
  branchId: string;
}
