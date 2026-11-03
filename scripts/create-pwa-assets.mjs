import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
const directory = new URL('../public/pwa/', import.meta.url);
await mkdir(directory, { recursive: true });
const logo = await readFile(new URL('../public/favicon.svg', import.meta.url));
for (const size of [180, 192, 512]) await sharp(logo).resize(size, size).png().toFile(fileURLToPath(new URL(`icon-${size}-blue.png`, directory)));
const safeLogo = await sharp(logo).resize(300, 300).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0d1825' } }).composite([{ input: safeLogo, gravity: 'centre' }]).png().toFile(fileURLToPath(new URL('icon-maskable-512-blue.png', directory)));
await sharp(fileURLToPath(new URL('../public/images/cardnet/hero.png', import.meta.url))).resize(1200, 675, { fit: 'cover' }).webp({ quality: 85 }).toFile(fileURLToPath(new URL('cover.webp', directory)));
await mkdir(new URL('photos/', directory), { recursive: true });
const photos = new URL('../public/images/cardnet/', import.meta.url);
for (const name of await readdir(photos)) {
  if (!name.endsWith('.png')) continue;
  await sharp(fileURLToPath(new URL(name, photos))).resize(800, 450, { fit: 'cover' }).webp({ quality: 75 }).toFile(fileURLToPath(new URL(`photos/${name.replace('.png', '.webp')}`, directory)));
}
await writeFile(new URL('README.txt', directory), 'Íconos derivados del logo SVG original de CARDNET. Portada optimizada de la fotografía corporativa existente. Regenerar: node scripts/create-pwa-assets.mjs.\n');


