// Local-only end-to-end verification. Creates clearly named test records.
import assert from 'node:assert/strict';
const origin = process.env.CARDNET_TEST_ORIGIN || 'http://127.0.0.1:5173';
assert(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'Run only against a local preview.');
const anonymous = await fetch(`${origin}/api/records`);
assert.equal(anonymous.status, 401, 'Anonymous reads must be rejected.');
const login = await fetch(`${origin}/signin-with-chatgpt?return_to=/`, { redirect: 'manual' });
const cookie = login.headers.getSetCookie().map(v => v.split(';')[0]).join('; ');
assert(cookie, 'Local sign-in must return a development session.');
async function request(method, body, overrides = {}) {
  const r = await fetch(`${origin}/api/records`, {
    method, headers: { Cookie: cookie, Origin: origin, 'Content-Type':'application/json', ...overrides },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const contentType = r.headers.get('content-type') || '';
  return { status: r.status, body: contentType.includes('application/json') ? await r.json() : { error: await r.text() } };
}
const tag = `Prueba local ${crypto.randomUUID().slice(0,8)}`;
const initial = await request('GET');
assert.equal(initial.status, 200);
assert.equal((await request('POST', {kind:'company',name:'',detail:'',category:'Servicios'})).status,400);
assert.equal((await request('POST', {kind:'company',name:tag,detail:'Prueba',category:'Servicios'}, { Origin:'https://invalid.example' })).status,403);
const company = await request('POST',{kind:'company',name:tag,detail:'Registro de prueba local',category:'Servicios'});
assert.equal(company.status,201);
const ticket = await request('POST',{kind:'ticket',name:tag,detail:'Solicitud de prueba local',category:'Cloud Cardnet'});
assert.equal(ticket.status,201);
assert.equal((await request('PATCH',{id:ticket.body.id,status:'En atención'})).status,200);
assert.equal((await request('PATCH',{id:ticket.body.id,status:'Resuelta'})).status,200);
assert.equal((await request('PATCH',{id:company.body.id,status:'Resuelta'})).status,404,'Company cannot be changed through ticket transitions.');
assert.equal((await request('PATCH',{id:ticket.body.id,status:'Inválido'})).status,400);
assert.equal((await request('PATCH',{id:crypto.randomUUID(),status:'Resuelta'})).status,404);
const final = await request('GET');
assert(final.body.records.some(r=>r.id===company.body.id));
assert(final.body.records.some(r=>r.id===ticket.body.id&&r.status==='Resuelta'));
assert(final.body.audit.some(r=>r.record_id===ticket.body.id));
console.log('PASS: authentication, validation, origin protection, persistence, ticket transitions and audit.');
