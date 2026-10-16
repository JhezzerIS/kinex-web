export type Gesto = 'indice' | 'pulgar' | 'dos_dedos' | 'palma_abierta' | 'puno' | 'deslizamiento';

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
  pulgar: {
    categoria: 'UN CLIC CON EL PULGAR',
    titulo: 'Abre el pulgar. Haz clic.',
    descripcion:
      'Con el índice extendido, abre y vuelve a cerrar el pulgar para hacer clic. Mantenerlo abierto permite arrastrar y dibujar.',
    intencion: 'Clic izquierdo',
    estado: 'El ciclo de apertura y cierre distingue el clic de una acción sostenida.',
    postura: 'Índice extendido y pulgar abierto',
  },
  dos_dedos: {
    categoria: 'MOVIMIENTO CONTINUO',
    titulo: 'Dos dedos. Usa las flechas.',
    descripcion:
      'Extiende el índice y el medio. La dirección de la mano permite usar las flechas del teclado; separar o juntar los dedos activa el zoom.',
    intencion: 'Flechas en cuatro direcciones',
    estado: 'Flechas y zoom son gestos diferenciados en el catálogo del sistema.',
    postura: 'Índice y medio extendidos',
  },
  palma_abierta: {
    categoria: 'UNA PAUSA A TIEMPO',
    titulo: 'Abre la mano. Toma una pausa.',
    descripcion:
      'Mantén la palma abierta y quieta durante siete segundos para pausar el control. El tiempo sostenido evita pausas por un movimiento pasajero.',
    intencion: 'Pausar el control',
    estado: 'La aplicación valida el gesto y el estado antes de pausar.',
    postura: 'Palma abierta y quieta',
  },
  puno: {
    categoria: 'UNA VENTANA MENOS',
    titulo: 'Cierra la mano. Minimiza.',
    descripcion:
      'Cierra la mano y mantén el puño durante dos segundos para minimizar la ventana activa.',
    intencion: 'Minimizar la ventana',
    estado: 'El puño sostenido está asignado a minimizar en el perfil predeterminado.',
    postura: 'Puño quieto',
  },
  deslizamiento: {
    categoria: 'EL MOVIMIENTO TAMBIÉN HABLA',
    titulo: 'Desliza. Ajusta el volumen.',
    descripcion:
      'Una palma abierta que se mueve horizontalmente permite distinguir un deslizamiento a la izquierda o a la derecha.',
    intencion: 'Subir o bajar el volumen',
    estado: 'Derecha sube el volumen; izquierda lo baja en el perfil predeterminado.',
    postura: 'Palma en deslizamiento horizontal',
  },
};
