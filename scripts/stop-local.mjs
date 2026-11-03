import { readFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const statePath = path.join(root, '.sites-runtime/cardnet-local.json');
let state;
try { state = JSON.parse(readFileSync(statePath, 'utf8')); }
catch { console.log('No hay una instancia local registrada.'); process.exit(0); }
if (state.root !== root || !Number.isInteger(state.pid) || state.pid <= 0) {
  console.error('Registro de proceso invalido. No se detuvo ningun proceso.'); process.exit(1);
}
const checkAndStop = `$p=Get-CimInstance Win32_Process -Filter ('ProcessId = '+$env:CARDNET_LOCAL_PID); if(-not $p){exit 0}; if(-not $p.CommandLine.Contains($env:CARDNET_LOCAL_ENTRY)){Write-Error 'El proceso no corresponde a CARDNET. No se detuvo.';exit 1}; & taskkill.exe /PID $env:CARDNET_LOCAL_PID /T /F; exit $LASTEXITCODE`;
const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', checkAndStop], {
  windowsHide: true, stdio: 'inherit', env: { ...process.env, CARDNET_LOCAL_PID: String(state.pid), CARDNET_LOCAL_ENTRY: path.join(root,'scripts/run-framework.mjs') },
});
if (result.error || result.status !== 0) {
  console.error('No se pudo detener la instancia local de CARDNET.'); process.exit(1);
}
unlinkSync(statePath);
console.log('CARDNET local detenido.');
