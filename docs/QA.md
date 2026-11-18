# Revisión de la primera versión

Fecha: 17 de noviembre de 2026, zona America/Mexico_City.

## Entorno y comprobaciones

- Windows, Node.js 24.16, Astro 5.18.2, integración oficial React 4.4.2.
- `npm run build`: tipos estrictos y generación estática de las seis páginas principales y la página 404. Sin errores, advertencias ni sugerencias de tipos.
- `npm test`: seis pruebas aprobadas. Cubren recuperación de datos dañados, cantidades y totales, bloqueo de productos sin precio, creación y persistencia de pedidos, progresión de estados y eventos de sincronización entre pestañas.
- La navegación se verificó en el navegador integrado, sirviendo desde `http://127.0.0.1:4321/`.
- Se comprobaron 172 referencias locales a enlaces, anclas y recursos en las siete páginas HTML generadas: cero referencias faltantes.

## Flujo observado en navegador

1. Añadir dos paquetes individuales: total $70 MXN.
2. Añadir una caja sin precio: confirmación deshabilitada y explicación visible. Retirarla permite continuar.
3. Recargar la tienda: la bolsa conserva cantidades e importe después de hidratarse.
4. Completar los tres pasos, elegir Zona Norte y PayPal simulado.
5. Confirmar: se genera un identificador, se vacía la bolsa y aparece el seguimiento “Recibido”.
6. Abrir la cuenta: aparece ese mismo pedido con su importe y zona.
7. Entrar como equipo en administración y avanzar a “En preparación” y “Listo para recoger”.
8. Volver al perfil de cliente: aparece “Listo para recoger” en ese mismo pedido.
9. Marcar “Entregado” desde administración: el pedido sale de la cola y aparece en Finalizados, con cuatro eventos en su historial.
10. Revisar Puntos de recogida en administración: pedidos activos agrupados por zona y acceso al detalle.

No se llamó a PayPal, Mercado Pago ni a un servicio comercial. El pedido de prueba quedó como dato ficticio en el navegador de revisión.

## Diseño y accesibilidad revisados

- Anchos de 320, 768 y 1440 px: las seis rutas se midieron comparando ancho de documento y ancho útil del viewport. Sin desbordamiento horizontal. También se revisaron portada, ciencia y checkout a 390 px.
- Se corrigió un desbordamiento del encabezado a 320 px reduciendo el logotipo y el espacio entre controles únicamente en pantallas menores a 380 px.
- Menú móvil: apertura, cierre con Escape, etiqueta accesible y foco de retorno al botón.
- Administración: flechas, Inicio y Fin para las pestañas; la selección y el panel cambian con el teclado.
- Checkout: foco en el encabezado al cambiar de paso y desplazamiento hasta el formulario; campos en una sola columna en móvil.
- Leaflet: el mapa muestra Aguascalientes, el selector conserva su elección y destaca el marcador correspondiente. Un observador recalcula su tamaño al cambiar el ancho disponible.
- Las zonas y el mapa indican que se trata de demostraciones sin establecimientos confirmados.
- Foco visible, enlaces para saltar al contenido, formularios etiquetados y estilos de movimiento reducido implementados. No se realizó una auditoría formal de WCAG ni una prueba con lector de pantalla.
- Recursos de imagen locales comprobados en las páginas; sin errores de consola observados al revisar el mapa.

## Capturas

- `screenshots/inicio-escritorio.jpg`: portada a 1440 px.
- `screenshots/inicio-completo.jpg`: recorrido completo del inicio en escritorio.
- `screenshots/inicio-movil.jpg`: portada a 390 px.
- `screenshots/checkout-movil.jpg`: último paso del checkout a 390 px.
- `screenshots/admin-escritorio.jpg`: gestión de un pedido desde el equipo.
- `screenshots/recogida-escritorio.jpg`: selector y mapa.
- `screenshots/pedido-confirmado.jpg`: confirmación de compra simulada.

## Pendientes de contenido comercial

Fotografía y forma final del producto; empaque definitivo; precio de la caja; sucursales, horarios y contactos; validación de formulación, alérgenos y etiquetado. Estos pendientes se identifican en la interfaz y no se sustituyen por datos comerciales inventados.
