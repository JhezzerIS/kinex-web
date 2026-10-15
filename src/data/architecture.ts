export type Vista = 'recorrido' | 'capas';
export interface Pieza {
  id: string;
  nombre: string;
  resumen: string;
  simbolo: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  tecnologia: string;
  archivo: string;
  rama?: boolean;
}

const raiz = 'src/holocontrol/';
export const arquitectura: Record<Vista, Pieza[]> = {
  recorrido: [
    {
      id: 'camara',
      nombre: 'Cámara',
      resumen: 'Captura el movimiento',
      simbolo: '◉',
      categoria: 'ENTRADA',
      titulo: 'La cámara observa.',
      descripcion:
        'La webcam seleccionada entrega imágenes al trabajador de visión. Todo empieza con la mano dentro del encuadre.',
      tecnologia: 'OpenCV · captura local',
      archivo: raiz + 'infrastructure/vision/camera.py',
    },
    {
      id: 'vision',
      nombre: 'Visión',
      resumen: 'Reconoce la mano',
      simbolo: '⌁',
      categoria: 'PERCEPCIÓN',
      titulo: 'El movimiento se interpreta.',
      descripcion:
        'MediaPipe detecta los 21 puntos de referencia. La geometría y la trayectoria permiten reconocer posturas y comunicar eventos ordenados.',
      tecnologia: 'MediaPipe · OpenCV · Python',
      archivo: raiz + 'infrastructure/vision/vision_processor.py',
    },
    {
      id: 'aplicacion',
      nombre: 'Aplicación',
      resumen: 'Valida la intención',
      simbolo: '⊙',
      categoria: 'DECISIÓN',
      titulo: 'Las reglas dan contexto.',
      descripcion:
        'La aplicación consulta visión, comprueba el perfil, la calibración, la confianza y el estado del control. Decide qué acción está permitida.',
      tecnologia: 'Coordinador · casos de uso · dominio',
      archivo: raiz + 'application/use_cases/control_aplicacion.py',
    },
    {
      id: 'windows',
      nombre: 'Windows',
      resumen: 'Recibe la acción',
      simbolo: '↗',
      categoria: 'SALIDA',
      titulo: 'La intención llega a pantalla.',
      descripcion:
        'El adaptador ejecuta movimientos de cursor, clics y scroll autorizados por la aplicación. La visión no llama directamente al mouse.',
      tecnologia: 'Puerto de acciones · PyAutoGUI',
      archivo: raiz + 'infrastructure/windows/windows_action_executor.py',
    },
    {
      id: 'datos',
      nombre: 'Perfiles',
      resumen: 'Conservan la configuración',
      simbolo: '≋',
      categoria: 'PERSISTENCIA LOCAL',
      titulo: 'Tu configuración tiene memoria.',
      descripcion:
        'El repositorio SQLite conserva perfiles, calibraciones, asignaciones y muestras. La aplicación accede a la persistencia mediante un puerto.',
      tecnologia: 'SQLite · repositorio de perfiles',
      archivo: raiz + 'infrastructure/persistence/repositorio_perfil.py',
      rama: true,
    },
  ],
  capas: [
    {
      id: 'interfaz',
      nombre: 'Presentación',
      resumen: 'Lo que ve la persona',
      simbolo: '▤',
      categoria: 'INTERFAZ',
      titulo: 'Una ventana al estado del sistema.',
      descripcion:
        'La interfaz permite gestionar perfiles y conocer el estado del control. El ensamblado conecta las vistas con los casos de uso y el coordinador.',
      tecnologia: 'PySide6 · ventanas y controles',
      archivo: raiz + 'bootstrap.py',
    },
    {
      id: 'casos',
      nombre: 'Aplicación',
      resumen: 'Coordina los casos de uso',
      simbolo: '⇄',
      categoria: 'COORDINACIÓN',
      titulo: 'Cada interacción tiene un orden.',
      descripcion:
        'Los casos de uso coordinan inicio, pausa, detención, perfiles y reconocimiento. El coordinador enlaza el proveedor de visión y la generación de cada sesión.',
      tecnologia: 'Casos de uso · CoordinadorControlVision',
      archivo: raiz + 'application/services/coordinador_control_vision.py',
    },
    {
      id: 'dominio',
      nombre: 'Dominio',
      resumen: 'Expresa las reglas',
      simbolo: '◇',
      categoria: 'NÚCLEO',
      titulo: 'Las reglas viven en el centro.',
      descripcion:
        'Perfiles, calibraciones, gestos y asignaciones expresan las reglas del proyecto. El dominio no necesita importar bibliotecas de cámara ni de interfaz.',
      tecnologia: 'Entidades · catálogo · validaciones',
      archivo: raiz + 'domain/entities/modelos.py',
    },
    {
      id: 'puertos',
      nombre: 'Puertos',
      resumen: 'Acuerdan cómo se conectan',
      simbolo: '⤳',
      categoria: 'CONTRATOS',
      titulo: 'Un idioma común entre piezas.',
      descripcion:
        'Los puertos definen los datos y operaciones que necesita la aplicación. ProveedorVision entrega resultados estructurados sin exponer OpenCV o MediaPipe.',
      tecnologia: 'Protocolos · datos de visión · repositorios',
      archivo: raiz + 'ports/vision/vision_provider.py',
    },
    {
      id: 'adaptadores',
      nombre: 'Infraestructura',
      resumen: 'Conecta con el mundo real',
      simbolo: '⊞',
      categoria: 'ADAPTADORES',
      titulo: 'La tecnología puede cambiar.',
      descripcion:
        'Cámara, detector, base de datos y acciones de Windows implementan los contratos. Sus detalles permanecen separados de las reglas de negocio.',
      tecnologia: 'OpenCV · MediaPipe · SQLite · PyAutoGUI',
      archivo: raiz + 'infrastructure/vision/vision_worker.py',
    },
  ],
};
