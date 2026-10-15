# Añadir el video y las fotos

La configuración está en `src/data/media.ts`. Con los valores iniciales, la
página muestra «Video en preparación» y oculta la galería vacía.
El explorador de mano está identificado como ilustración interactiva.

## Archivos

Coloca el material dentro de `public/media/`. Las rutas de configuración no
incluyen `public/` y funcionan también bajo la subcarpeta de GitHub Pages.

```ts
export const medios: MediosProyecto = {
  video: 'media/demo-kinex.mp4',
  poster: 'media/demo-poster.webp',
  subtitulos: 'media/demo-kinex.es.vtt',
  fotografias: [
    {
      archivo: 'media/interfaz-kinex.webp',
      descripcion: 'Descripción de la interfaz que aparece en la fotografía real',
      pie: 'Interfaz de Kinex',
    },
    {
      archivo: 'media/gestos-kinex.webp',
      descripcion: 'Descripción del gesto y su resultado en la fotografía real',
      pie: 'Del gesto a la pantalla',
    },
  ],
};
```

Puedes añadir solo video o solo fotografías. `poster` y `subtitulos` pueden
seguir siendo `null`. Las URLs externas deben comenzar por `https://` y apuntar
al archivo de video, no a una página de YouTube. Los archivos locales facilitan
una carga sin incrustaciones ni rastreadores de terceros.

## Registro sugerido

Graba una demostración breve del cursor, pellizco, scroll y pausa que realmente
funcionen en el prototipo. Muestra la mano y el efecto en pantalla. Identifica
como previstas las funciones que aún estén en desarrollo.

Exporta MP4 H.264 con audio AAC si lo hay, encuadre horizontal 16:9 y tamaño
moderado. El reproductor utiliza controles nativos, no reproduce automáticamente
y no descarga el video antes de la interacción. Añade subtítulos WebVTT cuando
haya explicación hablada. Fotografías WebP o AVIF de hasta 1600 px de ancho son
suficientes para esta composición.

Tras cambiar archivos ejecuta `npm run build` y comprueba el video en
`npm run preview`. Un archivo ausente produce un aviso visible; no se oculta
como si la demostración hubiera funcionado.
