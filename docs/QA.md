# Revisión de la landing Kinex

Revisión local: 15 de octubre de 2026. Resultado: **PASS** para la entrega de la
landing con multimedia real pendiente. No equivale a validar el programa de
Windows con una webcam. Las comprobaciones del despliegue público se realizan
por separado sobre la dirección publicada.

## Ejecución y evidencia

- `npm test`: compilación TypeScript estricta y Vite, **13 pruebas aprobadas** en Chromium.
- `prettier --check`: formato correcto en código, configuración y documentación revisados.
- `npm audit --omit=dev`: cero vulnerabilidades reportadas; no hay dependencias de ejecución.
- Anchuras comprobadas: **320, 390, 768 y 1440 px**, sin desbordamiento horizontal,
  también al seleccionar las seis posturas.
- Capturas locales en `.reports/`: página completa, portada, laboratorio, arquitectura,
  vistas móviles con cabecera, visor técnico claro y oscuro y tarjeta social.
- Consola de la landing sin errores y recursos sin respuestas HTTP de error durante las pruebas.
- Navegación real bajo `/kinex-web/`: fuentes, marca, estilos, scripts y mapa técnico cargan.
- Compilación de prueba con URL pública configurada: canonical, `og:url` e imagen
  social absoluta correctos. Esa URL de ejemplo no se incluye en `dist/`.
- QR de prueba PNG decodificado con OpenCV y destino de ejemplo verificado.
  `localhost` se rechaza. Es material de prueba excluido de la entrega pública.
- Animación normal de la mano comprobada: la posición final cambia tras la interpolación.
  Con movimiento reducido cambia de estado directamente.

## Recorrido de controles de la landing

| Control                                 | Acción observada                                                                    | Resultado |
| --------------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| Saltar al contenido                     | Foco por teclado y Enter llevan a `#contenido`                                      | PASS      |
| Marca de cabecera y pie                 | Regresan a `#inicio`                                                                | PASS      |
| El proyecto, Conoce la idea y continuar | Navegan a `#proyecto`                                                               | PASS      |
| Los gestos y Explora los gestos         | Navegan a `#gestos`                                                                 | PASS      |
| Por dentro                              | Navega a `#arquitectura`                                                            | PASS      |
| Menú móvil                              | Abre, cierra, cierra con Escape y al elegir un destino                              | PASS      |
| Índice                                  | Cambia ilustración, explicación, intención y estado de implementación               | PASS      |
| Pellizco                                | Cambia la postura y distingue clic de arrastre/dibujo previstos                     | PASS      |
| Dos dedos                               | Muestra scroll vertical y su explicación                                            | PASS      |
| Palma                                   | Explica activar/pausar y el tiempo de permanencia                                   | PASS      |
| Puño                                    | Explica la solicitud de modo y la acción prevista                                   | PASS      |
| Deslizar                                | Explica el gesto horizontal y los cambios de pestaña/diapositiva previstos          | PASS      |
| Teclado del laboratorio                 | Flechas, Home y End cambian selección y foco                                        | PASS      |
| El recorrido de un gesto                | Muestra cámara, visión, aplicación, Windows y perfiles                              | PASS      |
| Las capas del sistema                   | Muestra presentación, aplicación, dominio, puertos e infraestructura                | PASS      |
| Cada una de las diez piezas             | Actualiza detalle y enlace a su archivo de código                                   | PASS      |
| Recorrer el flujo                       | Recorre la cadena principal y termina en Windows; cambiar de vista cancela la traza | PASS      |
| Abrir mapa técnico                      | Abre el HTML autónomo, también bajo la subcarpeta de publicación                    | PASS      |
| Seis enlaces visibles a GitHub          | Abren su URL en otra pestaña; código y documentos existen en la revisión consultada | PASS      |
| Compartir                               | Confirma la copia; si el portapapeles falla abre diálogo con enlace seleccionable   | PASS      |
| Diálogo de compartir                    | Cierra con Escape y botón, y devuelve el foco                                       | PASS      |

Las pruebas de compartir sustituyen la API de portapapeles: no sobrescriben el
portapapeles del usuario. La landing no solicita permisos de cámara.

## Contraste de la landing

Ratios calculados con el comprobador de `antislop-human`, usando los colores
efectivos definidos en `src/styles.css`.

