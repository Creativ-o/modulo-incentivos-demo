/* Motor del recorrido guiado. Vive en el marco (fuera de la demo) y trabaja sobre el iframe de la demo, que es del mismo origen.
   Caso = { id, titulo, resumen, perfiles:[rol], escena, pasos:[paso] }
   Paso = { rol?, pantalla?, sel, contiene?, titulo?, texto, preparar?(ctx), hacer?(ctx), listo?(ctx), pulsar? }
     rol        perfil que hace el paso; si el actual es otro, la tarjeta ofrece cambiarlo
     pantalla   archivo de la demo; si el iframe está en otra, se navega
     sel        selector CSS (varios separados por coma); «tarjeta:Título» busca la tarjeta del formulario por su título
     contiene   filtra los candidatos de `sel` por el texto que traen
     preparar   deja la pantalla en el estado que el paso necesita (idempotente)
     hacer      lo que ejecuta «Siguiente» si la persona no actuó (listo() dice si ya está hecho)
     pulsar     «Siguiente» pulsa el elemento resaltado */
(function () {
  'use strict';
  var R = window.Recorrido = window.Recorrido || {};
  var HECHOS = 'recorrido:hechos';
  var frame, roles = {}, casos = {}, cur = null, i = 0, llenando = null, instante = false, congelado = false, faltaDesde = 0, token = 0, raf = 0, el = null, navegando = false, accionando = false, lastBox = '';

  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function lsG(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function lsS(k, v) { try { localStorage.setItem(k, v); } catch (_) { } }
  function hechos() { try { return JSON.parse(lsG(HECHOS) || '[]'); } catch (_) { return []; } }
  R.hechos = hechos;

  /* ── Acceso a la demo ── */
  R.rolActual = function () { return lsG('naowee-incentivos-role') || 'admin'; };
  R.ctx = function () { return { d: frame.contentDocument, w: frame.contentWindow, esperar: sleep }; };
  function archivo(p) { return String(p || '').split('?')[0].split('#')[0].split('/').pop(); }
  function pantallaActual() { try { return archivo(frame.contentWindow.location.pathname); } catch (_) { return ''; } }
  function cargada() { try { return frame.contentDocument && frame.contentDocument.readyState === 'complete' && pantallaActual() !== 'blank'; } catch (_) { return false; } }
  R.ir = async function (pantalla) {
    navegando = true;
    var qs = (String(pantalla).split('?')[1] || '').split('#')[0], busqActual = ''; try { busqActual = frame.contentWindow.location.search.replace(/^\?/, ''); } catch (_) { }
    var distinta = archivo(pantalla) !== pantallaActual() || (qs && qs !== busqActual);   // también cuenta el programa (?id=…)
    if (distinta || !cargada()) {
      if (distinta) frame.src = '../' + pantalla;
      var fin = Date.now() + 8000;
      await sleep(80);
      while (Date.now() < fin && !(cargada() && pantallaActual() === archivo(pantalla) && (!qs || frame.contentWindow.location.search.replace(/^\?/, '') === qs))) await sleep(80);
      await sleep(250);
    }
    navegando = false;
  };

  /* ── Búsqueda del elemento ── */
  function visible(e) { return !!e && e.isConnected && (e.offsetParent !== null || e.getClientRects().length > 0); }
  function tituloDe(c) { var t = c.querySelector('.pf-card-title, h1, h2, h3'); return (t ? t.textContent : c.textContent).toLowerCase(); }
  function buscar(p) {
    var d; try { d = frame.contentDocument; } catch (_) { return null; }
    if (!d || !p.sel) return null;
    var partes = String(p.sel).split(',').map(function (s) { return s.trim(); });
    for (var k = 0; k < partes.length; k++) {
      var s = partes[k], lista, m = /^tarjeta:(.+)$/.exec(s), rz = /^(tipo|inc):(\d+)(?:\s+(.+))?$/.exec(s), pc = /^pcard\[(.+?)\]\s*(.*)$/.exec(s);
      if (pc) { var cad = [].slice.call(d.querySelectorAll('.pcard')).filter(function (e) { return e.textContent.indexOf(pc[1]) > -1; })[0]; lista = !cad ? [] : (pc[2] ? [].slice.call(cad.querySelectorAll(pc[2])) : [cad]); if (p.contiene) { var cf = [].concat(p.contiene).map(function (x) { return x.toLowerCase(); }); lista = lista.filter(function (e) { var tx = e.textContent.toLowerCase(); return cf.every(function (f) { return tx.indexOf(f) > -1; }); }); } var h0 = lista.filter(visible)[0]; if (h0) return h0; continue; }
      if (rz) {
        var raiz = [].slice.call(d.querySelectorAll(rz[1] === 'tipo' ? '.pf-type' : '#pfIncs > .nwt-card'))[+rz[2] - 1];
        var resto = rz[3], nth = 0, mn = resto && /^(.*)@(\d+)$/.exec(resto); if (mn) { resto = mn[1]; nth = +mn[2] - 1; }   // «css@N» = la N-ésima coincidencia
        lista = !raiz ? [] : (resto ? [].slice.call(raiz.querySelectorAll(resto)) : [raiz]);
        if (mn) lista = lista[nth] ? [lista[nth]] : [];
        if (rz[3] && p.contiene) { var gs = [].concat(p.contiene).map(function (x) { return x.toLowerCase(); }); lista = lista.filter(function (c) { var tx = c.textContent.toLowerCase(); return gs.every(function (g) { return tx.indexOf(g) > -1; }); }); }
      } else if (m) { var q = m[1].toLowerCase(); lista = [].slice.call(d.querySelectorAll('.nwt-card')).filter(function (c) { return tituloDe(c).indexOf(q) > -1; }); }
      else { lista = [].slice.call(d.querySelectorAll(s)); if (p.contiene) { var fs = [].concat(p.contiene).map(function (x) { return x.toLowerCase(); }); lista = lista.filter(function (c) { var tx = c.textContent.toLowerCase(); return fs.every(function (f) { return tx.indexOf(f) > -1; }); }); } }
      var hit = lista.filter(visible)[0];
      if (hit) return hit;
    }
    return null;
  }

  /* ── Elementos de la capa ── */
  function mk(tag, cls, id) { var e = document.getElementById(id) || document.createElement(tag); if (!e.parentNode) e.className = cls; e.id = id; if (!e.parentNode) document.body.appendChild(e); return e; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(t) { return String(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/__(.+?)__/g, '<span class="rt-d">$1</span>'); }
  /* Perfil (y persona) que hace el paso: el del paso o, si no lo dice, el último que se declaró */
  function rolDe(idx) { for (var j = idx; j >= 0; j--) if (cur.pasos[j].rol) return cur.pasos[j].rol; return cur.perfiles[0]; }
  function personaDe(idx) { for (var j = idx; j >= 0; j--) { if (cur.pasos[j].rol) return rolDe(j) === 'deportista' ? cur.pasos[j].persona || '' : ''; } return ''; }
  /* Parte del flujo (solo en el recorrido completo): la del paso o, si no lo dice, la última declarada */
  function parteDe(idx) { if (!cur.partes) return 0; for (var j = idx; j >= 0; j--) if (cur.pasos[j].parte) return cur.pasos[j].parte; return 1; }
  function bandaParte(idx) {
    var n = parteDe(idx); if (!n) return '';
    var segs = cur.partes.map(function (nom, k) { return '<i class="' + (k + 1 < n ? 'done' : k + 1 === n ? 'now' : '') + '" title="' + esc(nom) + '"></i>'; }).join('');
    return '<div class="rt-band"><div class="rt-segs">' + segs + '</div><div class="rt-part"><b>Parte ' + n + ' de ' + cur.partes.length + '</b> · ' + esc(cur.partes[n - 1]) + '</div></div>';
  }
  function ocultar() { congelado = true; ['rtSpot', 'rtCoach', 'rtBack'].forEach(function (id) { var e = document.getElementById(id); if (e) e.classList.add('rt-off'); }); }
  /* Muestra la tarjeta y el resaltado cuando lo resaltado dejó de moverse (terminó el desplazamiento), con un fundido */
  async function revelar(t) {
    var antes = '', quietos = 0, fin = Date.now() + 1100;
    while (Date.now() < fin && quietos < 5) {
      await new Promise(function (r) { requestAnimationFrame(r); });
      if (t !== token) return;
      var k = el && visible(el) ? Math.round(el.getBoundingClientRect().top) + ',' + Math.round(el.getBoundingClientRect().height) : 'x';
      quietos = k === antes ? quietos + 1 : 0; antes = k;
    }
    if (t !== token) return;
    var sp = document.getElementById('rtSpot');
    if (sp) sp.style.transition = 'none';   // la forma nueva se coloca de golpe, mientras está invisible: no «crece» ni «se encoge» al aparecer
    congelado = false; lastBox = ''; bucle(true);
    if (sp) { void sp.offsetWidth; sp.style.transition = ''; }
    ['rtSpot', 'rtCoach', 'rtBack'].forEach(function (id) { var e = document.getElementById(id); if (e) e.classList.remove('rt-off'); });
  }
  function quitar() { ['rtSpot', 'rtCoach', 'rtBack'].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); }

  function pintar(p, objetivo, extra) {
    if (!cur) return;
    var spot = mk('div', 'rt-spot', 'rtSpot'), back = mk('div', 'rt-backdrop', 'rtBack'), coach = mk('div', 'rt-coach', 'rtCoach');
    [spot, back, coach].forEach(function (e) { if (!e.dataset.ini) { e.dataset.ini = '1'; e.classList.add('rt-off'); } });   // el primero aparece con fundido, no de golpe
    el = objetivo || null; lastBox = '';
    var last = i === cur.pasos.length - 1, rol = roles[rolDe(i)] || {};
    var hint = extra && extra.hint ? extra.hint : (p.llenar ? 'Se llena solo mientras lees. También puedes editarlo tú.' : (p.hacer || p.pulsar ? 'Hazlo tú o pulsa «Siguiente».' : ''));
    coach.innerHTML = '<div class="rt-h"><span class="rt-chip">' + esc(cur.id) + '</span><span class="rt-who">' + esc(personaDe(i) ? personaDe(i) + ' · Deportista' : (rol.nombre || '')) + '</span><button class="rt-x" aria-label="Cerrar recorrido">&times;</button></div>'
      + bandaParte(i)
      + '<div class="rt-title">' + esc(extra && extra.titulo || p.titulo || cur.titulo) + '</div>'
      + '<div class="rt-body">' + md(esc(extra && extra.texto || p.texto)) + '</div>'
      + (hint ? '<div class="rt-hint">' + esc(hint) + '</div>' : '')
      + '<div class="rt-f"><span class="rt-count">Paso ' + (i + 1) + ' de ' + cur.pasos.length + '</span><div class="rt-btns">'
      + (i > 0 ? '<button class="rt-btn" data-a="prev">Anterior</button>' : '')
      + (extra && extra.boton ? '<button class="rt-btn rt-btn--p" data-a="rol">' + esc(extra.boton) + '</button>'
        : '<button class="rt-btn rt-btn--p" data-a="' + (last ? 'done' : 'next') + '">' + (last ? ((R.etiquetaFinal && R.etiquetaFinal(cur)) || 'Finalizar') : 'Siguiente') + '</button>')
      + '</div></div>';
    coach.querySelector('.rt-x').onclick = function () { R.terminar(); };
    coach.querySelectorAll('[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.a;
        if (a === 'prev') return mover(-1);
        if (a === 'done') return fin();
        if (a === 'rol') return cambiarRol(p);
        return siguiente(b);
      };
    });
    if (objetivo) { try { objetivo.scrollIntoView({ block: 'center', behavior: instante ? 'instant' : 'smooth' }); } catch (_) { } }
    document.body.classList.add('rc-tour');
    back.style.display = objetivo ? 'none' : 'block';
    spot.style.display = objetivo ? 'block' : 'none';
    cancelAnimationFrame(raf); bucle(true);
  }

  /* Reposiciona el resaltado y la tarjeta mientras el contenido se mueve o se redibuja */
  function bucle(forzar) {
    if (!cur) return;
    var p = cur.pasos[i], spot = document.getElementById('rtSpot'), coach = document.getElementById('rtCoach'), back = document.getElementById('rtBack');
    if (spot && coach && p && !congelado) {
      var antes = el;
      if (!el || !visible(el)) el = buscar(p);   // el elemento puede aparecer después (se está llenando) o redibujarse
      if (el && !antes) { try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) { } }
      if (el) {
        faltaDesde = 0;
        var r = el.getBoundingClientRect(), fr = frame.getBoundingClientRect(), pad = 4;
        var top = r.top + fr.top, left = r.left + fr.left, w = r.width, h = r.height, box = [top, left, w, h, coach.offsetHeight].join();
        if (box !== lastBox || forzar) {
          lastBox = box;
          spot.style.display = 'block'; if (back) back.style.display = 'none';
          spot.style.top = (top - pad) + 'px'; spot.style.left = (left - pad) + 'px'; spot.style.width = (w + pad * 2) + 'px'; spot.style.height = (h + pad * 2) + 'px';
          var n = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0; spot.style.borderRadius = (n > 0 ? n + pad : 8) + 'px';
          colocar(coach, { top: top, left: left, width: w, height: h });
        }
      } else {
        if (!faltaDesde) faltaDesde = Date.now();
        if (Date.now() - faltaDesde > 2200 && lastBox !== 'x') { lastBox = 'x'; spot.style.display = 'none'; if (back) back.style.display = 'block'; colocar(coach, null); }   // un objetivo que tarda en aparecer no manda la tarjeta al centro
      }
    }
    raf = requestAnimationFrame(function () { bucle(false); });
  }
  /* La tarjeta flota sobre la demo pero busca un lugar que no tape lo resaltado: a la derecha, a la izquierda, debajo o arriba */
  function colocar(coach, r) {
    var cw = 360, ch = coach.offsetHeight || 260, m = 16, gap = 14, vw = innerWidth, vh = innerHeight, top, left;
    if (vw <= 760) { coach.style.top = Math.max(m, vh - ch - m) + 'px'; coach.style.left = Math.max(m, (vw - cw) / 2) + 'px'; return; }
    if (!r) { coach.style.top = Math.max(m, (vh - ch) / 2) + 'px'; coach.style.left = Math.max(m, (vw - cw) / 2) + 'px'; return; }
    var t0 = Math.max(r.top, 0), b0 = Math.min(r.top + r.height, vh), l0 = r.left, r0 = r.left + r.width;   // solo lo que se ve de lo resaltado
    var yAl = Math.min(Math.max(m, t0), vh - ch - m), xAl = Math.min(Math.max(m, l0), vw - cw - m);
    var cand = [
      { l: r0 + gap, t: yAl, ok: r0 + gap + cw + m <= vw },                       // a la derecha
      { l: l0 - gap - cw, t: yAl, ok: l0 - gap - cw >= m },                       // a la izquierda
      { l: xAl, t: b0 + gap, ok: b0 + gap + ch + m <= vh },                       // debajo
      { l: xAl, t: t0 - gap - ch, ok: t0 - gap - ch >= m }                        // arriba
    ];
    var hit = cand.filter(function (x) { return x.ok; })[0];
    if (!hit) {   // no cabe sin tapar: la esquina que menos tapa
      var esq = [{ l: vw - cw - m, t: vh - ch - m }, { l: m, t: vh - ch - m }, { l: vw - cw - m, t: m }, { l: m, t: m }];
      var ov = function (c) { var w = Math.max(0, Math.min(c.l + cw, r0) - Math.max(c.l, l0)), h = Math.max(0, Math.min(c.t + ch, b0) - Math.max(c.t, t0)); return w * h; };
      esq.sort(function (a, b) { return ov(a) - ov(b); }); hit = esq[0];
    }
    coach.style.top = Math.round(hit.t) + 'px'; coach.style.left = Math.round(hit.l) + 'px';
  }

  /* ── Ejecución ── */
  async function mostrar() {
    var t = ++token; if (!cur) return;
    var p = cur.pasos[i]; el = null; lastBox = ''; faltaDesde = 0;
    ocultar();   // lo anterior se desvanece mientras la demo cambia de pantalla o de paso
    var rol = p.rol && roles[p.rol];
    if (p.rol && (R.rolActual() !== p.rol || (p.persona && lsG('naowee:atleta-persona') !== p.persona))) {
      var pn = parteDe(i), pt = pn ? cur.partes[pn - 1] : '';
      pintar(p, null, { titulo: 'Cambio de perfil', texto: (pn ? 'Seguimos en la **parte ' + pn + ' de ' + cur.partes.length + ' · ' + pt + '**. ' : '') + 'Ahora lo hace **' + (p.persona ? p.persona + ' · Deportista' : (rol ? rol.nombre : p.rol)) + '**. Cambia de perfil para continuar el recorrido.', boton: 'Cambiar a ' + (p.persona ? p.persona.split(' ')[0] : (rol ? rol.corto : p.rol)), hint: ' ' }); return revelar(t);
    }
    /* Si la demo va a cambiar de pantalla o de paso del formulario, se funde la demo entera: así no se ve su desplazamiento intermedio */
    var AC = window.Acciones, destino = p.preparar && p.preparar.paso, cambia = false;
    try { cambia = (p.pantalla && (archivo(p.pantalla) !== pantallaActual() || ((String(p.pantalla).split('?')[1] || '') && String(p.pantalla).split('?')[1] !== frame.contentWindow.location.search.replace(/^\?/, '')))) || (destino && AC && AC.formPaso(R.ctx()) !== destino); } catch (_) { }
    instante = !!cambia;
    if (cambia) { await sleep(200); if (t !== token) return; }   // deja que la tarjeta termine de desvanecerse antes de que la demo cambie
    if (p.pantalla) { await R.ir(p.pantalla); if (t !== token) return; }
    var ctx = R.ctx();
    try { if (p.preparar) await p.preparar(ctx); } catch (e) { console.warn('preparar', e); }
    if (t !== token) return;
    var objetivo = null;
    var pintado = false;
    for (var n = 0; n < 30 && !objetivo; n++) {
      objetivo = buscar(p);
      if (!objetivo) { await sleep(120); if (t !== token) return; if (n === 16 && !pintado) { pintar(p, null); pintado = true; revelar(t); } }
    }
    if (objetivo || !pintado) { pintar(p, objetivo); revelar(t); }
    if (p.llenar) {   // los datos se van llenando mientras la persona lee el paso
      var AC = window.Acciones; if (AC) AC.ritmo = AC.ritmoBase;
      llenando = (async function () { await sleep(1100); if (t !== token) return; try { await p.llenar(R.ctx()); } catch (e) { console.warn('llenar', e); } })();
    }
  }
  async function cambiarRol(p) {
    var rol = roles[p.rol]; if (!rol) return;
    lsS('naowee-incentivos-role', p.rol);
    if (rol.atleta || p.persona) lsS('naowee:atleta-persona', p.persona || rol.atleta);
    await R.ir(p.pantalla || rol.inicio);
    if (archivo(p.pantalla || rol.inicio) === pantallaActual()) frame.contentWindow.location.reload();
    await sleep(200);
    mostrar();
  }
  function mover(d) { llenando = null; i = Math.max(0, Math.min(cur.pasos.length - 1, i + d)); mostrar(); }
  async function siguiente(btn) {
    var p = cur.pasos[i], ctx = R.ctx();
    accionando = true; if (btn) btn.disabled = true;
    try {
      if (llenando) { if (window.Acciones) window.Acciones.ritmo = 0.15; await llenando; }   // si no quiere esperar, el resto se llena de prisa
      if (p.hacer && !(p.listo && p.listo(ctx))) { await p.hacer(ctx); await sleep(450); }
      else if (p.pulsar) { var e = buscar(p); if (e) { ocultar(); await sleep(230); e.click(); await sleep(600); } }   // la tarjeta se desvanece antes de la acción: la pantalla puede cambiar
    } catch (e) { console.warn('hacer', e); }
    accionando = false;
    mover(1);
  }
  function fin() {
    var l = hechos(); if (l.indexOf(cur.id) < 0) { l.push(cur.id); lsS(HECHOS, JSON.stringify(l)); }
    var id = cur.id;
    R.terminar(true);
    if (R.alTerminar) R.alTerminar(id);
  }

  R.montar = function (o) {
    frame = o.frame; roles = o.roles; (o.casos || []).forEach(function (c) { casos[c.id] = c; });
    /* Si la persona navega por su cuenta (p. ej. pulsa «Crear programa»), el recorrido sigue en el paso de esa pantalla */
    frame.addEventListener('load', function () {
      if (!cur || navegando || accionando) return;
      var a = pantallaActual(), p = cur.pasos[i];
      if (!p.pantalla || archivo(p.pantalla) === a) return;
      for (var j = i + 1; j < cur.pasos.length; j++) { if (cur.pasos[j].pantalla && archivo(cur.pasos[j].pantalla) === a) { i = j; break; } }
      mostrar();
    });
    window.addEventListener('resize', function () { lastBox = ''; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) R.terminar(); });
  };
  R.iniciar = function (id) {
    if (!casos[id]) return;
    R.terminar(true);
    cur = casos[id]; i = 0; mostrar();
  };
  /* Al cerrar el recorrido la demo vuelve arriba: no se queda cortada donde estaba el último resaltado */
  function volverArriba() {
    try {
      var w = frame.contentWindow, d = frame.contentDocument;
      w.scrollTo({ top: 0, behavior: 'smooth' });
      [].slice.call(d.querySelectorAll('#pfScroll, .main, .page')).forEach(function (e) { if (e.scrollTop > 0) e.scrollTo({ top: 0, behavior: 'smooth' }); });
    } catch (_) { }
  }
  R.terminar = function (silencioso) {
    if (cur) volverArriba();
    token++; cancelAnimationFrame(raf); cur = null; el = null; congelado = false; quitar();
    document.body.classList.remove('rc-tour');
  };
  R.activo = function () { return !!cur; };
  R.saltar = function (n) { if (cur) { i = Math.max(0, Math.min(cur.pasos.length - 1, n)); mostrar(); } };   // para pruebas
})();
