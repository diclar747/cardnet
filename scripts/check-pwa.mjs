import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import sharp from 'sharp';
import ts from 'typescript';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const installSource = await readFile(new URL('../lib/pwa-install.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(installSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { isCardnetInstalled } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
assert.equal(isCardnetInstalled(true, false), true);
assert.equal(isCardnetInstalled(false, true), true);
assert.equal(isCardnetInstalled(false, false), false);
assert.equal(isCardnetInstalled(false, false, [{ platform: 'webapp', url: 'https://cardnet.test/manifest.webmanifest' }], 'https://cardnet.test'), true);
assert.equal(isCardnetInstalled(false, false, [{ platform: 'webapp', url: 'https://other.test/manifest.webmanifest' }], 'https://cardnet.test'), false);
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.webmanifest'), 'utf8'));
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.short_name, 'CARDNET');
for (const icon of manifest.icons) {
  const image = await sharp(path.join(root, icon.src)).metadata();
  assert.equal(`${image.width}x${image.height}`, icon.sizes);
}
const cacheStore = new Map();
const handlers = {};
const key = request => new URL(typeof request === 'string' ? request : request.url, 'https://cardnet.test').href;
let online = true;
const fetchFile = async request => {
  if (!online) throw Error('Offline');
  let file = new URL(key(request)).pathname;
  if (file.endsWith('/')) file += 'index.html';
  return new Response(await readFile(path.join(root, file)));
};
const cache = {
  async addAll(files) { for (const file of files) cacheStore.set(key(file), await fetchFile(file)); },
  async match(request) { return cacheStore.get(key(request))?.clone(); },
  async put(request, response) { cacheStore.set(key(request), response); },
  async keys() { return [...cacheStore.keys()].map(url => ({ url })); },
  async delete(request) { return cacheStore.delete(key(request)); },
};
vm.runInNewContext(await readFile(path.join(root, 'sw.js'), 'utf8'), {
  self: { location: { origin: 'https://cardnet.test' }, clients: { claim: async () => {} }, addEventListener: (event, handler) => handlers[event] = handler },
  caches: { open: async () => cache, match: request => cache.match(request), keys: async () => [], delete: async () => true },
  URL, fetch: fetchFile, Promise,
});
await new Promise((resolve, reject) => handlers.install({ waitUntil: promise => promise.then(resolve, reject) }));
online = false;
async function offline(url, mode) {
  let response;
  handlers.fetch({ request: { url: `https://cardnet.test${url}`, method: 'GET', mode }, respondWith: promise => response = promise });
  assert.ok(response);
  return await response;
}
assert.match(await (await offline('/panel/?solucion=school', 'navigate')).text(), /Explorá nuestras soluciones/);
assert.match(await (await offline('/ruta-no-guardada/', 'navigate')).text(), /Volvemos a conectar/);
assert.ok((await (await offline('/images/cardnet/hero.png', 'cors')).arrayBuffer()).byteLength > 1000);
assert.ok((await stat(path.join(root, 'pwa/icon-180-blue.png'))).size > 0);
console.log(`PWA correcta: manifest, íconos, ${cacheStore.size} archivos precargados, catálogo sin conexión, fallback y foto corporativa sin conexión.`);
// The isolated Response clones can retain undici MessagePorts after assertions.
process.exit(0);

