import { useState } from 'react';
import { money, type Product } from '../../data/products';
import { addToCart } from '../../lib/demoStore';
import QuantityControl from './QuantityControl';

export default function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  function add() {
    try {
      addToCart(product.id, quantity);
      setMessage(
        `${quantity === 1 ? 'Añadido' : 'Añadidos'} a tu bolsa. ${product.price === null ? 'Precio de la caja pendiente.' : 'Tu pausa te espera.'}`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible añadir el producto.');
    }
  }
  return (
    <article className="product-card">
      <div className={`product-image ${product.id === 'caja' ? 'is-box' : ''}`}>
        <img
          src={product.image}
          alt={
            product.id === 'caja'
              ? 'Sello oficial de la marca; empaque de la caja por definir'
              : 'Imagen conceptual de galletas de mantequilla en forma de luna'
          }
          width="560"
          height="620"
        />
        <span className="image-label">
          {product.id === 'caja'
            ? 'Empaque por definir · sello de marca'
            : 'Imagen conceptual · forma final por definir'}
        </span>
      </div>
      <h2>{product.name}</h2>
      <p className="product-subtitle">{product.subtitle}</p>
      <p className="product-description">{product.description}</p>
      <div className={`product-price ${product.price === null ? 'pending-price' : ''}`}>
        {product.price === null ? (
          'Precio por confirmar'
        ) : (
          <>
            {money(product.price)}
            <span>MXN · precio de referencia</span>
          </>
        )}
      </div>
      <div className="product-add">
        <QuantityControl value={quantity} onChange={setQuantity} label={product.subtitle} />
        <button type="button" className="button button-night" onClick={add}>
          Añadir a la bolsa <span aria-hidden="true">+</span>
        </button>
      </div>
      <p role="status" className="status-message">
        {message}
      </p>
    </article>
  );
}
