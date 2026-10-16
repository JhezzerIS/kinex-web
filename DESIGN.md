# Kinex para la feria

Dirección confirmada por el usuario: nombre Kinex, estética clara y luminosa,
tipografía protagonista, acentos de color, diseño profesional y animaciones fluidas.
Antislop se aplica durante esta sesión; no se modifica una preferencia global.

Lectura: landing de feria para público general, editorial y tecnológica.
ENERGY 3 / RHYTHM 3 / MOTION 2.

## Decisiones de implementación

- Marfil #f8f7f3 y tinta #20231f: lectura de exposición, contraste y espacio.
- Azul #2854d8: identifica la marca, enlaces, CTA y selecciones.
- Verde #56e7a0: puntos y conexiones del seguimiento, idéntico al banner de EXPOSIS.
- Lima #dcebc1: destaca la anotación de la mano, con texto oscuro.
- Manrope en titulares y DM Sans en lectura, alojadas localmente bajo OFL.
- La K se construye con trazos y nodos, como una trayectoria de la mano.
- Las manos son las imágenes realistas aprobadas para el banner, optimizadas a WebP.
  Se presentan como representaciones, no como capturas del programa. Foto y 21 puntos
  comparten encuadre SVG, escala uniforme y reflejo para mostrar siempre manos izquierdas.
- Los CTA del hero distinguen explorar gestos de consultar la arquitectura; ocupan el
  ancho disponible en móvil y mantienen una altura táctil de al menos 56 px.
- El equipo usa las cinco fotos originales y los roles aportados por el usuario.
  Las tarjetas dan el mismo peso a cada contribución: cinco columnas en escritorio,
  tres o dos en anchuras intermedias y filas con retrato junto al texto en móvil.
  El fondo continuo separa al equipo del registro del programa; las etiquetas resumen
  contribuciones concretas y no funcionan como botones.
- La composición cambia de titular y figura a manifiesto, laboratorio, mapa y equipo.
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

El documento del proyecto define alcance y arquitectura. El mapa técnico conserva la
referencia `bc6440d`. El catálogo ilustrado de gestos sigue la revisión `a2fbbc1` del
sistema, ya utilizada para el banner. Las manos se presentan como representaciones
de los gestos; la sección de video fue retirada por indicación del usuario.
No se publican metas de precisión/FPS como resultados medidos, testimonios ni personas inventadas.
El video vacío tiene un estado explícito; la galería no aparece hasta añadir fotografías.
