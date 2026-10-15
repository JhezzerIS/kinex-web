# Kinex web

Landing independiente para el QR del stand. El programa de Windows conserva
su repositorio: https://github.com/jean11op/HoloControl-Access.
Nombre definitivo confirmado: **Kinex**.

Repositorio de la landing: https://github.com/JhezzerIS/kinex-web.
Dirección de GitHub Pages: https://jhezzeris.github.io/kinex-web/.

Incluye marca vectorial propia, fuentes locales, explorador ilustrado de seis
gestos, dos vistas interactivas de arquitectura, mapa técnico ampliable,
enlaces al código, configuración de video y fotografías y preparación de QR.
La web no abre la cámara, no controla el dispositivo y no necesita un backend.

## Revisar localmente

Requiere Node.js 24 y npm. Desde esta carpeta:

```powershell
npm ci
npm run dev
```

En Windows, detén `npm run dev` o `npm run preview` con **Ctrl+C** antes de
ejecutar `npm ci`. Vite carga un módulo nativo que Windows mantiene bloqueado
mientras el servidor está abierto; reinstalar en ese momento puede producir
`EPERM ... rolldown-binding.win32-x64-msvc.node`. Cierra ese servidor y repite
`npm ci`; no hace falta ejecutar la terminal como administrador.

Abre http://127.0.0.1:5173. Para revisar la compilación de producción:

```powershell
npm run build
npm run preview
```

Abre http://127.0.0.1:4173. No abras `index.html` con doble clic: la versión de
desarrollo utiliza módulos y el sitio necesita servirse mediante HTTP.

## Publicar gratis

La landing utiliza el repositorio **público separado** `JhezzerIS/kinex-web`.
No mezcles este proyecto con la rama de visión del programa de Windows.
GitHub Pages admite alojamiento gratuito de sitios estáticos en repositorios
públicos de GitHub Free; no requiere comprar dominio.

1. Comprueba que Settings → Pages → Build and deployment utiliza **GitHub Actions**.
2. Para actualizar, cambia el contenido, ejecuta `npm test` y publica los cambios en `main`.
3. El workflow «Publicar Kinex en GitHub Pages» compila y despliega cada push a `main`.
4. Comprueba en Actions que el despliegue termina correctamente y revisa la URL pública.

El workflow instala dependencias con `npm ci`, compila y publica únicamente
`dist/`. Configura automáticamente `VITE_SITE_URL` para canonical y la imagen
social. Si utilizas un dominio propio, cambia esa variable por su URL HTTPS.
Las rutas relativas permiten publicar bajo `/kinex-web/` o en la raíz de otro
alojamiento estático. No hacen falta claves de API ni variables secretas.

Para un servicio estático distinto, utiliza `npm run build` y publica `dist/`.
Configura `VITE_SITE_URL` con la URL pública cuando la conozcas.

Fuentes: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages),
[despliegue estático de Vite](https://vite.dev/guide/static-deploy).

## QR para el stand

El QR apunta a **https://jhezzeris.github.io/kinex-web/**. Los archivos para el
banner se conservan en `public/qr/`:

- [SVG para impresión](public/qr/kinex-qr.svg).
- [PNG de 1200 px](public/qr/kinex-qr.png).
- [Destino del QR](public/qr/DESTINO.txt).

Para regenerarlos con esa misma dirección:

```powershell
npm run qr -- --url https://jhezzeris.github.io/kinex-web/ --out public/qr
```

El QR codifica una dirección, no una copia de la página. Puedes cambiar textos,
fotografías, video y diseño sin modificarlo mientras se conserve la misma URL.
Para mantener válido el banner, conserva el nombre de usuario, repositorio y
ruta publicados. Usa el SVG al imprimir, mantén su margen blanco y prueba el
código en varios teléfonos y con datos móviles antes de imprimir el banner.

## Contenido y mantenimiento

| Archivo                                   | Qué se modifica                                       |
| ----------------------------------------- | ----------------------------------------------------- |
| `index.html`                              | Textos, navegación y secciones                        |
| `src/data/gestures.ts`                    | Descripción y estado real de cada gesto               |
| `src/data/architecture.ts`                | Piezas, explicaciones y vínculos al código            |
| `src/data/media.ts`                       | Video, subtítulos y fotografías                       |
| `src/styles.css`                          | Composición, paleta, fuentes y responsive             |
| `public/brand/`                           | Símbolo SVG, favicon, PNG y tarjeta social            |
| `public/diagrams/arquitectura-kinex.html` | Mapa técnico autónomo con zoom y selección            |
| `docs/MEDIA.md`                           | Referencias y procedimiento para añadir medios reales |
| `docs/SOURCES.md`                         | Contexto, alcance y revisión del código               |
| `docs/QA.md`                              | Comprobaciones realizadas y límites de la revisión    |
| `DESIGN.md`                               | Dirección visual y motivos de las decisiones          |

La galería permanece oculta hasta tener fotos. El video no se inventa y muestra
un estado de preparación. No se presentan metas de FPS o precisión como
resultados medidos. Cursor, clic y scroll se distinguen de funciones previstas.

## Comprobaciones

```powershell
npm exec playwright install chromium
npm test
npm run check
node scripts/visual-review.mjs
```

Las capturas se guardan en `.reports/`. `scripts/brand-assets.mjs` regenera los
PNG de marca desde el SVG y Manrope; las fuentes y sus licencias OFL están en
`public/fonts/`. Las dependencias npm son de desarrollo: la página compilada
no carga un framework, analítica ni bibliotecas desde un CDN.

`npm test` compila antes de abrir Chromium. La revisión visual requiere mantener
`npm run preview` abierto en otra terminal. Consulta los resultados y el alcance
de las comprobaciones en [docs/QA.md](docs/QA.md).

La publicación de esta versión en `JhezzerIS/kinex-web` y la activación de GitHub
Pages fueron autorizadas por el usuario. Las fotos y el video reales se añadirán
posteriormente sin cambiar la dirección del QR.
