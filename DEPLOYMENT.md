# Publicar CARDNET en cardnet.cd.com.py

## Configuración de Despliegue Git

| Campo | Valor |
| --- | --- |
| Repositorio | https://github.com/diclar747/cardnet.git |
| Rama | main |
| Directorio del proyecto | raíz del repositorio (.) |
| Node | 22.13 o superior |
| Instalación | npm ci --include=dev --include=optional |
| Compilación | npm run build |
| Directorio publicado / salida | dist |
| Documento inicial | index.html |
| Tipo | Estático |
| Comando de arranque | Ninguno: servir los archivos de dist |

**La raíz pública debe ser dist, no la raíz del repositorio ni dist/server.** El index.html de la raíz del código es una plantilla; se publica el generado en dist/index.html. Si existe un solo campo de construcción: `npm ci --include=dev --include=optional && npm run build`.

Actualizar desde Git y crear un despliegue del último commit. Cambiar cualquier configuración anterior de Worker a estática. No volver a publicar una versión antigua.

Páginas físicas generadas:

- dist/index.html: portada y catálogo.
- dist/soluciones/index.html: presentación, conserva los enlaces anteriores.
- dist/panel/index.html: catálogo y fichas.
- dist/assets/: CSS y JavaScript compilados.
- dist/images/cardnet/: las 13 imágenes originales.

El servidor debe resolver los directorios con su index.html y conservar los parámetros (por ejemplo /panel/?solucion=school). No necesita API, Cloudflare, D1 ni proceso Node en ejecución. Publicar solo dist, sin node_modules, código fuente, archivos de entorno ni bases locales. Conservar solo dist en cada versión reduce el espacio utilizado.

## Alternativa Docker en el VPS

```sh
git clone https://github.com/diclar747/cardnet.git
cd cardnet
docker compose up -d --build
curl -I http://127.0.0.1:8086/
curl -I http://127.0.0.1:8086/soluciones/
curl -I http://127.0.0.1:8086/panel/
```

El contenedor final sirve únicamente dist mediante Nginx, sin Node ni node_modules. El puerto 8086 está vinculado a loopback: configurar el proxy HTTPS existente de cardnet.cd.com.py hacia http://127.0.0.1:8086. Si el puerto ya está ocupado, elegir otro libre en Compose y ajustar el proxy. No sobrescribir otros dominios. Las imágenes Docker requieren acceso a Docker Hub. Esta alternativa necesita verificación en el VPS: Docker no estaba instalado en la computadora de desarrollo.

## Verificación local

```sh
npm run install:ci
npm run build
node scripts/check-static.mjs
npm run preview:static
```

Abrir http://127.0.0.1:5187. Comprobar portada, /soluciones/, /panel/?solucion=school, imágenes, búsqueda, seis colores y ambos modos. Tras publicar, repetir en HTTPS y verificar que CSS/JS respondan con sus tipos correctos.

## Alcance

Se publican presentación, catálogo de 37 soluciones, fichas, búsqueda y personalización. Los módulos mantienen sus estados de desarrollo.

La gestión persistente de empresas, solicitudes, usuarios y actividad **no está habilitada en la salida estática**: necesita backend, autenticación y base de datos. No se simulan registros guardados ni sesión. El código anterior se conserva: npm run dev abre el entorno local completo; npm run build:worker construye Workers/D1 y npm run start:worker permite probar esa compilación. Ambas variantes usan dist: para publicar HTML ejecutar siempre npm run build al final.

La autenticación del backend anterior depende de Sites y requiere reemplazo antes de alojarlo en un VPS. La publicación estática no usa esa autenticación ni confía en cabeceras de identidad.
