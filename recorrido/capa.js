/* Capa del recorrido: marco con la demo, panel flotante (perfil, casos, pantallas, reiniciar) y arranque de escenas. */
(function () {
  'use strict';
  var R = window.Recorrido, A = window.Acciones;
  var frame = document.getElementById('demo');
  var PK = 'recorrido:', K_POS = PK + 'pos';
  var ROLES = {
    admin: { nombre: 'Danna Arrieta · Gestor de incentivos', persona: 'Danna Arrieta', corto: 'Danna', rol: 'Gestor de incentivos', ini: 'DA', bg: '#c4b5fd', fg: '#4c1d95', inicio: 'incentivo-02-dashboard.html' },
    programa: { nombre: 'Isa Pabon · Gestor de programa', persona: 'Isa Pabon', corto: 'Isa', rol: 'Gestor de programa', ini: 'IP', bg: '#bfdbfe', fg: '#1e3a8a', inicio: 'incentivo-03-programas.html' },
    operador: { nombre: 'Jorge Guzman · Operador', persona: 'Jorge Guzman', corto: 'Jorge', rol: 'Operador', ini: 'JG', bg: '#ffdfb5', fg: '#92400e', inicio: 'incentivo-08-asignar-buscar.html' },
    deportista: { nombre: 'Esteban Mora · Deportista', persona: 'Esteban Mora', corto: 'el deportista', rol: 'Deportista', ini: 'EM', bg: '#bbf7d0', fg: '#14532d', inicio: 'incentivo-17-mis-documentos.html', atleta: 'Esteban Mora' }
  };
  var ORDEN = ['admin', 'programa', 'operador', 'deportista'];
  var CLAVES = /^(naowee:|naowee-incentivos-|naowee-reversiones|inc-programa-|inc-crono-)/;
  function lsG(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function lsS(k, v) { try { localStorage.setItem(k, v); } catch (_) { } }
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  R.montar({ frame: frame, roles: ROLES, casos: window.CASOS });

  /* ── Estado de la demo ── */
  function borrarDemo() {
    [localStorage, sessionStorage].forEach(function (st) {
      try { for (var k = st.length - 1; k >= 0; k--) { var n = st.key(k); if (n && CLAVES.test(n)) st.removeItem(n); } } catch (_) { }
    });
  }
  function irA(pantalla) { frame.src = '../' + pantalla; }
  function ponerRol(r) { lsS('naowee-incentivos-role', r); if (ROLES[r].atleta) lsS('naowee:atleta-persona', ROLES[r].atleta); }
  function aplicarEscena(id) {
    var e = window.ESCENAS[id] || window.ESCENAS.base;
    if (e.reiniciar) borrarDemo();
    ponerRol(e.rol || 'admin'); if (e.atleta) lsS('naowee:atleta-persona', e.atleta);
    if (e.ls) Object.keys(e.ls).forEach(function (k) { lsS(k, typeof e.ls[k] === 'string' ? e.ls[k] : JSON.stringify(e.ls[k])); });
    return e;
  }

  /* ── Panel ── */
  var launch = document.createElement('button');
  launch.className = 'rc-launch'; launch.type = 'button'; launch.setAttribute('aria-haspopup', 'dialog');
  launch.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5" fill="currentColor" stroke="none"/></svg>Recorridos de la DEMO';
  var panel = document.createElement('aside'); panel.className = 'rc-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Recorridos de la DEMO');
  var scrim = document.createElement('div'); scrim.className = 'rc-scrim'; scrim.addEventListener('click', function () { togglePanel(false); });
  document.body.appendChild(scrim); document.body.appendChild(launch); document.body.appendChild(panel);

  var abierto = null;   // caso desplegado
  /* Carga la escena del caso y lo arranca cuando la pantalla de partida está lista */
  function lanzar(id) {
    var c = window.CASOS.filter(function (x) { return x.id === id; })[0]; if (!c || !c.pasos) return;
    var e = aplicarEscena(c.escena); togglePanel(false); R.terminar();
    frame.src = '../' + (e.inicio || ROLES[e.rol || 'admin'].inicio);
    frame.addEventListener('load', function una() { frame.removeEventListener('load', una); setTimeout(function () { R.iniciar(c.id); }, 150); });
  }
  R.alTerminar = function () { if (panel.classList.contains('open')) pintarPanel(); };

  function pintarPanel() {
    var rol = lsG('naowee-incentivos-role') || 'admin', done = R.hechos();
    var yo = ROLES[rol], CH = '<svg class="rc-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l4 4 4-4"/></svg>';
    function ava(r) { return '<span class="rc-ava" style="background:' + r.bg + ';color:' + r.fg + '">' + r.ini + '</span>'; }
    var perf = '<div class="rc-who" id="rcWho"><button type="button" class="rc-me" id="rcMe" aria-haspopup="listbox">' + ava(yo) + '<span class="rc-me-i"><b>' + esc(yo.persona) + '</b><small>' + esc(yo.rol) + '</small></span>' + CH + '</button>'
      + '<div class="rc-dd" role="listbox"><div class="rc-dd-l">Cambiar de perfil</div>' + ORDEN.map(function (k) { var r = ROLES[k];
        return '<button type="button" class="rc-it' + (k === rol ? ' on' : '') + '" role="option" data-rol="' + k + '">' + ava(r) + '<span class="rc-me-i"><b>' + esc(r.persona) + '</b><small>' + esc(r.rol) + '</small></span><svg class="rc-ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>'; }).join('') + '</div></div>';
    var flujo = window.CASOS.filter(function (c) { return c.id === 'FLUJO'; }), casos = window.CASOS.filter(function (c) { return c.id !== 'FLUJO'; });
    function fila(c) {
      var listo = !!c.pasos, abierto_ = abierto === c.id;
      return '<div class="rc-cu' + (abierto_ ? ' is-open' : '') + (done.indexOf(c.id) > -1 ? ' rc-ok' : '') + (listo ? '' : ' rc-soon') + '" data-id="' + c.id + '">'
        + '<button type="button" data-abrir="' + c.id + '"><span class="rc-code">' + esc(c.id) + '</span><span class="rc-t">' + esc(c.titulo) + '</span><svg class="rc-cv" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg></button>'
        + '<div class="rc-det">' + esc(c.resumen) + '<div class="rc-gap"></div>'
        + (listo ? '<button type="button" class="rc-go" data-go="' + c.id + '">Ver recorrido</button>' : '') + '</div></div>';
    }
    panel.innerHTML = '<div class="rc-h"><b>Recorridos de la DEMO</b><span id="rcResetBox"><button type="button" class="rc-ib" id="rcReset" title="Reiniciar demo: borra lo guardado" aria-label="Reiniciar demo">↺</button></span><button type="button" class="rc-ib" id="rcCerrar" aria-label="Cerrar">×</button></div>'
      + '<div class="rc-b"><div class="rc-g">Perfil</div>' + perf
      + '<div class="rc-g">Flujo completo</div><div class="rc-sub">La historia de principio a fin, con el mismo programa y las mismas personas. Avisa cuando cambia el perfil y en qué parte va.</div>' + flujo.map(fila).join('')
      + '<div class="rc-g">Casos independientes</div><div class="rc-sub">Cada caso se puede ver solo y parte de su propia escena.</div>' + casos.map(fila).join('')
      + '</div>';
  }
  function togglePanel(f) {
    var abrir = typeof f === 'boolean' ? f : !panel.classList.contains('open');
    if (abrir) { pintarPanel(); panel.classList.add('rc-anim'); setTimeout(function () { panel.classList.remove('rc-anim'); }, 700); }
    panel.classList.toggle('open', abrir); document.body.classList.toggle('rc-open', abrir);
  }
  panel.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('#rcCerrar')) return togglePanel(false);
    if (t.closest('#rcResetGo')) { borrarDemo(); ponerRol('admin'); R.terminar(); irA(ROLES.admin.inicio); return togglePanel(false); }
    if (t.closest('#rcReset')) { document.getElementById('rcResetBox').innerHTML = '<button type="button" class="rc-reset-go" id="rcResetGo">Reiniciar</button>'; return; }
    if (t.closest('#rcMe')) { var w = document.getElementById('rcWho'); w.classList.toggle('open'); return; }
    var b = t.closest('[data-rol]'); if (b) { R.terminar(); ponerRol(b.dataset.rol); irA(ROLES[b.dataset.rol].inicio); return pintarPanel(); }
    var wq = document.getElementById('rcWho'); if (wq && wq.classList.contains('open') && !t.closest('#rcWho')) wq.classList.remove('open');
    b = t.closest('[data-abrir]'); if (b) { abierto = abierto === b.dataset.abrir ? null : b.dataset.abrir; return pintarPanel(); }
    b = t.closest('[data-go]'); if (b) lanzar(b.dataset.go);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) togglePanel(false); });

  /* ── Lanzador arrastrable ── */
  function limitar() {
    var r = launch.getBoundingClientRect(), l = Math.max(6, Math.min(r.left, innerWidth - r.width - 6)), t = Math.max(6, Math.min(r.top, innerHeight - r.height - 6));
    launch.style.left = l + 'px'; launch.style.top = t + 'px'; launch.style.right = 'auto'; launch.style.bottom = 'auto'; return { l: l, t: t };
  }
  try { var pos = JSON.parse(lsG(K_POS)); if (pos && typeof pos.l === 'number') { launch.style.left = pos.l + 'px'; launch.style.top = pos.t + 'px'; launch.style.right = 'auto'; launch.style.bottom = 'auto'; limitar(); } } catch (_) { }
  var drag = null, movido = false;
  launch.addEventListener('pointerdown', function (e) { if (e.button > 0) return; var r = launch.getBoundingClientRect(); drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, on: false }; movido = false; try { launch.setPointerCapture(e.pointerId); } catch (_) { } });
  launch.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.on) { if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return; drag.on = movido = true; launch.classList.add('is-dragging'); }
    launch.style.left = (e.clientX - drag.dx) + 'px'; launch.style.top = (e.clientY - drag.dy) + 'px'; launch.style.right = 'auto'; launch.style.bottom = 'auto'; limitar();
  });
  function finArrastre(e) { if (!drag || e.pointerId !== drag.id) return; if (drag.on) { lsS(K_POS, JSON.stringify(limitar())); launch.classList.remove('is-dragging'); } drag = null; }
  launch.addEventListener('pointerup', finArrastre); launch.addEventListener('pointercancel', finArrastre);
  launch.addEventListener('click', function () { if (movido) { movido = false; return; } togglePanel(); });
  window.addEventListener('resize', function () { if (launch.style.left) limitar(); });

  /* ── Arranque: la demo en el perfil guardado ── */
  var inicial = lsG('naowee-incentivos-role'); if (!ROLES[inicial]) { inicial = 'admin'; ponerRol('admin'); }
  var q = new URLSearchParams(location.search).get('caso');
  var qs = new URLSearchParams(location.search), desde = qs.get('desde');
  frame.src = '../' + (desde && /^[\w.-]+\.html(\?[\w=&%.-]*)?$/.test(desde) ? desde : ROLES[inicial].inicio);
  if (qs.get('panel')) setTimeout(function () { togglePanel(true); }, 300);
  if (q) frame.addEventListener('load', function una() { frame.removeEventListener('load', una); var b = panel; setTimeout(function () { var c = window.CASOS.filter(function (x) { return x.id === q && x.pasos; })[0]; if (c) { aplicarEscena(c.escena); frame.src = '../' + (window.ESCENAS[c.escena].inicio); frame.addEventListener('load', function dos() { frame.removeEventListener('load', dos); setTimeout(function () { R.iniciar(c.id); }, 150); }); } }, 100); });
})();
