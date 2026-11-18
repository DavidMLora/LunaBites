import { useState } from 'react';
import { products } from '../../data/products';
import { useDemoStore } from '../../lib/useDemoStore';
import { hasPersistence } from '../../lib/demoStore';
import ProductCard from './ProductCard';
import Cart from './Cart';
import Checkout from './Checkout';

export default function Shop() {
  useDemoStore();
  const [checkout, setCheckout] = useState(false);
  function openCheckout() {
    setCheckout(true);
    window.requestAnimationFrame(() =>
      document
        .getElementById('checkout')
        ?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
          block: 'start',
        }),
    );
  }
  return (
    <>
      <div className="shop-layout">
        <div>
          <div className="product-list">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <div className="shop-details">
            <details>
              <summary>¿Qué contiene cada presentación?</summary>
              <p>
                El paquete individual incluye 10 galletas de mantequilla con valeriana, toronjil y
                pasiflora. La caja contiene 10 paquetes individuales, 100 galletas en total.
              </p>
            </details>
            <details>
              <summary>Sobre la formulación y los ingredientes</summary>
              <p>
                Luna Bites es un alimento, no un medicamento. La formulación, el etiquetado y la
                información definitiva de alérgenos están pendientes de validación. No se ofrecen
                beneficios clínicos demostrados del producto.
              </p>
            </details>
            <details>
              <summary>¿Cómo funciona esta compra de prueba?</summary>
              <p>
                Añade productos, revisa tu bolsa, selecciona una zona de recogida y confirma un pago
                ficticio. El pedido se guarda en este navegador y puede consultarse en tu cuenta y
                en administración demo.
              </p>
            </details>
          </div>
        </div>
        <aside className="shop-sidebar" aria-label="Bolsa de compra">
          <Cart onCheckout={openCheckout} />
        </aside>
      </div>
      {!hasPersistence() && (
        <p role="alert" className="demo-note persistence-note">
          El almacenamiento local está bloqueado. Puedes explorar esta página, pero los cambios no
          se conservarán al navegar o recargar. Habilita el almacenamiento del sitio para probar el
          flujo completo.
        </p>
      )}
      {checkout && (
        <Checkout
          onClose={() => {
            setCheckout(false);
            document.getElementById('bolsa')?.scrollIntoView();
          }}
        />
      )}
    </>
  );
}
