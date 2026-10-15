import { arquitectura, type Vista, type Pieza } from '../data/architecture';

export function iniciarArquitectura() {
  const mapa = document.querySelector<HTMLElement>('#architecture-map')!;
  const panel = document.querySelector<HTMLElement>('#architecture-panel')!;
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-view]')];
  const recorrer = document.querySelector<HTMLButtonElement>('#trace-button')!;
  let vista: Vista = 'recorrido';
  let temporizador = 0;
  let generacion = 0;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)');

  function seleccionar(pieza: Pieza) {
    mapa
      .querySelectorAll<HTMLButtonElement>('.map-node')
      .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.node === pieza.id)));
    document.querySelector('#node-category')!.textContent = pieza.categoria;
    document.querySelector('#node-title')!.textContent = pieza.titulo;
    document.querySelector('#node-description')!.textContent = pieza.descripcion;
    document.querySelector('#node-technology')!.textContent = pieza.tecnologia;
    document.querySelector<HTMLAnchorElement>('#node-source')!.href =
      `https://github.com/jean11op/HoloControl-Access/blob/develop/${pieza.archivo}`;
  }

  function detenerTraza() {
    generacion += 1;
    window.clearTimeout(temporizador);
    recorrer.disabled = false;
    recorrer.lastChild!.textContent = 'Recorrer el flujo';
    mapa.querySelectorAll('.node-tracing').forEach((n) => n.classList.remove('node-tracing'));
  }

  function mostrar(nuevaVista: Vista) {
    detenerTraza();
    vista = nuevaVista;
    mapa.replaceChildren();
    mapa.dataset.layout = vista;
    tabs.forEach((t) => {
      const activa = t.dataset.view === vista;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `view-${vista}`);
    arquitectura[vista].forEach((pieza, i) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = `map-node${pieza.rama ? ' is-branch' : ''}`;
      boton.dataset.node = pieza.id;
      if (i === 3 || vista === 'capas') boton.dataset.last = 'true';
      boton.setAttribute('aria-pressed', String(i === 0));
      const simbolo = document.createElement('span');
      simbolo.className = 'node-symbol';
      simbolo.setAttribute('aria-hidden', 'true');
      simbolo.textContent = pieza.simbolo;
      const nombre = document.createElement('strong');
      nombre.textContent = pieza.nombre;
      const resumen = document.createElement('small');
      resumen.textContent = pieza.resumen;
      boton.append(simbolo, nombre, resumen);
      boton.addEventListener('click', () => {
        detenerTraza();
        seleccionar(pieza);
      });
      mapa.append(boton);
    });
    const pie = document.createElement('p');
    pie.className = 'map-caption';
    pie.textContent =
      vista === 'recorrido'
        ? 'Procesamiento local, en el mismo computador.'
        : 'Arquitectura por capas con principios hexagonales.';
    mapa.append(pie);
    seleccionar(arquitectura[vista][0]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => mostrar(tab.dataset.view as Vista));
    tab.addEventListener('keydown', (evento) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
      evento.preventDefault();
      const destino =
        evento.key === 'Home'
          ? 0
          : evento.key === 'End'
            ? tabs.length - 1
            : (i + (evento.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[destino].focus();
      mostrar(tabs[destino].dataset.view as Vista);
    });
  });

  recorrer.addEventListener('click', () => {
    detenerTraza();
    const turno = generacion;
    const piezas = arquitectura[vista].filter((pieza) => !pieza.rama);
    let indice = 0;
    recorrer.disabled = true;
    recorrer.lastChild!.textContent = 'Recorriendo…';
    function avanzar() {
      if (turno !== generacion) return;
      mapa.querySelectorAll('.node-tracing').forEach((n) => n.classList.remove('node-tracing'));
      if (indice >= piezas.length) {
        detenerTraza();
        return;
      }
      const pieza = piezas[indice++];
      seleccionar(pieza);
      if (!reducir.matches)
        mapa.querySelector(`[data-node="${pieza.id}"]`)!.classList.add('node-tracing');
      temporizador = window.setTimeout(avanzar, 800);
    }
    avanzar();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) detenerTraza();
  });
  mostrar(vista);
}
