import { test, expect } from '@playwright/test';
import { arquitectura } from '../src/data/architecture';
import { gestos, type Gesto } from '../src/data/gestures';

test('navegación, recursos y contenido real sin errores de carga', async ({ page }) => {
  const errores: string[] = [];
  page.on('pageerror', (error) => errores.push(error.message));
  page.on('response', (respuesta) => {
    if (respuesta.status() >= 400) errores.push(respuesta.url());
  });
  await page.goto('/');
  await expect(page).toHaveTitle('Kinex · El control, en tus manos');
  await expect(page.locator('h1')).toContainText('Kinex');
  await expect(page.locator('#hero-hand .hand-joint')).toHaveCount(21);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('500 24px Manrope'))).toBe(true);
  for (const destino of ['proyecto', 'gestos', 'arquitectura', 'equipo']) {
    await page.locator(`#navegacion a[href="#${destino}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${destino}$`));
  }
  await expect(page.locator('#demostracion, #demo-frame, #photo-gallery')).toHaveCount(0);
  await expect(page.getByText('VIDEO EN PREPARACIÓN', { exact: true })).toHaveCount(0);
  await expect(page.locator('video')).toHaveCount(0);
  expect(errores).toEqual([]);
});

test('las seis posturas cambian la foto y muestran acciones del sistema revisado', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#gestos');
  for (const [nombre, ficha] of Object.entries(gestos)) {
    await page.locator(`[data-gesture="${nombre}"]`).click();
    await expect(page.locator('#gesture-hand svg')).toHaveAttribute('data-postura', nombre);
    await expect(page.locator('#gesture-name')).toHaveText(ficha.titulo);
    await expect(page.locator('#gesture-outcome')).toHaveText(ficha.intencion);
    await expect(page.locator('#gesture-status')).toHaveText(ficha.estado);
    await expect(page.locator('[data-gesture][aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator('#gesture-hand .hand-joint')).toHaveCount(21);
  }
  await page.locator('[data-gesture="indice"]').click();
  await expect(page.locator('#gesture-hand image')).toHaveAttribute('href', /indice\.webp$/);
  await page.locator('[data-gesture="pulgar"]').click();
  await expect(page.locator('#gesture-hand image')).toHaveAttribute('href', /pulgar\.webp$/);
  await expect(page.locator('#gesture-outcome')).toHaveText('Clic izquierdo');
  await page.locator('[data-gesture="dos_dedos"]').click();
  await expect(page.locator('#gesture-outcome')).toHaveText('Flechas en cuatro direcciones');
  await page.locator('[data-gesture="puno"]').click();
  await expect(page.locator('#gesture-outcome')).toHaveText('Minimizar la ventana');
  await page.locator('[data-gesture="deslizamiento"]').click();
  await expect(page.locator('#gesture-outcome')).toHaveText('Subir o bajar el volumen');
});

test('el explorador responde al teclado sin activar una cámara', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => {
          throw new Error('La landing no debe abrir una cámara.');
        },
      },
    });
  });
  await page.goto('/#gestos');
  await page.locator('#tab-indice').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-pulgar')).toBeFocused();
  await expect(page.locator('#tab-pulgar')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(page.locator('#tab-deslizamiento')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#tab-indice')).toBeFocused();
});

test('cada pieza de ambas vistas muestra su explicación y vínculo al código', async ({ page }) => {
  await page.goto('/#arquitectura');
  for (const vista of ['recorrido', 'capas'] as const) {
    await page.locator(`[data-view="${vista}"]`).click();
    for (const pieza of arquitectura[vista]) {
      await page.locator(`[data-node="${pieza.id}"]`).click();
      await expect(page.locator('#node-title')).toHaveText(pieza.titulo);
      await expect(page.locator('#node-source')).toHaveAttribute(
        'href',
        'https://github.com/jean11op/HoloControl-Access',
      );
      await expect(page.locator('.map-node[aria-pressed="true"]')).toHaveCount(1);
    }
  }
});

test('la traza finaliza en Windows y se cancela al cambiar de vista', async ({ page }) => {
  await page.goto('/#arquitectura');
  await page.locator('#trace-button').click();
  await expect(page.locator('[data-node="windows"]')).toHaveAttribute('aria-pressed', 'true', {
    timeout: 6000,
  });
  await expect(page.locator('#trace-button')).toBeEnabled({ timeout: 3000 });
  await page.locator('#trace-button').click();
  await page.locator('[data-view="capas"]').click();
  await page.waitForTimeout(950);
  await expect(page.locator('[data-node="interfaz"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#trace-button')).toBeEnabled();
});

