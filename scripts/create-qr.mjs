import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const argumentos = process.argv.slice(2);
const valor = (nombre) => {
  const indice = argumentos.indexOf(nombre);
  return indice >= 0 ? argumentos[indice + 1] : undefined;
};
const direccion = valor('--url');
if (!direccion) {
  console.error('Uso: npm run qr -- --url https://cuenta.github.io/kinex-web/ [--out carpeta]');
  process.exit(1);
}
const url = new URL(direccion);
const nombre = url.hostname.toLowerCase();
if (
  url.protocol !== 'https:' ||
  url.username ||
  url.password ||
  nombre === 'localhost' ||
  nombre.endsWith('.local') ||
  /^(127\.|10\.|192\.168\.|0\.)/.test(nombre) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(nombre) ||
  nombre === '[::1]'
) {
  throw new Error(
    'El QR del stand necesita una URL HTTPS pública, sin credenciales ni direcciones locales.',
  );
}
url.hash = '';
const carpeta = resolve(valor('--out') || '.exports/qr');
await mkdir(carpeta, { recursive: true });
const opciones = {
  errorCorrectionLevel: 'H',
  margin: 4,
  width: 1200,
  color: { dark: '#20231fff', light: '#ffffffff' },
};
await QRCode.toFile(resolve(carpeta, 'kinex-qr.png'), url.href, opciones);
await writeFile(
  resolve(carpeta, 'kinex-qr.svg'),
  await QRCode.toString(url.href, { ...opciones, type: 'svg' }),
);
await writeFile(
  resolve(carpeta, 'DESTINO.txt'),
  `Kinex\n${url.href}\n\nComprueba este enlace y escanea ambos archivos antes de imprimir.\n`,
);
console.log(`QR creado para ${url.href}\n${carpeta}`);
