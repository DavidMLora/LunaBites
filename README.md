# Luna Bites · El jardín de medianoche

Primera versión completa de un prototipo local de repostería funcional botánica. Astro y TypeScript estricto para las páginas y la narrativa; React solo en bolsa, compra, cuenta, mapa y administración. Sin backend, autenticación real ni pagos.

## Ejecutar

Requisitos: Node.js 22.12 o superior (verificado con Node 24.16), npm y un navegador moderno.

```sh
npm ci
npm run dev
```

Abrir **http://127.0.0.1:4321/**. Mantén siempre este origen: `localhost` y `127.0.0.1` tienen almacenamiento diferente. Si el puerto está ocupado, Astro imprime el nuevo puerto; utiliza ese mismo origen en todas las pestañas.

```sh
npm run check   # Tipos estrictos, componentes Astro y React
npm test        # 6 pruebas del flujo y del adaptador de datos
npm run build  # Comprobación de tipos y sitio estático en dist/
npm run preview
```

Se utiliza Astro **5.18.2** con la integración oficial React **4.4.2**. Se probó Astro 7.4.12, pero Windows rechazó la carga de su dependencia nativa Sätteri (error 4551). Se eligió una versión estable que funciona en este entorno. El lockfile fija las versiones reproducibles. El prototipo no utiliza endpoints de servidor.

## Recorrido de prueba

1. Desde el inicio, abre **Las galletas** (`/tienda`). Selecciona una cantidad del paquete individual y añádela a la bolsa.
2. Pulsa **Revisar mi pedido**, revisa el total y elige una zona de recogida de demostración.
3. Selecciona PayPal o Mercado Pago (ambos simulados) y conserva el perfil ficticio `Luna / luna@ejemplo.test`. Confirma la simulación. No se contacta ninguna pasarela ni se cobra.
4. Abre **Ver mi pedido** o `/cuenta`: el pedido aparece junto a los ejemplos precargados.
5. Abre `/admin` y pulsa **Entrar como equipo demo**. Selecciona ese mismo pedido y avanza: **Recibido → En preparación → Listo para recoger → Entregado**. Al entregarse pasa a Finalizados.
6. Vuelve a `/cuenta` y pulsa **Ver como Luna · cliente demo** para observar el cambio. Si utilizaste otro correo ficticio, sal del perfil e ingresa con ese mismo correo.
7. En `/admin`, **Puntos de recogida** agrupa los pedidos activos por zona y permite abrirlos directamente.

El perfil del equipo es `equipo@ejemplo.test`, sin contraseña. Los roles son una simulación pública, **no un control de acceso**. La sesión se comparte entre pestañas del mismo origen, al igual que los pedidos.

La caja de diez paquetes admite cantidades y puede añadirse a la bolsa, pero **no se puede confirmar mientras su precio sea `null`**. No se inventa un precio ni se cobra como si fuera gratuita. Retírala para completar la demostración con el paquete individual. Al confirmar un precio numérico en `products.ts`, el flujo la admite automáticamente.

## Páginas

| Ruta        | Experiencia                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `/`         | Narrativa en seis secciones, fotografía conceptual protagonista y branding original |
| `/ciencia`  | Herbario, tres plantas, hidrolatos, elaboración y fuentes                           |
| `/tienda`   | Dos presentaciones, bolsa y checkout de tres pasos                                  |
| `/recogida` | Leaflet + OpenStreetMap y selector accesible de zonas ficticias                     |
| `/cuenta`   | Acceso de demostración, historial, detalle y seguimiento                            |
| `/admin`    | Rol de equipo, cola, finalizados, detalle y pedidos por zona                        |

## Modificar el proyecto

