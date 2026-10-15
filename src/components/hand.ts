import type { Gesto } from '../data/gestures';

type Punto = [number, number];
type Postura = Gesto | 'abierta';

const manoAbierta: Punto[] = [
  [230, 435],
  [166, 371],
  [119, 323],
  [82, 266],
  [62, 222],
  [167, 289],
  [158, 197],
  [154, 127],
  [153, 75],
  [228, 274],
  [226, 166],
  [225, 90],
  [225, 37],
  [284, 289],
  [292, 194],
  [296, 128],
  [299, 83],
  [333, 324],
  [357, 249],
  [368, 198],
  [377, 158],
];

const cadenas = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [17, 18, 19, 20],
];
const huesos = [
  [0, 1],
  [0, 5],
  [5, 9],
  [9, 13],
  [13, 17],
  [17, 0],
  ...cadenas.flatMap((c) => c.slice(1).map((n, i) => [c[i], n])),
];

function puntosPostura(postura: Postura): Punto[] {
  const puntos = manoAbierta.map(([x, y]): Punto => [x, y]);
  const extender =
    postura === 'abierta' || postura === 'palma_abierta' || postura === 'deslizamiento';
  if (!extender) {
    const flexionados: Punto[][] = [
      [
        [164, 249],
        [174, 302],
        [176, 335],
      ],
      [
        [229, 234],
        [237, 305],
        [235, 343],
      ],
      [
        [292, 247],
        [290, 317],
        [282, 349],
      ],
      [
        [344, 288],
        [330, 341],
        [318, 362],
      ],
    ];
    [5, 9, 13, 17].forEach((base, dedo) => {
      const seExtiende =
        ((postura === 'indice' || postura === 'dos_dedos') && dedo === 0) ||
        (postura === 'dos_dedos' && dedo === 1);
      if (!seExtiende)
        flexionados[dedo].forEach((punto, i) => {
          puntos[base + i + 1] = punto;
        });
    });
    if (postura === 'pellizco') {
      puntos[2] = [123, 330];
      puntos[3] = [106, 275];
      puntos[4] = [122, 230];
      puntos[6] = [161, 214];
      puntos[7] = [138, 197];
      puntos[8] = [122, 230];
    }
    if (postura === 'puno') {
      puntos[2] = [145, 330];
      puntos[3] = [189, 330];
      puntos[4] = [229, 345];
    }
  }
  return puntos;
}

