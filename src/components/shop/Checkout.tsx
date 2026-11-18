import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { useDemoStore } from '../../lib/useDemoStore';
import { cartTotal, hasUnpricedItems, placeOrder, selectBranch } from '../../lib/demoStore';
import { money, productById } from '../../data/products';
import { branches, branchById } from '../../data/branches';
import { demoEmail } from '../../data/demoOrders';
import type { Order, PaymentMethod } from '../../lib/types';
import OrderTracker from '../orders/OrderTracker';

export default function Checkout({ onClose }: { onClose: () => void }) {
  const state = useDemoStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(
    state.session?.role === 'customer' ? state.session.name : 'Luna',
  );
  const [email, setEmail] = useState(
    state.session?.role === 'customer' ? state.session.email : demoEmail,
  );
  const [payment, setPayment] = useState<PaymentMethod>('Mercado Pago');
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    document.getElementById('checkout')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [step, order]);
  function confirm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    try {
      const placed = placeOrder(name, email, payment);
      setOrder(placed);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No fue posible simular el pedido.');
      busy.current = false;
    }
  }
  if (order)
    return (
      <section id="checkout" className="checkout-confirmation" aria-live="polite">
        <p className="eyebrow">Simulación completada · sin cargos</p>
        <h2 ref={heading} tabIndex={-1}>
          Tu pausa ya tiene un lugar.
        </h2>
        <p>
          Pedido <strong>{order.id}</strong> · {money(order.total)} MXN.
          <br />
          {branchById(order.branchId)?.name} · ubicación de demostración.
        </p>
        <OrderTracker status={order.status} />
        <p>
          Guardamos este pedido en tu cuenta de demostración <strong>{order.customerId}</strong>.
          Puedes seguirlo y probar los cambios desde administración.
        </p>
        <div className="form-actions">
          <a href="/cuenta" className="button button-night">
            Ver mi pedido <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="link-button" onClick={onClose}>
            Volver a las galletas
          </button>
        </div>
      </section>
    );
  if (!state.cart.length || hasUnpricedItems(state))
    return (
      <section id="checkout" className="checkout-section">
        <h2 ref={heading} tabIndex={-1}>
          Revisa tu bolsa.
        </h2>
        <p className="small muted" style={{ marginTop: 20 }}>
          {!state.cart.length
            ? 'Añade un paquete para continuar.'
            : 'Retira los productos sin precio confirmado para continuar.'}
        </p>
        <div className="form-actions">
          <button type="button" className="link-button" onClick={onClose}>
            Volver a la tienda
          </button>
        </div>
      </section>
    );
  return (
    <section id="checkout" className="checkout-section" aria-labelledby="checkout-heading">
      <p className="eyebrow">Una compra de prueba, paso a paso</p>
      <h2 id="checkout-heading" ref={heading} tabIndex={-1}>
        Completa tu pausa.
      </h2>
      <ol className="checkout-steps">
        {['Revisar pedido', 'Punto de recogida', 'Pago simulado'].map((label, index) => (
          <li key={label} aria-current={step === index + 1 ? 'step' : undefined}>
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      {step === 1 && (
        <div>
          <ul className="review-list">
            {state.cart.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.quantity} × {productById(item.productId)?.subtitle}
                </span>
                <strong>{money((productById(item.productId)?.price ?? 0) * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <p className="small muted">
            Recogida de demostración: sin costo. Todo el pedido es simulado.
          </p>
          <div className="checkout-total">
            <span>Total</span>
            <span>{money(cartTotal(state))} MXN</span>
          </div>
          <div className="form-actions">
            <button type="button" className="button button-night" onClick={() => setStep(2)}>
              Elegir recogida <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="link-button" onClick={onClose}>
              Editar mi bolsa
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <fieldset className="branch-options">
            <legend>¿Dónde te gustaría recoger?</legend>
            {branches.map((branch) => (
              <label className="branch-choice" key={branch.id}>
                <input
                  type="radio"
                  name="checkout-branch"
                  checked={state.branchId === branch.id}
                  onChange={() => selectBranch(branch.id)}
                  value={branch.id}
                />
                <span>
                  <strong>{branch.name}</strong>
                  <small>{branch.area}. Sin dirección comercial ni horarios confirmados.</small>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="small muted" style={{ marginTop: 16 }}>
            Estas zonas permiten probar el flujo. No son sucursales abiertas.
          </p>
          <div className="form-actions">
            <button type="button" className="button button-night" onClick={() => setStep(3)}>
              Continuar al pago simulado <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="link-button" onClick={() => setStep(1)}>
              Volver al pedido
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <form onSubmit={confirm}>
          <div className="form-stack">
            <div className="demo-note">
              No se abrirá ninguna pasarela. No introduzcas contraseñas ni datos bancarios; utiliza
              los datos ficticios precargados.
            </div>
            <div className="field-row">
              <label className="field">
                Nombre de demostración
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  autoComplete="off"
                />
              </label>
              <label className="field">
                Correo de demostración
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={159}
                  autoComplete="off"
                />
              </label>
            </div>
          </div>
          <fieldset className="payment-options">
            <legend>Elige cómo simular tu pago</legend>
            {(['PayPal', 'Mercado Pago'] as const).map((method) => (
              <label className="payment-option" key={method}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                />
                <span>
                  {method}
                  <small style={{ display: 'block', fontSize: '.6rem' }}>Demostración</small>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="small muted" style={{ marginTop: 23 }}>
            Recogida: {branchById(state.branchId)?.name} (demo).
            <br />
            Este correo identifica tus pedidos únicamente en este navegador.
          </p>
          <div className="checkout-total">
            <span>Total simulado</span>
            <span>{money(cartTotal(state))} MXN</span>
          </div>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button type="submit" className="button button-night">
              Confirmar simulación <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="link-button" onClick={() => setStep(2)}>
              Volver a recogida
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
