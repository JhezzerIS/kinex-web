import type { MediosProyecto } from '../data/media';

export function resolverMedio(archivo: string, base: string): string {
  if (/^https:\/\//i.test(archivo)) return archivo;
  if (/^[a-z][a-z\d+.-]*:/i.test(archivo) || archivo.startsWith('//'))
    throw new Error('Usa una ruta local o una URL HTTPS.');
  if (archivo.split('/').includes('..'))
    throw new Error('La ruta multimedia debe permanecer dentro de la web.');
  return `${base.replace(/\/$/, '')}/${archivo.replace(/^\//, '')}`;
}

export function montarMultimedia(medios: MediosProyecto, base: string) {
  const marco = document.querySelector<HTMLElement>('#demo-frame')!;
  if (medios.video) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', 'Demostración real del funcionamiento de Kinex');
    if (medios.poster) video.poster = resolverMedio(medios.poster, base);
    video.src = resolverMedio(medios.video, base);
    if (medios.subtitulos) {
      const pista = document.createElement('track');
      pista.kind = 'captions';
      pista.srclang = 'es';
      pista.label = 'Español';
      pista.default = true;
      pista.src = resolverMedio(medios.subtitulos, base);
      video.append(pista);
    }
    video.addEventListener(
      'error',
      () => {
        const aviso = document.createElement('p');
        aviso.className = 'media-error';
        aviso.append('No se pudo cargar el video. Puedes volver a intentarlo más tarde o ');
        const enlace = document.createElement('a');
        enlace.href = 'https://github.com/jean11op/HoloControl-Access';
        enlace.textContent = 'conocer el proyecto en GitHub';
        aviso.append(enlace, '.');
        marco.replaceChildren(aviso);
      },
      { once: true },
    );
    marco.replaceChildren(video);
    const titulo = document.querySelector('#demo-title')!;
    titulo.textContent = 'Un gesto. Un resultado en pantalla.';
    const descripcion = titulo.closest('.section-heading')!.querySelector(':scope > p')!;
    descripcion.textContent = 'Así funciona el prototipo de Kinex.';
  }
  const galeria = document.querySelector<HTMLElement>('#photo-gallery')!;
  if (!medios.fotografias.length) return;
  galeria.hidden = false;
  medios.fotografias.forEach((foto) => {
    const figura = document.createElement('figure');
    const imagen = document.createElement('img');
    imagen.src = resolverMedio(foto.archivo, base);
    imagen.alt = foto.descripcion;
    imagen.loading = 'lazy';
    imagen.decoding = 'async';
    imagen.width = 1280;
    imagen.height = 800;
    const pie = document.createElement('figcaption');
    pie.textContent = foto.pie;
    imagen.addEventListener(
      'error',
      () => {
        imagen.hidden = true;
        pie.textContent = 'La fotografía no está disponible en este momento.';
      },
      { once: true },
    );
    figura.append(imagen, pie);
    galeria.append(figura);
  });
}
