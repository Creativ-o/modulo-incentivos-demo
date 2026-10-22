/* Acciones sobre la demo: llenan el formulario como lo haría una persona (escriben, eligen, pulsan).
   Solo usan la interfaz (DOM y clics), nunca el código interno de la demo. Todas son idempotentes: no pisan lo que ya está lleno. */
(function () {
  'use strict';
  var A = window.Acciones = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  A.esperar = sleep;
  /* Ritmo del llenado: todas las pausas se multiplican por A.ritmo (más alto = más pausado).
     Al saltar de un paso a otro con «Siguiente» o al navegar el formulario se acelera para no hacer esperar. */
  A.ritmoBase = 1.8; A.ritmo = A.ritmoBase;
  var zz = function (ms) { return sleep(ms * A.ritmo); };

  /* ── El programa de ejemplo ── */
  /* Fechas del programa de ejemplo, relativas a hoy: así la ventana de cargue siempre está abierta al hacer el recorrido */
  var HOY = new Date(), p2 = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
  var mas = function (d, dias) { var x = new Date(d.getTime()); x.setDate(x.getDate() + dias); return x; };
  var masMeses = function (d, m) { var x = new Date(d.getFullYear(), d.getMonth() + m, d.getDate()); return x; };
  var D0 = new Date(HOY.getFullYear(), HOY.getMonth(), 1), D1 = mas(masMeses(D0, 12), -1);
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  A.fechaLarga = function (d) { return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); };
  A.fechas = { desde: D0, hasta: D1, cargueFin: mas(HOY, 45) };
  var PROG = A.PROG = {
    nombre: 'Estímulos integrales medallistas 2027',
    desc: 'Reconoce a las y los medallistas de los Juegos Deportivos Nacionales con apoyo económico, movilidad, dotación y reconocimiento oficial.',
    evento: 'Juegos Deportivos Nacionales 2026',
    gestores: ['Isa Pabon', 'Laura Meza'],
    desde: iso(D0), hasta: iso(D1),
    justificacion: 'Resolución 0417 de 2026 del Ministerio del Deporte, que crea el programa de estímulos para medallistas.',
    roles: ['Deportista', 'Paradeportista'],
    cobertura: ['Antioquia', 'Atlántico', 'Valle del Cauca'],
    docs: ['Certificado de resultado', 'Certificación bancaria', 'Autorización del acudiente'],
    docOpcional: 'Autorización del acudiente',
    etapas: { carga: [iso(D0) + 'T08:00', iso(mas(HOY, 45)) + 'T23:59'], revision: [iso(D0) + 'T08:00', iso(mas(HOY, 60)) + 'T23:59'], asignacion: [iso(D0) + 'T08:00', iso(mas(HOY, 75)) + 'T23:59'] },
    gracia: '3',
    inc: [
      { nombre: 'Beca educativa · Medallistas de oro', categoria: 'beca', unit: '2000000', cantidad: '40' },
      { nombre: 'Bono de transporte mensual', categoria: 'transporte', unit: '150000', cantidad: '60', sinCodigo: true, rec: { desde: iso(D0), hasta: iso(masMeses(D0, 6)) } },
      { nombre: 'Kit deportivo · Medallistas', categoria: 'kit', unit: '350000', cantidad: '80', sinCodigo: true },
      { nombre: 'Diploma de reconocimiento', categoria: 'diploma', unit: '4500', cantidad: '120' }
    ]
  };

  /* ── Primitivas ── */
  A.pulsar = function (c, s) { var e = c.d.querySelector(s); if (e) e.click(); return !!e; };
  function setVal(c, e, valor) {
    var Ev = c.w.Event; e.focus(); e.value = valor;
    e.dispatchEvent(new Ev('input', { bubbles: true })); e.dispatchEvent(new Ev('change', { bubbles: true }));
  }
  /* Escribe de a poco para que se vea llenar; los campos de fecha y número se ponen de una vez */
  A.escribir = async function (c, s, valor, tipeo) {
    var e = c.d.querySelector(s); if (!e) return false;
    if (tipeo && /^(text|textarea|)$/.test(e.type === 'textarea' ? 'textarea' : (e.getAttribute('type') || 'text'))) {
      var paso = Math.max(1, Math.ceil(valor.length / 60));
      for (var k = paso; k < valor.length; k += paso) { e.focus(); e.value = valor.slice(0, k); e.dispatchEvent(new c.w.Event('input', { bubbles: true })); await zz(26); }
    }
    setVal(c, e, valor); await zz(120); return true;
  };
  A.vacio = function (c, s) { var e = c.d.querySelector(s); return !!e && !String(e.value || '').trim(); };
  A.elegirValor = function (c, el, v) { el.value = v; el.dispatchEvent(new c.w.Event('change', { bubbles: true })); };
  A.elegir = async function (c, s, valor) { var e = c.d.querySelector(s); if (!e) return false; setVal(c, e, valor); await zz(320); return true; };
  A.marcado = function (c, s) { var e = c.d.querySelector(s); return !!e && (e.getAttribute('aria-checked') === 'true' || e.classList.contains('nwt-switch--checked') || e.classList.contains('nwt-checkbox--checked')); };
  A.clic = async function (c, s, ms) { var e = c.d.querySelector(s); if (!e) return false; e.click(); await zz(ms || 320); return true; };

  /* Selector múltiple del formulario: key = evento · gestor · rol · cob · mun · fx:<inc>:<dim> · rl:<regla> */
  A.ms = async function (c, key, valores, quitar) {
    var tog = c.d.querySelector('[data-act="ms-toggle"][data-i="' + key + '"]'); if (!tog) return false;
    if (tog.getAttribute('aria-expanded') !== 'true') { tog.click(); await zz(220); }
    for (var k = 0; k < valores.length; k++) {
      var o = c.d.querySelector('[data-act="ms-opt"][data-i="' + key + '"][data-x="' + valores[k] + '"]');
      if (o && (o.getAttribute('aria-selected') === 'true') === !!quitar) { o.click(); await zz(170); }
    }
    c.d.body.click(); await zz(150); return true;
  };
  A.chips = function (c, key) { return [].slice.call(c.d.querySelectorAll('[data-ms="' + key + '"] .pf-ms__chips .nwt-tag')).map(function (e) { return e.textContent.trim(); }); };

  /* ── Navegación del formulario ── */
  A.formPaso = function (c) {
    var a = c.d.querySelector('.nwt-stepper__item--active'); if (!a) return 0;
    var m = /Paso\s*(\d)/.exec(a.textContent); return m ? +m[1] : 0;
  };
  /* Ids de los tipos de incentivo, en orden; según el paso se leen de una pantalla u otra */
  A.incIds = function (c) {
    var ids = [];
    function add(e, re) { var m = re.exec(e); if (m && ids.indexOf(m[1]) < 0) ids.push(m[1]); }
    [].slice.call(c.d.querySelectorAll('input[data-k^="inc."][data-k$=".nombre"]')).forEach(function (e) { add(e.dataset.k, /^inc\.([^.]+)\.nombre$/); });
    if (!ids.length) [].slice.call(c.d.querySelectorAll('[data-act="tipo-toggle"][data-i]')).forEach(function (e) { ids.push(e.dataset.i); });
    if (!ids.length) [].slice.call(c.d.querySelectorAll('[data-act="cod-modo"][data-i]')).forEach(function (e) { if (ids.indexOf(e.dataset.i) < 0) ids.push(e.dataset.i); });
    return ids;
  };

  /* ── Paso 1 ── */
  A.llenarInfo = async function (c) {
    if (A.vacio(c, 'input[data-k="datos.nombre"]')) await A.escribir(c, 'input[data-k="datos.nombre"]', PROG.nombre, true);
    if (A.vacio(c, 'textarea[data-k="datos.desc"]')) await A.escribir(c, 'textarea[data-k="datos.desc"]', PROG.desc, true);
    if (!A.chips(c, 'evento').length) await A.ms(c, 'evento', [PROG.evento]);
  };
  A.llenarGestores = async function (c) { if (A.chips(c, 'gestor').length < PROG.gestores.length) await A.ms(c, 'gestor', PROG.gestores); };
  A.gestorElegido = function (c) { return A.chips(c, 'gestor').length > 0; };
  A.llenarVigencia = async function (c) {
    if (A.vacio(c, 'input[data-k="datos.desde"]')) await A.escribir(c, 'input[data-k="datos.desde"]', PROG.desde);
    if (A.vacio(c, 'input[data-k="datos.hasta"]')) await A.escribir(c, 'input[data-k="datos.hasta"]', PROG.hasta);
  };
  A.llenarSoporte = async function (c) { if (A.vacio(c, 'textarea[data-k="datos.justificacion"]')) await A.escribir(c, 'textarea[data-k="datos.justificacion"]', PROG.justificacion, true); };

  /* ── Paso 2 ── */
  A.llenarPoblacion = async function (c) {
    if (A.chips(c, 'rol').length < PROG.roles.length) await A.ms(c, 'rol', PROG.roles);
    if (A.chips(c, 'cob').indexOf('Nacional') > -1) await A.ms(c, 'cob', ['Nacional'], true);   // «Nacional» incluye a todos: se quita para elegir departamentos
    if (A.chips(c, 'cob').length < PROG.cobertura.length) await A.ms(c, 'cob', PROG.cobertura);
    if (!A.marcado(c, '[data-act="seleccion"][data-x="manual"]')) await A.clic(c, '[data-act="seleccion"][data-x="manual"]');
  };
  A.docsActivos = function (c) { return !!c.d.querySelector('.pf-doc'); };
  A.docsActivar = async function (c) { if (!A.docsActivos(c)) await A.clic(c, '[data-act="doc-req"]', 380); };
  A.llenarDocs = async function (c) {
    await A.docsActivar(c);
    for (var k = 0; k < PROG.docs.length; k++) await A.clic(c, '[data-act="doc-add-s"][data-x="' + PROG.docs[k] + '"]', 300);
    var filas = [].slice.call(c.d.querySelectorAll('.pf-doc'));
    for (var f = 0; f < filas.length; f++) {
      var nombre = (filas[f].querySelector('.pf-doc__name') || {}).textContent || '';
      var ob = filas[f].querySelector('[data-act="doc-oblig"]');
      if (ob && nombre.indexOf(PROG.docOpcional) > -1 && ob.getAttribute('aria-checked') === 'true') { ob.click(); await zz(300); filas = [].slice.call(c.d.querySelectorAll('.pf-doc')); }
    }
  };
  A.llenarEtapas = async function (c) {
    await A.docsActivar(c);
    var E = PROG.etapas;
    for (var fase in E) {
      if (A.vacio(c, 'input[data-k="crono.' + fase + '.ini"]')) await A.escribir(c, 'input[data-k="crono.' + fase + '.ini"]', E[fase][0]);
      if (A.vacio(c, 'input[data-k="crono.' + fase + '.fin"]')) await A.escribir(c, 'input[data-k="crono.' + fase + '.fin"]', E[fase][1]);
    }
    if (A.vacio(c, 'input[data-k="crono.gracia"]')) await A.escribir(c, 'input[data-k="crono.gracia"]', PROG.gracia);
  };
  A.llenarTipos = async function (c) {
    if (!c.d.querySelector('select[data-k="rubro.n"]')) await A.clic(c, '[data-act="rubro-tipos"][data-x="varios"]', 400);
    var s = c.d.querySelector('select[data-k="rubro.n"]');
    if (s && s.value !== String(PROG.inc.length)) await A.elegir(c, 'select[data-k="rubro.n"]', String(PROG.inc.length));
  };
  A.llenarInc = async function (c, idx) {
    var id = A.incIds(c)[idx], d = PROG.inc[idx]; if (!id || !d) return;
    var k = 'inc.' + id + '.';
    if (A.vacio(c, 'input[data-k="' + k + 'nombre"]')) await A.escribir(c, 'input[data-k="' + k + 'nombre"]', d.nombre, true);
    var sc = c.d.querySelector('select[data-k="' + k + 'categoria"]');
    if (sc && !sc.value) await A.elegir(c, 'select[data-k="' + k + 'categoria"]', d.categoria);
    if (d.sinCodigo && A.marcado(c, '[data-act="inc-codigos"][data-i="' + id + '"]')) await A.clic(c, '[data-act="inc-codigos"][data-i="' + id + '"]', 350);
    if (d.rec) {
      if (!A.marcado(c, '[data-act="inc-rec"][data-i="' + id + '"]')) await A.clic(c, '[data-act="inc-rec"][data-i="' + id + '"]', 380);
      if (A.vacio(c, 'input[data-k="' + k + 'rec.desde"]')) await A.escribir(c, 'input[data-k="' + k + 'rec.desde"]', d.rec.desde);
      if (A.vacio(c, 'input[data-k="' + k + 'rec.hasta"]')) await A.escribir(c, 'input[data-k="' + k + 'rec.hasta"]', d.rec.hasta);
    }
    if (d.unit && A.vacio(c, 'input[data-k="' + k + 'unit"]')) await A.escribir(c, 'input[data-k="' + k + 'unit"]', d.unit);
    if (d.cantidad && A.vacio(c, 'input[data-k="' + k + 'cantidad"]')) await A.escribir(c, 'input[data-k="' + k + 'cantidad"]', d.cantidad);
  };

  /* ── Paso 3: condiciones por tipo ── */
  A.abrirTipo = async function (c, idx) {
    var id = A.incIds(c)[idx], t = c.d.querySelector('[data-act="tipo-toggle"][data-i="' + id + '"]');
    if (t && t.getAttribute('aria-expanded') !== 'true') { t.click(); await zz(380); }
    return id;
  };
  /* Regla r = { f, op?, v } en el grupo gi, fila ri del tipo id */
  A.regla = async function (c, id, gi, ri, r) {
    var k = 'rule.' + id + '.' + gi + '.' + ri + '.';
    if (!c.d.querySelector('select[data-k="' + k + 'f"]')) await A.clic(c, '[data-act="rule-add"][data-i="' + id + '"][data-x="' + gi + '"]', 380);
    var sf = c.d.querySelector('select[data-k="' + k + 'f"]');
    if (sf && sf.value !== r.f) await A.elegir(c, 'select[data-k="' + k + 'f"]', r.f);
    if (r.op && c.d.querySelector('select[data-k="' + k + 'op"]') && c.d.querySelector('select[data-k="' + k + 'op"]').value !== r.op) await A.elegir(c, 'select[data-k="' + k + 'op"]', r.op);
    if (Array.isArray(r.v)) { if (A.chips(c, 'rl:' + id + '.' + gi + '.' + ri).length < r.v.length) await A.ms(c, 'rl:' + id + '.' + gi + '.' + ri, r.v); }
    else if (A.vacio(c, 'input[data-k="' + k + 'v"]')) await A.escribir(c, 'input[data-k="' + k + 'v"]', String(r.v));
  };
  A.grupoNuevo = async function (c, id, gi) { if (!c.d.querySelector('[data-act="grp-del"][data-i="' + id + '"][data-x="' + gi + '"]') && !c.d.querySelector('.pf-type [data-act="rule-add"][data-i="' + id + '"][data-x="' + gi + '"]')) await A.clic(c, '[data-act="grp-add"][data-i="' + id + '"]', 400); };
  /* Quita del tipo los valores de población que no le aplican (repartir roles entre tipos) */
  A.reparto = async function (c, id, dim, valores) { await A.ms(c, 'fx:' + id + ':' + dim, valores, true); };
  A.docDelTipo = async function (c, id, nombre) {
    var filas = [].slice.call(c.d.querySelectorAll('.pf-type [data-act="tipo-doc"][data-i="' + id + '"]'));
    for (var k = 0; k < filas.length; k++) {
      var n = filas[k].closest('.pf-doc'); n = n && n.querySelector('.pf-doc__name');
      if (n && n.textContent.indexOf(nombre) > -1 && filas[k].getAttribute('aria-checked') === 'true') { filas[k].click(); await zz(380); return; }
    }
  };
  A.llenarCondicionesBeca = async function (c, parte) {
    var id = await A.abrirTipo(c, 0);
    if (parte === 'fijas' || parte === 'todo') await A.reparto(c, id, 'roles', ['Paradeportista']);
    if (parte === 'g1' || parte === 'todo') {
      await A.regla(c, id, 0, 0, { f: 'logro', v: ['Medalla de oro'] });
      await A.regla(c, id, 0, 1, { f: 'edad', op: '≤', v: 25 });
    }
    if (parte === 'g2' || parte === 'todo') {
      if (!c.d.querySelector('select[data-k="rule.' + id + '.1.0.f"]')) await A.clic(c, '[data-act="grp-add"][data-i="' + id + '"]', 420);
      await A.regla(c, id, 1, 0, { f: 'logro', v: ['Medalla de plata'] });
      await A.regla(c, id, 1, 1, { f: 'medallas', op: '≥', v: 3 });
    }
  };
  A.llenarCondicionesBono = async function (c) {
    var id = await A.abrirTipo(c, 1);
    await A.regla(c, id, 0, 0, { f: 'disciplina', v: ['Atletismo', 'Ciclismo'] });
  };
  A.llenarCondicionesKit = async function (c) {
    var id = await A.abrirTipo(c, 2);
    await A.reparto(c, id, 'roles', ['Paradeportista']);
    await A.docDelTipo(c, id, 'Certificación bancaria');
  };
  A.llenarCondicionesDiploma = async function (c) {
    await A.abrirTipo(c, 3);
  };

  /* ── Paso 4 ── */
  A.llenarCodigos = async function (c) {
    var id = A.incIds(c)[0];
    if (!c.d.querySelector('[data-act="cod-sim"][data-i="' + id + '"]')) await A.clic(c, '[data-act="cod-modo"][data-i="' + id + '"][data-x="masivo"]', 380);
    if (!/válidos cargados/.test((c.d.querySelector('.pf-drop') || {}).textContent || '')) await A.clic(c, '[data-act="cod-sim"][data-i="' + id + '"]', 400);
  };
  A.activar = async function (c) { if (!/Crear y activar/.test((c.d.querySelector('#pfNext') || {}).textContent || '')) await A.clic(c, '[data-act="activar"][data-x="activo"]', 350); };


  /* ── «Mis documentos» del deportista (pantalla 17) ── */
  A.subirArchivo = async function (c, doc, archivo, bytes, prog, tarjeta) {
    var raiz = c.d;
    if (tarjeta) raiz = [].slice.call(c.d.querySelectorAll('.pcard')).filter(function (e) { return e.textContent.indexOf(tarjeta) > -1; })[0] || c.d;   // la tarjeta del programa por su nombre
    var btn = raiz.querySelector('button.dlink' + (prog ? '[onclick*="' + prog + '"]' : '') + '[onclick*="' + doc + '"]'); if (!btn) return false;
    var P = c.w.HTMLInputElement.prototype, abrir = P.click;
    P.click = function () { if (this.type === 'file') return; return abrir.apply(this, arguments); };   // sin abrir el selector de archivos del sistema
    try { btn.click(); } finally { P.click = abrir; }
    var inp = c.d.getElementById('fileInput'), dt = new c.w.DataTransfer();
    dt.items.add(new c.w.File([new c.w.Uint8Array(bytes || 120000)], archivo, { type: /\.pdf$/.test(archivo) ? 'application/pdf' : 'image/jpeg' }));
    inp.files = dt.files; inp.dispatchEvent(new c.w.Event('change', { bubbles: true }));
    for (var k = 0; k < 40; k++) { await zz(180); var fila = [].slice.call(c.d.querySelectorAll('.drow')).filter(function (r) { return r.textContent.indexOf(doc) > -1 && (!tarjeta || (r.closest('.pcard') || {textContent: ''}).textContent.indexOf(tarjeta) > -1); })[0]; if (fila && fila.textContent.indexOf(archivo) > -1) break; }
    await zz(300); return true;
  };
  A.archivoSubido = function (c, doc, archivo) { var fila = [].slice.call(c.d.querySelectorAll('.drow')).filter(function (r) { return r.textContent.indexOf(doc) > -1; })[0]; return !!fila && fila.textContent.indexOf(archivo) > -1; };
  A.campanaAbrir = async function (c) { var p = c.d.querySelector('.notif__panel'); if (p && p.hidden) { A.pulsar(c, '.notif__btn'); await sleep(300); } };

  /* ── «Revisión documental» (pantalla 16) ── */
  A.revBuscar = async function (c, texto) { if (c.d.getElementById('searchInput') && c.d.getElementById('searchInput').value !== texto) await A.escribir(c, '#searchInput', texto, true); };
  A.revFila = function (c, partes) { return [].slice.call(c.d.querySelectorAll('.asig-table tbody tr')).filter(function (r) { return [].concat(partes).every(function (x) { return r.textContent.indexOf(x) > -1; }); })[0]; };
  A.revDoc = async function (c, nombre) { var f = [].slice.call(c.d.querySelectorAll('.dt-table tbody tr')).filter(function (r) { return r.textContent.indexOf(nombre) > -1; })[0]; if (f && !f.classList.contains('sel')) { f.click(); await zz(350); } };
  A.revPend = async function (c, doc, estado, nota) {
    await A.revDoc(c, doc);
    var sel = estado === 'aprobado' ? '.ab--ok' : '.ab--no';
    var b = c.d.querySelector(sel); if (b && !b.classList.contains('on')) { b.click(); await zz(400); }
    if (nota) { var t = c.d.getElementById('notaTxt'); if (t && !t.value) { await A.escribir(c, '#notaTxt', nota, true); } }
  };
  /* Selecciona todos los documentos en revisión del perfil abierto */
  A.revSeleccionarTodos = async function (c) { var t = c.d.getElementById('dtAll'); if (t && !t.checked && !t.disabled) { t.click(); await zz(450); } };
  A.modalAceptar = async function (c) { var b = c.d.querySelector('#mdOv.open .md__f .naowee-btn--loud'); if (b) { b.click(); await sleep(350); } };


  /* ── «Gestión de usuarios» (pantalla 18) ── */
  A.usuarioNuevo = { nombre: 'Mateo Ríos Pardo', cc: '1010222333', tel: '3115550199', mail: 'mateo.rios@mindeporte.gov.co' };
  A.invitarDatos = async function (c, d) {
    var m = [['#invNombre', d.nombre], ['#invCc', d.cc], ['#invTel', d.tel], ['#invMail', d.mail]];
    for (var k = 0; k < m.length; k++) if (A.vacio(c, m[k][0])) await A.escribir(c, m[k][0], m[k][1], k === 0 || k === 3);
  };
  A.invitarPrograma = async function (c, idx) {
    var w = c.d.getElementById('ddPrgWrap'), item = c.d.querySelectorAll('#ddPrgMenu [data-prg]')[idx || 0];
    if (!w || !item || item.getAttribute('aria-selected') === 'true') return;
    if (!w.classList.contains('open')) { A.pulsar(c, '#ddPrgWrap .toolbar-dd'); await zz(350); }
    item.click(); await zz(450);
    c.d.body.click(); await zz(250);   // se cierra el desplegable
  };
  A.rolInvitado = async function (c, rol) { var o = c.d.querySelector('#invRol [data-rol="' + rol + '"]'); if (o && !o.classList.contains('on')) { o.click(); await zz(350); } };
  A.filaUsuario = function (c, nombre) { return [].slice.call(c.d.querySelectorAll('#rows tr')).filter(function (r) { return r.textContent.indexOf(nombre) > -1; })[0]; };

  /* Modal de cierre/reapertura: elige el primer motivo y escribe el detalle */
  A.cierreMotivo = function (detalle) {
    return async function (c) {
      var m = c.d.getElementById('clsM'); if (m && !m.value) { var o = [].slice.call(m.options).filter(function (x) { return x.value; })[0]; if (o) A.elegirValor(c, m, o.value); }
      await zz(300); if (A.vacio(c, '#clsJ')) await A.escribir(c, '#clsJ', detalle, true);
    };
  };

  /* ── Completar un paso entero (para avanzar sin que falte nada obligatorio) ── */
  A.llenarPaso = async function (c, n) {
    if (n === 1) { await A.llenarInfo(c); await A.llenarGestores(c); await A.llenarVigencia(c); await A.llenarSoporte(c); }
    if (n === 2) {
      await A.llenarPoblacion(c); await A.llenarDocs(c); await A.llenarEtapas(c); await A.llenarTipos(c);
      for (var k = 0; k < PROG.inc.length; k++) await A.llenarInc(c, k);
    }
    if (n === 3) { await A.llenarCondicionesBeca(c, 'todo'); await A.llenarCondicionesBono(c); await A.llenarCondicionesKit(c); await A.llenarCondicionesDiploma(c); }
  };
  A.formIr = async function (c, n) {
    var antes = A.ritmo; A.ritmo = 0.2;   // saltar de paso: sin esperas largas
    try { await A.formIrLento(c, n); } finally { A.ritmo = antes; }
  };
  A.formIrLento = async function (c, n) {
    for (var k = 0; k < 10; k++) {
      var p = A.formPaso(c); if (!p || p === n) return;
      if (p > n) { A.pulsar(c, '.nwt-stepper__item[data-x="' + n + '"]'); await zz(500); continue; }
      await A.llenarPaso(c, p); A.pulsar(c, '#pfNext'); await zz(650);
    }
  };
  A.paso = function (n) { var f = function (c) { return A.formIr(c, n); }; f.paso = n; return f; };
})();
