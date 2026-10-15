import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';

const simbolo = await readFile('public/brand/kinex-symbol.svg', 'utf8');
const manrope = (await readFile('public/fonts/manrope-latin.woff2')).toString('base64');
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await pagina.setContent(
    `<!doctype html><html lang="es"><style>@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${manrope});font-weight:200 800}*{box-sizing:border-box}body{margin:0;background:#f8f7f3;color:#20231f;font-family:Manrope,sans-serif}.card{width:1200px;height:630px;padding:66px 80px;position:relative}.brand{display:flex;gap:14px;align-items:center;font-size:60px;font-weight:750;letter-spacing:-4px}.brand svg{width:75px;height:75px}.claim{font-size:87px;line-height:1.08;font-weight:550;letter-spacing:-6px;margin:50px 0 0}.claim span{color:#2854d8}.small{font-size:18px;margin-top:35px;color:#666b63}.dots{position:absolute;right:78px;bottom:60px;color:#2854d8;font-size:150px;letter-spacing:-15px;font-weight:300}.bar{position:absolute;bottom:0;left:0;right:0;height:12px;background:#2854d8}</style><div class="card"><div class="brand">${simbolo}<span>kinex<span style="color:#2854d8">.</span></span></div><p class="claim">El control,<br>en tus <span>manos.</span></p><p class="small">Control gestual para Windows · Proyecto académico</p><span class="dots">⌁</span><div class="bar"></div></div></html>`,
  );
  await pagina.evaluate(() => document.fonts.ready);
  await mkdir('public/brand', { recursive: true });
  await pagina.screenshot({ path: 'public/brand/kinex-social.png' });
  await pagina.setViewportSize({ width: 512, height: 512 });
  await pagina.setContent(
    `<!doctype html><style>body{margin:0;background:#f8f7f3;display:grid;place-items:center;width:512px;height:512px}svg{width:360px;height:360px}</style>${simbolo}`,
  );
  await pagina.screenshot({ path: 'public/brand/kinex-symbol.png' });
  console.log(
    'Marca PNG y tarjeta social generadas desde el símbolo vectorial y las fuentes locales.',
  );
} finally {
  await navegador.close();
}