| Texto / fondo                          | Ratio   | Uso                         |
| -------------------------------------- | ------- | --------------------------- |
| Tinta `#20231f` / marfil `#f8f7f3`     | 14,82:1 | Texto principal             |
| Gris `#666b63` / marfil                | 5,09:1  | Texto secundario            |
| Azul `#2854d8` / marfil                | 5,85:1  | Enlaces y etiquetas         |
| Gris / fondo de arquitectura `#f0f1eb` | 4,80:1  | Explicaciones               |
| Azul / fondo de arquitectura           | 5,52:1  | Enlaces y selección         |
| Tinta / lima `#dcebc1`                 | 12,63:1 | Anotación de la ilustración |
| Blanco / azul                          | 6,27:1  | Titular del cierre          |
| `#d7dff5` / azul                       | 4,71:1  | Etiqueta del cierre         |
| `#e1e7f8` / azul                       | 5,07:1  | Párrafo del cierre          |
| `#7c8275` / marfil                     | 3,69:1  | Solo titular grande         |

Se comprobaron foco visible, teclado y controles táctiles de al menos 44 px en
el menú y laboratorio. Esto documenta comprobaciones concretas, no una certificación
completa de accesibilidad ni una prueba de todos los lectores de pantalla.

## Mapa técnico autónomo

Tipo: arquitectura de un monolito modular local. Evidencia de código:
`bc6440dc27397f2f59fcfb5c2cf85f3f6f115f1d` de `HoloControl-Access`.

- Archify `finalize --quality showcase`: **validate, deliver, check y browser-check PASS**,
  cero diagnósticos. Los recibos se conservan localmente en `.archify/`.
- SHA-256 de la especificación:
  `014b1210db2c79b170fd9d4978db2a8cb8d8e2f1f6eb57f9f56b6b508838383a`.
- SHA-256 del HTML comprobado:
  `08e5693995001d915ec1b1d7fe2ca637d2c830413a9cb1f4c266d0ed4817039f`.
- Revisión visual adicional de las capturas en escritorio, móvil y tema oscuro.
  El recibo automatizado conserva correctamente `visualReview: not-requested`;
  la inspección manual posterior es una comprobación separada.
- Tema claro/oscuro, acercar/alejar, selección de nodo y apertura/cierre del menú
  de exportación accionados en navegador. El menú ofrece PNG, JPEG, WebP, SVG y WebM.
  Esta revisión no afirma haber exportado y comparado cada formato o probado cada
  herramienta avanzada del visor generado.
- En móvil el escenario técnico se explora desplazándolo y ampliándolo. El mapa
  simplificado de la landing redistribuye sus piezas para la lectura inicial del QR.

## Informe Antislop de la landing

Evidencia de dirección y propósito en `DESIGN.md`. Cada PASS se refiere al
código, contenido y estados de la landing revisados, con los límites anteriores.

### Reglas obligatorias

- R-02 PASS: sin rayas largas en el texto editorial de la landing.
- R-03 PASS: cuatro anchuras verificadas sin desbordamiento horizontal.
- R-17 PASS: no hay estadísticas promocionales; los 21 puntos proceden del detector.
- R-18 PASS: no hay testimonios, avatares ni personas inventadas.
- R-23 PASS: el usuario solicitó logo, animaciones, distribución y diagramas; la mano está identificada como ilustración.
- R-24 PASS: nueve enlaces internos llevan a secciones existentes.
- R-25 PASS: combinaciones de texto de la landing medidas en la tabla de contraste; gris claro reservado al titular grande.
- R-26 PASS: los controles de la landing tienen los resultados registrados en el recorrido anterior.
- R-27 PASS: video pendiente y galería vacía tienen estado explícito; existen manejo de error multimedia y alternativa al portapapeles.
- R-28 PASS: no se añadió una FAQ de relleno.
- R-32 PASS: menú, tabs y diálogo comprobados con teclado y foco visible.
- R-33 PASS: las funciones y estilos se escribieron en sus fuentes; no se inyectan mediante scripts externos de sustitución.
- R-34 PASS: la landing sigue la dirección clara; el visor independiente conserva sus dos temas comprobados.
- R-35 PASS: compilación, trece pruebas y recorrido de enlaces y controles documentados arriba.
- R-36 PASS: no se atribuyen cifras de rendimiento, precisión, seguridad o cumplimiento sin evidencia.
- R-37 PASS: nombre, dirección clara y uso de Antislop confirmados; lectura de diseño declarada antes de construir.
- R-38 PASS: contenido del documento y código contrastados; video y funciones previstas identificados.

### Técnicas y propósito

