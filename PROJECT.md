# CARDNET — Plataforma integral

## Primera entrega

Actualización de inicio local y apariencia: acceso de inicio persistente en segundo plano, comprobación de disponibilidad, reutilización de instancia existente y acceso separado para detener solo el proceso de este proyecto. Selector global de seis paletas, persistencia local de la preferencia y restauración antes del primer render.

Verificado en esta actualización: comprobación TypeScript y compilación correctas; inicio desde proceso detenido; persistencia del servidor tras terminar el iniciador; apertura repetida sin duplicar el PID; parada del proceso propio; seis valores de color aplicados desde la interfaz; persistencia tras recarga y al navegar a la presentación; selector en dos columnas a 390 px. El servidor se deja activo para la prueba del usuario.

Presentación institucional en `/soluciones`, panel de operaciones adaptable, catálogo de 37 soluciones del documento base, filtros por sector, búsqueda, detalle de alcance, registro de empresas, solicitudes con estados, exportación CSV y actividad auditada.

Los registros están diseñados para almacenarse en D1, asociados a la identidad autenticada de cada usuario. El usuario pidió mantener todo únicamente en su computadora: no sincronizar ni publicar. Solo se creó previamente el identificador de un alojamiento sin código; la sincronización fue detenida y no se publicó el sitio. No hay datos empresariales ficticios ni indicadores inventados.

## Verificación

Pasó `node scripts/check-records-unit.mjs`: ejecuta el código real de la API con un adaptador D1 sobre SQLite en memoria. Comprueba rechazo sin sesión, validación de datos, protección de origen, persistencia, estados, auditoría y aislamiento de dos cuentas.

Completado: instalación, comprobación TypeScript, generación y aplicación de la migración local, compilación y prueba HTTP real con `scripts/check-records.mjs` (autenticación local, validación, origen, persistencia, cambios de estado y auditoría). En navegador se comprobó iniciar sesión, registrar una empresa ficticia, su aparición en actividad, navegar a la presentación, buscar soluciones y abrir su ficha. Se revisaron los diseños de escritorio, tableta y celular; la presentación móvil no tiene desbordamiento horizontal.

La identidad y los permisos de producción compartida siguen pendientes. La prueba en memoria no sustituye validar integraciones alojadas, que no se utilizarán por indicación del usuario. Se conservaron registros claramente identificados como pruebas en la base local.

Esta entrega organiza empresas dentro de un espacio personal. No implementa todavía membresías compartidas, permisos corporativos ni contratación de servicios. El catálogo no activa módulos operativos.

## Estructura

- `app/workspace.tsx`: interfaz y navegación del espacio.
- `app/soluciones/page.tsx`: presentación institucional y catálogo por sectores.
- `app/theme.css`: diseño adaptable y visuales originales construidos con CSS e iconografía.
- `lib/catalog.ts`: catálogo y alcance de las soluciones.
- `app/api/records/route.ts`: lectura, creación y cambio de estado autenticados.
- `db/schema.ts`: registros y auditoría.
- `drizzle/`: migraciones de base de datos.
- `REQUIREMENTS.md`: matriz de trazabilidad de las 37 soluciones, reglas y dependencias.
- `.openai/hosting.json`: identidad del sitio y almacenamiento.

## Seguridad de esta entrega

Cada consulta filtra por identidad de usuario obtenida del servidor. Las escrituras validan origen, campos y permisos sobre el registro. Cambios y creación escriben auditoría en una misma operación de base de datos. Los registros no se borran desde la interfaz.

## Flujo de revisión

1. Abrir la plataforma e iniciar sesión.
2. Registrar una empresa con datos de prueba.
3. Recargar y comprobar persistencia.
4. Explorar y filtrar el catálogo.
5. Abrir una solución y registrar una solicitud.
6. Cambiar su estado a En atención y después Resuelta.
7. Comprobar indicadores y actividad.
8. Exportar el listado.
9. Verificar interfaz a 390 px y escritorio.

## Siguientes entregas

1. Organizaciones con miembros, roles, sucursales y permisos; auditoría ampliada.
2. Accesos: personas, zonas, credenciales, invitados, QR y simulador de controlador.
3. Estacionamientos: sesiones, tarifas, ocupación, pago simulado y salidas.
4. Reservas: recursos, disponibilidad, concurrencia y cancelaciones.
5. Conectores de pago y WhatsApp con entornos de prueba autorizados.
6. Transporte, rondas, visitas y entregas.
7. DOOH, cloud y dispositivos.
8. Verticales Cortex, seguros y mantenimiento.
9. Salud con revisión profesional, consentimientos y controles específicos.

## Límites conservados del alcance

- Centinela: inventario, mantenimiento y supervisión; sin control de armas.
- Viaje Blindado: salida segura independiente del pago.
- Bio-Cuántico: gestión documental, sin diagnóstico.
- Mantenimiento vehicular: ampliación propuesta, no detallada en el PDF.
- QR o documento ingresado no equivalen a identidad verificada.
- Notificaciones, pagos y equipos físicos requieren proveedores y pruebas reales.

## Desarrollo

Node >=22.13.0. Instalar con el helper de Sites indicado en README. Ejecutar `npm run db:generate` al modificar esquema, construir y aplicar migraciones locales según README. `npm run dev` inicia el entorno local. `node node_modules/typescript/bin/tsc --noEmit` comprueba tipos una vez completada la instalación.

El acceso local se simula mediante `/signin-with-chatgpt?return_to=/`; ese mecanismo de desarrollo no se incluye en producción. La identidad alojada es administrada por Sites.

## Presentación corporativa local

La página /soluciones incorpora una portada fotográfica, secciones de cloud, inteligencia artificial y Doorway, seis sectores y un catálogo filtrable de 37 soluciones. Se integraron 13 imágenes conceptuales originales; los prompts y archivos están documentados en IMAGES.md. El panel y los detalles de módulos comparten estas imágenes. Se conservan las seis paletas y los estados de desarrollo del catálogo. Todo permanece en esta computadora.


La apariencia incluye modos claro y oscuro en el selector Temas. Se recuerda por navegador, independientemente de las seis paletas, y se aplica antes del primer renderizado. Restablecer vuelve a naranja y modo claro.

