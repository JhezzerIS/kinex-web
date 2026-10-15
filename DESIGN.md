# Kinex para la feria

Dirección confirmada por el usuario: nombre Kinex, estética clara y luminosa,
tipografía protagonista, acentos de color, diseño profesional y animaciones fluidas.
Antislop se aplica durante esta sesión; no se modifica una preferencia global.

Lectura: landing de feria para público general, editorial y tecnológica.
ENERGY 3 / RHYTHM 3 / MOTION 2.

## Decisiones de implementación

- Marfil #f8f7f3 y tinta #20231f: lectura de exposición, contraste y espacio.
- Azul #2854d8: identifica puntos, enlaces y selecciones; nunca cubre todo el sitio.
- Lima #dcebc1: destaca el contacto de los dedos, con texto oscuro.
- Manrope en titulares y DM Sans en lectura, alojadas localmente bajo OFL.
- La K se construye con trazos y nodos, como una trayectoria de la mano.
- La mano es una ilustración vectorial identificada como tal; no simula una captura real.
- La composición cambia de titular y figura a manifiesto, laboratorio, mapa y registro.
- Transiciones de 160–360 ms; una entrada inicial y trazas activadas por el visitante.
  Sin scroll secuestrado, sin audio y sin fondos que se muevan sin intervención.
- Movimiento reducido: se conservan todos los estados y se elimina la interpolación.
- Menú, tabs y mapas funcionan con teclado y con objetivos táctiles de al menos 44 px.
- Las etiquetas pequeñas en mayúsculas orientan por sección y tipo de dato; los
  titulares conservan caja natural. Manrope aporta una geometría próxima al símbolo
  de nodos; DM Sans facilita la lectura de explicaciones largas.
- Las flechas distinguen desplazamientos internos y salidas al código. Los signos
  del mapa representan captura, procesamiento, almacenamiento y ejecución.
- La cuadrícula de puntos se limita al visor técnico ampliado: sirve de referencia
  espacial al mover y ampliar el diagrama, no de fondo decorativo de la landing.
- Las piezas del mapa comparten tamaño para poder compararlas; el manifiesto,
  laboratorio, registro y cierre tienen composiciones distintas. La cabecera tenue
  conserva el contexto al desplazarse; no se aplica cristal a tarjetas ni paneles.

## Veracidad

El documento del proyecto define alcance y arquitectura. El código revisado corresponde
a `HoloControl-Access`, `develop`, revisión `bc6440d`. Se distinguen funciones implementadas,
ilustraciones, partes en integración y medios reales todavía pendientes.
No se publican metas de precisión/FPS como resultados medidos, testimonios ni personas inventadas.
El video vacío tiene un estado explícito; la galería no aparece hasta añadir fotografías.
