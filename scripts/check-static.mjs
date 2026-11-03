import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const files = new Set();
for (const page of ['index.html', 'soluciones/index.html', 'panel/index.html']) {
  const html = await readFile(path.join(root, page), 'utf8');
  if (!html.includes('CARDNET') || !html.includes('cardnet.mode.v1')) throw Error(`Página incompleta: ${page}`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
    const asset = decodeURIComponent(match[1]);
    files.add(asset.endsWith('/') || !path.extname(asset) ? `${asset.replace(/\/$/, '')}/index.html` : asset);
  }
}
for (const file of files) {
  const info = await stat(path.join(root, file));
  if (!info.isFile()) throw Error(`Archivo ausente: ${file}`);
}
for (const file of [...files].filter(f => f.endsWith('.js'))) {
  const code = await readFile(path.join(root, file), 'utf8');
  if (code.includes('/api/records') || code.includes('/signin-with-chatgpt')) throw Error('La salida estática incluye llamadas al backend.');
}
console.log(`Correcto: 3 páginas HTML y ${files.size} rutas/archivos válidos; sin API de registros ni autenticación de Sites.`);
