# Proyecto web CARDNET · revisión de implementación

Referencia local: análisis del 10 de octubre de 2026, 51 páginas. El PDF se conserva fuera del repositorio. El índice numerado identifica 39 productos, más las familias Doorway Virtual y Cortex. Los totales aproximados que aparecen al inicio del análisis difieren del índice.

## Recorrido de revisión

1. Abrir http://127.0.0.1:5187/panel/ y buscar Cloud Cardnet, Doorway Estacionamiento II o Cortex Bio-Pass Empresas. Ver la ficha y guardar una solución.
2. Abrir Cardy, elegir texto o voz, seleccionar una necesidad y una solución. Probar precio, implementación, enlace a la ficha y navegación a otro producto.
3. En localhost, abrir Probar video en una ficha con enlace del análisis. Si el reproductor emite fin de video, Cardy ofrece los próximos pasos. El botón Continuar después del video permite revisar el flujo aunque el enlace no se reproduzca.
4. Revisar Contacto, Cómo contratamos, Empresa, Privacidad y Términos. Los enlaces a WhatsApp preparan un mensaje que el visitante puede revisar.
5. Revisar /instalar/ y el catálogo sin conexión. La bienvenida de la PWA, el logo celeste y las soluciones guardadas se conservan.

## Cobertura y decisiones

| Área | Estado de la prueba | Para cerrar |
| --- | --- | --- |
| Catálogo y familias | 39 fichas base, dos familias, rutas HTML, títulos y descripciones. Se distinguen las variantes de estacionamiento y Bio-Pass Empresas. | Completar y aprobar los textos extensos, galerías y guiones por producto. Validar cifras comerciales y prestaciones. |
| Cardy | Guía por botones, texto y voz optativa, consulta de cotización, derivación a WhatsApp. | Confirmar el modelo de cotización inmediata y las tarifas. El documento combina respuestas directas y derivaciones. |
| Videos | Enlaces candidatos solo en localhost, reproductor a demanda y continuidad de la guía. | Validar identidad, reproducción y subtítulos. Resolver faltantes, duplicados y galerías. |
| Contacto | Tarjetas por país y enlaces comerciales. Se conserva Paraguay +595 981 405 077 como número general aprobado anteriormente. | El análisis también indica +595 976 291 499 para los botones generales. Confirmar el destino comercial y el canal del formulario. |
| Contratación y precios | Etapas del proceso y consulta según alcance. | Acordar 90 minutos frente a unas 2 horas, alcance de “sin inversiones”, precio y condiciones del Estacionamiento III y vigencia del porcentaje del II. |
| Legal y datos | Páginas base informativas. | Aprobar aviso y términos, consentimiento y tratamiento de datos antes de activar formularios, GA4 o integraciones sensibles. |
| SEO y rendimiento | Páginas HTML con H1 y metadatos por ficha. | Confirmar dominio canónico, sitemap, datos estructurados y medición real en móvil. |
| Fase posterior del análisis | La base comercial y la PWA quedan disponibles para revisión. | Portugués, selección de país, conversación libre y nuevas grabaciones. |

Esta revisión se prepara para publicar en cardnet.cd.com.py. El catálogo presenta el alcance comercial y las funciones en desarrollo. Pagos, biometría, datos clínicos y equipos físicos requieren sus respectivas implementaciones. El documento orienta el producto. Las comunicaciones y operaciones externas requieren autorización específica.
