import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const urlSitio = 'https://jhezzeris.github.io/kinex-web/';
const git = (argumentos, opciones = {}) =>
  execFileSync('git', argumentos, { cwd: raiz, encoding: 'utf8', ...opciones }).trim();

if (git(['branch', '--show-current']) !== 'main') throw new Error('Publica desde la rama main.');
if (git(['status', '--porcelain']))
  throw new Error('Primero guarda tus cambios en un commit y sube main a GitHub.');
const revision = git(['rev-parse', 'HEAD']);
const remoto = git(['ls-remote', 'origin', 'refs/heads/main']).split(/\s+/)[0];
if (remoto !== revision)
  throw new Error('Primero ejecuta git push origin main para publicar el código fuente.');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Ejecuta este script mediante npm run deploy.');

execFileSync(process.execPath, [npm, 'run', 'build'], {
  cwd: raiz,
  env: { ...process.env, VITE_SITE_URL: urlSitio },
  stdio: 'inherit',
});
const salida = join(raiz, 'dist');
writeFileSync(join(salida, '.nojekyll'), '');

const consulta = spawnSync('git', ['ls-remote', '--exit-code', 'origin', 'refs/heads/gh-pages'], {
  cwd: raiz,
  encoding: 'utf8',
});
if (![0, 2].includes(consulta.status))
  throw new Error('No se pudo consultar la rama gh-pages de GitHub.');
let anterior;
if (consulta.status === 0) {
  git(['fetch', 'origin', 'refs/heads/gh-pages']);
  anterior = git(['rev-parse', 'FETCH_HEAD']);
}

// Un índice separado publica dist sin cambiar main ni su directorio de trabajo.
const temporal = mkdtempSync(join(tmpdir(), 'kinex-pages-'));
const indice = join(temporal, 'index');
const entorno = {
  ...process.env,
  GIT_DIR: join(raiz, '.git'),
  GIT_WORK_TREE: salida,
  GIT_INDEX_FILE: indice,
};
const preparar = (argumentos) => git(argumentos, { cwd: salida, env: entorno });
try {
  preparar(['read-tree', '--empty']);
  preparar(['-c', 'core.autocrlf=false', 'add', '--all', '--force', '--', '.']);
  const arbol = preparar(['write-tree']);
  if (anterior && arbol === git(['rev-parse', `${anterior}^{tree}`])) {
    console.log(`La versión compilada ya está en gh-pages.\n${urlSitio}`);
  } else {
    const padres = anterior ? ['-p', anterior] : [];
    const commit = preparar([
      'commit-tree',
      arbol,
      ...padres,
      '-m',
      `deploy: publicar Kinex (${revision.slice(0, 7)})`,
    ]);
    // Push normal: si otro integrante publicó mientras tanto, Git rechaza sobrescribirlo.
    git(['push', 'origin', `${commit}:refs/heads/gh-pages`]);
    console.log(
      `Publicación enviada a GitHub Pages.\n${urlSitio}\nComprueba la web tras el despliegue.`,
    );
  }
} finally {
  rmSync(indice, { force: true });
  rmSync(`${indice}.lock`, { force: true });
  rmdirSync(temporal);
}
