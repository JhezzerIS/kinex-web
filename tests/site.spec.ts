import { test, expect } from '@playwright/test';
import { resolverMedio } from '../src/components/media';
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
  for (const destino of ['proyecto', 'gestos', 'arquitectura']) {
    await page.locator(`#navegacion a[href="#${destino}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${destino}$`));
  }
  await expect(page.getByText('VIDEO EN PREPARACIÓN', { exact: true })).toBeVisible();
  await expect(page.locator('#photo-gallery')).toBeHidden();
  await expect(page.locator('video')).toHaveCount(0);
  expect(errores).toEqual([]);
});

test('las seis posturas cambian la ilustración y distinguen funciones previstas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#gestos');
  for (const [nombre, ficha] of Object.entries(gestos)) {
    await page.locator(`[data-gesture="${nombre}"]`).click();
    await expect(page.locator('#gesture-name')).toHaveText(ficha.titulo);
    await expect(page.locator('#gesture-outcome')).toHaveText(ficha.intencion);
    await expect(page.locator('#gesture-status')).toHaveText(ficha.estado);
    await expect(page.locator('[data-gesture][aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator('#gesture-hand .hand-joint')).toHaveCount(21);
  }
  await page.locator('[data-gesture="indice"]').click();
  const abierto = await page.locator('#gesture-hand .hand-joint').nth(8).getAttribute('cy');
  await page.locator('[data-gesture="pellizco"]').click();
  const cerrado = await page.locator('#gesture-hand .hand-joint').nth(8).getAttribute('cy');
  expect(cerrado).not.toBe(abierto);
  await expect(page.locator('#gesture-status')).toContainText('previstos');
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
  await expect(page.locator('#tab-pellizco')).toBeFocused();
  await expect(page.locator('#tab-pellizco')).toHaveAttribute('aria-selected', 'true');
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
        `https://github.com/jean11op/HoloControl-Access/blob/develop/${pieza.archivo}`,
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

for (const ancho of [320, 390, 768, 1440]) {
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
  await expect(page.locator('#gesture-outcome')).toHaveText('Desplazamiento vertical');
  const mapa = page.locator('#full-diagram-link');
  const direccion = await mapa.evaluate((e: HTMLAnchorElement) => e.href);
  expect(direccion).toBe('http://127.0.0.1:4174/kinex-web/diagrams/arquitectura-kinex.html');
  await page.goto(direccion);
  await expect(page.locator('svg').first()).toBeVisible();
  expect(errores).toEqual([]);
});

test('las rutas multimedia respetan HTTPS y la subcarpeta', () => {
  expect(resolverMedio('media/demo.mp4', './')).toBe('./media/demo.mp4');
  expect(resolverMedio('media/demo.mp4', '/kinex-web/')).toBe('/kinex-web/media/demo.mp4');
  expect(resolverMedio('https://example.org/demo.mp4', './')).toBe('https://example.org/demo.mp4');
  for (const ruta of ['javascript:alert(1)', '//example.org/demo.mp4', '../demo.mp4'])
    expect(() => resolverMedio(ruta, './')).toThrow();
});
