import './styles.css';
import { crearMano } from './components/hand';
import { iniciarArquitectura } from './components/architecture';
import { gestos, type Gesto } from './data/gestures';

const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)');
crearMano(document.querySelector<HTMLElement>('#hero-hand')!);
const mano = crearMano(document.querySelector<HTMLElement>('#gesture-hand')!, 'indice');
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-gesture]')];
const panelGesto = document.querySelector<HTMLElement>('#gesture-panel')!;
let animacionFicha: Animation | undefined;

function seleccionarGesto(nombre: Gesto) {
  const ficha = gestos[nombre];
  tabs.forEach((tab) => {
    const activo = tab.dataset.gesture === nombre;
    tab.setAttribute('aria-selected', String(activo));
    tab.tabIndex = activo ? 0 : -1;
  });
  panelGesto.setAttribute('aria-labelledby', `tab-${nombre}`);
  for (const [selector, contenido] of Object.entries({
    '#gesture-category': ficha.categoria,
    '#gesture-name': ficha.titulo,
    '#gesture-description': ficha.descripcion,
    '#gesture-outcome': ficha.intencion,
    '#gesture-status': ficha.estado,
    '#gesture-caption': ficha.postura,
  }))
    document.querySelector(selector)!.textContent = contenido;
  void mano.cambiarPostura(nombre);
  animacionFicha?.cancel();
  if (!reducirMovimiento.matches)
    animacionFicha = panelGesto.animate(
      [
        { opacity: 0.65, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
  const figura = document.querySelector<HTMLElement>('#gesture-hand')!;
  figura.getAnimations().forEach((a) => a.cancel());
  if (nombre === 'deslizamiento' && !reducirMovimiento.matches)
    figura.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(20px)', offset: 0.4 },
        { transform: 'translateX(-20px)', offset: 0.75 },
        { transform: 'translateX(0)' },
      ],
      { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
}

reducirMovimiento.addEventListener('change', (evento) => {
  if (evento.matches) {
    animacionFicha?.cancel();
    document
      .querySelector('#gesture-hand')!
      .getAnimations()
      .forEach((animacion) => animacion.cancel());
  }
});

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => seleccionarGesto(tab.dataset.gesture as Gesto));
  tab.addEventListener('keydown', (evento) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(evento.key))
      return;
    evento.preventDefault();
    const direccion = evento.key === 'ArrowRight' || evento.key === 'ArrowDown' ? 1 : -1;
    const destino =
      evento.key === 'Home'
        ? 0
        : evento.key === 'End'
          ? tabs.length - 1
          : (i + direccion + tabs.length) % tabs.length;
    tabs[destino].focus();
    seleccionarGesto(tabs[destino].dataset.gesture as Gesto);
  });
});

const cabecera = document.querySelector<HTMLElement>('.site-header')!;
const botonMenu = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const navegacion = document.querySelector<HTMLElement>('#navegacion')!;
function cambiarMenu(abierto: boolean) {
  cabecera.classList.toggle('menu-open', abierto);
  botonMenu.setAttribute('aria-expanded', String(abierto));
  botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
}
botonMenu.addEventListener('click', () =>
  cambiarMenu(botonMenu.getAttribute('aria-expanded') !== 'true'),
);
navegacion
  .querySelectorAll('a')
  .forEach((enlace) => enlace.addEventListener('click', () => cambiarMenu(false)));
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && cabecera.classList.contains('menu-open')) {
    cambiarMenu(false);
    botonMenu.focus();
  }
});
document.addEventListener('click', (evento) => {
  if (!cabecera.contains(evento.target as Node)) cambiarMenu(false);
});
matchMedia('(min-width: 601px)').addEventListener('change', (evento) => {
  if (evento.matches) cambiarMenu(false);
});

const avance = document.querySelector<HTMLElement>('.reading-progress')!;
let cuadroScroll = 0;
function actualizarAvance() {
  const alto = document.documentElement.scrollHeight - innerHeight;
  avance.style.transform = `scaleX(${alto > 0 ? Math.min(1, Math.max(0, scrollY / alto)) : 0})`;
  cuadroScroll = 0;
}
addEventListener(
  'scroll',
  () => {
    if (!cuadroScroll) cuadroScroll = requestAnimationFrame(actualizarAvance);
  },
  { passive: true },
);
addEventListener('resize', actualizarAvance, { passive: true });
actualizarAvance();

let entradaVista = false;
try {
  entradaVista = sessionStorage.getItem('kinex-presentado') === '1';
  sessionStorage.setItem('kinex-presentado', '1');
} catch {
  /* La página funciona con el almacenamiento del navegador desactivado. */
}
if (!reducirMovimiento.matches && !entradaVista) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll<HTMLElement>('.section-heading, .project-copy > h2, .closing-layout')
    .forEach((elemento) => {
      elemento.classList.add('reveal-ready');
      observador.observe(elemento);
    });
}

const compartir = document.querySelector<HTMLButtonElement>('#share-button')!;
const dialogo = document.querySelector<HTMLDialogElement>('#share-dialog')!;
const campoEnlace = document.querySelector<HTMLInputElement>('#share-url')!;
let confirmacion = 0;
compartir.addEventListener('click', async () => {
  const enlace = new URL(location.href);
  enlace.hash = '';
  enlace.search = '';
  try {
    await navigator.clipboard.writeText(enlace.href);
    compartir.firstChild!.textContent = 'Enlace copiado ';
    compartir.setAttribute('aria-live', 'polite');
    clearTimeout(confirmacion);
    confirmacion = window.setTimeout(() => {
      compartir.firstChild!.textContent = 'Compartir Kinex ';
    }, 2000);
  } catch {
    campoEnlace.value = enlace.href;
    dialogo.showModal();
    campoEnlace.focus();
    campoEnlace.select();
  }
});
dialogo.querySelector('button')!.addEventListener('click', () => dialogo.close());
dialogo.addEventListener('click', (evento) => {
  if (evento.target === dialogo) {
    const r = dialogo.getBoundingClientRect();
    if (
      evento.clientX < r.left ||
      evento.clientX > r.right ||
      evento.clientY < r.top ||
      evento.clientY > r.bottom
    )
      dialogo.close();
  }
});

iniciarArquitectura();
