/* ═══════════════════════════════════════════════════════════════
   Parametrizar programa de incentivos — propuesta v2 (SUID)
   Fuente: Excel «INCENTIVOS SUID» HU-01..05 · mapping (n-a-wizard, n-a2-condiciones)
           · audios de Danna (15-oct-2026).
   Markup 100% SDK Naowee (nwt-*). Sin dependencias.
   URL: ?edit=1  → edición de un programa Activo V1.0 (muestra versionamiento)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var DRAFT_KEY = 'inc-programa-draft-v2';
  var params = new URLSearchParams(location.search);
  var EDIT = params.get('edit') === '1';
  var role = (function () { try { return localStorage.getItem('naowee-incentivos-role') || 'admin'; } catch (_) { return 'admin'; } })();
  var CAN_EDIT_PROGRAM = role === 'admin' || role === 'gestor';
  var CONDITIONS_LOCKED = EDIT && role === 'programa'; // el Gestor de programa solo lee condicionales (HU-03)

  /* ── Catálogos ─────────────────────────────────────────────── */
  var EVENTOS = ['Juegos Intercolegiados Nacionales 2026', 'Juegos Deportivos Nacionales 2026', 'Juegos Paranacionales 2026', 'Campeonato nacional de atletismo 2026', 'Sin evento asociado (programa permanente)'];
  var AREAS = ['Dirección de Fomento y Desarrollo', 'Alto rendimiento', 'Viceministerio del Deporte'];
  var GESTORES = ['Isa Pabon', 'Laura Meza', 'Carla Suárez', 'Andrés Polo'];
  var REGIONES = ['Nacional', 'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Cundinamarca', 'Santander', 'Valle del Cauca'];
  var CATEGORIAS = ['Beca', 'Kit', 'Bono', 'Dinero', 'Pase o entrada', 'Certificado', 'Otro'];
  var FRECUENCIAS = [['mensual', 'Mensual'], ['bimestral', 'Bimestral'], ['trimestral', 'Trimestral'], ['semestral', 'Semestral'], ['otra', 'Otra (definir meses)']];
  var DOC_SUGERIDOS = ['Documento de identidad', 'Certificado de resultado', 'Certificación bancaria', 'Certificado de estudio', 'Autorización del acudiente', 'Certificado médico'];
  var BENEFICIARIOS = [['deportista', 'Deportista'], ['paradeportista', 'Paradeportista'], ['apoyo', 'Personal de apoyo'], ['institucion', 'Institución educativa']];
  var FAMILIAS = { dem: 'Demográficos', geo: 'Geográficos', dep: 'Deportivos', plat: 'Plataforma', aca: 'Académicos' };
  var DEPTOS = ['Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Cundinamarca', 'Nariño', 'Santander', 'Valle del Cauca'];
  var FIELDS = {
    edad:        { fam: 'dem',  label: 'Edad',                 type: 'num' },
    genero:      { fam: 'dem',  label: 'Género',               type: 'sel', opts: ['Femenino', 'Masculino'] },
    depto:       { fam: 'geo',  label: 'Departamento',         type: 'sel', opts: DEPTOS },
    municipio:   { fam: 'geo',  label: 'Municipio',            type: 'text' },
    zona:        { fam: 'geo',  label: 'Zona',                 type: 'sel', opts: ['Urbana', 'Rural'] },
    disciplina:  { fam: 'dep',  label: 'Disciplina deportiva', type: 'sel', opts: ['Atletismo', 'Boxeo', 'Ciclismo', 'Fútbol', 'Judo', 'Natación'] },
    logro:       { fam: 'dep',  label: 'Logro / medallería',   type: 'sel', opts: ['Medalla de oro', 'Medalla de plata', 'Medalla de bronce', 'Participación'] },
    etapa:       { fam: 'dep',  label: 'Etapa',                type: 'sel', opts: ['Municipal', 'Departamental', 'Regional', 'Nacional'] },
    categoria:   { fam: 'dep',  label: 'Categoría',            type: 'sel', opts: ['Prejuvenil', 'Juvenil', 'Mayores', 'Altius', 'Reserva'] },
    rol:         { fam: 'plat', label: 'Rol en SUID',          type: 'sel', opts: ['Deportista', 'Paradeportista', 'Entrenador', 'Personal de apoyo', 'Delegado'] },
    escolaridad: { fam: 'aca',  label: 'Estado de escolaridad', type: 'sel', opts: ['Escolarizado', 'No escolarizado', 'Egresado'] },
    grado:       { fam: 'aca',  label: 'Grado',                type: 'sel', opts: ['Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Once'] }
  };
  var OPS_NUM = ['≥', '≤', '='];
  var OPS_SEL = [['=', 'es'], ['≠', 'no es'], ['∈', 'es uno de']];

  /* ── Estado ─────────────────────────────────────────────────── */
  var uid = 0;
  function nextId() { uid += 1; return 'i' + uid; }
  function newInc() { return { id: nextId(), nombre: '', categoria: 'Beca', modalidad: 'codigo', valor: '', cantidad: '', foto: true, frecuencia: 'mensual', frecuenciaN: '', plantilla: 'Diploma institucional' }; }

  var S = {
    step: 1, max: 1, done: false,
    datos: { nombre: '', desc: '', evento: '', area: '', gestor: '', desde: '', hasta: '', activacion: '', cobertura: ['Nacional'] },
    rubro: { on: true, modo: 'presupuesto', valor: '', cupo: '' },
    inc: [newInc()],
    cond: { benef: ['deportista'], modo: 'motor', grupos: [{ op: 'AND', rows: [] }], doc: { req: false, list: [] } },
    codigos: {},
    crono: { gracia: '3', primer: '', carga: { ini: '', fin: '' }, revision: { ini: '', fin: '' }, asignacion: { ini: '', fin: '' }, motivo: '' },
    activar: 'config'
  };
  var LOG_KEY = 'inc-crono-log-v1';
  var PERSONAS = { admin: ['Danna Arrieta', 'Gestor de incentivos'], gestor: ['Danna Arrieta', 'Gestor de incentivos'], programa: ['Isa Pabon', 'Gestor de programa'], operador: ['Jorge Guzman', 'Operador'] };
  var FASES = [['carga', 'Carga de documentos', 'El beneficiario sube sus soportes'], ['revision', 'Revisión documental', 'El Gestor de programa aprueba o rechaza'], ['asignacion', 'Asignación', 'El Operador entrega el beneficio']];
  var LOG = [];
  var SNAP = null; // foto del programa publicado (modo edición) para detectar versionamiento

  function seedEdit() {
    var i1 = newInc(); i1.nombre = 'Beca educativa · Medallistas de oro'; i1.categoria = 'Beca'; i1.modalidad = 'fijo'; i1.valor = '1000000'; i1.cantidad = '200'; i1.frecuencia = 'mensual';
    var i2 = newInc(); i2.nombre = 'Kit deportivo'; i2.categoria = 'Kit'; i2.modalidad = 'codigo'; i2.valor = '350000'; i2.cantidad = '150'; i2.foto = true;
    S.datos = { nombre: 'Becas deportivas medallistas 2026', desc: 'Beca dirigida a deportistas medallistas de los Juegos Nacionales para apoyar su formación profesional.', evento: EVENTOS[1], area: AREAS[0], gestor: 'Isa Pabon', desde: '2026-04-22', hasta: '2026-12-31', activacion: '2026-04-22', cobertura: ['Nacional'] };
    S.rubro = { on: true, modo: 'presupuesto', valor: '252500000', cupo: '' };
    S.inc = [i1, i2];
    S.cond = {
      benef: ['deportista'], modo: 'motor',
      grupos: [{ op: 'AND', rows: [{ f: 'edad', op: '≥', v: '18' }, { f: 'categoria', op: '=', v: 'Juvenil' }] }, { op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }],
      doc: { req: true, list: [{ name: 'Documento de identidad', oblig: true }, { name: 'Certificado de resultado', oblig: true }, { name: 'Certificación bancaria', oblig: true }] }
    };
    S.codigos[i2.id] = { modo: 'despues', n: 0 };
    S.crono = { gracia: '3', primer: '2026-05-01', carga: { ini: '15', fin: '18' }, revision: { ini: '20', fin: '25' }, asignacion: { ini: '25', fin: '30' }, motivo: '' };
    LOG = [{ ts: '22/04/2026 09:14', user: 'Danna Arrieta', rol: 'Gestor de incentivos', ev: 'Creación del cronograma', det: 'Carga día 15–18 · Revisión día 20–25 · Asignación día 25–30 · Gracia 3 días hábiles', motivo: '—', ip: '190.24.18.07' }];
    try { LOG = (JSON.parse(localStorage.getItem(LOG_KEY)) || []).concat(LOG); } catch (_) {}
    S.step = 1; S.max = 5;
  }

  /* ── Utilidades ─────────────────────────────────────────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$ ' + Number(n || 0).toLocaleString('es-CO'); }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function fmtDate(d) { if (!d) return '—'; var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function incById(id) { return S.inc.filter(function (i) { return i.id === id; })[0]; }
  function hasModalidad(m) { return S.inc.some(function (i) { return i.modalidad === m; }); }
  function isRec() { return hasModalidad('fijo'); }
  function fmtDT(v) { if (!v) return '—'; var a = v.split('T'), d = a[0].split('-'); return d[2] + '/' + d[1] + '/' + d[0] + (a[1] ? ' ' + a[1] : ''); }
  function docRequired() { return S.cond.doc.req || hasModalidad('fijo'); }
  function icon(n) { return '<div class="nwt-icon"><i class="naotech-icon-' + n + '"></i></div>'; }

  /* ── Plantillas SDK ─────────────────────────────────────────── */
  function badge(t, theme) { return '<span class="nwt-badge" role="status" nwt-theme="' + (theme || 'neutral') + '" nwt-size="small" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">' + esc(t) + '</div></div></span>'; }
  function alertBox(msg, theme, ic) { return '<div class="nwt-alert nwt-alert--visible" nwt-theme="' + (theme || 'informative') + '" nwt-variant="quiet"><div class="nwt-alert__content"><div class="nwt-alert__icon">' + icon(ic || 'info') + '</div><span class="nwt-alert__label">' + msg + '</span></div></div>'; }
  function btn(label, act, o) {
    o = o || {};
    return '<button type="button" class="nwt-button" nwt-variant="' + (o.v || 'quiet') + '" nwt-size="' + (o.s || 'small') + '" data-act="' + act + '"' + (o.d != null ? ' data-i="' + esc(o.d) + '"' : '') + (o.x != null ? ' data-x="' + esc(o.x) + '"' : '') + '><span class="nwt-button__content">' + (o.i ? icon(o.i) : '') + label + '</span></button>';
  }
  function iconBtn(ic, act, label, d, x) { return '<span class="nwt-icon-button" nwt-variant="mute" nwt-size="small"><button type="button" class="nwt-icon-button__content" aria-label="' + esc(label) + '" data-act="' + act + '"' + (d != null ? ' data-i="' + esc(d) + '"' : '') + (x != null ? ' data-x="' + esc(x) + '"' : '') + '>' + icon(ic) + '</button></span>'; }
  function inputBox(label, req, control, hint, k) {
    return '<div class="nwt-input-box" data-box="' + esc(k || '') + '"><div class="nwt-input-box__content">' +
      (label ? '<label class="nwt-input-box__label">' + esc(label) + (req ? '<span class="nwt-input-box__required">*</span>' : '') + '</label>' : '') +
      '<div class="nwt-input-box__control">' + control + '</div>' +
      (hint ? '<div class="nwt-input-box__message"><span>' + esc(hint) + '</span></div>' : '') +
      '</div></div>';
  }
  function tf(o) {
    var control = '<input class="nwt-text-field__input" type="' + (o.type || 'text') + '" data-k="' + esc(o.k) + '" value="' + esc(o.val) + '" placeholder="' + esc(o.ph || '') + '"' + (o.mode ? ' inputmode="' + o.mode + '"' : '') + (o.ro ? ' readonly' : '') + '/>';
    return '<div class="nwt-text-field' + (o.ro ? ' nwt-text-field--readonly' : '') + '" nwt-size="medium">' + inputBox(o.label, o.req, control, o.hint, o.k) + '</div>';
  }
  function ta(o) {
    var control = '<textarea class="nwt-text-area__input" rows="' + (o.rows || 3) + '" data-k="' + esc(o.k) + '" placeholder="' + esc(o.ph || '') + '">' + esc(o.val) + '</textarea>';
    return '<div class="nwt-text-area" nwt-size="medium">' + inputBox(o.label, o.req, control, o.hint, o.k) + '</div>';
  }
  function sel(o) {
    var opts = (o.opts || []).map(function (x) { var v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x; return '<option value="' + esc(v) + '"' + (String(o.val) === String(v) ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('');
    var ph = o.ph ? '<option value=""' + (o.val ? '' : ' selected') + ' disabled>' + esc(o.ph) + '</option>' : '';
    var control = '<div class="nwt-select__content"><select class="nwt-select__input" data-k="' + esc(o.k) + '"' + (o.attrs || '') + '>' + ph + (o.groups || opts) + '</select><div class="nwt-select__chevron">' + icon('chevron-down') + '</div></div>';
    return '<div class="nwt-select" nwt-size="medium">' + inputBox(o.label, o.req, control, o.hint, o.k) + '</div>';
  }
  function radios(o) {
    return '<div class="nwt-radio-group' + (o.compact ? ' pf-radio-compact' : '') + '" role="radiogroup" nwt-direction="' + (o.dir || 'vertical') + '"><fieldset class="nwt-radio-group__fieldset">' +
      (o.label ? '<legend class="nwt-radio-group__label">' + esc(o.label) + '</legend>' : '') +
      '<div class="nwt-radio-group__options">' + o.options.map(function (op) {
        var on = String(o.value) === String(op.v);
        return '<label class="nwt-radio-group__option' + (on ? ' nwt-radio-group__option--selected' : '') + '" data-act="' + o.act + '"' + (o.d ? ' data-i="' + esc(o.d) + '"' : '') + ' data-x="' + esc(op.v) + '">' +
          '<span class="nwt-radio-group__circle"><span class="nwt-radio-group__dot"></span></span>' +
          '<span class="nwt-radio-group__option-label"><span class="pf-opt"><b>' + esc(op.l) + '</b>' + (op.s ? '<small>' + esc(op.s) + '</small>' : '') + '</span></span></label>';
      }).join('') + '</div></fieldset></div>';
  }
  function checkbox(label, on, act, d, x) { return '<div class="nwt-checkbox' + (on ? ' nwt-checkbox--checked' : '') + '" role="checkbox" aria-checked="' + !!on + '" nwt-size="medium" data-act="' + act + '"' + (d != null ? ' data-i="' + esc(d) + '"' : '') + (x != null ? ' data-x="' + esc(x) + '"' : '') + '><div class="nwt-checkbox__control">' + (on ? icon('positive') : '') + '</div><span class="nwt-checkbox__label">' + esc(label) + '</span></div>'; }
  function toggle(on, act, d) { return '<div class="nwt-switch' + (on ? ' nwt-switch--checked' : '') + '" role="switch" aria-checked="' + !!on + '" data-act="' + act + '"' + (d ? ' data-i="' + esc(d) + '"' : '') + '><div class="nwt-switch__component"><div class="nwt-switch__component__element"></div></div></div>'; }
  function tag(label, on, act, d, x) { return '<span class="nwt-tag' + (on ? ' nwt-tag--active' : '') + '" nwt-size="medium" role="button" tabindex="0" data-act="' + act + '"' + (d != null ? ' data-i="' + esc(d) + '"' : '') + (x != null ? ' data-x="' + esc(x) + '"' : '') + '>' + esc(label) + '</span>'; }
  function card(title, sub, body, o) {
    o = o || {};
    return '<div class="nwt-card' + (o.cls ? ' ' + o.cls : '') + '" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body">' +
      '<div class="nwt-card__header"><div class="pf-card-head-row"><div><h3 class="pf-card-title">' + (o.n ? '<span class="pf-num">' + o.n + '</span>' : '') + esc(title) + '</h3>' + (sub ? '<p class="pf-card-sub">' + sub + '</p>' : '') + '</div>' + (o.right || '') + '</div></div>' +
      '<div class="nwt-card__content">' + body + '</div><div class="nwt-card__footer"></div></div></div>';
  }
  function head(title, lead) { return '<div><h2 class="pf-h2">' + esc(title) + '</h2><p class="pf-lead">' + lead + '</p></div>'; }

  /* ── Paso 1 · Datos ─────────────────────────────────────────── */
  function step1() {
    var d = S.datos;
    return '<div class="pf-sec">' + head('Datos del programa', 'Define la identidad del programa. El estado inicial es <b>Configuración</b>: solo opera (postulaciones y asignaciones) cuando esté <b>Activo</b>.') +
      card('Información general', '', '<div class="pf-grid">' +
        '<div class="pf-span2">' + tf({ label: 'Nombre del programa', req: 1, k: 'datos.nombre', val: d.nombre, ph: 'Ej. Becas deportivas medallistas 2026', hint: 'Aparecerá en listados, reportes y notificaciones.' }) + '</div>' +
        '<div class="pf-span2">' + ta({ label: 'Descripción breve', k: 'datos.desc', val: d.desc, ph: 'A quién va dirigido y para qué.' }) + '</div>' +
        sel({ label: 'Evento / categoría asociado', k: 'datos.evento', val: d.evento, ph: 'Selecciona un evento', opts: EVENTOS, hint: 'Útil para reportería. Un programa puede existir sin evento.' }) +
        sel({ label: 'Área responsable', req: 1, k: 'datos.area', val: d.area, ph: 'Selecciona el área', opts: AREAS }) +
      '</div>', { n: 1 }) +
      card('Gestor de programa', 'Quien revisa documentación y entrega beneficios. Solo verá y gestionará los programas que tiene a cargo.', '<div class="pf-grid">' +
        sel({ label: 'Gestor de programa responsable', req: 1, k: 'datos.gestor', val: d.gestor, ph: 'Asigna un gestor', opts: GESTORES }) +
        '<div>' + alertBox('El Gestor de programa <b>solo lee</b> las condiciones; editarlas es de Superadmin, Administrador y Gestor de incentivos.', 'informative') + '</div>' +
      '</div>', { n: 2 }) +
      card('Vigencia y activación', 'Al cumplirse la fecha de fin el programa se inactiva solo.', '<div class="pf-grid">' +
        tf({ label: 'Vigencia desde', req: 1, type: 'date', k: 'datos.desde', val: d.desde }) +
        tf({ label: 'Vigencia hasta', req: 1, type: 'date', k: 'datos.hasta', val: d.hasta }) +
        tf({ label: 'Fecha de activación', type: 'date', k: 'datos.activacion', val: d.activacion, hint: 'Opcional. Si la dejas vacía, activas manualmente en el paso final.' }) +
        '<div class="pf-ro"><div><span class="pf-label">Estado inicial</span>' + badge('Configuración', 'caution') + '</div></div>' +
        '<div class="pf-span2"><span class="pf-label">Cobertura territorial</span><div class="pf-row" id="pfCobertura">' + REGIONES.map(function (r) { return tag(r, d.cobertura.indexOf(r) > -1, 'cobertura', null, r); }).join('') + '</div><p class="pf-hint" style="margin-top:8px">«Nacional» incluye todas las regiones.</p></div>' +
      '</div>', { n: 3 }) + '</div>';
  }

  /* ── Paso 2 · Rubro ─────────────────────────────────────────── */
  function step2() {
    var r = S.rubro;
    var body = '<div class="pf-switch-row">' + toggle(r.on, 'rubro-on') + '<span>Definir presupuesto o cupo para este programa</span></div>';
    if (r.on) {
      body += radios({ act: 'rubro-modo', value: r.modo, dir: 'horizontal', compact: 1, options: [{ v: 'presupuesto', l: 'Presupuesto ($)' }, { v: 'cupo', l: 'Cupo de entregas' }, { v: 'ambos', l: 'Ambos' }] });
      body += '<div class="pf-grid">' +
        (r.modo !== 'cupo' ? tf({ label: 'Valor presupuestal asignado', req: 1, k: 'rubro.valor', val: r.valor ? Number(r.valor).toLocaleString('es-CO') : '', ph: '0', mode: 'numeric', hint: 'Pesos colombianos. Se distribuye entre los incentivos en el paso 3.' }) : '') +
        (r.modo !== 'presupuesto' ? tf({ label: 'Cupo máximo de entregas', req: 1, k: 'rubro.cupo', val: r.cupo, ph: '0', mode: 'numeric', hint: 'Número total de entregas del programa.' }) : '') +
      '</div>' +
      '<div class="pf-grid" id="pfKpi">' + ['Inicial', 'Ejecutado', 'Disponible'].map(function () { return ''; }).join('') + '</div>' +
      alertBox('El sistema calcula en tiempo real <b>inicial, ejecutado y disponible</b>, bloquea nuevas asignaciones cuando llegue a cero y reintegra el saldo al revertir una entrega.', 'informative');
    } else {
      body += alertBox('Por ahora el rubro es <b>opcional</b>. Sin rubro no se controla presupuesto ni cupo del programa; podrás definirlo después sin crear una versión.', 'caution', 'attention');
    }
    return '<div class="pf-sec">' + head('Rubro', 'Establece el dinero o los cupos disponibles para evidenciar su uso. <b>La fuente presupuestal no se solicita</b> (se oculta en esta versión).') +
      card('Presupuesto y cupo', '', '<div class="pf-inc">' + body + '</div>', { n: 1 }) + '</div>';
  }

  /* ── Paso 3 · Tipos ─────────────────────────────────────────── */
  function incCard(inc, idx) {
    var m = inc.modalidad;
    var mod = radios({ label: 'Modalidad del incentivo', act: 'inc-modalidad', d: inc.id, value: m, dir: 'horizontal', options: [
      { v: 'codigo', l: 'Entrega única con código', s: 'Bono, kit, beca… Cada código es una unidad.' },
      { v: 'certificado', l: 'Certificado digital', s: 'PDF con firma digital y QR. Sin código.' },
      { v: 'fijo', l: 'Fijo recurrente', s: 'Apoyo periódico por ciclos. Sin código.' }
    ] });
    var extra = '';
    if (m === 'codigo') {
      extra = alertBox('Cada código equivale a <b>una unidad entregable</b>, es único e irrepetible. Los códigos se cargan en el paso 5 o después.', 'informative');
    } else if (m === 'certificado') {
      extra = '<div class="pf-grid">' + sel({ label: 'Plantilla del certificado', k: 'inc.' + inc.id + '.plantilla', val: inc.plantilla, opts: ['Diploma institucional', 'Reconocimiento al mérito deportivo'] }) +
        '<div>' + alertBox('Incluye firma digital y <b>QR de verificación</b>. La firma digital la define el Ministerio (pendiente).', 'caution', 'attention') + '</div></div>';
    } else {
      extra = '<div class="pf-grid">' + sel({ label: 'Frecuencia de entrega', req: 1, k: 'inc.' + inc.id + '.frecuencia', val: inc.frecuencia, opts: FRECUENCIAS, attrs: ' data-struct="1"' }) +
        (inc.frecuencia === 'otra' ? tf({ label: 'Cada cuántos meses', req: 1, type: 'number', k: 'inc.' + inc.id + '.frecuenciaN', val: inc.frecuenciaN, ph: '2' }) : '<div></div>') + '</div>' +
        alertBox('No usa códigos y <b>exige etapa documental</b> (paso 4). Cada ciclo lo confirma el Gestor de programa; cambiar la frecuencia crea una nueva versión del programa.', 'informative');
    }
    var foto = m === 'codigo' ? '<div class="pf-switch-row">' + toggle(inc.foto, 'inc-foto', inc.id) + '<span>Exige fotografía de evidencia en la entrega</span></div>' : '';
    var showCant = true;
    var cantLabel = m === 'codigo' ? 'Stock / cantidad de códigos' : (m === 'fijo' ? 'Beneficiarios estimados' : 'Cantidad estimada');
    var valorLabel = m === 'fijo' ? 'Valor por ciclo' : 'Valor unitario';
    return '<div class="nwt-card" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body">' +
      '<div class="nwt-card__header"><div class="pf-card-head-row"><h3 class="pf-card-title"><span class="pf-num">' + (idx + 1) + '</span>Incentivo #' + (idx + 1) + '</h3>' + (S.inc.length > 1 ? btn('Quitar', 'inc-del', { v: 'mute', d: inc.id, i: 'delete' }) : '') + '</div></div>' +
      '<div class="nwt-card__content"><div class="pf-inc"><div class="pf-grid">' +
        tf({ label: 'Nombre del incentivo', req: 1, k: 'inc.' + inc.id + '.nombre', val: inc.nombre, ph: 'Ej. Beca educativa · Medallistas de oro' }) +
        sel({ label: 'Categoría', k: 'inc.' + inc.id + '.categoria', val: inc.categoria, opts: CATEGORIAS }) +
      '</div>' +
      '<div class="pf-modal-box pf-new">' + mod + extra + '</div>' +
      '<div class="pf-grid">' +
        tf({ label: valorLabel, req: m !== 'certificado', k: 'inc.' + inc.id + '.valor', val: inc.valor ? Number(inc.valor).toLocaleString('es-CO') : '', ph: m === 'certificado' ? 'Sin valor monetario' : '0', mode: 'numeric', hint: m === 'fijo' ? 'Pesos por cada ciclo entregado.' : 'Pesos por incentivo entregado.' }) +
        (showCant ? tf({ label: cantLabel, k: 'inc.' + inc.id + '.cantidad', val: inc.cantidad, ph: '0', mode: 'numeric' }) : '') +
      '</div>' + foto + '</div></div><div class="nwt-card__footer"></div></div></div>';
  }
  function step3() {
    return '<div class="pf-sec">' + head('Tipos de incentivo', 'Define qué entrega este programa. Puede haber uno o varios tipos, cada uno con su <b>modalidad</b>. «Montos distintos» = incentivos distintos.') +
      '<div id="pfIncs" class="pf-sec">' + S.inc.map(incCard).join('') + '</div>' +
      '<div><button type="button" class="nwt-button" nwt-variant="quiet" nwt-size="medium" data-act="inc-add"><span class="nwt-button__content">' + icon('add') + 'Agregar otro incentivo</span></button></div>' +
      '<div id="pfDist"></div></div>';
  }
  function updateDist() {
    var host = $('#pfDist'); if (!host) return;
    var total = S.inc.reduce(function (a, i) { return a + (Number(i.valor) || 0) * (Number(i.cantidad) || 0); }, 0);
    var rub = S.rubro.on && S.rubro.modo !== 'cupo' ? Number(S.rubro.valor) || 0 : 0;
    if (!total) { host.innerHTML = ''; return; }
    if (!rub) { host.innerHTML = alertBox('Distribución estimada: <b>' + money(total) + '</b> (valor × cantidad). Define un presupuesto en el paso 2 para compararla.', 'informative'); return; }
    host.innerHTML = total > rub ? alertBox('La distribución estimada <b>' + money(total) + '</b> supera el presupuesto <b>' + money(rub) + '</b> en ' + money(total - rub) + '.', 'negative', 'attention')
      : alertBox('Distribuido <b>' + money(total) + '</b> de <b>' + money(rub) + '</b> · disponible ' + money(rub - total) + '.', 'positive', 'positive');
  }

  /* ── Paso 4 · Condiciones ───────────────────────────────────── */
  function famInUse() {
    var u = {}; S.cond.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (FIELDS[r.f]) u[FIELDS[r.f].fam] = 1; }); }); return u;
  }
  function fieldGroups(cur) {
    return Object.keys(FAMILIAS).map(function (fam) {
      return '<optgroup label="' + FAMILIAS[fam] + '">' + Object.keys(FIELDS).filter(function (k) { return FIELDS[k].fam === fam; }).map(function (k) { return '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + FIELDS[k].label + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  }
  function ruleRow(gi, ri, r) {
    var f = FIELDS[r.f];
    var key = gi + '.' + ri;
    var fieldSel = sel({ label: ri === 0 ? 'Campo' : '', k: 'rule.' + key + '.f', val: r.f, ph: 'Campo', groups: '<option value="" disabled' + (r.f ? '' : ' selected') + '>Campo</option>' + fieldGroups(r.f), attrs: ' data-struct="1"' });
    var opSel = '', val = '';
    if (f) {
      if (f.type === 'num') {
        opSel = sel({ label: ri === 0 ? 'Operador' : '', k: 'rule.' + key + '.op', val: r.op, opts: OPS_NUM });
        val = tf({ label: ri === 0 ? 'Valor' : '', type: 'number', k: 'rule.' + key + '.v', val: r.v, ph: '18' });
      } else if (f.type === 'text') {
        opSel = sel({ label: ri === 0 ? 'Operador' : '', k: 'rule.' + key + '.op', val: r.op || '=', opts: [['=', 'es'], ['≠', 'no es']] });
        val = tf({ label: ri === 0 ? 'Valor' : '', k: 'rule.' + key + '.v', val: r.v, ph: 'Ej. Cali' });
      } else {
        opSel = sel({ label: ri === 0 ? 'Operador' : '', k: 'rule.' + key + '.op', val: r.op || '=', opts: OPS_SEL, attrs: ' data-struct="1"' });
        if (r.op === '∈') {
          var arr = Array.isArray(r.v) ? r.v : [];
          val = '<div>' + (ri === 0 ? '<span class="pf-label">Valores</span>' : '') + '<div class="pf-rule__chips">' + f.opts.map(function (o) { return tag(o, arr.indexOf(o) > -1, 'rule-multi', key, o); }).join('') + '</div></div>';
        } else {
          val = sel({ label: ri === 0 ? 'Valor' : '', k: 'rule.' + key + '.v', val: Array.isArray(r.v) ? '' : r.v, ph: 'Selecciona', opts: f.opts });
        }
      }
    } else { opSel = '<div></div>'; val = '<div></div>'; }
    return '<div class="pf-rule">' + fieldSel + opSel + val + '<div>' + iconBtn('close', 'rule-del', 'Quitar condición', gi, ri) + '</div></div>';
  }
  function ruleText(r) {
    var f = FIELDS[r.f]; if (!f) return null;
    var v = r.v;
    if (r.op === '∈') { if (!Array.isArray(v) || !v.length) return null; return f.label + ' ∈ {' + v.join(', ') + '}'; }
    if (v === '' || v == null || Array.isArray(v)) return null;
    return f.label + ' ' + r.op + ' ' + v;
  }
  function previewHTML() {
    var parts = S.cond.grupos.map(function (g) {
      var t = g.rows.map(ruleText).filter(Boolean);
      return t.length ? '(' + t.join(g.op === 'AND' ? ' <em>Y</em> ' : ' <em>O</em> ') + ')' : null;
    }).filter(Boolean);
    return parts.length ? parts.map(esc).join(' <em>O</em> ').replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>') : '<em>Sin condiciones definidas todavía.</em>';
  }
  function groupsHTML() {
    var used = famInUse();
    return '<div class="pf-families">' + Object.keys(FAMILIAS).map(function (f) { return '<span class="nwt-tag' + (used[f] ? ' nwt-tag--active' : '') + '" nwt-size="small">' + FAMILIAS[f] + '</span>'; }).join('') + '</div>' +
      '<p class="pf-hint">Se resaltan las familias en uso. Se combinan con Y; si falla una, el sistema <b>bloquea y dice cuál</b>.</p>' +
      S.cond.grupos.map(function (g, gi) {
        return (gi > 0 ? '<div class="pf-or">— O —</div>' : '') + '<div class="pf-group"><div class="pf-group__head"><span class="pf-group__label">Grupo ' + (gi + 1) + '</span>' +
          tag('Todas deben cumplirse (Y)', g.op === 'AND', 'grp-op', gi, 'AND') + tag('Basta una (O)', g.op === 'OR', 'grp-op', gi, 'OR') +
          '<span style="flex:1"></span>' + (S.cond.grupos.length > 1 ? btn('Quitar grupo', 'grp-del', { v: 'mute', d: gi, i: 'delete' }) : '') + '</div>' +
          g.rows.map(function (r, ri) { return ruleRow(gi, ri, r); }).join('') +
          btn('Añadir condición', 'rule-add', { d: gi, i: 'add' }) + '</div>';
      }).join('') +
      '<div>' + btn('Agregar grupo alternativo (O)', 'grp-add', { i: 'add' }) + '</div>' +
      '<div><span class="pf-label">Vista previa de la regla</span><div class="pf-preview" id="pfPreview">' + previewHTML() + '</div></div>';
  }
  function docsHTML() {
    var d = S.cond.doc, forced = hasModalidad('fijo');
    var out = '<div class="pf-switch-row">' + (forced ? toggle(true, 'noop') : toggle(d.req, 'doc-req')) + '<span>¿Requiere etapa de documentación previa?' + (forced ? ' <b>Sí (obligatorio con incentivo fijo recurrente)</b>' : '') + '</span></div>';
    if (!docRequired()) {
      return out + alertBox('<b>Flujo directo:</b> no hay postulación ni cargue de documentos. El beneficiario elegible queda habilitado directamente para que el Operador le asigne el incentivo.', 'informative');
    }
    out += alertBox('<b>Flujo con postulación documental:</b> el beneficiario carga soportes (PDF, JPG, PNG) en la ventana de fechas, el Gestor de programa los revisa y solo con <b>Documentación aprobada</b> el Operador puede asignar.', 'informative');
    out += '<div><span class="pf-label">Documentos que pide al beneficiario</span><div class="pf-sec" style="gap:8px" id="pfDocs">' + (d.list.length ? d.list.map(function (x, i) {
      return '<div class="pf-doc"><span class="pf-doc__name">' + esc(x.name) + '</span>' + checkbox('Obligatorio', x.oblig, 'doc-oblig', i) + iconBtn('close', 'doc-del', 'Quitar documento', i) + '</div>';
    }).join('') : '<p class="pf-hint">Agrega al menos un documento obligatorio.</p>') + '</div></div>';
    out += '<div class="pf-row">' + DOC_SUGERIDOS.filter(function (n) { return !d.list.some(function (x) { return x.name === n; }); }).map(function (n) { return tag('+ ' + n, false, 'doc-add-s', null, n); }).join('') + '</div>';
    out += '<div class="pf-add">' + tf({ label: 'Otro documento', k: 'ui.docNuevo', val: '', ph: 'Nombre del documento' }) + btn('Agregar', 'doc-add', { v: 'quiet', s: 'medium', i: 'add' }) + '</div>';
    out += alertBox('Define más abajo el <b>cronograma</b> de cargue, revisión y asignación.', 'informative', 'calendar');
    return out;
  }
  /* ── Cronograma (HU-06) ─────────────────────────────────────── */
  function faseVal(f, w) { var v = S.crono[f][w]; return v; }
  function cronoSummary(c, rec) {
    return FASES.map(function (f) { return f[1] + ' ' + (rec ? 'día ' + c[f[0]].ini + '–' + c[f[0]].fin : fmtDT(c[f[0]].ini) + ' → ' + fmtDT(c[f[0]].fin)); }).join(' · ') + ' · Gracia ' + c.gracia + ' días hábiles';
  }
  function cronoCard() {
    var rec = isRec(), c = S.crono;
    var rows = FASES.map(function (f, i) {
      var k = f[0];
      return '<div class="pf-phase"><div class="pf-phase__head"><span class="pf-num">' + (i + 1) + '</span><div><b>' + f[1] + '</b><p class="pf-hint">' + f[2] + '</p></div></div><div class="pf-grid">' +
        (rec ? tf({ label: 'Desde el día del ciclo', req: 1, type: 'number', k: 'crono.' + k + '.ini', val: c[k].ini, ph: '1' }) + tf({ label: 'Hasta el día del ciclo', req: 1, type: 'number', k: 'crono.' + k + '.fin', val: c[k].fin, ph: '30' })
          : tf({ label: 'Inicio', req: 1, type: 'datetime-local', k: 'crono.' + k + '.ini', val: c[k].ini }) + tf({ label: 'Cierre', req: 1, type: 'datetime-local', k: 'crono.' + k + '.fin', val: c[k].fin })) +
      '</div></div>';
    }).join('');
    var top = '<div class="pf-grid">' + (rec ? tf({ label: 'Inicio del primer ciclo', req: 1, type: 'date', k: 'crono.primer', val: c.primer, hint: 'Desde esta fecha corre la frecuencia del incentivo fijo.' }) : '<div></div>') +
      sel({ label: 'Plazo de gracia para subsanar', k: 'crono.gracia', val: c.gracia, opts: [['3', '3 días hábiles'], ['4', '4 días hábiles'], ['5', '5 días hábiles']], hint: 'Excluye sábados, domingos y festivos de Colombia.' }) + '</div>';
    var note = rec ? alertBox('Programa recurrente: estas fechas se <b>repiten en cada ciclo</b> (' + frecuenciaTxt() + '). El Gestor de programa confirma cada ciclo; no se renueva solo.', 'informative', 'calendar')
      : alertBox('Fuera de la ventana de cargue el sistema bloquea la postulación, salvo <b>habilitación excepcional</b>.', 'informative', 'calendar');
    return card('Cronograma', 'Cuándo se carga, se revisa y se asigna. Lo defines al crear el programa y el <b>Gestor de programa puede ajustarlo</b>; cada cambio queda auditado.', '<div class="pf-inc">' + note + top + rows + '<div id="pfCronoChg">' + cronoChgHTML() + '</div></div>', { n: 5, cls: 'pf-new' });
  }
  function frecuenciaTxt() { var i = S.inc.filter(function (x) { return x.modalidad === 'fijo'; })[0]; if (!i) return ''; return i.frecuencia === 'otra' ? 'cada ' + (i.frecuenciaN || '?') + ' meses' : i.frecuencia; }
  function cronoChanges() {
    if (!SNAP) return [];
    var out = [], a = SNAP.crono, b = S.crono;
    FASES.forEach(function (f) { ['ini', 'fin'].forEach(function (w) { if (a[f[0]][w] !== b[f[0]][w]) out.push({ campo: f[1] + (w === 'ini' ? ' · inicio' : ' · cierre'), antes: isRec() ? 'día ' + a[f[0]][w] : fmtDT(a[f[0]][w]), despues: isRec() ? 'día ' + b[f[0]][w] : fmtDT(b[f[0]][w]) }); }); });
    if (a.gracia !== b.gracia) out.push({ campo: 'Plazo de gracia', antes: a.gracia + ' días hábiles', despues: b.gracia + ' días hábiles' });
    if (isRec() && a.primer !== b.primer) out.push({ campo: 'Inicio del primer ciclo', antes: fmtDate(a.primer), despues: fmtDate(b.primer) });
    return out;
  }
  function cronoChgHTML() {
    if (!EDIT) return '';
    var ch = cronoChanges();
    if (!ch.length) return '<p class="pf-hint">Sin cambios en el cronograma. Si ajustas una fecha, deberás indicar el motivo y quedará en la bitácora.</p>';
    return alertBox('Cambios al cronograma (<b>no generan versión</b>, quedan en la bitácora): ' + ch.map(function (x) { return esc(x.campo) + ' <b>' + esc(x.antes) + ' → ' + esc(x.despues) + '</b>'; }).join(' · '), 'caution', 'attention') +
      ta({ label: 'Motivo del cambio', req: 1, k: 'crono.motivo', val: S.crono.motivo, rows: 2, ph: 'Ej. Ampliación por solicitud de la federación (Res. 123)', hint: 'Obligatorio. Se guarda con usuario, rol, fecha, hora e IP.' });
  }
  function logCard() {
    if (!EDIT) return '';
    var rows = LOG.map(function (l) {
      return '<div class="pf-log"><div class="pf-log__top"><b>' + esc(l.ev) + '</b><span class="pf-hint">' + esc(l.ts) + '</span></div><div>' + esc(l.det) + '</div><div class="pf-hint">' + esc(l.user) + ' · ' + esc(l.rol) + ' · IP ' + esc(l.ip) + (l.motivo && l.motivo !== '—' ? ' · <b>Motivo:</b> ' + esc(l.motivo) : '') + '</div></div>';
    }).join('');
    return card('Bitácora del cronograma', 'Registro inmutable de cada cambio: quién, cuándo, qué cambió y por qué.', '<div class="pf-sec" style="gap:12px">' + rows + '</div>', { n: 6 });
  }

  function step4() {
    var c = S.cond;
    var manual = c.modo === 'manual';
    var body = (CONDITIONS_LOCKED ? alertBox('Tu rol <b>solo visualiza</b> las condiciones de elegibilidad. Para modificarlas, solicítalo al Gestor de incentivos.', 'caution', 'padlock-close') : '') +
      '<div ' + (CONDITIONS_LOCKED ? 'inert class="pf-sec pf-readonly"' : 'class="pf-sec"') + '>' +
      card('¿Quién puede recibirlo?', 'El tipo de beneficiario al que va dirigido el programa.', '<div class="pf-row">' + BENEFICIARIOS.map(function (b) { return checkbox(b[1], c.benef.indexOf(b[0]) > -1, 'benef', null, b[0]); }).join('') + '</div>', { n: 1 }) +
      card('Elegibilidad', 'Define cómo se decide quién califica.', radios({ act: 'cond-modo', value: c.modo, options: [
        { v: 'motor', l: 'El motor valida en SUID', s: 'Condicionales automáticos con bloqueo estricto.' },
        { v: 'manual', l: 'No validable en la plataforma', s: 'Ej. afectados por un desastre. El Gestor de programa registra o carga a los beneficiarios (habilitación excepcional).' }
      ] }) + (manual ? alertBox('Los beneficiarios se registran <b>uno a uno o por carga masiva</b> (Excel/CSV). Si el programa pide documentos, igual los cargan y se revisan.', 'informative') : ''), { n: 2 }) +
      (manual ? '' : card('Condicionales de elegibilidad', 'Combina cinco familias de condicionales. Grupos con Y / O.', '<div class="pf-sec" id="pfRules">' + groupsHTML() + '</div>', { n: 3, cls: 'pf-new' })) +
      card('Etapa documental', 'Define si el beneficiario debe postularse con documentos.', '<div class="pf-inc" id="pfDoc">' + docsHTML() + '</div>', { n: manual ? 3 : 4, cls: 'pf-new' }) +
      '</div>' +
      (docRequired() ? cronoCard() : '') + logCard() +
      alertBox('<b>Habilitación excepcional:</b> el Gestor de programa siempre podrá habilitar a una persona concreta que no cumpla fechas o condiciones (individual o masiva, con justificación y auditoría). No es un campo de este formulario.', 'informative');
    return '<div class="pf-sec">' + head('Condiciones de elegibilidad', 'Quién puede acceder al beneficio y si debe postularse con documentos. <b>Bloqueo estricto:</b> sin cumplir el 100% el sistema impide la operación e indica qué condición falla.') + body + '</div>';
  }

  /* ── Paso 5 · Códigos y revisión ────────────────────────────── */
  function routeHTML() {
    var rec = hasModalidad('fijo'), docs = docRequired();
    var steps = S.cond.modo === 'manual' ? ['Gestor registra beneficiarios'] : ['Motor valida elegibilidad'];
    if (docs) steps.push('Beneficiario carga soportes', 'Gestor de programa revisa');
    steps.push('Operador asigna');
    if (rec) steps.push('Gestor confirma ciclo');
    return '<div class="pf-route">' + steps.map(function (s, i) { return (i ? '<span class="pf-arrow">→</span>' : '') + badge(s, i === steps.length - 1 ? 'positive' : 'neutral'); }).join('') + '</div>';
  }
  function kv(k, v) { return '<div class="pf-kv"><dt>' + esc(k) + '</dt><dd>' + v + '</dd></div>'; }
  function step5() {
    var cod = S.inc.filter(function (i) { return i.modalidad === 'codigo'; });
    var codHTML = cod.length ? cod.map(function (i) {
      var c = S.codigos[i.id] || (S.codigos[i.id] = { modo: 'despues', n: 0 });
      return '<div class="pf-modal-box"><b>' + esc(i.nombre || 'Incentivo sin nombre') + '</b>' + radios({ act: 'cod-modo', d: i.id, value: c.modo, dir: 'horizontal', compact: 1, options: [{ v: 'ahora', l: 'Cargar ahora' }, { v: 'despues', l: 'Cargar después' }] }) +
        (c.modo === 'ahora' ? '<div class="pf-drop">' + icon('upload') + (c.n ? '<b>' + c.n + ' códigos válidos cargados</b><span>1 duplicado omitido</span>' : '<span>Arrastra una plantilla Excel/CSV o selecciónala</span>') + '<div class="pf-row">' + btn('Descargar plantilla', 'cod-tpl', { i: 'download' }) + btn(c.n ? 'Reemplazar carga' : 'Simular carga', 'cod-sim', { v: 'loud', d: i.id, i: 'upload' }) + '</div></div>' : '<p class="pf-hint">El Gestor de programa o el de incentivos podrán cargar los códigos cuando quieran, sin versionar el programa.</p>') + '</div>';
    }).join('') : alertBox('Ningún incentivo de este programa usa códigos: no hay inventario que cargar.', 'informative');

    var d = S.datos, rub = S.rubro;
    var rubTxt = !rub.on ? 'Sin rubro (opcional)' : [rub.modo !== 'cupo' ? money(rub.valor) : '', rub.modo !== 'presupuesto' ? (rub.cupo || 0) + ' entregas' : ''].filter(Boolean).join(' · ');
    var incTxt = S.inc.map(function (i) { return '<div>' + esc(i.nombre || 'Sin nombre') + ' · ' + badge({ codigo: 'Con código', certificado: 'Certificado', fijo: 'Fijo ' + i.frecuencia }[i.modalidad], i.modalidad === 'fijo' ? 'caution' : 'neutral') + ' ' + (i.valor ? money(i.valor) : '') + '</div>'; }).join('');
    var benTxt = S.cond.benef.map(function (b) { return BENEFICIARIOS.filter(function (x) { return x[0] === b; })[0][1]; }).join(', ') || '—';
    var rev = card('Resumen del programa', 'Revisa antes de guardar. Puedes volver a cualquier paso.', '<div class="pf-sum"><dl style="margin:0">' +
      kv('Programa', esc(d.nombre) + ' ' + (EDIT ? badge('Activo · V1.0', 'positive') : badge('Configuración', 'caution'))) + kv('Evento', esc(d.evento || '—')) + kv('Área · Gestor', esc(d.area) + ' · ' + esc(d.gestor)) +
      kv('Vigencia', fmtDate(d.desde) + ' → ' + fmtDate(d.hasta)) + kv('Cobertura', esc(d.cobertura.join(', '))) + kv('Rubro', esc(rubTxt)) + kv('Incentivos', incTxt) +
      kv('Beneficiarios', esc(benTxt)) + kv('Elegibilidad', S.cond.modo === 'manual' ? 'Habilitación manual por el Gestor de programa' : '<span style="font-family:monospace;font-size:12px">' + previewHTML() + '</span>') +
      kv('Cronograma', docRequired() ? esc(cronoSummary(S.crono, isRec())) : 'No aplica (flujo directo)') + kv('Documentos', docRequired() ? S.cond.doc.list.map(function (x) { return esc(x.name) + (x.oblig ? '' : ' (opcional)'); }).join(', ') || '—' : 'No requiere (flujo directo)') +
    '</dl></div>', { n: 2 });
    var route = card('Ruta del programa', 'Así fluirá una persona desde la elegibilidad hasta la entrega.', routeHTML(), { n: 3 });
    var ch = EDIT ? versionChanges() : [];
    var act = EDIT ? card('Versión resultante', 'Las reglas de versionamiento del programa Activo.', ch.length
      ? alertBox('Se publicará la <b>versión V2.0</b>. Cambios que la generan: <b>' + ch.join(' · ') + '</b>. La V1.0 y todo lo entregado bajo ella quedan congelados e inmutables; si cambian los documentos, las aprobaciones previas pasan a «Expirada / Histórica por nueva versión» al iniciar el siguiente ciclo.', 'caution', 'attention')
      : alertBox('Sin cambios de fondo: se conserva la <b>versión V1.0</b>. Solo se registra la edición en la bitácora de auditoría.', 'positive', 'positive'), { n: 4 })
    : card('Activación', 'El programa solo opera cuando está <b>Activo</b>. Al activarlo queda en <b>versión V1.0</b>.', radios({ act: 'activar', value: S.activar, options: [
      { v: 'config', l: 'Guardar en Configuración', s: 'Queda como borrador operativo. Puedes terminar de parametrizar y activar después.' },
      { v: 'activo', l: d.activacion ? 'Activar el ' + fmtDate(d.activacion) : 'Activar ahora', s: 'Habilita postulaciones y asignaciones. Se registra auditoría con usuario, fecha, hora e IP.' }
    ] }), { n: 4 });
    return '<div class="pf-sec">' + head('Códigos y revisión', 'Carga el inventario de códigos (solo incentivos con código) y revisa el programa completo.') +
      card('Inventario de códigos', 'Aplica solo a incentivos de entrega única con código.', '<div class="pf-inc">' + codHTML + '</div>', { n: 1 }) + rev + route + act + '<div id="pfIssues"></div></div>';
  }

  /* ── Validación por paso ────────────────────────────────────── */
  function validate(step) {
    var e = [], d = S.datos;
    if (step >= 1) {
      if (!d.nombre.trim()) e.push(['datos.nombre', 'Escribe el nombre del programa.', 1]);
      if (!d.area) e.push(['datos.area', 'Selecciona el área responsable.', 1]);
      if (!d.gestor) e.push(['datos.gestor', 'Asigna un gestor de programa.', 1]);
      if (!d.desde) e.push(['datos.desde', 'Indica la fecha de inicio.', 1]);
      if (!d.hasta) e.push(['datos.hasta', 'Indica la fecha de fin.', 1]);
      if (d.desde && d.hasta && d.hasta < d.desde) e.push(['datos.hasta', 'La fecha de fin debe ser posterior al inicio.', 1]);
      if (d.activacion && d.desde && d.activacion < d.desde) e.push(['datos.activacion', 'La activación no puede ser anterior a la vigencia.', 1]);
    }
    if (step >= 2 && S.rubro.on) {
      if (S.rubro.modo !== 'cupo' && !Number(S.rubro.valor)) e.push(['rubro.valor', 'Define el valor presupuestal.', 2]);
      if (S.rubro.modo !== 'presupuesto' && !Number(S.rubro.cupo)) e.push(['rubro.cupo', 'Define el cupo de entregas.', 2]);
    }
    if (step >= 3) S.inc.forEach(function (i) {
      if (!i.nombre.trim()) e.push(['inc.' + i.id + '.nombre', 'Nombra el incentivo.', 3]);
      if (i.modalidad !== 'certificado' && !Number(i.valor)) e.push(['inc.' + i.id + '.valor', 'Indica el valor.', 3]);
      if (i.modalidad === 'fijo' && i.frecuencia === 'otra' && !Number(i.frecuenciaN)) e.push(['inc.' + i.id + '.frecuenciaN', 'Indica cada cuántos meses.', 3]);
    });
    if (step >= 4) {
      if (!S.cond.benef.length) e.push(['', 'Elige al menos un tipo de beneficiario.', 4]);
      if (S.cond.modo === 'motor') {
        var any = S.cond.grupos.some(function (g) { return g.rows.some(ruleText); });
        if (!any) e.push(['', 'Define al menos una condición válida (o cambia a «No validable en la plataforma»).', 4]);
        S.cond.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (r.f && !ruleText(r)) e.push(['', 'Hay una condición incompleta: ' + FIELDS[r.f].label + '.', 4]); }); });
      }
      if (docRequired() && !S.cond.doc.list.some(function (x) { return x.oblig; })) e.push(['', 'Agrega al menos un documento obligatorio.', 4]);
      if (docRequired()) cronoErrors(e);
      if (EDIT && cronoChanges().length && !S.crono.motivo.trim()) e.push(['crono.motivo', 'Indica el motivo del cambio de cronograma.', 4]);
    }
    return e;
  }
  function cronoErrors(e) {
    var c = S.crono, rec = isRec(), prev = null, prevName = '';
    if (rec && !c.primer) e.push(['crono.primer', 'Indica cuándo inicia el primer ciclo.', 4]);
    FASES.forEach(function (f) {
      var k = f[0], a = c[k].ini, b = c[k].fin;
      if (!a) e.push(['crono.' + k + '.ini', 'Falta el inicio.', 4]);
      if (!b) e.push(['crono.' + k + '.fin', 'Falta el cierre.', 4]);
      if (a && b) {
        if (rec) {
          if (+a < 1 || +b > 31 || +a < 1) e.push(['crono.' + k + '.fin', 'Usa días entre 1 y 31.', 4]);
          else if (+b < +a) e.push(['crono.' + k + '.fin', 'El cierre no puede ser antes del inicio.', 4]);
          else if (prev != null && +a < prev) e.push(['crono.' + k + '.ini', f[1] + ' no puede empezar antes de que cierre ' + prevName + ' (día ' + prev + ').', 4]);
          if (!(+b < +a)) { prev = +b; prevName = f[1]; }
        } else {
          if (b <= a) e.push(['crono.' + k + '.fin', 'El cierre debe ser posterior al inicio.', 4]);
          else if (prev && a < prev) e.push(['crono.' + k + '.ini', f[1] + ' no puede empezar antes de que cierre ' + prevName + '.', 4]);
          if (S.datos.desde && a.slice(0, 10) < S.datos.desde) e.push(['crono.' + k + '.ini', 'Queda fuera de la vigencia del programa.', 4]);
          if (S.datos.hasta && b.slice(0, 10) > S.datos.hasta) e.push(['crono.' + k + '.fin', 'Queda fuera de la vigencia del programa.', 4]);
          if (b > a) { prev = b; prevName = f[1]; }
        }
      }
    });
  }
  function showErrors(errs, step) {
    document.querySelectorAll('.nwt-input-box--error').forEach(function (b) { b.classList.remove('nwt-input-box--error'); var m = b.querySelector('.pf-err'); if (m) m.remove(); });
    var first = null;
    errs.filter(function (x) { return x[2] === step; }).forEach(function (x) {
      if (!x[0]) return;
      var box = document.querySelector('[data-box="' + x[0] + '"]'); if (!box) return;
      box.classList.add('nwt-input-box--error');
      var c = box.querySelector('.nwt-input-box__content'), m = document.createElement('div'); m.className = 'nwt-input-box__message pf-err'; m.innerHTML = '<span>' + esc(x[1]) + '</span>'; c.appendChild(m);
      if (!first) first = box;
    });
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
    var general = errs.filter(function (x) { return x[2] === step && !x[0]; }).map(function (x) { return x[1]; });
    return general;
  }

  /* ── Versionamiento (modo edición) ──────────────────────────── */
  function versionChanges() {
    if (!SNAP) return [];
    var ch = [];
    if (JSON.stringify([S.cond.benef, S.cond.modo, S.cond.grupos]) !== JSON.stringify([SNAP.cond.benef, SNAP.cond.modo, SNAP.cond.grupos])) ch.push('Condicionales de elegibilidad');
    var f1 = S.inc.map(function (i) { return [i.id, i.modalidad, i.frecuencia, i.frecuenciaN]; }), f0 = SNAP.inc.map(function (i) { return [i.id, i.modalidad, i.frecuencia, i.frecuenciaN]; });
    if (JSON.stringify(f1) !== JSON.stringify(f0)) ch.push('Frecuencia / modalidad del incentivo');
    if (JSON.stringify([docRequired(), S.cond.doc.list]) !== JSON.stringify([SNAP.docReq, SNAP.cond.doc.list])) ch.push('Documentos requeridos');
    return ch;
  }
  function banner() {
    var host = $('#pfBanner'), h = '';
    if (!EDIT && !CAN_EDIT_PROGRAM) h = alertBox('Tu rol no crea programas: lo hace el Gestor de incentivos, Administrador o Superadmin. Puedes explorar el formulario, pero no guardar.', 'caution', 'padlock-close');
    if (EDIT) {
      var ch = versionChanges(), cc = cronoChanges();
      h = ch.length ? alertBox('Editas <b>V1.0 (Activo)</b>. Estos cambios generarán la <b>nueva versión V2.0</b>: ' + ch.join(' · ') + '. Lo ya entregado en V1.0 queda congelado e inmutable.', 'caution', 'attention')
        : alertBox('Editas <b>V1.0 (Activo)</b>. Cambiar <b>condicionales, frecuencia o documentos</b> crea una nueva versión (V2.0). Cambiar estado, extender vigencia, <b>ajustar el cronograma</b> o cargar códigos <b>no versiona</b>.', 'informative');
      if (cc.length && !ch.length) h += alertBox('Ajustas el <b>cronograma</b> (' + cc.length + ' cambio' + (cc.length > 1 ? 's' : '') + '): se conserva V1.0 y queda registrado en la bitácora con tu motivo.', 'caution', 'calendar');
    }
    host.innerHTML = h;
    var fin = $('#pfNext .nwt-button__content');
    if (S.step === 5 && fin) fin.innerHTML = (EDIT ? (versionChanges().length ? 'Publicar V2.0' : 'Guardar cambios') : (S.activar === 'activo' ? 'Crear y activar' : 'Crear programa')) + icon('positive');
  }

  /* ── Render ─────────────────────────────────────────────────── */
  var STEPS = ['Datos', 'Rubro', 'Tipos', 'Condiciones', 'Códigos y revisión'];
  function renderStepper() {
    $('#pfStepper').innerHTML = STEPS.map(function (l, i) {
      var n = i + 1, act = S.step === n, dn = S.step > n;
      return '<div class="nwt-stepper__item' + (act ? ' nwt-stepper__item--active' : '') + (dn ? ' nwt-stepper__item--done' : '') + (n > S.max ? ' nwt-stepper__item--disabled' : '') + '" data-act="goto" data-x="' + n + '"><div class="nwt-stepper__item__content"><div class="nwt-stepper__item__badge">' + (dn ? icon('positive') : n) + '</div><span class="nwt-stepper__item__label">' + l + '</span></div></div>';
    }).join('');
  }
  function render(keepScroll) {
    var html = [step1, step2, step3, step4, step5][S.step - 1]();
    if (EDIT && role === 'programa' && S.step <= 2) html = alertBox('Los datos y el rubro del programa los edita el Gestor de incentivos. Tu rol <b>solo los visualiza</b>.', 'caution', 'padlock-close') + '<div inert class="pf-sec pf-readonly">' + html + '</div>';
    $('#pfStep').innerHTML = html;
    renderStepper(); banner();
    $('#pfPrev').style.visibility = S.step === 1 ? 'hidden' : 'visible';
    var nx = $('#pfNext .nwt-button__content');
    if (S.step < 5) nx.innerHTML = 'Continuar' + icon('arrow-right');
    $('#pfFooterInfo').innerHTML = 'Paso ' + S.step + ' de 5 · <b>' + STEPS[S.step - 1] + '</b>';
    if (S.step === 2) updateKpi();
    if (S.step === 3) updateDist();
    if (S.step === 5) { banner(); issues(); }
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    saveDraft(true);
  }
  function updateKpi() {
    var host = $('#pfKpi'); if (!host) return;
    var v = S.rubro.modo !== 'cupo' ? Number(S.rubro.valor) || 0 : null, c = S.rubro.modo !== 'presupuesto' ? Number(S.rubro.cupo) || 0 : null;
    var cell = function (l, a, b) { return '<div class="pf-modal-box" style="gap:4px"><span class="pf-hint">' + l + '</span><b style="font-size:20px">' + a + '</b>' + (b ? '<span class="pf-hint">' + b + '</span>' : '') + '</div>'; };
    host.style.gridTemplateColumns = 'repeat(3,minmax(0,1fr))';
    host.innerHTML = cell('Inicial', v != null ? money(v) : c + ' entregas', v != null && c != null ? c + ' entregas' : '') + cell('Ejecutado', v != null ? money(0) : '0 entregas', 'al crear: 0') + cell('Disponible', v != null ? money(v) : c + ' entregas', v != null && c != null ? c + ' entregas' : '');
  }
  function issues() {
    var host = $('#pfIssues'); if (!host) return;
    var e = validate(4);
    host.innerHTML = e.length ? alertBox('Faltan datos para guardar: <b>' + e.map(function (x) { return esc(x[1]); }).join(' · ') + '</b>', 'negative', 'attention') : alertBox('Todo listo: el programa tiene los datos mínimos para guardarse.', 'positive', 'positive');
  }
  function updateRules() {
    var p = $('#pfPreview'); if (p) p.innerHTML = previewHTML();
    var fam = $('#pfRules .pf-families'); if (fam) { var u = famInUse(); fam.querySelectorAll('.nwt-tag').forEach(function (t) { var k = Object.keys(FAMILIAS).filter(function (f) { return FAMILIAS[f] === t.textContent; })[0]; t.classList.toggle('nwt-tag--active', !!u[k]); }); }
    banner();
  }

  /* ── Estado: bind por path ──────────────────────────────────── */
  function setByKey(k, raw) {
    var p = k.split('.');
    if (p[0] === 'datos') S.datos[p[1]] = raw;
    else if (p[0] === 'rubro') S.rubro[p[1]] = digits(raw);
    else if (p[0] === 'inc') { var i = incById(p[1]); i[p[2]] = (p[2] === 'valor' || p[2] === 'cantidad' || p[2] === 'frecuenciaN') ? digits(raw) : raw; }
    else if (p[0] === 'crono') { if (p.length === 3) S.crono[p[1]][p[2]] = raw; else S.crono[p[1]] = raw; }
    else if (p[0] === 'rule') {
      var r = S.cond.grupos[+p[1]].rows[+p[2]], f = p[3];
      if (f === 'f') { r.f = raw; var fd = FIELDS[raw]; r.op = fd.type === 'num' ? '≥' : '='; r.v = ''; }
      else if (f === 'op') { r.op = raw; if (raw === '∈') r.v = []; else if (Array.isArray(r.v)) r.v = ''; }
      else r.v = raw;
    }
  }
  function onInput(e) {
    var t = e.target; if (!t.dataset || !t.dataset.k) return;
    var k = t.dataset.k;
    if (k === 'ui.docNuevo') return;
    var isMoney = /(\.valor|\.cantidad|^rubro\.)/.test(k);
    if (isMoney) { var d = digits(t.value); if (e.type === 'change' && k.indexOf('cantidad') < 0 && k !== 'rubro.cupo') t.value = d ? Number(d).toLocaleString('es-CO') : ''; else if (e.type === 'input') t.value = d && (k.indexOf('cantidad') < 0 && k !== 'rubro.cupo') ? Number(d).toLocaleString('es-CO') : d; }
    setByKey(k, t.value);
    if (t.dataset.struct && e.type === 'change') { render(true); return; }
    var box = t.closest('.nwt-input-box'); if (box && box.classList.contains('nwt-input-box--error')) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
    if (k.indexOf('rule.') === 0) updateRules();
    if (k.indexOf('crono.') === 0 && k !== 'crono.motivo') { var ch = $('#pfCronoChg'); if (ch && e.type === 'change') ch.innerHTML = cronoChgHTML(); banner(); }
    if (S.step === 2) updateKpi();
    if (S.step === 3) updateDist();
    if (EDIT) banner();
  }

  /* ── Acciones ───────────────────────────────────────────────── */
  var ACT = {
    cobertura: function (x) { var c = S.datos.cobertura, i = c.indexOf(x); if (x === 'Nacional') { S.datos.cobertura = ['Nacional']; } else { if (i > -1) c.splice(i, 1); else c.push(x); S.datos.cobertura = c.filter(function (r) { return r !== 'Nacional'; }); if (!S.datos.cobertura.length) S.datos.cobertura = ['Nacional']; } render(true); },
    'rubro-on': function () { S.rubro.on = !S.rubro.on; render(true); },
    'rubro-modo': function (x) { S.rubro.modo = x; render(true); },
    'inc-add': function () { S.inc.push(newInc()); render(true); var c = document.querySelectorAll('#pfIncs > .nwt-card'); if (c.length) c[c.length - 1].scrollIntoView({ block: 'center', behavior: 'smooth' }); },
    'inc-del': function (x, i) { S.inc = S.inc.filter(function (n) { return n.id !== i; }); render(true); },
    'inc-modalidad': function (x, i) { var n = incById(i); n.modalidad = x; if (x !== 'codigo') n.foto = false; else n.foto = true; render(true); },
    'inc-foto': function (x, i) { var n = incById(i); n.foto = !n.foto; render(true); },
    benef: function (x) { var b = S.cond.benef, i = b.indexOf(x); if (i > -1) b.splice(i, 1); else b.push(x); render(true); },
    'cond-modo': function (x) { S.cond.modo = x; render(true); },
    'grp-op': function (x, gi) { S.cond.grupos[+gi].op = x; render(true); },
    'grp-add': function () { S.cond.grupos.push({ op: 'AND', rows: [{ f: '', op: '=', v: '' }] }); render(true); },
    'grp-del': function (x, gi) { S.cond.grupos.splice(+gi, 1); render(true); },
    'rule-add': function (x, gi) { S.cond.grupos[+gi].rows.push({ f: '', op: '=', v: '' }); render(true); },
    'rule-del': function (x, gi) { S.cond.grupos[+gi].rows.splice(+x, 1); render(true); },
    'rule-multi': function (x, key) { var p = key.split('.'), r = S.cond.grupos[+p[0]].rows[+p[1]]; if (!Array.isArray(r.v)) r.v = []; var i = r.v.indexOf(x); if (i > -1) r.v.splice(i, 1); else r.v.push(x); render(true); },
    'doc-req': function () { S.cond.doc.req = !S.cond.doc.req; if (S.cond.doc.req && !S.cond.doc.list.length) S.cond.doc.list = [{ name: 'Documento de identidad', oblig: true }]; render(true); },
    'doc-oblig': function (x) { var d = S.cond.doc.list[+x]; d.oblig = !d.oblig; render(true); },
    'doc-del': function (x) { S.cond.doc.list.splice(+x, 1); render(true); },
    'doc-add-s': function (x) { S.cond.doc.list.push({ name: x, oblig: true }); render(true); },
    'doc-add': function () { var inp = $('[data-k="ui.docNuevo"]'), v = inp && inp.value.trim(); if (!v) return toast('Escribe el nombre del documento.', 'caution'); S.cond.doc.list.push({ name: v, oblig: true }); render(true); },
    'cod-modo': function (x, i) { (S.codigos[i] || (S.codigos[i] = { n: 0 })).modo = x; render(true); },
    'cod-sim': function (x, i) { S.codigos[i].n = 50; render(true); },
    'cod-tpl': function () { toast('Plantilla de ejemplo (demo): codigo, observación.', 'informative'); },
    activar: function (x) { S.activar = x; render(true); },
    'save-draft': function () { saveDraft(); toast('Borrador guardado. Podrás retomarlo cuando quieras.', 'positive'); },
    goto: function (x) { var n = +x; if (n <= S.max && n !== S.step) go(n); },
    edit: function (x) { go(+x); },
    noop: function () {}
  };
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    if (t.closest('[inert]')) return;
    var fn = ACT[t.dataset.act]; if (!fn) return;
    if (t.tagName === 'LABEL') e.preventDefault();
    fn(t.dataset.x, t.dataset.i);
  }
  function onKey(e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.nwt-tag[data-act], .nwt-checkbox[data-act], .nwt-switch[data-act]')) { e.preventDefault(); e.target.click(); } }

  function go(n) { S.step = n; if (n > S.max) S.max = n; render(); }
  function next() {
    if (S.done) return;
    var errs = validate(S.step), general = showErrors(errs, S.step);
    if (errs.some(function (x) { return x[2] === S.step; })) {
      toast(general.length ? general[0] : 'Revisa los campos marcados para continuar.', 'negative');
      var b = $('#pfNext'); b.classList.remove('pf-shake'); void b.offsetWidth; return;
    }
    if (S.step < 5) { go(S.step + 1); return; }
    var all = validate(4);
    if (all.length) { toast('Completa los datos faltantes antes de guardar.', 'negative'); return; }
    if (!EDIT && !CAN_EDIT_PROGRAM) { toast('Tu rol no puede crear programas.', 'caution'); return; }
    finish();
  }
  function finish() {
    S.done = true; try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
    var ver = EDIT && versionChanges().length ? 'V2.0' : 'V1.0';
    var nlog = 0;
    if (EDIT) {
      var who = PERSONAS[role] || PERSONAS.admin, now = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
      var ts = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
      var ch2 = cronoChanges();
      if (ch2.length) {
        var entry = { ts: ts, user: who[0], rol: who[1], ev: 'Edición del cronograma', det: ch2.map(function (x) { return x.campo + ': ' + x.antes + ' → ' + x.despues; }).join(' · '), motivo: S.crono.motivo.trim(), ip: '190.24.18.' + (20 + now.getSeconds() % 70) };
        try { var st = JSON.parse(localStorage.getItem(LOG_KEY)) || []; st.unshift(entry); localStorage.setItem(LOG_KEY, JSON.stringify(st)); } catch (_) {}
        nlog = ch2.length;
      }
    }
    var activo = EDIT || S.activar === 'activo';
    $('#pfBanner').innerHTML = '';
    $('#pfStep').innerHTML = '<div class="pf-ok"><div class="nwt-avatar-icon" nwt-theme="positive">' + icon('positive') + '</div>' +
      '<h2 class="pf-h2">' + (EDIT ? 'Cambios guardados' : 'Programa creado') + '</h2>' +
      '<p class="pf-lead"><b>' + esc(S.datos.nombre) + '</b> ' + (activo ? 'está <b>Activo · ' + ver + '</b>.' : 'quedó en <b>Configuración</b>. Actívalo cuando esté listo.') + ' Se registró auditoría con usuario, fecha, hora e IP.' + (nlog ? ' <b>' + nlog + ' cambio' + (nlog > 1 ? 's' : '') + ' de cronograma</b> ' + (nlog > 1 ? 'quedaron' : 'quedó') + ' en la bitácora con su motivo.' : '') + '</p>' +
      '<div class="pf-row">' + badge(activo ? 'Activo · ' + ver : 'Configuración', activo ? 'positive' : 'caution') + badge(routeLabel(), 'neutral') + '</div>' +
      '<div class="pf-row"><a class="nwt-button" nwt-variant="loud" nwt-size="medium" href="incentivo-03-programas.html"><span class="nwt-button__content">Ver programas</span></a><a class="nwt-button" nwt-variant="quiet" nwt-size="medium" href="incentivo-04-programa-crear.html"><span class="nwt-button__content">Crear otro</span></a></div></div>';
    $('.pf-footer').hidden = true; $('#pfStepper').innerHTML = ''; window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function routeLabel() { return (hasModalidad('fijo') ? 'Recurrente' : 'Pago único') + ' · ' + (docRequired() ? 'Con documentos' : 'Flujo directo'); }

  /* ── Toast y borrador ───────────────────────────────────────── */
  var toastT;
  function toast(msg, theme) {
    $('#pfToast').innerHTML = alertBox(msg, theme || 'informative', theme === 'positive' ? 'positive' : theme === 'negative' || theme === 'caution' ? 'attention' : 'info');
    clearTimeout(toastT); toastT = setTimeout(function () { $('#pfToast').innerHTML = ''; }, 3600);
  }
  function saveDraft(silent) {
    if (EDIT) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ S: S, uid: uid })); } catch (_) {}
  }
  function loadDraft() {
    if (EDIT) return false;
    try {
      var raw = localStorage.getItem(DRAFT_KEY); if (!raw) return false;
      var o = JSON.parse(raw); if (!o.S || o.S.done) return false;
      S = o.S; uid = o.uid || uid; return true;
    } catch (_) { return false; }
  }


  /* ── Barra lateral (SDK nwt-sidebar) + encabezado fijo ───────── */
  function initChrome() {
    var pf = $('.pf'), side = $('#pfSide'), tgl = $('#pfSideToggle'), scrim = $('#pfScrim');
    var SIDE_KEY = 'inc-sidebar-open', mq = window.matchMedia('(max-width: 760px)');
    var burger = document.createElement('button'); burger.type = 'button'; burger.className = 'pf-burger'; burger.setAttribute('aria-label', 'Abrir menú'); burger.innerHTML = icon('drawer'); pf.appendChild(burger);
    function setExpanded(open) {
      side.classList.toggle('nwt-sidebar--collapsed', !open);
      tgl.setAttribute('aria-pressed', String(!open)); tgl.setAttribute('aria-label', open ? 'Colapsar menú' : 'Expandir menú');
      tgl.querySelector('.nwt-icon').classList.toggle('nwt-sidebar__toolbar__toggle--back', open);
      tgl.querySelector('i').className = 'naotech-icon-' + (open ? 'chevron-right' : 'drawer');
    }
    function setDrawer(open) { side.classList.toggle('is-open', open); scrim.hidden = !open; }
    var saved = false;
    function apply() { if (mq.matches) { setExpanded(true); setDrawer(false); } else { setExpanded(saved); setDrawer(false); } }
    tgl.addEventListener('click', function () {
      if (mq.matches) { setDrawer(false); return; }
      saved = side.classList.contains('nwt-sidebar--collapsed');
      setExpanded(saved);
    });
    burger.addEventListener('click', function () { setDrawer(true); });
    scrim.addEventListener('click', function () { setDrawer(false); });
    function toLanding(e) { e.preventDefault(); if (window.incGoLanding) window.incGoLanding(e.currentTarget); else location.href = 'index.html'; }
    $('#pfLogout').addEventListener('click', toLanding);
    /* Chip de usuario + menú «Cambiar de perfil» (mismas opciones que las demás vistas) */
    var PERFILES = [
      { k: 'admin', n: 'Danna Arrieta', l: 'Gestor de incentivos', m: 'Parametriza y audita', bg: '#c4b5fd', fg: '#4c1d95', home: 'incentivo-02-dashboard.html' },
      { k: 'programa', n: 'Isa Pabon', l: 'Gestor de programa', m: 'Gestiona su programa asignado', bg: '#bfdbfe', fg: '#1e3a8a', home: 'incentivo-03-programas.html' },
      { k: 'operador', n: 'Jorge Guzman', l: 'Operador', m: 'Asigna incentivos en campo', bg: '#ffdfb5', fg: '#92400e', home: 'incentivo-08-asignar-buscar.html' }
    ];
    var cur = PERFILES.filter(function (p) { return p.k === (role === 'gestor' ? 'admin' : role); })[0] || PERFILES[0];
    var ub = $('#pfUserBtn'), um = $('#pfUserMenu');
    var ini = function (p) { return p.n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2); };
    $('#pfUserName').textContent = cur.n; $('#pfUserRole').textContent = cur.l; $('#pfUserIni').textContent = ini(cur);
    um.innerHTML = '<span class="pf-user__label">Cambiar de perfil</span>' + PERFILES.map(function (p) {
      return '<button type="button" class="pf-user__item' + (p.k === cur.k ? ' is-active' : '') + '" role="menuitem" data-perfil="' + p.k + '">' +
        '<span class="pf-user__ava" style="background:' + p.bg + ';color:' + p.fg + '">' + ini(p) + '</span>' +
        '<span class="pf-user__text"><strong>' + p.n + '</strong><small>' + p.l + ' · ' + p.m + '</small></span>' +
        (p.k === cur.k ? '<span class="pf-user__check">' + icon('positive') + '</span>' : '') + '</button>';
    }).join('');
    function setMenu(o) { um.hidden = !o; ub.setAttribute('aria-expanded', String(o)); }
    ub.addEventListener('click', function (e) { e.stopPropagation(); setMenu(um.hidden); });
    um.addEventListener('click', function (e) {
      var it = e.target.closest('[data-perfil]'); if (!it) return;
      var p = PERFILES.filter(function (x) { return x.k === it.dataset.perfil; })[0];
      setMenu(false); if (p.k === cur.k) return;
      try { localStorage.setItem('naowee-incentivos-role', p.k); } catch (_) {}
      location.href = p.home; // igual que el selector de perfil de las vistas: cada perfil vive en su inicio
    });
    document.addEventListener('click', function (e) { if (!$('#pfUser').contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    if (mq.addEventListener) mq.addEventListener('change', apply); apply();
    /* Encabezado: sombra + compactación al hacer scroll (histéresis para evitar parpadeo) */
    var on = false;
    function onScroll() {
      var y = window.scrollY;
      if (!on && y > 24) { on = true; pf.classList.add('is-scrolled'); }
      else if (on && y < 4) { on = false; pf.classList.remove('is-scrolled'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ── Arranque ───────────────────────────────────────────────── */
  function init() {
    var restored = loadDraft();
    if (EDIT) {
      seedEdit(); SNAP = clone({ cond: S.cond, inc: S.inc, docReq: docRequired(), crono: S.crono });
      $('#pfCrumb').textContent = S.datos.nombre; $('#pfTitle').textContent = 'Editar programa';
      $('#pfStateBadge').innerHTML = badge('Activo · V1.0', 'positive');
    } else {
      $('#pfStateBadge').innerHTML = badge('Configuración', 'caution');
    }
    var h = parseInt((location.hash.match(/step=(\d)/) || [])[1], 10);
    if (h >= 1 && h <= 5) { S.step = h; if (h > S.max) S.max = h; }
    var root = $('#pfStep');
    root.addEventListener('input', onInput); root.addEventListener('change', onInput);
    document.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
    root.addEventListener('focusin', function (e) { var b = e.target.closest('.nwt-input-box'); if (b) { b.classList.add('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.add(f.className.split(' ')[0] + '--focused'); } });
    root.addEventListener('focusout', function (e) { var b = e.target.closest('.nwt-input-box'); if (b) { b.classList.remove('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.remove(f.className.split(' ')[0] + '--focused'); } });
    $('#pfPrev').addEventListener('click', function () { if (S.step > 1) go(S.step - 1); });
    $('#pfNext').addEventListener('click', next);
    $('[data-act="save-draft"]').style.display = EDIT ? 'none' : '';
    initChrome();
    render(true);
    if (restored) toast('Recuperamos tu borrador sin terminar.', 'informative');
  }
  init();
})();
