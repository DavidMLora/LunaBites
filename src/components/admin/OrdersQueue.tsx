import type { Order } from '../../lib/types';
import { branchById } from '../../data/branches';
export default function OrdersQueue({
  orders,
  selectedId,
  onSelect,
}: {
  orders: Order[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!orders.length)
    return (
      <div className="empty-state">
        <h3>Todo en calma.</h3>
        <p>No hay pedidos en este apartado.</p>
      </div>
    );
  return (
    <div className="admin-queue" aria-label="Seleccionar pedido">
      {orders.map((order) => (
        <button
          type="button"
          className="queue-item"
          key={order.id}
          aria-pressed={order.id === selectedId}
          onClick={() => onSelect(order.id)}
        >
          <span>
            <strong>{order.id}</strong>
            <small>
              {order.customerName} · {branchById(order.branchId)?.name}
            </small>
            <small>{order.status}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </button>
      ))}
    </div>
  );
}
