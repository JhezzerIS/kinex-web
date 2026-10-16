# Contexto y fuentes de Kinex

Revisión de contenido: 16 de octubre de 2026.
Nombre final confirmado por el usuario: Kinex.

## Documento de requisitos

Se revisó el documento aportado `HoloControl_Access_Requisitos_y_Modelo_BDvdvd.docx`.
Describe control accesible de Windows, captura de cámara, gestos, perfiles,
calibración y una arquitectura de monolito modular con principios hexagonales.
El archivo original no se publica como parte de esta web.

Los requisitos no sustituyen la evidencia de implementación. El explorador presenta
seis gestos del catálogo revisado, no un inventario completo de comandos del sistema.

## Código revisado

Repositorio: https://github.com/jean11op/HoloControl-Access

Referencia del mapa técnico:
`bc6440dc27397f2f59fcfb5c2cf85f3f6f115f1d`, rama `develop`.

| Afirmación de la landing               | Fuente                                                              |
| -------------------------------------- | ------------------------------------------------------------------- |
| Captura seleccionable y local          | `infrastructure/vision/camera.py`                                   |
| Detección de 21 puntos                 | `infrastructure/vision/hand_detector.py`, modelos de `ports/vision` |
| Catálogo y permanencia de gestos       | `infrastructure/vision/gesture_recognizer.py`, `configuration.py`   |
| Posturas personalizadas                | `infrastructure/vision/gesture_training.py`                         |
| Resultados y fases en orden            | `ports/vision/models.py`, `vision_worker.py`                        |
| Coordinación entre visión y aplicación | `application/services/coordinador_control_vision.py`                |
| Cursor, clic, scroll y pausa           | `application/use_cases/control_aplicacion.py`                       |
| Ejecución separada del reconocimiento  | `infrastructure/windows/windows_action_executor.py`                 |
| Perfiles persistidos en SQLite         | `infrastructure/persistence/repositorio_perfil.py`                  |
| Composición con interfaz               | `bootstrap.py`, `presentation/`                                     |

Las rutas de esta tabla parten de `src/holocontrol/`. El paquete y el repositorio
conservan el nombre original HoloControl; la marca pública es Kinex.
Por indicación del usuario, los enlaces de GitHub y documentación de la landing y
del mapa técnico apuntan a la portada del repositorio. El mapa conserva el commit,
las rutas y las líneas de la evidencia como metadatos, sin enlazar archivos concretos.

## Catálogo actualizado y equipo

El explorador de gestos toma como evidencia adicional la revisión
`a2fbbc1e903a93dfd85dbcb8ab51a719fdff40c6`, la misma copia local consultada para el
banner de EXPOSIS. Se comprobaron `domain/rules/catalogo.py`,
`infrastructure/vision/thumb_click.py`, `configuration.py`, `gesture_recognizer.py`
y `application/use_cases/control_aplicacion.py` dentro de `src/holocontrol/`.
Índice corresponde a cursor; apertura y cierre del pulgar a clic; dos dedos a
flechas y zoom; palma sostenida a pausa; puño sostenido a minimizar y deslizamiento
horizontal a volumen. Las asignaciones descritas son las predeterminadas.

El enlace público del repositorio devuelve HTTP 404 en la consulta del 16 de octubre.
La evidencia anterior es una copia local identificada por commit; no se afirma haber
validado un estado remoto posterior. Se conservan los enlaces originales del proyecto.

Las cinco fotografías del equipo y la asignación de nombres/roles proceden de los
archivos y capturas aportados por el usuario en esta conversación. Se conservan las
fotografías originales; la presentación usa recorte CSS. No se inventan cargos de
liderazgo, enlaces sociales ni credenciales profesionales.

## Imágenes y estado

Las manos son las cinco imágenes realistas generadas y aprobadas para el banner,
convertidas a WebP conservando transparencia y proporción 2:3. Sus 21 puntos y
conexiones proceden de `manos-fotograficas-puntos.json`, usado en el banner.
`src/data/hand-landmarks.json` conserva posiciones en un encuadre de 1024 × 1536.
La foto de dos dedos se refleja junto con los puntos para mantener la orientación
izquierda. El color de puntos y conexiones es exactamente `#56e7a0`.

Estas imágenes representan posturas; no son fotografías capturadas por el programa.
Seleccionar un gesto no realiza reconocimiento en el navegador. La landing no solicita
permisos de cámara ni ejecuta acciones del sistema.

Las descripciones no afirman resultados medidos de usabilidad, precisión o rendimiento.
La sección de video fue retirada por indicación del usuario. La institución
Universidad Nacional de Trujillo y la feria EXPOSIS 2026 fueron indicadas por el usuario.

## Arquitectura

El explorador inicial ofrece dos lecturas: recorrido de datos y separación por
capas. El mapa técnico autónomo se generó con Archify a partir de fuentes
versionadas; sus comprobaciones de esquema, composición, procedencia y navegador
pasaron. La selección de nodos, zoom, temas y exportación pertenecen al visor.
El mapa no representa microservicios ni comunicación con una nube.

La especificación editable está en `docs/architecture/kinex.architecture.json`.
Para regenerarla se necesita Archify instalado y una copia Git del repositorio
del programa que contenga el commit de referencia. Las evidencias locales de
generación se conservan en `.archify/` y no se alojan con la landing. Al regenerar,
los enlaces de las referencias deben conservar el destino a la portada del repositorio.
