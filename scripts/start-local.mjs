import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, readFileSync, writeFileSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';

const root = fileURLToPath(new URL('../', import.meta.url));
const stateDir = path.join(root, '.sites-runtime');
const url = 'http://127.0.0.1:5186/';
const shouldOpen = !process.argv.includes('--no-browser');
mkdirSync(stateDir, { recursive: true });

async function probe() {
  return new Promise(resolve => {
    const request = http.get(url, { timeout: 15000 }, response => {
      let content = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { content += chunk; });
      response.on('end', () => resolve(response.statusCode === 200 && content.includes('CARDNET | Centro de operaciones')));
    });
    request.on('error', () => resolve(false));
    request.on('timeout', () => request.destroy());
  });
}
function openBrowser() {
  if (!shouldOpen) return;
  // Hidden helper; only the requested browser page becomes visible.
  const child = process.platform === 'win32'
    ? spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', "Start-Process 'http://127.0.0.1:5186/'"], { windowsHide: true, detached: true, stdio: 'ignore' })
    : spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { detached: true, stdio: 'ignore' });
  child.on('error', () => console.log(`Abra ${url} en su navegador.`));
  child.unref();
}
if (await probe()) {
  console.log(`CARDNET ya esta activo en ${url}`);
  openBrowser();
  process.exit(0);
}
if (!existsSync(path.join(root, 'node_modules/vinext/dist/cli.js'))) {
  console.error('Faltan los componentes del proyecto. Revise la instalacion de CARDNET.');
  process.exit(1);
}
const logPath = path.join(stateDir, 'cardnet-local.log');
const statePath = path.join(stateDir, 'cardnet-local.json');
let alreadyStarting = false;
try {
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  if (state.root === root && state.url === url && Number.isInteger(state.pid) && state.pid > 0) {
    process.kill(state.pid, 0);
    alreadyStarting = true;
  }
} catch { /* No running instance owned by this launcher. */ }
const portBusy = await new Promise(resolve => {
  const socket = net.createConnection({ host:'127.0.0.1', port:5186 });
  socket.setTimeout(1000);
  socket.on('connect', () => { socket.destroy(); resolve(true); });
  socket.on('error', () => resolve(false));
  socket.on('timeout', () => { socket.destroy(); resolve(false); });
});
if (portBusy && !alreadyStarting) {
  console.error('El puerto 5186 esta ocupado por otro servicio. No se inicio otra copia de CARDNET.');
  process.exit(1);
}
let startError;
if (!alreadyStarting) {
const log = openSync(logPath, 'a');
const child = spawn(process.execPath, [path.join(root, 'scripts/run-framework.mjs'), 'dev', '--port', '5186', '--hostname', '127.0.0.1'], {
  cwd: root, detached: true, windowsHide: true, stdio: ['ignore', log, log],
});
closeSync(log);
child.on('error', error => { startError = error; });
child.unref();
if (child.pid) writeFileSync(statePath, JSON.stringify({ pid: child.pid, url, root, startedAt: new Date().toISOString() }));
}
console.log(alreadyStarting ? 'Esperando la instancia de CARDNET que ya esta iniciando...' : 'Iniciando CARDNET en esta computadora...');
console.log('El primer inicio puede tardar unos minutos. No abra otra copia.');
const deadline = Date.now() + 240000;
let nextProgress = Date.now() + 15000;
while (Date.now() < deadline) {
  if (startError) break;
  if (await probe()) {
    console.log(`CARDNET listo: ${url}`);
    console.log('Puede cerrar esta ventana. El sistema seguira activo en segundo plano.');
    openBrowser();
    process.exit(0);
  }
  if (Date.now() >= nextProgress) {
    console.log('Preparando el sistema local...');
    nextProgress = Date.now() + 15000;
  }
  await new Promise(resolve => setTimeout(resolve, 600));
}
console.error(`No se pudo iniciar CARDNET. Registro local: ${logPath}`);
if (startError) console.error(startError.message);
else if (existsSync(logPath)) console.error(readFileSync(logPath, 'utf8').slice(-2500));
process.exit(1);
