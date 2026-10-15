export type Gesto =
  'indice' | 'pellizco' | 'dos_dedos' | 'palma_abierta' | 'puno' | 'deslizamiento';

interface FichaGesto {
  categoria: string;
  titulo: string;
  descripcion: string;
  intencion: string;
  estado: string;
  postura: string;
}

export const gestos: Record<Gesto, FichaGesto> = {
  indice: {
    categoria: 'MOVIMIENTO CONTINUO',
    titulo: 'Señala. El cursor te sigue.',
    descripcion:
      'El índice extendido marca la posición. La aplicación convierte esa coordenada en movimiento dentro de la zona calibrada.',
    intencion: 'Mover el cursor',
    estado: 'Reconocimiento y acción básica implementados.',
    postura: 'Índice extendido',
  },
  pellizco: {
    categoria: 'UN CONTACTO CON INTENCIÓN',
    titulo: 'Acerca los dedos. Haz clic.',
    descripcion:
      'El contacto entre pulgar e índice se reconoce como pellizco. Su inicio, mantenimiento y fin permiten distinguir una interacción sostenida.',
    intencion: 'Clic izquierdo',
    estado: 'Clic implementado. Arrastre y dibujo sostenido previstos en el alcance.',
    postura: 'Pulgar e índice próximos',
  },
  dos_dedos: {
    categoria: 'MOVIMIENTO CONTINUO',
    titulo: 'Dos dedos. Sigue recorriendo.',
    descripcion:
      'Índice y medio extendidos identifican el gesto de desplazamiento. El movimiento vertical se traduce en scroll de la pantalla.',
    intencion: 'Desplazamiento vertical',
    estado: 'Reconocimiento y conversión de scroll implementados.',
    postura: 'Índice y medio extendidos',
  },
  palma_abierta: {
    categoria: 'UNA PAUSA A TIEMPO',
    titulo: 'Abre la mano. Toma una pausa.',
    descripcion:
      'La palma abierta y quieta solicita una pausa. El tiempo de permanencia ayuda a distinguir la intención de un movimiento pasajero.',
    intencion: 'Solicitar pausa del control',
    estado: 'La aplicación valida el gesto y el estado antes de pausar.',
    postura: 'Palma abierta y quieta',
  },
  puno: {
    categoria: 'UNA SOLICITUD DE CAMBIO',
    titulo: 'Cierra la mano. Cambia la intención.',
    descripcion:
      'El puño sostenido se reconoce como una señal propia. El diseño del proyecto lo contempla para solicitar el cambio entre cursor y dibujo.',
    intencion: 'Solicitar cambio de modo',
    estado: 'Reconocimiento implementado; cambio de modo y dibujo en desarrollo.',
    postura: 'Puño quieto',
  },
  deslizamiento: {
    categoria: 'EL MOVIMIENTO TAMBIÉN HABLA',
    titulo: 'Desliza. Pasa a lo siguiente.',
    descripcion:
      'Una palma abierta que se mueve horizontalmente permite distinguir un deslizamiento a la izquierda o a la derecha.',
    intencion: 'Solicitar cambio de pestaña o diapositiva',
    estado: 'Ambos sentidos reconocidos; ejecución de estas acciones prevista.',
    postura: 'Palma en deslizamiento horizontal',
  },
};