for (const ancho of [320, 360, 390, 768, 1440]) {
  test(`sin desbordamiento horizontal a ${ancho}px`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      ancho,
    );
    for (const gesto of Object.keys(gestos) as Gesto[]) {
      await page.locator(`[data-gesture="${gesto}"]`).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        ancho,
      );
    }
  });
}

test('menú móvil, destinos y escape conservan una navegación utilizable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#navegacion')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('#navegacion a[href="#gestos"]').click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#gestos$/);
  for (const selector of [
    '.hero-actions .button',
    '.gesture-tabs button',
    '.view-tabs button',
    '.map-node',
    '#share-button',
  ]) {
    for (const control of await page.locator(selector).all()) {
      const caja = await control.boundingBox();
      expect(caja?.height).toBeGreaterThanOrEqual(44);
      expect(caja?.width).toBeGreaterThanOrEqual(44);
    }
  }
});

test('compartir confirma la copia y ofrece un diálogo si el portapapeles falla', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (texto: string) => {
          (window as unknown as { enlaceCopiado: string }).enlaceCopiado = texto;
        },
      },
    });
  });
  await page.goto('/#proyecto');
  await page.locator('#share-button').click();
  await expect(page.locator('#share-button')).toContainText('Enlace copiado');
  expect(
    await page.evaluate(() => (window as unknown as { enlaceCopiado: string }).enlaceCopiado),
  ).toBe('http://127.0.0.1:4173/');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Portapapeles no disponible');
    };
  });
  await page.locator('#share-button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#share-url')).toHaveValue('http://127.0.0.1:4173/');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('#share-button')).toBeFocused();
});

test('funciona bajo la subcarpeta de GitHub Pages con recursos y mapa técnico', async ({
  page,
}) => {
  const errores: string[] = [];
  page.on('response', (r) => {
    if (r.status() >= 400) errores.push(r.url());
  });
  page.on('pageerror', (e) => errores.push(e.message));
  await page.goto('http://127.0.0.1:4174/kinex-web/');
  await expect(page.locator('#hero-hand .hand-joint')).toHaveCount(21);
  await page.locator('[data-gesture="dos_dedos"]').click();
  await expect(page.locator('#gesture-outcome')).toHaveText('Flechas en cuatro direcciones');
  await expect(page.locator('#gesture-hand image')).toHaveAttribute('href', /dos\.webp$/);
  await page.locator('#equipo').scrollIntoViewIfNeeded();
  for (const foto of await page.locator('#equipo img').all()) {
    await expect(foto).toBeVisible();
    await expect
      .poll(() => foto.evaluate((imagen: HTMLImageElement) => imagen.naturalWidth))
      .toBeGreaterThan(0);
  }
  const mapa = page.locator('#full-diagram-link');
  const direccion = await mapa.evaluate((e: HTMLAnchorElement) => e.href);
  expect(direccion).toBe('https://github.com/jean11op/HoloControl-Access');
  await page.goto('http://127.0.0.1:4174/kinex-web/diagrams/arquitectura-kinex.html');
  await expect(page.locator('svg').first()).toBeVisible();
  expect(errores).toEqual([]);
});

