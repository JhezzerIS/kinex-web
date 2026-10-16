# Manos de Kinex

Las cinco imágenes son las manos realistas aprobadas para el banner de EXPOSIS 2026.
Están en WebP de 768 × 1152 px, con transparencia y sin alterar su proporción 2:3.
Son representaciones generadas, no capturas del sistema ni fotografías de los integrantes.

El componente `src/components/hand.ts` usa las coordenadas del banner almacenadas en
`src/data/hand-landmarks.json`. Imagen y puntos comparten un encuadre de 1024 × 1536
y escala uniforme. La imagen `dos.webp` y sus puntos se reflejan para mostrar una mano
izquierda, igual que en el banner. El resto conserva su orientación original.

Los 21 puntos y 21 conexiones usan el verde exacto del banner: `#56e7a0`.
