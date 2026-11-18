import { orderStatuses, type OrderStatus } from '../../lib/types';
export default function OrderTracker({ status }: { status: OrderStatus }) {
  const active = orderStatuses.indexOf(status);
  return (
    <ol className="order-tracker" aria-label={`Seguimiento: ${status}`}>
      {orderStatuses.map((label, index) => (
        <li
          key={label}
          className={index <= active ? 'is-complete' : undefined}
          aria-current={index === active ? 'step' : undefined}
        >
          {label}
        </li>
      ))}
    </ol>
  );
}
