import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { DatabaseSync } from 'node:sqlite';

// Exercises the actual API implementation with an in-memory SQLite D1 adapter.
// Hosted identity injection and Cloudflare runtime are checked separately in preview.
const sqlite = new DatabaseSync(':memory:');
sqlite.exec(`CREATE TABLE records (id TEXT PRIMARY KEY, owner TEXT NOT NULL, kind TEXT NOT NULL,
name TEXT NOT NULL, detail TEXT NOT NULL, category TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE audit (id TEXT PRIMARY KEY, owner TEXT NOT NULL, action TEXT NOT NULL, record_id TEXT NOT NULL, created_at TEXT NOT NULL);`);
const DB = {
  prepare(sql) {
    return { bind(...args) {
      return {
        all: async()=>({ results: sqlite.prepare(sql).all(...args) }),
        first: async()=>sqlite.prepare(sql).get(...args),
        run: ()=>sqlite.prepare(sql).run(...args),
      };
    } };
  },
  async batch(statements) {
    sqlite.exec('BEGIN');
    try { const result = statements.map(s=>s.run()); sqlite.exec('COMMIT'); return result; }
    catch(e) { sqlite.exec('ROLLBACK'); throw e; }
  },
};
let user = null;
const env = { DB };
const source = readFileSync(new URL('../app/api/records/route.ts',import.meta.url),'utf8');
const js = stripTypeScriptTypes(source).replace(/^import .*;\r?$/gm,'').replace(/^export /gm,'');
const api = new Function('env','getChatGPTUser',`${js};return {GET,POST,PATCH};`)(env,async()=>user);
const origin = 'http://localhost:5173';
async function call(method,body,requestOrigin=origin) {
  const req = new Request(origin+'/api/records',{
    method, headers:{Origin:requestOrigin,'Content-Type':'application/json'},
    ...(method!=='GET'?{body:JSON.stringify(body)}:{}),
  });
  const r=await api[method](req);
  return {status:r.status,body:await r.json()};
}
assert.equal((await call('GET')).status,401);
assert.equal((await call('POST',{})).status,401);
user={userId:'alice',displayName:'Alice',email:'alice@example.test'};
assert.equal((await call('POST',null)).status,400);
assert.equal((await call('PATCH',null)).status,400);
assert.equal((await call('POST',{kind:'company',name:'',detail:'',category:'Servicios'})).status,400);
assert.equal((await call('POST',{kind:'company',name:'Demo',detail:'',category:'Servicios'},'https://invalid.example')).status,403);
const company=await call('POST',{kind:'company',name:'Empresa de prueba',detail:'Local',category:'Servicios'});
assert.equal(company.status,201);
const ticket=await call('POST',{kind:'ticket',name:'Solicitud de prueba',detail:'Local',category:'Cloud Cardnet'});
assert.equal(ticket.status,201);
assert.equal((await call('PATCH',{id:ticket.body.id,status:'En atención'})).status,200);
assert.equal((await call('PATCH',{id:ticket.body.id,status:'Resuelta'})).status,200);
assert.equal((await call('PATCH',{id:ticket.body.id,status:'Inválido'})).status,400);
assert.equal((await call('PATCH',{id:company.body.id,status:'Resuelta'})).status,404);
let result=await call('GET');
assert.equal(result.body.records.length,2);
assert.equal(result.body.audit.length,4);
assert.equal(result.body.records.find(r=>r.id===ticket.body.id).status,'Resuelta');
user={userId:'bob',displayName:'Bob',email:'bob@example.test'};
result=await call('GET');
assert.equal(result.body.records.length,0,'Another account must not see records.');
assert.equal(result.body.audit.length,0,'Another account must not see audit events.');
assert.equal((await call('PATCH',{id:ticket.body.id,status:'Abierta'})).status,404);
env.DB=null;
assert.equal((await call('GET')).status,503);
sqlite.close();
console.log('PASS: API authentication, input validation, cross-origin protection, SQLite persistence, state updates, audit and account isolation.');