- R-01 PASS: no hay fondos de gradiente ni brillos como sustituto de identidad.
- R-04 PASS: símbolo de nodos, captura, cursores y almacenamiento relacionados con el sistema.
- R-06 PASS: Manrope, DM Sans y etiquetas de sección justificadas en `DESIGN.md`.
- R-07 PASS: puntos de referencia limitados al escenario técnico explorable.
- R-08 PASS: flechas señalan avance, retorno y salida a documentación/código.
- R-09 PASS: el estado del proyecto es informativo; no hay una cápsula promocional sobre el título.
- R-10 PASS: cabecera tenue para conservar el contexto; no hay sucesión de paneles de cristal.
- R-12 PASS: separadores y fondos planos dominan la composición; no todas las piezas flotan.
- R-13 PASS: sin brillos repartidos por botones, tarjetas y fondos.
- R-14 PASS: mapa comparable por nodos; el resto de secciones varía según su contenido.
- R-19 PASS: movimiento moderado y finito, mano tras seleccionar y traza voluntaria; reducción de movimiento respetada.
- R-22 PASS: ilustración propia de puntos de mano y representación del cursor, vinculadas a Kinex.

### Ritmo e identidad

- Diales PASS: ENERGY 3 / RHYTHM 3 / MOTION 2 declarados en `DESIGN.md`.
- Coherencia PASS: portada expresiva, lectura editorial, laboratorio, mapa y registro con ritmos distintos.
- Foco PASS: título/mano, gesto seleccionado, pieza del mapa y registro audiovisual guían cada sección.
- Espacio PASS: márgenes y separadores distinguen bloques; las piezas se redistribuyen en móvil.
- Acento PASS: azul de puntos, enlaces y selección; lima puntual para el contacto.
- Motivo PASS: nodos y trayectorias reaparecen en logo, mano y arquitectura.
- Lectura previa PASS: dirección y diales comunicados antes de la implementación.

### Acabado

- C-1 PASS: motivos de color, tipografía, ilustración y distribución escritos en `DESIGN.md`.
- C-2 PASS: comportamiento de controles documentado en el recorrido.
- C-3 PASS: cada bloque explica el proyecto, sus gestos, arquitectura o registro real pendiente.
- C-4 PASS: breakpoints, movimiento reducido, teclado y alternativa de compartir comprobados.
- C-5 PASS: afirmaciones limitadas al documento y código revisados.
- R-05 PASS: composición editorial variada, sin precios, logos de clientes ni mosaico de relleno.
- R-11 PASS: radios pequeños en controles; círculo solo en la figura y marcadores.
- R-15 PASS: acciones concretas: explorar gestos, recorrer el flujo, abrir mapa y leer documentación.
- R-16 PASS: sin promesas de revolución ni superlativos tecnológicos vacíos.
- R-20 PASS: mano de 21 puntos, logo de trayectorias y laboratorio pertenecen al contexto de Kinex.
- R-21 PASS: tema claro elegido por el usuario.
- R-29 PASS: marfil/tinta, azul y acento lima documentados como paleta.
- R-30 PASS: composición y símbolo propios, sin imitar una interfaz comercial concreta.
- R-31 PASS: decisiones principales justificadas en una línea en la dirección de diseño.

## Publicación y contenido pendiente

El usuario autorizó publicar esta versión en `JhezzerIS/kinex-web`, con GitHub
Pages en `https://jhezzeris.github.io/kinex-web/`. El QR de `public/qr/` conserva
esa dirección para que las actualizaciones de contenido no requieran reimprimirlo.

La demostración, subtítulos y fotografías se incorporan cuando el equipo tenga
material real, siguiendo `MEDIA.md`. No se presentan estos medios ni las pruebas
del hardware como terminados.

La reinstalación limpia `npm ci` se volvió a comprobar en Windows tras detener
el servidor de vista previa que bloqueaba el módulo nativo de Rolldown. Terminó
correctamente y las trece pruebas de la landing volvieron a pasar.

## Comprobación de la publicación

- URL pública: https://jhezzeris.github.io/kinex-web/, respuesta **HTTP 200**.
- GitHub Pages informa `built` para la versión estática publicada en `gh-pages`.
- Navegador real contra la URL pública a 1440 y 390 px: seis posturas, selección
  de ambas vistas de arquitectura, fuentes y recursos sin errores de consola
  ni respuestas HTTP fallidas. Sin desbordamiento horizontal en ambas anchuras.
- Título y canonical públicos correctos. Capturas de ambas vistas revisadas.
- Mapa técnico remoto con HTTP 200 y SHA-256 idéntico al artefacto comprobado.
- SVG y PNG del QR descargados desde la web y comparados byte a byte con sus
  originales. El PNG remoto se decodificó y devuelve la URL pública esperada.
- El primer workflow de Actions no llegó a iniciar sus pasos: GitHub informó
  un bloqueo de facturación de la cuenta. La publicación desde `gh-pages` con
  `.nojekyll` sí terminó y no requiere compilar en un runner. El workflow propio
  queda solo para ejecución manual; `npm run deploy` permite actualizar la rama
  estática desde el equipo del desarrollador.

Las comprobaciones digitales del QR no sustituyen probar su tamaño y contraste
en el diseño final del banner con teléfonos reales antes de imprimirlo.
