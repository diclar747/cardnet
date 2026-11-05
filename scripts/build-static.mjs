import { build, createServer } from 'vite';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readdir } from 'node:fs/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(root, 'vite.static.config.ts');
// Some Git hosting panels publish the entire checkout instead of dist.
// Keep an authored template so repeated builds never use generated HTML as input.
await cp(path.join(root, 'static/index.template.html'), path.join(root, 'index.html'));
await build({ root, configFile });
let projectRoutes = [];
const server = await createServer({ root, configFile, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/static/render.tsx');
  const { themeInitialization } = await server.ssrLoadModule('/lib/themes.ts');
  const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  const { siteRoutes, siteProducts, institutionalPages } = await server.ssrLoadModule('/lib/site-catalog.ts');
  projectRoutes = siteRoutes;
  const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  for (const directory of ['', 'soluciones', 'panel', 'instalar', ...siteRoutes]) {
    const route = directory ? `/${directory}/` : '/';
    const output = path.join(root, 'dist', directory);
    await mkdir(output, { recursive: true });
    const product = siteProducts.find(item => item.slug === directory);
    const page = institutionalPages[directory];
    const title = product?.name ?? page?.title;
    const description = product?.description ?? page?.description;
    let html = template;
    if (title && description) {
      html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)} | CARDNET</title>`);
      html = html.replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escapeHtml(description)}">`);
    }
    await writeFile(path.join(output, 'index.html'), html.replace('<!--appearance-->', `<script>${themeInitialization}</script>`).replace('<!--app-->', () => render(route)));
  }
  console.log(`Publicación estática lista: ${siteRoutes.length + 4} páginas.`);
} finally { await server.close(); }

const assets = (await readdir(path.join(root, 'dist/assets'))).map(name => `/assets/${name}`);
const photos = (await readdir(path.join(root, 'dist/pwa/photos'))).map(name => `/pwa/photos/${name}`);
const precache = ['/', '/soluciones/', '/panel/', '/instalar/', '/offline.html', '/manifest.webmanifest', '/pwa/icon-192-blue.png', '/pwa/icon-512-blue.png', '/pwa/cover.webp', ...projectRoutes.map(route => `/${route}/`), ...photos, ...assets];
const versionHash = createHash('sha256');
for (const url of precache) {
  const file = url.endsWith('/') ? `${url}index.html` : url;
  versionHash.update(url).update(await readFile(path.join(root, 'dist', file)));
}
const version = versionHash.digest('hex').slice(0, 12);
const swTemplate = await readFile(path.join(root, 'scripts/service-worker.template.js'), 'utf8');
await writeFile(path.join(root, 'dist/sw.js'), swTemplate.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache)));

// Compatibility with cd.com.py's checkout-root publication. dist remains the
// preferred standalone artifact; these copies make either document root work.
for (const entry of ['index.html', 'assets', 'images', 'panel', 'soluciones', 'instalar', 'favicon.svg', 'manifest.webmanifest', 'sw.js', 'offline.html', 'pwa', ...projectRoutes]) {
  await cp(path.join(root, 'dist', entry), path.join(root, entry), { recursive: true });
}
console.log('Compatibilidad de hosting: HTML y recursos compilados preparados también en la raíz.');

