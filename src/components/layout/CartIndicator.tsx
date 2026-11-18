import { useDemoStore } from '../../lib/useDemoStore';
import { cartQuantity } from '../../lib/demoStore';
export default function CartIndicator() {
  const state = useDemoStore();
  const count = cartQuantity(state);
  return (
    <a
      href="/tienda#bolsa"
      className="bag-link"
      aria-label={`Bolsa, ${count} ${count === 1 ? 'artículo' : 'artículos'}`}
    >
      <svg
        width="21"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2" />
      </svg>
      <span className="bag-count">{count}</span>
    </a>
  );
}
