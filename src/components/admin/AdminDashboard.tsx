import { useState } from 'react';
import { useDemoStore } from '../../lib/useDemoStore';
import { signIn, signOut, demoAdmin } from '../../lib/mockAuth';
import { branches } from '../../data/branches';
import OrdersQueue from './OrdersQueue';
import OrderDetails from './OrderDetails';
type Tab = 'queue' | 'completed' | 'branches';
export default function AdminDashboard() {
  const state = useDemoStore();
  const [tab, setTab] = useState<Tab>('queue');
  const [selectedId, setSelectedId] = useState('');
  const [notice, setNotice] = useState('');
  if (state.session?.role !== 'admin')
    return (
      <section className="admin-login">
        <h2>El otro lado de cada pausa.</h2>
        <p>
          Prueba la gestión de pedidos con el perfil de equipo. Verás los mismos pedidos que se
          crean en la tienda de este navegador.
        </p>
        <div className="demo-note" style={{ marginBottom: 25 }}>
          Este acceso solo simula un rol. No existe autenticación ni protección real de datos.
          Utiliza información ficticia.
        </div>
        <button
          type="button"
          className="button button-night"
          onClick={() => signIn(demoAdmin.name, demoAdmin.email, 'admin')}
        >
          Entrar como equipo demo <span aria-hidden="true">→</span>
        </button>
      </section>
    );
  const queue = state.orders.filter((order) => order.status !== 'Entregado');
  const completed = state.orders.filter((order) => order.status === 'Entregado');
  const filtered = tab === 'completed' ? completed : queue;
  const selected = filtered.find((order) => order.id === selectedId) ?? filtered[0];
  const tabs: { id: Tab; label: string }[] = [
    { id: 'queue', label: `Pedidos en cola (${queue.length})` },
    { id: 'completed', label: `Finalizados (${completed.length})` },
    { id: 'branches', label: 'Puntos de recogida' },
  ];
  function selectTab(id: Tab) {
    setTab(id);
    setSelectedId('');
    setNotice('');
  }
  return (
    <>
      <div className="dashboard-toolbar">
        <div>
          <h2>Hola, equipo Luna.</h2>
          <p>{state.session.email} · administración de demostración</p>
        </div>
        <button type="button" className="link-button" onClick={signOut}>
          Salir del modo equipo
        </button>
      </div>
      <div className="admin-summary">
        <div>
          <strong>{queue.length}</strong>
          <span>pedidos en cola</span>
        </div>
        <div>
          <strong>{queue.filter((order) => order.status === 'Listo para recoger').length}</strong>
          <span>listos para recoger</span>
        </div>
        <div>
          <strong>{completed.length}</strong>
          <span>pedidos finalizados</span>
        </div>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Secciones de administración">
        {tabs.map((item) => (
          <button
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={tab === item.id}
            tabIndex={tab === item.id ? 0 : -1}
            key={item.id}
            onClick={() => selectTab(item.id)}
            onKeyDown={(event) => {
              const index = tabs.findIndex((candidate) => candidate.id === item.id);
              let next = index;
              if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
              else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = tabs.length - 1;
              else return;
              event.preventDefault();
              selectTab(tabs[next].id);
              document.getElementById(`tab-${tabs[next].id}`)?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'branches' ? (
          <div className="branch-admin-list">
            {branches.map((branch) => {
              const assigned = state.orders.filter(
                (order) => order.branchId === branch.id && order.status !== 'Entregado',
              );
              return (
                <article className="app-panel" key={branch.id}>
                  <span className="demo-pill">Ubicación demo</span>
                  <h3 style={{ marginTop: 18 }}>{branch.name}</h3>
                  <p>
                    {assigned.length}{' '}
                    {assigned.length === 1 ? 'pedido activo asignado' : 'pedidos activos asignados'}
                  </p>
                  {assigned.length > 0 && (
                    <ul>
                      {assigned.map((order) => (
                        <li key={order.id}>
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => {
                              setTab('queue');
                              setSelectedId(order.id);
                            }}
                          >
                            {order.id}
                          </button>
                          <br />
                          {order.status}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p style={{ marginTop: 20 }}>
                    Zona de referencia sin dirección comercial ni horario confirmados.
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-order-layout">
            <OrdersQueue
              orders={filtered}
              selectedId={selected?.id ?? ''}
              onSelect={(id) => {
                setSelectedId(id);
                setNotice('');
              }}
            />
            {selected ? (
              <OrderDetails order={selected} key={selected.id} onUpdate={setNotice} />
            ) : (
              <div className="app-panel">
                <p className="small muted">
                  Los pedidos aparecerán aquí. Puedes crear uno en la tienda.
                </p>
                <a className="text-link" href="/tienda" style={{ marginTop: 20 }}>
                  Ir a la tienda <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      <p role="status" className="status-message">
        {notice}
      </p>
      <p className="small muted" style={{ marginTop: 25 }}>
        Para revisar el resultado, abre{' '}
        <a href="/cuenta" style={{ textDecoration: 'underline' }}>
          Mi cuenta
        </a>{' '}
        y cambia al perfil del cliente. Los datos permanecen en el mismo navegador.
      </p>
    </>
  );
}
