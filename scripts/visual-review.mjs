import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const destino = '.reports';
await mkdir(destino, { recursive: true });
const navegador = await chromium.launch();
try {
  for (const [nombre, width, height] of [
    ['desktop', 1440, 1000],
    ['tablet', 768, 1024],
    ['mobile', 390, 844],
    ['small-mobile', 320, 800],
  ]) {
    const pagina = await navegador.newPage({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    const errores = [];
    pagina.on('pageerror', (error) => errores.push(error.message));
    pagina.on('response', (respuesta) => {
      if (respuesta.status() >= 400) errores.push(`${respuesta.status()} ${respuesta.url()}`);
    });
    await pagina.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.screenshot({
      path: `${destino}/${nombre}.png`,
      fullPage: true,
    });
    await pagina.screenshot({ path: `${destino}/${nombre}-top.png` });
    if (nombre === 'desktop' || nombre === 'mobile') {
      await pagina.locator('#gestos').screenshot({ path: `${destino}/${nombre}-gestos.png` });
      await pagina
        .locator('#arquitectura')
        .screenshot({ path: `${destino}/${nombre}-arquitectura.png` });
    }
    const medidas = await pagina.evaluate(() => ({
      ancho: innerWidth,
      contenido: document.documentElement.scrollWidth,
      alto: document.documentElement.scrollHeight,
    }));
    const desbordes = await pagina.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .map((e) => ({
          tag: e.tagName,
          clase: e.getAttribute('class'),
          izquierda: e.getBoundingClientRect().left,
          derecha: e.getBoundingClientRect().right,
        }))
        .filter((e) => e.derecha > innerWidth + 1 || e.izquierda < -1)
        .slice(0, 12),
    );
    console.log(JSON.stringify({ nombre, ...medidas, errores, desbordes }));
    await pagina.close();
  }
} finally {
  await navegador.close();
}
