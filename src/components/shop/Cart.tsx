import { useState } from 'react';
import { useDemoStore } from '../../lib/useDemoStore';
import { cartQuantity, cartTotal, hasUnpricedItems, setQuantity } from '../../lib/demoStore';
import { money, productById } from '../../data/products';
import QuantityControl from './QuantityControl';

export default function Cart({ onCheckout }: { onCheckout: () => void }) {
  const state = useDemoStore();
  const [error, setError] = useState('');
  const pending = hasUnpricedItems(state);
  function change(id: string, quantity: number) {
    try {
      setQuantity(id, quantity);
      setError('');
    } catch (error) {
      setError(String(error));
    }
  }
  return (
    <section id="bolsa" className="cart-panel" aria-labelledby="cart-heading">
      <div className="cart-title">
        <h2 id="cart-heading">Tu bolsa</h2>
        <span>
          {cartQuantity(state)} {cartQuantity(state) === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>
      {state.cart.length === 0 ? (
        <div className="empty-state">
          <p>Un espacio para tu próxima pausa. Añade tus galletas para empezar.</p>
        </div>
      ) : (
        <>
          <ul className="cart-items">
            {state.cart.map((item) => {
              const product = productById(item.productId)!;
              return (
                <li className="cart-item" key={item.productId}>
                  <div className="cart-item-top">
                    <strong>{product.subtitle}</strong>
                    <span>
                      {product.price === null
                        ? 'Por confirmar'
                        : money(product.price * item.quantity)}
                    </span>
                  </div>
                  <div className="cart-item-bottom">
                    <QuantityControl
                      value={item.quantity}
                      label={`bolsa: ${product.subtitle}`}
                      onChange={(value) => change(item.productId, value)}
                    />
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => change(item.productId, 0)}
                      aria-label={`Retirar ${product.subtitle}`}
                    >
                      Retirar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="cart-total">
            <span>{pending ? 'Subtotal con precio' : 'Total de demostración'}</span>
            <strong>{money(cartTotal(state))}</strong>
          </div>
          {pending && (
            <p className="error-message">
              La caja no tiene precio confirmado. Retírala de la bolsa para simular la compra del
              paquete individual.
            </p>
          )}
          <button
            className="button button-night"
            type="button"
            onClick={onCheckout}
            disabled={pending}
          >
            Revisar mi pedido <span aria-hidden="true">→</span>
          </button>
          <p className="cart-caption">
            Precios en MXN. Recogida de demostración sin costo. No se realizará ningún cargo.
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </section>
  );
}
