import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
async function context(request: Request, write = false) {
  if (write && request.headers.get('origin') !== new URL(request.url).origin) return { error: json({ error: 'Origen de solicitud inválido.' }, 403) };
  const user = await getChatGPTUser();
  if (!user) return { error: json({ error: 'Iniciá sesión para administrar tus registros.' }, 401) };
  if (!env.DB) return { error: json({ error: 'El almacenamiento todavía no está disponible.' }, 503) };
  return { user, db: env.DB };
}
export async function GET(request: Request) {
  const c = await context(request); if (c.error) return c.error;
  const [records, audit] = await Promise.all([
    c.db!.prepare('SELECT * FROM records WHERE owner = ? ORDER BY created_at DESC').bind(c.user!.userId).all(),
    c.db!.prepare('SELECT * FROM audit WHERE owner = ? ORDER BY created_at DESC LIMIT 12').bind(c.user!.userId).all(),
  ]);
  return json({ records: records.results, audit: audit.results, name: c.user!.displayName });
}
export async function POST(request: Request) {
  const c = await context(request, true); if (c.error) return c.error;
  let body; try { body = await request.json() as Record<string, unknown>; } catch { return json({ error: 'Datos inválidos.' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Datos inválidos.' }, 400);
  const { kind, name, detail, category } = body;
  if (!['company', 'ticket'].includes(String(kind)) || typeof name !== 'string' || !name.trim() || name.length > 120 || typeof detail !== 'string' || detail.length > 2000 || typeof category !== 'string' || category.length > 100) return json({ error: 'Revisá los campos del formulario.' }, 400);
  const id = crypto.randomUUID(), date = new Date().toISOString();
  await c.db!.batch([
    c.db!.prepare('INSERT INTO records (id,owner,kind,name,detail,category,status,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(id,c.user!.userId,kind,name.trim(),detail.trim(),category,kind === 'company' ? 'Activa' : 'Abierta',date),
    c.db!.prepare('INSERT INTO audit (id,owner,action,record_id,created_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),c.user!.userId,`${kind === 'company' ? 'Empresa registrada' : 'Solicitud creada'}: ${name.trim()}`,id,date),
  ]);
  return json({ id }, 201);
}
export async function PATCH(request: Request) {
  const c = await context(request, true); if (c.error) return c.error;
  let body; try { body = await request.json() as Record<string, unknown>; } catch { return json({ error: 'Datos inválidos.' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.id !== 'string' || !['Abierta','En atención','Resuelta'].includes(String(body.status))) return json({ error: 'Estado inválido.' }, 400);
  const found = await c.db!.prepare('SELECT id FROM records WHERE id=? AND owner=? AND kind=?').bind(body.id,c.user!.userId,'ticket').first();
  if (!found) return json({ error: 'Solicitud no encontrada.' },404);
  await c.db!.batch([
    c.db!.prepare('UPDATE records SET status=? WHERE id=? AND owner=?').bind(body.status,body.id,c.user!.userId),
    c.db!.prepare('INSERT INTO audit (id,owner,action,record_id,created_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),c.user!.userId,`Solicitud actualizada: ${body.status}`,body.id,new Date().toISOString()),
  ]);
  return json({ ok: true });
}
