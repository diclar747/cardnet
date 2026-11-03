# CARDNET instalable

Página de instalación: https://cardnet.cd.com.py/instalar/.

## Uso

- Android: abrir en Chrome y tocar «Instalar app». Cuando el navegador habilita el aviso nativo, el botón abre la instalación. Si todavía no aparece, usar el menú de Chrome: «Instalar aplicación» o «Agregar a la pantalla principal».
- iPhone: abrir en Safari, Compartir → Agregar a pantalla de inicio. Activar «Abrir como app web» si se ofrece.
- Computadora: Chrome o Edge pueden ofrecer el ícono de instalación en la barra de direcciones.

La apariencia del diálogo y de la pantalla de arranque del sistema operativo depende del dispositivo. El manifiesto define nombre CARDNET, logo original, fondo oscuro, modo standalone, accesos al catálogo y captura móvil. La aplicación incorpora una breve bienvenida fotográfica al iniciarse en modo standalone. No se distribuye un APK ni se publica en tiendas.

## Sin conexión

El service worker precarga portada, catálogo, página de instalación, CSS/JS, logo y fotografías optimizadas (las 13 juntas pesan menos de 1 MB). Es necesario completar una primera carga con internet. Las fotos originales se guardan a medida que se visitan; sin conexión se usan las versiones livianas si hace falta. Una ruta que no esté guardada muestra una pantalla de desconexión con acceso al inicio.

Solo se guardan archivos públicos de esta presentación. Las rutas API, autenticación, solicitudes POST y servicios de terceros quedan fuera. WhatsApp e información nueva requieren conexión. La PWA no incorpora gestión persistente de usuarios, empresas ni solicitudes.

## Archivos y comprobaciones

- `public/manifest.webmanifest`: identidad e instalación.
- `public/pwa/`: íconos PNG estándar y maskable, Apple Touch Icon, portada y fotos WebP, captura real de la interfaz móvil.
- `app/pwa.tsx` y `app/pwa.css`: instalación y bienvenida.
- `scripts/service-worker.template.js`: navegación con prioridad de red, archivos versionados, imágenes offline y limpieza de cachés anteriores.
- `scripts/build-static.mjs`: crea `sw.js` con versión y lista de archivos reales. Debe servirse desde la raíz del dominio con tipo JavaScript.
- `node scripts/check-pwa.mjs`: comprueba tamaños de íconos, manifiesto, precarga y respuestas de navegación/fotos sin conexión mediante ejecución aislada del worker.
- `node scripts/create-pwa-assets.mjs`: regenera íconos desde el favicon SVG original y fotos livianas desde las imágenes corporativas. La captura móvil se conserva como recurso independiente.

Las actualizaciones del worker esperan a que se cierren las ventanas anteriores para no mezclar versiones mientras se utiliza la aplicación. El HTML usa prioridad de red. No configurar caché permanente para `/sw.js`; el ejemplo Nginx ya lo evita.

La instalación real y el arranque desde el ícono deben comprobarse en el teléfono del usuario; la revisión de escritorio no sustituye esa prueba.

Referencias: https://web.dev/learn/pwa/web-app-manifest y https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable.
