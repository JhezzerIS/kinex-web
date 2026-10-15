import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, extname, sep, isAbsolute } from 'node:path';

const raiz = resolve('dist');
const montaje = '/kinex-web/';
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
};
const servidor = createServer(async (peticion, respuesta) => {
  try {
    if (!['GET', 'HEAD'].includes(peticion.method)) {
      respuesta.writeHead(405);
      respuesta.end();
      return;
    }
    const url = new URL(peticion.url, 'http://127.0.0.1');
    if (!url.pathname.startsWith(montaje)) {
      respuesta.writeHead(404);
      respuesta.end();
      return;
    }
    const nombre = decodeURIComponent(url.pathname.slice(montaje.length)) || 'index.html';
    const archivo = resolve(raiz, nombre);
    const diferencia = relative(raiz, archivo);
    if (diferencia === '..' || diferencia.startsWith('..' + sep) || isAbsolute(diferencia)) {
      respuesta.writeHead(403);
      respuesta.end();
      return;
    }
    if (!(await stat(archivo)).isFile()) {
      respuesta.writeHead(404);
      respuesta.end();
      return;
    }
    const contenido = await readFile(archivo);
    respuesta.writeHead(200, {
      'Content-Type': tipos[extname(archivo)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    respuesta.end(peticion.method === 'HEAD' ? undefined : contenido);
  } catch {
    respuesta.writeHead(404);
    respuesta.end();
  }
});
servidor.listen(4174, '127.0.0.1', () =>
  console.log('Prueba de subruta: http://127.0.0.1:4174/kinex-web/'),
);
