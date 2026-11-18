import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState,
  parseState,
  getSnapshot,
  STORAGE_KEY,
  addToCart,
  setQuantity,
  cartTotal,
  placeOrder,
  signIn,
  updateOrderStatus,
  selectBranch,
} from '../src/lib/demoStore';

const storage = new Map<string, string>();
const handlers: ((event: { key: string; newValue: string | null }) => void)[] = [];
Object.defineProperty(globalThis, 'window', {
  value: {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
    addEventListener: (
      name: string,
      callback: (event: { key: string; newValue: string | null }) => void,
    ) => {
      if (name === 'storage') handlers.push(callback);
    },
  },
  configurable: true,
});

function reset() {
  getSnapshot();
  storage.clear();
  handlers.forEach((callback) => callback({ key: STORAGE_KEY, newValue: null }));
}

test('corrupted and unrecognized browser state falls back safely', () => {
  assert.equal(parseState('{broken'), initialState);
  assert.equal(parseState('{"version":2}'), initialState);
  const parsed = parseState(
    JSON.stringify({
      ...initialState,
      cart: [
        { productId: 'individual', quantity: -1 },
        { productId: 'unknown', quantity: 2 },
        { productId: 'individual', quantity: 1.5 },
      ],
      orders: [{ id: 'broken' }],
      branchId: 'fake',
    }),
  );
  assert.deepEqual(parsed.cart, []);
  assert.deepEqual(parsed.orders, []);
  assert.equal(parsed.branchId, initialState.branchId);
});

test('cart enforces quantities, merges additions, recalculates and removes items', () => {
  reset();
  assert.throws(() => addToCart('individual', -1));
  assert.throws(() => addToCart('unknown', 1));
  addToCart('individual', 2);
  addToCart('individual', 1);
  assert.equal(getSnapshot().cart.length, 1);
  assert.equal(cartTotal(getSnapshot()), 105);
  assert.throws(() => addToCart('individual', 99));
  setQuantity('individual', 5);
  assert.equal(cartTotal(getSnapshot()), 175);
  setQuantity('individual', 0);
  assert.equal(getSnapshot().cart.length, 0);
});

test('a pending box price blocks order creation without consuming the cart', () => {
  reset();
  addToCart('individual', 2);
  addToCart('caja', 1);
  assert.throws(() => placeOrder('Luna', 'luna@ejemplo.test', 'PayPal'), /precio/);
  assert.equal(getSnapshot().orders.length, initialState.orders.length);
  assert.equal(getSnapshot().cart.length, 2);
});

test('checkout creates a persistent customer order with exact lines and selected branch', () => {
  reset();
  addToCart('individual', 3);
  selectBranch('oriente-demo');
  assert.throws(() => placeOrder('Luna', 'invalid', 'PayPal'));
  const order = placeOrder('Luna', 'LUNA@ejemplo.test', 'Mercado Pago');
  assert.equal(order.total, 105);
  assert.equal(order.items[0].unitPrice, 35);
  assert.equal(order.branchId, 'oriente-demo');
  assert.equal(order.customerId, 'luna@ejemplo.test');
  assert.equal(order.status, 'Recibido');
  assert.equal(getSnapshot().cart.length, 0);
  assert.equal(getSnapshot().session?.role, 'customer');
  assert.ok(
    parseState(storage.get(STORAGE_KEY) ?? null).orders.some(
      (candidate) => candidate.id === order.id,
    ),
  );
  assert.throws(() => placeOrder('Luna', 'luna@ejemplo.test', 'PayPal'), /vacía/);
});

test('admin progresses the same customer order in sequence and retains its history', () => {
  reset();
  addToCart('individual', 1);
  const order = placeOrder('Luna', 'luna@ejemplo.test', 'PayPal');
  assert.throws(() => updateOrderStatus(order.id, 'En preparación'), /administrador/);
  signIn('Equipo', 'equipo@ejemplo.test', 'admin');
  assert.throws(() => updateOrderStatus(order.id, 'Entregado'), /siguiente/);
  updateOrderStatus(order.id, 'En preparación');
  updateOrderStatus(order.id, 'Listo para recoger');
  updateOrderStatus(order.id, 'Entregado');
  signIn('Luna', 'luna@ejemplo.test');
  const saved = getSnapshot().orders.find((candidate) => candidate.id === order.id)!;
  assert.equal(saved.status, 'Entregado');
  assert.equal(saved.history.length, 4);
  assert.equal(saved.total, 35);
});

test('a storage event synchronizes the snapshot used by other tabs', () => {
  reset();
  const otherTab = {
    ...initialState,
    cart: [{ productId: 'individual', quantity: 4 }],
    branchId: 'norte-demo',
  };
  handlers.forEach((callback) =>
    callback({ key: STORAGE_KEY, newValue: JSON.stringify(otherTab) }),
  );
  assert.equal(cartTotal(getSnapshot()), 140);
  assert.equal(getSnapshot().branchId, 'norte-demo');
});
