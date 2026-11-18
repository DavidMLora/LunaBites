import { money } from '../../data/products';
import { branchById } from '../../data/branches';
import type { Order } from '../../lib/types';

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(new Date(iso));
export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City',
  }).format(new Date(iso));

export default function OrderDetails({
  order,
  showHistory = true,
}: {
  order: Order;
  showHistory?: boolean;
}) {
  return (
    <>
      <ul className="order-details-list">
        {order.items.map((item) => (
          <li key={item.productId}>
            <span>
              {item.quantity} × {item.name}
              <small style={{ display: 'block', color: 'var(--muted)' }}>
                {money(item.unitPrice)} MXN por unidad
              </small>
            </span>
            <strong>{money(item.quantity * item.unitPrice)}</strong>
          </li>
        ))}
      </ul>
      <div className="order-meta">
        <span>{branchById(order.branchId)?.name} · ubicación demo</span>
        <strong>{money(order.total)} MXN</strong>
      </div>
      <p className="small muted" style={{ marginTop: 13 }}>
        Pago simulado con {order.payment}. Sin cargos ni recogida real.
      </p>
      {showHistory && (
        <>
          <h4 style={{ fontSize: '1rem', marginTop: 22 }}>El recorrido de tu pedido</h4>
          <ol className="order-history-log">
            {order.history.map((event, index) => (
              <li key={index}>
                {event.status} · <time dateTime={event.at}>{formatDateTime(event.at)}</time>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