export function crearMano(contenedor: HTMLElement, inicial: Postura = 'abierta') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 460 530');
  svg.setAttribute('focusable', 'false');
  const grupo = document.createElementNS(ns, 'g');
  svg.append(grupo);
  const crear = <T extends keyof SVGElementTagNameMap>(
    tipo: T,
    atributos: Record<string, string>,
  ) => {
    const elemento = document.createElementNS(ns, tipo);
    Object.entries(atributos).forEach(([nombre, valor]) => elemento.setAttribute(nombre, valor));
    grupo.append(elemento);
    return elemento;
  };
  const palma = crear('path', {
    fill: '#e4decf',
    stroke: '#c9c2b2',
    'stroke-width': '1.3',
  });
  const bordes = cadenas.map(() =>
    crear('polyline', {
      fill: 'none',
      stroke: '#c9c2b2',
      'stroke-width': '43',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  );
  const dedos = cadenas.map(() =>
    crear('polyline', {
      fill: 'none',
      stroke: '#e4decf',
      'stroke-width': '40',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  );
  const pliegues = [
    crear('path', { fill: 'none', stroke: '#c9c2b2', 'stroke-width': '1.2' }),
    crear('path', { fill: 'none', stroke: '#c9c2b2', 'stroke-width': '1.2' }),
  ];
  const conexiones = huesos.map(() =>
    crear('line', {
      stroke: '#2854d8',
      'stroke-width': '1.2',
      'stroke-opacity': '.55',
    }),
  );
  const contacto = crear('circle', {
    r: '17',
    fill: '#dcebc1',
    stroke: '#2854d8',
    'stroke-width': '1.3',
    opacity: '0',
  });
  const articulaciones = manoAbierta.map(() =>
    crear('circle', {
      r: '3.4',
      fill: '#2854d8',
      stroke: '#f8f7f3',
      'stroke-width': '1',
      class: 'hand-joint',
    }),
  );
  const etiqueta = crear('text', {
    fill: '#2854d8',
    'font-size': '10',
    'font-family': 'DM Sans, sans-serif',
  });
  let actuales = puntosPostura(inicial);
  let cuadro = 0;
  let posturaActual: Postura = inicial;
  const movimientoReducido = matchMedia('(prefers-reduced-motion: reduce)');

  function dibujar(puntos: Punto[]) {
    const [x, y] = puntos[0];
    palma.setAttribute(
      'd',
      `M${x - 42} ${y + 58} L${x - 45} ${y - 8} Q${x - 91} ${y - 69} ${puntos[1][0] - 4} ${puntos[1][1] - 15} Q${puntos[5][0] - 26} ${puntos[5][1] - 17} ${puntos[5][0]} ${puntos[5][1] - 17} Q${puntos[9][0]} ${puntos[9][1] - 28} ${puntos[13][0]} ${puntos[13][1] - 17} Q${puntos[17][0] + 26} ${puntos[17][1] - 18} ${puntos[17][0] + 19} ${puntos[17][1] + 23} Q${x + 84} ${y - 15} ${x + 43} ${y + 4} L${x + 43} ${y + 58} Z`,
    );
    cadenas.forEach((cadena, i) => {
      const secuencia = cadena.map((indice) => puntos[indice].join(',')).join(' ');
      bordes[i].setAttribute('points', secuencia);
      dedos[i].setAttribute('points', secuencia);
    });
    pliegues[0].setAttribute('d', `M${x - 43} ${y - 30} Q${x - 57} ${y - 101} ${x - 4} ${y - 119}`);
    pliegues[1].setAttribute('d', `M${x - 24} ${y - 88} Q${x + 26} ${y - 103} ${x + 66} ${y - 83}`);
    huesos.forEach(([a, b], i) => {
      conexiones[i].setAttribute('x1', String(puntos[a][0]));
      conexiones[i].setAttribute('y1', String(puntos[a][1]));
      conexiones[i].setAttribute('x2', String(puntos[b][0]));
      conexiones[i].setAttribute('y2', String(puntos[b][1]));
    });
    puntos.forEach(([px, py], i) => {
      articulaciones[i].setAttribute('cx', String(px));
      articulaciones[i].setAttribute('cy', String(py));
      articulaciones[i].setAttribute('r', i === 8 ? '5' : '3.4');
    });
    contacto.setAttribute('cx', String(puntos[8][0]));
    contacto.setAttribute('cy', String(puntos[8][1]));
    contacto.setAttribute('opacity', posturaActual === 'pellizco' ? '1' : '0');
    etiqueta.setAttribute('x', String(puntos[8][0] + 13));
    etiqueta.setAttribute('y', String(puntos[8][1] - 10));
    etiqueta.textContent = '08';
  }

  function cambiarPostura(postura: Postura) {
    cancelAnimationFrame(cuadro);
    posturaActual = postura;
    const destino = puntosPostura(postura);
    const origen = actuales.map(([x, y]): Punto => [x, y]);
    if (movimientoReducido.matches) {
      actuales = destino;
      dibujar(actuales);
      return;
    }
    const inicio = performance.now();
    function avanzar(ahora: number) {
      const avance = Math.min(1, (ahora - inicio) / 360);
      const mezcla = 1 - Math.pow(1 - avance, 4);
      actuales = origen.map(([x, y], i): Punto => [
        x + (destino[i][0] - x) * mezcla,
        y + (destino[i][1] - y) * mezcla,
      ]);
      dibujar(actuales);
      if (avance < 1) cuadro = requestAnimationFrame(avanzar);
    }
    cuadro = requestAnimationFrame(avanzar);
  }

  contenedor.append(svg);
  dibujar(actuales);
  return { cambiarPostura };
}
