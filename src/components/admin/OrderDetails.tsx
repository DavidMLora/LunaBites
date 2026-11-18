import { useState } from 'react';
import { orderStatuses, type Order } from '../../lib/types';
import { updateOrderStatus } from '../../lib/demoStore';
import { branchById } from '../../data/branches';
import OrderTracker from '../orders/OrderTracker';
import CustomerOrderDetails, { formatDate } from '../orders/OrderDetails';
export default function OrderDetails({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (message: string) => void;
}) {
  const [error, setError] = useState('');
  const next = orderStatuses[orderStatuses.indexOf(order.status) + 1];
  function advance() {
    if (next) {
      try {
        updateOrderStatus(order.id, next);
        setError('');
        onUpdate(`Pedido ${order.id}: ${next}. El seguimiento del cliente se ha actualizado.`);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No se pudo actualizar el pedido.');
      }
    }
  }
  return (
    <article className="app-panel admin-order-detail">
      <div className="admin-detail-header">
        <h2>{order.id}</h2>
        <span className="tag">{order.status}</span>
      </div>
      <p className="small muted">Creado el {formatDate(order.createdAt)} · pedido simulado</p>
      <dl className="admin-detail-grid">
        <div>
          <dt>Cliente de demostración</dt>
          <dd>
            {order.customerName}
            <br />
            {order.customerId}
          </dd>
        </div>
        <div>
          <dt>Recogida asignada</dt>
          <dd>
            {branchById(order.branchId)?.name}
            <br />
            Ubicación de demostración
          </dd>
        </div>
        <div>
          <dt>Método de pago</dt>
          <dd>{order.payment} · simulado</dd>
        </div>
        <div>
          <dt>Estado del pago</dt>
          <dd>Simulación confirmada · sin cargo</dd>
        </div>
      </dl>
      <OrderTracker status={order.status} />
      <CustomerOrderDetails order={order} />
      <div className="admin-next">
        {next ? (
          <>
            <p>El siguiente cambio aparecerá también en el seguimiento del cliente.</p>
            <button type="button" className="button button-night" onClick={advance}>
              Marcar: {next} <span aria-hidden="true">→</span>
            </button>
          </>
        ) : (
          <p>Pedido finalizado. Su recorrido permanece en el historial.</p>
        )}
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
