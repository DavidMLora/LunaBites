import type { Order } from '../../lib/types';
import { branchById } from '../../data/branches';
import { money } from '../../data/products';
import OrderTracker from './OrderTracker';
import OrderDetails, { formatDate } from './OrderDetails';

export default function OrderHistory({ orders }: { orders: Order[] }) {
  if (!orders.length)
    return (
      <div className="empty-state">
        <h3>Tu historia empieza con una pausa.</h3>
        <p>Todavía no hay pedidos asociados a este correo en este navegador.</p>
        <a className="button button-night" href="/tienda">
          Descubre las galletas <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  return (
    <div className="order-list">
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <header className="order-card-header">
            <div>
              <h3>Pedido {order.id}</h3>
              <p>
                <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time> · demostración
              </p>
            </div>
            <span className={`tag ${order.status === 'Entregado' ? 'tag-delivered' : ''}`}>
              {order.status}
            </span>
          </header>
          <OrderTracker status={order.status} />
          <div className="order-meta">
            <span>{branchById(order.branchId)?.name} · punto demo</span>
            <strong>{money(order.total)} MXN</strong>
          </div>
          <details>
            <summary>Ver productos, pago y recorrido</summary>
            <OrderDetails order={order} />
          </details>
        </article>
      ))}
    </div>
  );
}