- **Identidad:** `src/styles/tokens.css`. Colores, tipografía, espaciado, radios y sombras en un solo lugar. Georgia conserva la identidad de marca; Segoe UI hace legibles los controles y los textos pequeños.
- **Plantas:** `src/data/plants.ts`. Nombres científicos y textos compartidos entre inicio y ciencia: valeriana, toronjil morado (_Agastache mexicana_) y pasiflora. Los identificadores de imágenes y anclas existentes se conservan para mantener los enlaces.
- **Diseño responsive:** `src/styles/global.css`. Composiciones y ajustes específicos para escritorio, tableta y móvil, además de foco visible y movimiento reducido.
- **Productos y precios:** `src/data/products.ts`. El precio individual inicial es $35 MXN de referencia; el precio de caja es `null` hasta su confirmación. Los pedidos guardan una copia del precio al confirmar para conservar su historial.
- **Ubicaciones:** `src/data/branches.ts`. Las tres coordenadas son zonas de referencia, no sucursales comerciales. Reemplazar nombres, coordenadas y avisos solo cuando existan datos definitivos.
- **Pedidos iniciales:** `src/data/demoOrders.ts`.
- **Estado y persistencia:** `src/lib/demoStore.ts`. Validación, bolsa, pedidos, cambios de estado y eventos de almacenamiento. `useDemoStore.ts` enlaza todas las islas React con `useSyncExternalStore`.
- **Tipos:** `src/lib/types.ts`. Modelo compartido de productos de pedido, roles, estados y pagos.
- **Roles:** `src/lib/mockAuth.ts`. Punto de sustitución para un futuro proveedor de identidad.
- **Narrativa:** componentes independientes en `src/components/home/` y `src/components/science/`.
- **Imagen conceptual y procedencia:** `docs/ASSETS.md`.
- **Revisión realizada:** `docs/QA.md` y capturas en `docs/screenshots/`.

## Datos locales y reinicio

La clave `lunabites:prototype:v1` contiene bolsa, pedidos, perfil y zona elegida. Los cambios notifican a todas las islas y a otras pestañas del mismo origen. No se envían a un servidor. Si el navegador bloquea el almacenamiento, se muestra un aviso; en ese caso el estado solo dura mientras permanezcas en esa página.

Para volver a los ejemplos iniciales, elimina únicamente esa clave desde las herramientas del navegador y recarga:

```js
localStorage.removeItem('lunabites:prototype:v1');
location.reload();
```

Los datos guardados deben ser ficticios: no hay privacidad entre perfiles simulados. Los datos dañados o de una versión desconocida se descartan de manera controlada. Cambiar los ejemplos en el archivo no sobrescribe pedidos ya guardados; reinicia la clave para volver a sembrarlos.

## Preparación para servicios REST

`demoStore.ts` concentra las operaciones del dominio y la persistencia. Para una fase posterior, sustituye la lectura/escritura local por un adaptador de servicio y conserva los tipos compartidos; utiliza una caché cliente con notificaciones equivalentes. El servidor deberá calcular importes, validar transiciones, controlar concurrencia y aplicar autenticación y autorización reales. Los roles del navegador nunca servirán como control de seguridad. Los pagos reales requerirán endpoints, credenciales de servidor y confirmación del proveedor.

## Límites deliberados

- La imagen principal fue generada como visual conceptual: no representa una fotografía ni forma final confirmada. Los logotipos y las ilustraciones botánicas son los originales proporcionados.
- No hay empaque definitivo de la caja; se muestra el sello original y se indica que está por definir.
- No existen sucursales comerciales confirmadas, horarios ni teléfonos inventados.
- El etiquetado definitivo está pendiente de validación; la tienda informa sobre trigo, huevo y leche.
- Los textos botánicos describen _Valeriana officinalis_, _Agastache mexicana_ y _Passiflora edulis_, con referencias específicas de las especies y sin atribuir efectos clínicos a las galletas.
- Solo el mapa necesita Internet para descargar teselas de OpenStreetMap. La lista de recogida funciona aunque no carguen. El resto de los recursos visuales se sirve localmente.
- Las compras y los perfiles son de demostración. Sin servicios comerciales, analítica, fuentes remotas ni comunicación con pasarelas de pago.

## Formato

```sh
npx prettier --write src tests astro.config.mjs
```
