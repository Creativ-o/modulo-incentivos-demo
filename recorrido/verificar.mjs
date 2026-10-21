// Verificador del recorrido: abre cada caso en Chrome sin interfaz, recorre todos los pasos con «Siguiente»
// y comprueba que cada uno encuentra su elemento en la demo. Uso: node recorrido/verificar.mjs [CU-01 CU-02 …]
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const srv = createServer(async (req, res) => {
  try {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    const f = await readFile(join(RAIZ, p.endsWith('/') ? p + 'index.html' : p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(f);
  } catch (_) { res.writeHead(404); res.end(); }
});
await new Promise(r => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}`;

const port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'rec-'))}`, '--no-first-run', '--window-size=1400,1000', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (list.length) break; } catch (_) { } await sleep(250); }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(), errores = [];
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result.exceptionDetails ? 'ERR' : r.result.result.value; };
await send('Runtime.enable'); await send('Page.enable');
const ir = async u => { await send('Page.navigate', { url: u }); await sleep(1800); };

const fallos = []; let total = 0;
try {
  await ir(base + '/recorrido/index.html');
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : JSON.parse(await ev('JSON.stringify(window.CASOS.filter(c => c.pasos).map(c => c.id))'));
  for (const caso of ids) {
    await ir(base + '/incentivo-03-programas.html'); await ev('localStorage.clear(); sessionStorage.clear(); 1');
    await ir(base + '/recorrido/index.html?caso=' + caso); await sleep(2500);
    const n = await ev(`window.CASOS.find(c => c.id === '${caso}').pasos.length`);
    for (let k = 1; k <= n; k++) {
      let est = null;
      for (let t = 0; t < 40; t++) {   // el paso puede tardar en cargar su pantalla
        est = await ev(`(() => { const c = document.getElementById('rtCoach'), s = document.getElementById('rtSpot'); if (!c) return null; const m = /Paso (\\d+) de/.exec(c.textContent); return { n: m ? +m[1] : 0, ok: !!s && s.style.display === 'block', t: c.querySelector('.rt-title').textContent } })()`);
        if (await ev(`(() => { const b = document.querySelector('#rtCoach [data-a=rol]'); if (!b) return false; b.click(); return true })()`)) { await sleep(900); continue; }   // paso que pide cambiar de perfil: se acepta el cambio
        if (est && est.n === k && est.ok) break;
        await sleep(250);
      }
      total++;
      if (!est || est.n !== k || !est.ok) {
        const dbg = await ev(`(() => { const f = document.getElementById('demo'), d = f.contentDocument, c = document.getElementById('rtCoach'); return JSON.stringify({ url: f.contentWindow.location.pathname.split('/').pop(), listo: d.readyState, banner: !!d.querySelector('.status-banner'), vis: (() => { const b = d.querySelector('.status-banner'); return b ? [b.offsetParent !== null, b.getClientRects().length] : null })(), coach: c ? c.className + '|' + getComputedStyle(c).opacity : null, spot: (document.getElementById('rtSpot') || {style:{}}).style.display, dim: (document.getElementById('rtBack') || {style:{}}).style.display }) })()`);
        fallos.push(`${caso} · paso ${k}${est ? ' «' + est.t + '»' : ''}: no encontró su elemento · ${dbg}`);
      }
      await ev(`(() => { const b = document.querySelector('#rtCoach [data-a=next], #rtCoach [data-a=done]'); if (b) b.click(); return 1 })()`);
      await sleep(900);
    }
  }
} finally { ws.close(); proc.kill(); srv.close(); }
if (errores.length) fallos.push('Errores de JS: ' + errores.slice(0, 3).join(' | '));
console.log(fallos.length ? 'FALLA\n- ' + fallos.join('\n- ') : `OK · ${total} pasos verificados`);
process.exit(fallos.length ? 1 : 0);
