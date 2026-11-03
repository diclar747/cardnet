# Despliegue en cd.com.py

Destino previsto: VPS Linux con Docker. Repositorio: https://github.com/diclar747/cardnet.

## Estado de esta versión

La presentación, el catálogo, las seis paletas y los modos claro/oscuro están implementados. El panel cuenta con empresas, solicitudes y actividad. Los 37 módulos del catálogo conservan sus estados de desarrollo; no son 37 sistemas operativos terminados.

Esta versión usa Vinext, Cloudflare Workers y D1. No es una aplicación Node/Express convencional ni un sitio PHP. El comando `npm start` ejecuta el Worker construido mediante Wrangler/Miniflare local; es una vista previa, no una receta de producción para un VPS.

El acceso de desarrollo simulado solo existe en localhost. La autenticación de producción actual espera cabeceras verificadas por Sites y sus rutas de inicio de sesión. Un VPS no proporciona ese servicio automáticamente. No se debe publicar el panel confiando en cabeceras enviadas por el visitante.

## Comprobar el código en Linux

Requiere Node 22.13 o superior y las dependencias de desarrollo para construir.

```sh
git clone https://github.com/diclar747/cardnet.git
cd cardnet
npm run install:ci
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

Para evaluación aislada en el propio servidor, `npm start -- --port 8787` inicia la vista previa sobre 127.0.0.1. No exponerla como panel de producción. No copiar la base de datos de la computadora de desarrollo.

## Trabajo requerido para producción en el VPS

1. Adaptar la ejecución de Workers y el acceso D1 a un entorno de servidor soportado (por ejemplo Node y PostgreSQL), o mantener el backend en un proveedor compatible con Workers/D1.
2. Implementar autenticación y sesiones propias, permisos por organización y validación del origen de identidad; reemplazar las rutas de autenticación de Sites.
3. Preparar Dockerfile y Compose para el runtime definitivo, migraciones de base de datos, volumen persistente y copias de seguridad. No usar un servidor de desarrollo como proceso de producción.
4. Configurar proxy inverso, HTTPS y DNS de cd.com.py, sin sobrescribir un sitio existente. Comprobar rutas, imágenes, inicio de sesión, permisos y persistencia tras reiniciar.

Estos cambios y el despliegue real todavía no se han realizado. No se han recibido ni guardado credenciales del VPS.

## Archivos excluidos

Git excluye `node_modules`, compilaciones, `.env*`, `.dev.vars*`, claves PEM, `.wrangler`, `.sites-runtime`, capturas y temporales en `work`. Se incluyen las migraciones de esquema, sin registros personales. El PDF original no forma parte del repositorio.