test('los enlaces de GitHub y documentación apuntan a la portada del repositorio', async ({
  page,
}) => {
  const repositorio = 'https://github.com/jean11op/HoloControl-Access';
  await page.goto('/');
  const externos = page.locator('a[href^="https://"]');
  await expect(externos).toHaveCount(5);
  for (const enlace of await externos.all()) {
    await expect(enlace).toHaveAttribute('href', repositorio);
    await expect(enlace).toHaveAttribute('target', '_blank');
    await expect(enlace).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.goto('/diagrams/arquitectura-kinex.html');
  const fuentes = JSON.parse(
    (await page.locator('#archify-source-evidence-data').textContent()) ?? '{}',
  );
  expect(fuentes.repository.href).toBe(repositorio);
  for (const referencias of Object.values(fuentes.nodes) as { href: string }[][])
    for (const referencia of referencias) expect(referencia.href).toBe(repositorio);
});

test('el hero lleva al explorador y la arquitectura con foco visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const explorar = page.getByRole('link', { name: 'Explorar gestos', exact: true });
  const funcionamiento = page.getByRole('link', { name: 'Cómo funciona', exact: true });
  await expect(explorar).toHaveAttribute('href', '#gestos');
  await expect(funcionamiento).toHaveAttribute('href', '#arquitectura');
  await explorar.focus();
  expect(await explorar.evaluate((enlace) => getComputedStyle(enlace).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#gestos$/);
  await funcionamiento.click();
  await expect(page).toHaveURL(/#arquitectura$/);
});

test('las manos conservan proporciones y 21 puntos verdes en todas las posturas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#gestos');
  for (const nombre of Object.keys(gestos) as Gesto[]) {
    await page.locator(`[data-gesture="${nombre}"]`).click();
    const figura = page.locator('#gesture-hand svg');
    await expect(figura).toHaveAttribute('data-postura', nombre);
    await expect(figura).toHaveAttribute('data-lateralidad', 'izquierda');
    await expect(figura.locator('.hand-joint')).toHaveCount(21);
    await expect(figura.locator('.hand-bone')).toHaveCount(21);
    await expect(figura.locator('.hand-joint').first()).toHaveCSS('fill', 'rgb(86, 231, 160)');
    await expect(figura.locator('.hand-bone').first()).toHaveCSS('stroke', 'rgb(86, 231, 160)');
    const proporcion = await figura.locator('image').evaluate((imagen: SVGImageElement) => {
      const matriz = imagen.getCTM()!;
      return Math.abs(matriz.a / matriz.d);
    });
    expect(proporcion).toBeCloseTo(1, 5);
  }
  await expect(page.locator('#hero-hand .hand-joint')).toHaveCount(21);
  await expect(page.locator('#hero-hand .hand-joint').first()).toHaveCSS(
    'fill',
    'rgb(86, 231, 160)',
  );
});

test('el equipo conserva las cinco fotos con sus nombres, roles y contribuciones', async ({
  page,
}) => {
  await page.goto('/#equipo');
  await expect(page.getByRole('heading', { name: 'Equipo Kinex', exact: true })).toBeVisible();
  const tarjetas = page.locator('#equipo .team-card');
  await expect(tarjetas).toHaveCount(5);
  const integrantes = [
    ['Gabriela Gómez Flores', 'Base de datos', 'gabriela-gomez-flores'],
    ['César Ruiz Vidaurre', 'Dominio y aplicación', 'cesar-ruiz-vidaurre'],
    ['Jhezzer Hilario Lázaro', 'Visión artificial', 'jhezzer-hilario-lazaro'],
    ['Jean Olivares Polo', 'Integración con Windows', 'jean-olivares-polo'],
    ['Nahuel Martínez Gutiérrez', 'Interfaz de usuario', 'nahuel-martinez-gutierrez'],
  ];
  for (const [nombre, rol, archivo] of integrantes) {
    const tarjeta = tarjetas.filter({
      has: page.getByRole('heading', { name: nombre, exact: true }),
    });
    await tarjeta.scrollIntoViewIfNeeded();
    await expect(tarjeta.locator('.team-role')).toHaveText(rol);
    await expect(tarjeta.locator('.team-badge')).not.toBeEmpty();
    const foto = tarjeta.getByRole('img', { name: nombre, exact: true });
    await expect(foto).toHaveAttribute('src', `./media/team/${archivo}.jpg`);
    await expect
      .poll(() =>
        foto.evaluate((imagen: HTMLImageElement) => imagen.complete && imagen.naturalWidth > 0),
      )
      .toBe(true);
  }
});

test('selecciones rápidas y movimiento reducido mantienen el último gesto', async ({ page }) => {
  await page.goto('/#gestos');
  await page.locator('[data-gesture="pulgar"]').click();
  await page.evaluate(() => {
    for (const nombre of ['dos_dedos', 'palma_abierta', 'indice', 'puno'])
      document.querySelector<HTMLButtonElement>(`[data-gesture="${nombre}"]`)!.click();
  });
  await expect(page.locator('#gesture-hand svg')).toHaveAttribute('data-postura', 'puno');
  await expect(page.locator('#gesture-name')).toHaveText('Cierra la mano. Minimiza.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('[data-gesture="deslizamiento"]').click();
  await expect(page.locator('#gesture-hand svg')).toHaveAttribute('data-postura', 'deslizamiento');
  expect(
    await page.locator('#gesture-panel').evaluate((elemento) => elemento.getAnimations().length),
  ).toBe(0);
  expect(
    await page.locator('#gesture-hand').evaluate((elemento) => elemento.getAnimations().length),
  ).toBe(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});

test('móvil horizontal conserva menú, contenido y equipo sin recortes', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/#equipo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(844);
  await expect(page.locator('#navegacion a[href="#equipo"]')).toBeVisible();
  for (const tarjeta of await page.locator('.team-card').all()) {
    const caja = await tarjeta.boundingBox();
    expect(caja!.x).toBeGreaterThanOrEqual(0);
    expect(caja!.x + caja!.width).toBeLessThanOrEqual(844);
  }
});
