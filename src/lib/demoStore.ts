import { demoOrders } from '../data/demoOrders';
import { branchById } from '../data/branches';
import { productById } from '../data/products';
import {
  orderStatuses,
  type DemoState,
  type Order,
  type OrderStatus,
  type PaymentMethod,
  type Session,
} from './types';

export const STORAGE_KEY = 'lunabites:prototype:v1';
export const initialState: DemoState = {
  version: 1,
  cart: [],
  orders: demoOrders,
  session: null,
  branchId: 'centro-demo',
};
let snapshot = initialState;
let initialized = false;
let storageAvailable = true;
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}
const quantityValid = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 99;
const emailValid = (value: unknown): value is string =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length < 160;

function validOrder(value: unknown): value is Order {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    !emailValid(value.customerId) ||
    typeof value.customerName !== 'string' ||
    typeof value.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    typeof value.branchId !== 'string' ||
    !branchById(value.branchId) ||
    !orderStatuses.includes(value.status as OrderStatus) ||
    !['PayPal', 'Mercado Pago'].includes(String(value.payment)) ||
    !Array.isArray(value.items) ||
    value.items.length === 0 ||
    !Array.isArray(value.history)
  )
    return false;
  if (
    !value.items.every(
      (item) =>
        isRecord(item) &&
        typeof item.productId === 'string' &&
        !!productById(item.productId) &&
        typeof item.name === 'string' &&
        quantityValid(item.quantity) &&
        typeof item.unitPrice === 'number' &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0,
    )
  )
    return false;
  const total = value.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
  return (
    value.total === total &&
    value.history.every(
      (event) =>
        isRecord(event) &&
        orderStatuses.includes(event.status as OrderStatus) &&
        typeof event.at === 'string' &&
        Number.isFinite(Date.parse(event.at)),
    )
  );
}

/** Validate browser data at the boundary. Replace this adapter with a REST service later. */
export function parseState(raw: string | null): DemoState {
  if (!raw) return initialState;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      value.version !== 1 ||
      !Array.isArray(value.cart) ||
      !Array.isArray(value.orders)
    )
      return initialState;
    const cart = value.cart.filter(
      (item) =>
        isRecord(item) &&
        typeof item.productId === 'string' &&
        !!productById(item.productId) &&
        quantityValid(item.quantity),
    );
    const unique = [
      ...new Map(
        cart.map((item) => [
          item.productId,
          { productId: String(item.productId), quantity: Number(item.quantity) },
        ]),
      ).values(),
    ];
    const candidate = value.session;
    const session: Session | null =
      isRecord(candidate) &&
      typeof candidate.name === 'string' &&
      emailValid(candidate.email) &&
      ['customer', 'admin'].includes(String(candidate.role))
        ? {
            name: candidate.name.slice(0, 60),
            email: candidate.email,
            role: candidate.role as Session['role'],
          }
        : null;
    return {
      version: 1,
      cart: unique,
      orders: value.orders.filter(validOrder),
      session,
      branchId:
        typeof value.branchId === 'string' && branchById(value.branchId)
          ? value.branchId
          : initialState.branchId,
    };
  } catch {
    return initialState;
  }
}

const emit = () => listeners.forEach((listener) => listener());
function initialize() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try {
    snapshot = parseState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    storageAvailable = false;
  }
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      snapshot = parseState(event.key === null ? null : event.newValue);
      emit();
    }
  });
}
export function getSnapshot() {
  initialize();
  return snapshot;
}
export const getServerSnapshot = () => initialState;
export function subscribe(listener: () => void) {
  initialize();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function hasPersistence() {
  initialize();
  return storageAvailable;
}

function save(next: DemoState) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    storageAvailable = false;
  }
  emit();
}

export function cartQuantity(state: DemoState) {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}
export function cartTotal(state: DemoState) {
  return state.cart.reduce(
    (sum, item) => sum + (productById(item.productId)?.price ?? 0) * item.quantity,
    0,
  );
}
export function hasUnpricedItems(state: DemoState) {
  return state.cart.some((item) => productById(item.productId)?.price == null);
}

export function addToCart(productId: string, quantity: number) {
  const current = getSnapshot();
  if (!productById(productId) || !quantityValid(quantity))
    throw new Error('Selecciona una cantidad de 1 a 99.');
  const existing = current.cart.find((item) => item.productId === productId);
  if (existing && existing.quantity + quantity > 99)
    throw new Error('Puedes añadir hasta 99 unidades de cada presentación.');
  save({
    ...current,
    cart: existing
      ? current.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...current.cart, { productId, quantity }],
  });
}
export function setQuantity(productId: string, quantity: number) {
  const current = getSnapshot();
  if (quantity === 0) {
    save({ ...current, cart: current.cart.filter((item) => item.productId !== productId) });
    return;
  }
  if (!quantityValid(quantity)) throw new Error('Selecciona una cantidad de 1 a 99.');
  save({
    ...current,
    cart: current.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
  });
}
export function selectBranch(branchId: string) {
  if (!branchById(branchId)) throw new Error('Selecciona un punto de demostración válido.');
  save({ ...getSnapshot(), branchId });
}
export function signIn(name: string, email: string, role: Session['role'] = 'customer') {
  const cleanEmail = email.trim().toLowerCase();
  if (!name.trim() || !emailValid(cleanEmail))
    throw new Error('Revisa tu nombre y correo de demostración.');
  save({ ...getSnapshot(), session: { name: name.trim().slice(0, 60), email: cleanEmail, role } });
}
export function signOut() {
  save({ ...getSnapshot(), session: null });
}

export function placeOrder(name: string, email: string, payment: PaymentMethod): Order {
  const current = getSnapshot();
  if (!current.cart.length) throw new Error('Tu bolsa está vacía.');
  if (hasUnpricedItems(current))
    throw new Error(
      'La caja aún no tiene precio. Retírala para continuar con el paquete individual.',
    );
  if (!branchById(current.branchId) || !['PayPal', 'Mercado Pago'].includes(payment))
    throw new Error('Revisa el punto de recogida y el método de pago.');
  const cleanEmail = email.trim().toLowerCase();
  if (!name.trim() || !emailValid(cleanEmail))
    throw new Error('Revisa tu nombre y correo de demostración.');
  const createdAt = new Date().toISOString();
  const order: Order = {
    id: `LB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    customerId: cleanEmail,
    customerName: name.trim().slice(0, 60),
    createdAt,
    items: current.cart.map((item) => {
      const product = productById(item.productId)!;
      return { ...item, name: product.subtitle, unitPrice: product.price! };
    }),
    total: cartTotal(current),
    branchId: current.branchId,
    payment,
    status: 'Recibido',
    history: [{ status: 'Recibido', at: createdAt }],
  };
  save({
    ...current,
    cart: [],
    orders: [order, ...current.orders],
    session: { name: order.customerName, email: cleanEmail, role: 'customer' },
  });
  return order;
}
export function updateOrderStatus(id: string, status: OrderStatus) {
  const current = getSnapshot();
  if (current.session?.role !== 'admin')
    throw new Error('Entra en el modo administrador de demostración.');
  const order = current.orders.find((item) => item.id === id);
  if (!order || orderStatuses.indexOf(status) !== orderStatuses.indexOf(order.status) + 1)
    throw new Error('Los pedidos avanzan al siguiente estado, en orden.');
  save({
    ...current,
    orders: current.orders.map((item) =>
      item.id === id
        ? { ...item, status, history: [...item.history, { status, at: new Date().toISOString() }] }
        : item,
    ),
  });
}
