import type { Gesto } from '../data/gestures';
import coordenadas from '../data/hand-landmarks.json';

type Postura = Gesto | 'abierta';
type Fotografia = keyof typeof coordenadas;

const fotografias: Record<Postura, Fotografia> = {
  abierta: 'abierta',
  indice: 'indice',
  pulgar: 'pulgar',
  dos_dedos: 'dos',
  palma_abierta: 'abierta',
  puno: 'puno',
  deslizamiento: 'abierta',
};

const conexiones = [
  [0, 1],
  [0, 5],
  [5, 9],
  [9, 13],
  [13, 17],
  [17, 0],
  ...[1, 5, 9, 13, 17].flatMap((base) =>
    [0, 1, 2].map((tramo) => [base + tramo, base + tramo + 1]),
  ),
];

export function crearMano(contenedor: HTMLElement, inicial: Postura = 'abierta') {
  const espacio = 'http://www.w3.org/2000/svg';
  const figura = document.createElementNS(espacio, 'svg');
  figura.setAttribute('viewBox', '0 0 1024 1536');
  figura.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  figura.setAttribute('focusable', 'false');
  figura.dataset.lateralidad = 'izquierda';
  const imagen = document.createElementNS(espacio, 'image');
  imagen.setAttribute('width', '1024');
  imagen.setAttribute('height', '1536');
  imagen.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  imagen.addEventListener('error', () => {
    contenedor.dataset.estado = 'error';
  });
  const seguimiento = document.createElementNS(espacio, 'g');
  figura.append(imagen, seguimiento);
  contenedor.replaceChildren(figura);
  let solicitud = 0;
  const precargas = new Map<Fotografia, Promise<void>>();

  const ruta = (nombre: Fotografia) => `${import.meta.env.BASE_URL}media/hands/${nombre}.webp`;

  function dibujar(postura: Postura) {
    const nombre = fotografias[postura];
    const datos = coordenadas[nombre];
    // Foto y puntos comparten encuadre; el reflejo conserva todas las manos izquierdas.
    const puntos = datos.puntos.map(([x, y]) => [datos.reflejar ? 1024 - x : x, y]);
    imagen.setAttribute('href', ruta(nombre));
    imagen.setAttribute('transform', datos.reflejar ? 'translate(1024 0) scale(-1 1)' : '');
    seguimiento.replaceChildren();
    for (const [inicio, fin] of conexiones) {
      const linea = document.createElementNS(espacio, 'line');
      linea.setAttribute('x1', String(puntos[inicio][0]));
      linea.setAttribute('y1', String(puntos[inicio][1]));
      linea.setAttribute('x2', String(puntos[fin][0]));
      linea.setAttribute('y2', String(puntos[fin][1]));
      linea.classList.add('hand-bone');
      seguimiento.append(linea);
    }
    puntos.forEach(([x, y], indice) => {
      const punto = document.createElementNS(espacio, 'circle');
      punto.setAttribute('cx', String(x));
      punto.setAttribute('cy', String(y));
      punto.setAttribute('r', '8.5');
      punto.dataset.indice = String(indice);
      punto.classList.add('hand-joint');
      seguimiento.append(punto);
    });
    figura.dataset.postura = postura;
    figura.dataset.reflejada = String(datos.reflejar);
    contenedor.dataset.estado = 'listo';
  }

  async function cambiarPostura(postura: Postura) {
    const turno = ++solicitud;
    const nombre = fotografias[postura];
    if (!precargas.has(nombre)) {
      const foto = new Image();
      foto.src = ruta(nombre);
      precargas.set(nombre, foto.decode());
    }
    try {
      await precargas.get(nombre);
      if (turno === solicitud) dibujar(postura);
    } catch {
      precargas.delete(nombre);
      if (turno === solicitud) contenedor.dataset.estado = 'error';
    }
  }

  dibujar(inicial);
  return { cambiarPostura };
}
