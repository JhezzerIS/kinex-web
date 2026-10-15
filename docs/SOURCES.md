# Contexto y fuentes de Kinex

Revisión de contenido: 15 de octubre de 2026.
Nombre final confirmado por el usuario: Kinex.

## Documento de requisitos

Se revisó el documento aportado `HoloControl_Access_Requisitos_y_Modelo_BDvdvd.docx`.
Describe control accesible de Windows, captura de cámara, gestos, perfiles,
calibración y una arquitectura de monolito modular con principios hexagonales.
El archivo original no se publica como parte de esta web.

Los requisitos de dibujo, arrastre, cambios de pestaña/diapositiva y otras
ampliaciones no se presentan como acciones terminadas. El alcance de comandos
de voz y sincronización del documento no se anuncia como disponible en el prototipo.

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
Los enlaces de exploración apuntan a `develop` para seguir el avance del equipo.
El mapa técnico ampliable conserva enlaces al commit exacto utilizado como evidencia.

## Ilustraciones y estado

La mano vectorial es una ilustración propia de los puntos y posturas, no una
imagen capturada por el programa. Seleccionar una postura no realiza reconocimiento
en el navegador. La landing no solicita permisos de cámara ni ejecuta acciones del sistema.

Cursor, clic, scroll y pausa tienen implementación de software en el código
revisado; esto no afirma resultados de usabilidad, precisión o rendimiento.
El video y las fotografías reales siguen pendientes. Se omiten testimonios,
personas, métricas de éxito, nombres de institución y cifras sin fuente.

## Arquitectura

El explorador inicial ofrece dos lecturas: recorrido de datos y separación por
capas. El mapa técnico autónomo se generó con Archify a partir de fuentes
versionadas; sus comprobaciones de esquema, composición, procedencia y navegador
pasaron. La selección de nodos, zoom, temas y exportación pertenecen al visor.
El mapa no representa microservicios ni comunicación con una nube.

La especificación editable está en `docs/architecture/kinex.architecture.json`.
Para regenerarla se necesita Archify instalado y una copia Git del repositorio
del programa que contenga el commit de referencia. Las evidencias locales de
generación se conservan en `.archify/` y no se alojan con la landing.
