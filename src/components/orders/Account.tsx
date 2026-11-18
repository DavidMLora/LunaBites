import { useState, type SubmitEvent } from 'react';
import { useDemoStore } from '../../lib/useDemoStore';
import { signIn, signOut } from '../../lib/mockAuth';
import { hasPersistence } from '../../lib/demoStore';
import { demoEmail } from '../../data/demoOrders';
import OrderHistory from './OrderHistory';

export default function Account() {
  const state = useDemoStore();
  const [name, setName] = useState('Luna');
  const [email, setEmail] = useState(demoEmail);
  const [error, setError] = useState('');
  function login(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      signIn(name, email);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Revisa los datos.');
    }
  }
  if (state.session?.role === 'admin')
    return (
      <section className="session-notice">
        <h2>Estás en modo equipo.</h2>
        <p>
          Para recorrer la experiencia del cliente, cambia al perfil de Luna. Los pedidos y sus
          estados se conservarán en este navegador.
        </p>
        <div className="form-actions">
          <button
            type="button"
            className="button button-night"
            onClick={() => signIn('Luna', demoEmail)}
          >
            Ver como Luna · cliente demo
          </button>
          <a href="/admin" className="text-link">
            Volver a administración
          </a>
        </div>
      </section>
    );
  if (state.session?.role === 'customer') {
    const orders = state.orders.filter((order) => order.customerId === state.session?.email);
    return (
      <>
        <div className="dashboard-toolbar">
          <div>
            <h2>Buenas noches, {state.session.name}.</h2>
            <p>{state.session.email} · perfil de demostración</p>
          </div>
          <button type="button" className="link-button" onClick={signOut}>
            Salir del perfil
          </button>
        </div>
        <OrderHistory orders={orders} />
        {!hasPersistence() && (
          <p className="error-message" role="alert">
            El almacenamiento está bloqueado; los cambios se perderán al salir de la página.
          </p>
        )}
        <p className="small muted" style={{ marginTop: 25 }}>
          Los estados se actualizan al modificarlos en{' '}
          <a href="/admin" style={{ textDecoration: 'underline' }}>
            administración demo
          </a>
          , también entre pestañas de este mismo origen.
        </p>
      </>
    );
  }
  return (
    <section className="account-login">
      <figure className="login-art">
        <img
          src="/images/seal-presentation.png"
          width="431"
          height="452"
          alt="Sello oficial LunaBite"
        />
      </figure>
      <div className="login-copy">
        <h2>
          Un espacio para
          <br />
          <em>tus pequeñas pausas.</em>
        </h2>
        <p>
          Consulta tus pedidos y sigue su recorrido. Entra con el correo que utilizaste al confirmar
          la simulación.
        </p>
        <form onSubmit={login} className="form-stack">
          <label className="field">
            Nombre de demostración
            <input
              required
              autoComplete="off"
              value={name}
              maxLength={60}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            Correo de demostración
            <input
              required
              type="email"
              autoComplete="off"
              value={email}
              maxLength={159}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <button type="submit" className="button button-night">
            Entrar al prototipo <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="small muted">
          Sin contraseña ni registro real. Usa los datos ficticios precargados para ver pedidos de
          ejemplo. El acceso es una simulación local.
        </p>
      </div>
    </section>
  );
}
