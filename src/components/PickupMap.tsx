import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { branches, branchById } from '../data/branches';
import { useDemoStore } from '../lib/useDemoStore';
import { selectBranch } from '../lib/demoStore';

export default function PickupMap() {
  const state = useDemoStore();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState('');
  useEffect(() => {
    let cancelled = false;
    let instance: LeafletMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    void import('leaflet')
      .then((L) => {
        if (cancelled || !container.current) return;
        instance = L.map(container.current, { scrollWheelZoom: false, zoomControl: true }).setView(
          [21.896, -102.289],
          12,
        );
        map.current = instance;
        resizeObserver = new ResizeObserver(() => instance?.invalidateSize({ pan: false }));
        resizeObserver.observe(container.current);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(instance);
        tiles.on('tileerror', () => {
          if (!cancelled)
            setMapError(
              'No se pudieron cargar algunas teselas. La lista de zonas sigue disponible.',
            );
        });
        markers.current = branches.map((branch, index) => {
          const marker = L.marker([branch.lat, branch.lng], {
            icon: L.divIcon({
              className: 'luna-marker',
              html: `<span class="map-pin">${index + 1}</span>`,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            }),
            title: `${branch.name} · ubicación de demostración`,
            alt: `Seleccionar ${branch.name}, zona de demostración`,
            keyboard: true,
          }).addTo(instance!);
          marker.on('click', () => selectBranch(branch.id));
          return marker;
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled)
          setMapError('El mapa no está disponible. Selecciona una zona desde la lista.');
      });
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?.remove();
      map.current = null;
      markers.current = [];
    };
  }, []);
  useEffect(() => {
    if (!ready || !map.current) return;
    const selected = branchById(state.branchId);
    if (selected)
      map.current.setView([selected.lat, selected.lng], 13, {
        animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    branches.forEach((branch, index) => {
      const element = markers.current[index]?.getElement();
      element?.querySelector('.map-pin')?.classList.toggle('active', branch.id === state.branchId);
      element?.setAttribute(
        'aria-label',
        `${branch.name}, ubicación demo${branch.id === state.branchId ? ', seleccionada' : ''}`,
      );
    });
  }, [state.branchId, ready]);
  return (
    <>
      <div className="pickup-layout">
        <div>
          <div className="pickup-list" aria-label="Zonas de recogida de demostración">
            {branches.map((branch, index) => (
              <button
                type="button"
                className="pickup-button"
                key={branch.id}
                aria-pressed={state.branchId === branch.id}
                onClick={() => selectBranch(branch.id)}
              >
                <span className="pickup-number">0{index + 1}</span>
                <span>
                  <strong>{branch.name}</strong>
                  <small>
                    Punto de demostración
                    <br />
                    Sin horario ni dirección comercial
                  </small>
                </span>
              </button>
            ))}
          </div>
          <p className="pickup-selection" role="status">
            Seleccionado: <strong>{branchById(state.branchId)?.name}</strong> (demo).
          </p>
          <a className="button button-night" href="/tienda">
            Elegir mis galletas <span aria-hidden="true">→</span>
          </a>
        </div>
        <div>
          <div
            ref={container}
            className="pickup-map"
            role="region"
            aria-label="Mapa de zonas de demostración en Aguascalientes"
          >
            {!ready && (
              <div className="map-fallback">
                {mapError || 'Preparando el mapa de Aguascalientes…'}
              </div>
            )}
          </div>
          <p className="map-note">
            Mapa: © OpenStreetMap. Los marcadores señalan zonas de referencia; no establecimientos
            comerciales. {mapError}
          </p>
        </div>
      </div>
    </>
  );
}
