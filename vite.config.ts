import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'kinex-public-url',
      transformIndexHtml(html) {
        const sitio = process.env.VITE_SITE_URL;
        if (!sitio) return html;
        const url = new URL(sitio);
        if (url.protocol !== 'https:') throw new Error('VITE_SITE_URL debe utilizar HTTPS.');
        if (!url.pathname.endsWith('/')) url.pathname += '/';
        return {
          html: html.replace(
            'content="./brand/kinex-social.png"',
            `content="${new URL('brand/kinex-social.png', url).href}"`,
          ),
          tags: [
            { tag: 'link', attrs: { rel: 'canonical', href: url.href }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:url', content: url.href }, injectTo: 'head' },
          ],
        };
      },
    },
  ],
  build: { target: 'es2022', sourcemap: false },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
