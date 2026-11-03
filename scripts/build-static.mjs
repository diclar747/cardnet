import { build, createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(root, 'vite.static.config.ts');
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
