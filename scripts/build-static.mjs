import { build, createServer } from 'vite';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(root, 'vite.static.config.ts');
// Some Git hosting panels publish the entire checkout instead of dist.
// Keep an authored template so repeated builds never use generated HTML as input.
await cp(path.join(root, 'static/index.template.html'), path.join(root, 'index.html'));
await build({ root, configFile });
const server = await createServer({ root, configFile, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/static/render.tsx');
  const { themeInitialization } = await server.ssrLoadModule('/lib/themes.ts');
  const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  for (const [directory, route] of [['', '/'], ['soluciones', '/soluciones/'], ['panel', '/panel/']]) {
    const output = path.join(root, 'dist', directory);
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, 'index.html'), template.replace('<!--appearance-->', `<script>${themeInitialization}</script>`).replace('<!--app-->', render(route)));
  }
  console.log('Publicación estática lista: dist/index.html, dist/soluciones/index.html, dist/panel/index.html');
} finally { await server.close(); }

// Compatibility with cd.com.py's checkout-root publication. dist remains the
// preferred standalone artifact; these copies make either document root work.
for (const entry of ['index.html', 'assets', 'images', 'panel', 'soluciones', 'favicon.svg']) {
  await cp(path.join(root, 'dist', entry), path.join(root, entry), { recursive: true });
}
console.log('Compatibilidad de hosting: HTML y recursos compilados preparados también en la raíz.');
