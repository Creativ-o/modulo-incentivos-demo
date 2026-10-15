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
  var EVENTOS = ['Juegos Intercolegiados Nacionales 2026', 'Juegos Deportivos Nacionales 2026', 'Juegos Paranacionales 2026', 'Campeonato nacional de atletismo 2026', 'Sin evento asociado'];
  var AREAS = ['Dirección de Fomento y Desarrollo', 'Alto rendimiento', 'Viceministerio del Deporte'];
  var GESTORES = ['Isa Pabon', 'Laura Meza', 'Carla Suárez', 'Andrés Polo'];
  var REGIONES = ['Nacional', 'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada']; // Nacional + 32 departamentos + Bogotá D.C.
  /* valor: 1 = tiene valor numérico (se pide valor total); 0 = no se pide valor. cert: 1 = se entrega como certificado digital. */
  var CATEGORIAS = [
    { k: 'bono', l: 'Bono', valor: 1 }, { k: 'beca', l: 'Beca', valor: 1 }, { k: 'kit', l: 'Kit', valor: 1 }, { k: 'transporte', l: 'Transporte', valor: 1 },
    { k: 'inscripcion', l: 'Inscripción', valor: 1 }, { k: 'descuento', l: 'Descuento', valor: 1 }, { k: 'dinero', l: 'Dinero', valor: 1 },
    { k: 'pase', l: 'Pase / acceso', valor: 0 }, { k: 'diploma', l: 'Diploma / reconocimiento', valor: 0, cert: 1 }
  ];
  function catOf(i) { return CATEGORIAS.filter(function (c) { return c.k === i.categoria; })[0] || null; }
  function conValor(i) { var c = catOf(i); return !c || !!c.valor; }
  /* La categoría decide si se pide valor y qué modalidades tienen sentido:
     Diploma / reconocimiento → solo certificado digital; las demás → código o fijo recurrente (no certificado). Sin categoría → ninguna aún. */
  function modsOf(i) { var c = catOf(i); return !c ? [] : (c.cert ? ['certificado'] : ['codigo', 'fijo']); }
  function applyCategoria(inc) {
    var c = catOf(inc); if (!c) return;
    if (!c.valor) inc.valor = '';
    var ok = modsOf(inc);
    if (ok.indexOf(inc.modalidad) < 0) { inc.modalidad = ok[0]; inc.foto = (inc.modalidad === 'codigo'); }
  }
  var FRECUENCIAS = [['mensual', 'Mensual'], ['bimestral', 'Bimestral'], ['trimestral', 'Trimestral'], ['semestral', 'Semestral'], ['otra', 'Otra (definir meses)']];
  var DOC_SUGERIDOS = ['Documento de identidad', 'Certificado de resultado', 'Certificación bancaria', 'Certificado de estudio', 'Autorización del acudiente', 'Certificado médico'];
  var BENEFICIARIOS = [['deportista', 'Deportista'], ['paradeportista', 'Paradeportista'], ['apoyo', 'Personal de apoyo'], ['institucion', 'Institución educativa']];
  var FAMILIAS = { dem: 'Demográficos', geo: 'Geográficos', dep: 'Deportivos', plat: 'Plataforma', aca: 'Académicos' };
  var DEPTOS = REGIONES.slice(1); // mismos departamentos en el constructor de reglas
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
  var OPS_NUM = ['≥', '≤', '=', '≠'];
  var OPS_SEL = [['=', 'es'], ['≠', 'no es'], ['∈', 'es uno de'], ['∉', 'no es ninguno de']];

  /* ── Estado ─────────────────────────────────────────────────── */
  var uid = 0;
  function nextId() { uid += 1; return 'i' + uid; }
  function newCrono() { return { gracia: '3', primer: '', carga: { ini: '', fin: '' }, revision: { ini: '', fin: '' }, asignacion: { ini: '', fin: '' }, motivo: '' }; }
  function newInc() { return { id: nextId(), nombre: '', categoria: '', modalidad: 'codigo', valor: '', cantidad: '', foto: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', plantilla: 'Diploma institucional', grupos: [{ op: 'AND', rows: [] }], doc: { req: false, list: [] }, crono: newCrono() }; }

  var S = {
    step: 1, max: 1, done: false,
    datos: { nombre: '', desc: '', evento: '', area: '', gestor: '', desde: '', hasta: '', activacion: '', cobertura: ['Nacional'], justificacion: '', anexo: null, responsable: '' },
    rubro: { valor: '', tipos: 'uno', n: 2 },
    inc: [newInc()],
    codigos: {},
    activar: 'config'
  };
  var LOG_KEY = 'inc-crono-log-v1';
  var PERSONAS = { admin: ['Danna Arrieta', 'Gestor de incentivos'], gestor: ['Danna Arrieta', 'Gestor de incentivos'], programa: ['Isa Pabon', 'Gestor de programa'], operador: ['Jorge Guzman', 'Operador'] };
  var FASES = [['carga', 'Carga de documentos', 'El beneficiario sube sus soportes'], ['revision', 'Revisión documental', 'El Gestor de programa aprueba o rechaza'], ['asignacion', 'Asignación', 'El Operador entrega el beneficio']];
  var LOG = [];
  var SNAP = null; // foto del programa publicado (modo edición) para detectar versionamiento

  function seedEdit() {
    var i1 = newInc(); i1.nombre = 'Beca educativa · Medallistas de oro'; i1.categoria = 'beca'; i1.modalidad = 'fijo'; i1.valor = '200000000'; i1.cantidad = '200'; i1.frecuencia = 'mensual';
    var i2 = newInc(); i2.nombre = 'Kit deportivo'; i2.categoria = 'kit'; i2.modalidad = 'codigo'; i2.valor = '52500000'; i2.cantidad = '150'; i2.foto = true;
    S.datos = { nombre: 'Becas deportivas medallistas 2026', desc: 'Beca dirigida a deportistas medallistas de los Juegos Nacionales para apoyar su formación profesional.', evento: EVENTOS[1], area: AREAS[0], gestor: 'Isa Pabon', desde: '2026-04-22', hasta: '2026-12-31', activacion: '2026-04-22', cobertura: ['Nacional'], justificacion: 'Resolución 0123 de 2026 del Ministerio del Deporte, que crea el programa de becas para deportistas medallistas de los Juegos Nacionales.', anexo: { name: 'Resolucion-0123-2026.pdf', size: 482000 }, responsable: 'Danna Arrieta · Gestor de incentivos' };
    S.rubro = { valor: '252500000', tipos: 'varios', n: 2 };
    S.inc = [i1, i2];
    i1.grupos = [{ op: 'AND', rows: [{ f: 'edad', op: '≥', v: '18' }, { f: 'categoria', op: '=', v: 'Juvenil' }] }, { op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }];
    i1.doc = { req: true, list: [{ name: 'Documento de identidad', oblig: true }, { name: 'Certificado de resultado', oblig: true }, { name: 'Certificación bancaria', oblig: true }] };
    i1.crono = { gracia: '3', primer: '2026-05-01', carga: { ini: '15', fin: '18' }, revision: { ini: '20', fin: '25' }, asignacion: { ini: '25', fin: '30' }, motivo: '' };
    i2.grupos = [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro'] }] }];
    S.codigos[i2.id] = { modo: 'despues', n: 0 };
    LOG = [{ ts: '22/04/2026 09:14', user: 'Danna Arrieta', rol: 'Gestor de incentivos', ev: 'Creación del cronograma · Beca educativa · Medallistas de oro', det: 'Carga día 15–18 · Revisión día 20–25 · Asignación día 25–30 · Gracia 3 días hábiles', motivo: '—', ip: '190.24.18.07' }];
    try { LOG = (JSON.parse(localStorage.getItem(LOG_KEY)) || []).concat(LOG); } catch (_) {}
    S.step = 1; S.max = 5;
  }

  /* ── Utilidades ─────────────────────────────────────────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$ ' + Number(n || 0).toLocaleString('es-CO'); }
  function money2(n) { return '$ ' + Number(n || 0).toLocaleString('es-CO', { maximumFractionDigits: 2 }); }
  /* Debajo de la cantidad: valor de cada cupo = valor total ÷ cantidad */
  function cupoText(inc) {
    var v = Number(inc.valor) || 0, c = Number(inc.cantidad) || 0, fijo = inc.modalidad === 'fijo', who = fijo ? 'beneficiario' : 'cupo';
    if (!conValor(inc)) return 'Número de cupos de este tipo. No tiene valor monetario.';
    if (v && c) return 'Cada ' + who + (fijo ? ' recibe ' : ' es de ') + money2(v / c) + (fijo ? ' por ciclo' : '');
    return 'Con el valor total y la cantidad se calcula el valor de cada ' + who + '.';
  }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function fmtDate(d) { if (!d) return '—'; var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function incById(id) { return S.inc.filter(function (i) { return i.id === id; })[0]; }
  function hasModalidad(m) { return S.inc.some(function (i) { return i.modalidad === m; }); }
  function isRec(inc) { return inc ? inc.modalidad === 'fijo' : hasModalidad('fijo'); }
  function docOn(inc) { return inc.modalidad === 'fijo' || !!inc.doc.req; }
  function anyDoc() { return S.inc.some(docOn); }
  function fmtDT(v) { if (!v) return '—'; var a = v.split('T'), d = a[0].split('-'); return d[2] + '/' + d[1] + '/' + d[0] + (a[1] ? ' ' + a[1] : ''); }
  function icon(n) { return '<div class="nwt-icon"><i class="naotech-icon-' + n + '"></i></div>'; }

  /* ── Plantillas SDK ─────────────────────────────────────────── */
  function badge(t, theme) { return '<span class="nwt-badge" role="status" nwt-theme="' + (theme || 'neutral') + '" nwt-size="small" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">' + esc(t) + '</div></div></span>'; }
  function alertBox(msg, theme, ic) { return '<div class="nwt-alert nwt-alert--visible" nwt-theme="' + (theme || 'informative') + '" nwt-variant="quiet"><div class="nwt-alert__content"><div class="nwt-alert__icon">' + icon(ic || 'info') + '</div><span class="nwt-alert__label">' + msg + '</span></div></div>'; }
  function btn(label, act, o) {
    o = o || {};
    return '<button type="button" class="nwt-button" nwt-variant="' + (o.v || 'quiet') + '" nwt-size="' + (o.s || 'small') + '" data-act="' + act + '"' + (o.d != null ? ' data-i="' + esc(o.d) + '"' : '') + (o.x != null ? ' data-x="' + esc(o.x) + '"' : '') + '><span class="nwt-button__content">' + (o.i ? icon(o.i) : '') + label + '</span></button>';
  }
  function iconBtn(ic, act, label, d, x) { return '<span class="nwt-icon-button" nwt-variant="mute" nwt-size="small"><button type="button" class="nwt-icon-button__content" aria-label="' + esc(label) + '" data-act="' + act + '"' + (d != null ? ' data-i="' + esc(d) + '"' : '') + (x != null ? ' data-x="' + esc(x) + '"' : '') + '>' + icon(ic) + '</button></span>'; }
  function inputBox(label, req, control, hint, k, cls) {
    return '<div class="nwt-input-box' + (cls ? ' ' + cls : '') + '" data-box="' + esc(k || '') + '"><div class="nwt-input-box__content">' +
      (label ? '<label class="nwt-input-box__label">' + esc(label) + (req ? '<span class="nwt-input-box__required">*</span>' : '') + '</label>' : '') +
      '<div class="nwt-input-box__control">' + control + '</div>' +
      (hint ? '<div class="nwt-input-box__message"><span>' + esc(hint) + '</span></div>' : '') +
      '</div></div>';
  }
  function tf(o) {
    var control = (o.ico ? icon(o.ico) : '') + (o.pre ? '<span class="pf-pre">' + esc(o.pre) + '</span>' : '') + '<input class="nwt-text-field__input" type="' + (o.type || 'text') + '" data-k="' + esc(o.k) + '" value="' + esc(o.val) + '" placeholder="' + esc(o.ph || '') + '"' + (o.mode ? ' inputmode="' + o.mode + '"' : '') + (o.ro ? ' readonly tabindex="-1"' : '') + '/>';
    return '<div class="nwt-text-field' + (o.ro ? ' nwt-text-field--readonly' : '') + (o.ico || o.pre ? ' pf-tf-ico' : '') + '" nwt-size="medium">' + inputBox(o.label, o.req, control, o.hint, o.k, o.ro ? 'nwt-input-box--disabled pf-ro-box' : '') + '</div>';
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
        return '<label class="nwt-radio-group__option' + (on ? ' nwt-radio-group__option--selected' : '') + (op.dis ? ' nwt-radio-group__option--disabled' : '') + '"' + (op.dis ? ' aria-disabled="true" title="' + esc(op.why || 'No disponible') + '" data-x="' + esc(op.v) + '"' : ' data-act="' + o.act + '"' + (o.d ? ' data-i="' + esc(o.d) + '"' : '') + ' data-x="' + esc(op.v) + '"') + '>' +
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
        tf({ label: 'Responsable', k: 'datos.responsable', val: d.responsable, ro: 1, ico: 'user', hint: 'Se asigna automáticamente: es quien parametriza el programa.' }) +
        sel({ label: 'Área responsable', req: 1, k: 'datos.area', val: d.area, ph: 'Selecciona el área', opts: AREAS, hint: 'Área del Ministerio dueña del programa.' }) +
        '<div class="pf-span2">' + sel({ label: 'Evento / categoría asociado', k: 'datos.evento', val: d.evento, ph: 'Selecciona un evento', opts: EVENTOS, hint: 'Útil para reportería. Un programa puede existir sin evento.' }) + '</div>' +
      '</div>', { n: 1 }) +
      card('Gestor de programa', 'Quien revisa documentación y entrega beneficios. Solo verá y gestionará los programas que tiene a cargo.', '<div class="pf-grid">' +
        sel({ label: 'Gestor de programa asignado', req: 1, k: 'datos.gestor', val: d.gestor, ph: 'Asigna un gestor', opts: GESTORES }) +
        '<div>' + alertBox('El Gestor de programa <b>solo lee</b> las condiciones.', 'informative') + '</div>' +
      '</div>', { n: 2 }) +
      card('Vigencia y activación', 'Al cumplirse la fecha de fin el programa se inactiva solo.', '<div class="pf-grid">' +
        tf({ label: 'Vigencia desde', req: 1, type: 'date', k: 'datos.desde', val: d.desde }) +
        tf({ label: 'Vigencia hasta', req: 1, type: 'date', k: 'datos.hasta', val: d.hasta }) +
        tf({ label: 'Fecha de activación', type: 'date', k: 'datos.activacion', val: d.activacion, hint: 'Opcional. Si la dejas vacía, activas manualmente en el paso final.' }) +
        '<div class="pf-ro"><div><span class="pf-label">Estado inicial</span>' + badge('Configuración', 'caution') + '</div></div>' +
        '<div class="pf-span2"><div class="nwt-dropdown pf-ms" id="pfCob" nwt-size="medium">' + cobInner() + '</div></div>' +
      '</div>', { n: 3 }) +
      card('Soporte del programa', 'Acto administrativo que respalda el programa. Es opcional.', '<div class="pf-inc">' +
        ta({ label: 'Justificación / acto administrativo', k: 'datos.justificacion', val: d.justificacion, rows: 3, ph: 'Resolución / acto administrativo que soporta el programa...' }) +
        '<div id="pfAnexo">' + anexoInner() + '</div></div>', { n: 4 }) + '</div>';
  }

  /* ── Documentación de la resolución (carga opcional; simula progreso como en la demo original) ── */
  var ANEXO_OK = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'], ANEXO_MAX = 10 * 1024 * 1024, anexoUp = null, anexoTimer = null;
  function fmtSize(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function anexoInner() {
    var a = S.datos.anexo, up = anexoUp;
    var name = up ? up.name : (a ? a.name : '');
    var control = '<div class="nwt-file-field__content"><div class="nwt-file-field__icon">' + icon('attach') + '</div>' +
      '<input class="nwt-file-field__picker" id="pfAnexoInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"/>' +
      '<input class="nwt-file-field__display" type="text" readonly placeholder="Sin archivo adjunto" value="' + esc(name) + '"/>' +
      '<div class="nwt-file-field__button">' + icon('upload') + '</div></div>';
    var out = '<div class="nwt-file-field" nwt-size="medium">' + inputBox('Documentación de la resolución', false, control, 'Opcional · PDF, DOC, DOCX, JPG, PNG · máx 10 MB', 'datos.anexo') + '</div>';
    if (up) out += '<div class="pf-anexo"><div class="nwt-progress-bar" role="progressbar" aria-valuenow="' + up.pct + '" aria-valuemin="0" aria-valuemax="100" nwt-size="medium"><div class="nwt-progress-bar__track"><div class="nwt-progress-bar__fill" style="width:' + up.pct + '%"></div></div></div><span class="pf-hint">Subiendo ' + esc(up.name) + '… ' + up.pct + '%</span></div>';
    else if (a) out += '<div class="pf-anexo pf-anexo--row">' + badge('Cargado', 'positive') + '<span class="pf-hint">' + esc(a.name) + ' · ' + fmtSize(a.size) + '</span>' + btn('Quitar', 'anexo-del', { v: 'mute', i: 'delete' }) + '</div>';
    return out;
  }
  function anexoRedraw() { var el = $('#pfAnexo'); if (el) el.innerHTML = anexoInner(); }
  function anexoStart(f) {
    var ext = (f.name.split('.').pop() || '').toLowerCase();
    if (ANEXO_OK.indexOf(ext) < 0 || f.size > ANEXO_MAX) { toast('Archivo no válido: usa PDF, DOC, DOCX, JPG o PNG de hasta 10 MB.', 'negative'); return; }
    if (anexoTimer) clearInterval(anexoTimer);
    anexoUp = { name: f.name, pct: 0 }; S.datos.anexo = null; anexoRedraw();
    anexoTimer = setInterval(function () {
      anexoUp.pct = Math.min(100, anexoUp.pct + Math.round(6 + Math.random() * 10));
      if (anexoUp.pct >= 100) { clearInterval(anexoTimer); anexoTimer = null; S.datos.anexo = { name: f.name, size: f.size }; anexoUp = null; saveDraft(true); }
      anexoRedraw();
    }, 120);
  }

  /* ── Cobertura territorial: dropdown con multiselección (composición SDK: nwt-dropdown + opciones con checkbox) ── */
  var cobOpen = false, cobQuery = '';
  function norm(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function cobOptsHTML() {
    var sel = S.datos.cobertura, q = norm(cobQuery.trim()), nac = sel.indexOf('Nacional') > -1;
    var list = REGIONES.filter(function (r) { return !q || norm(r).indexOf(q) > -1; });
    if (!list.length) return '<li class="nwt-dropdown__option nwt-dropdown__option--empty"><span>Sin resultados</span></li>';
    return list.map(function (r) {
      var on = sel.indexOf(r) > -1, off = nac && r !== 'Nacional'; // «Nacional» ya los incluye a todos
      return '<li class="nwt-dropdown__option' + (off ? ' nwt-dropdown__option--disabled' : '') + '" role="option" aria-selected="' + on + '"' + (off ? ' aria-disabled="true" title="Incluido en «Nacional»"' : ' data-act="cob-opt" data-x="' + esc(r) + '"') + '><span class="nwt-dropdown__option-checkbox' + (on ? ' nwt-dropdown__option-checkbox--selected' : '') + '">' + (on ? icon('positive') : '') + '</span><span>' + esc(r) + '</span></li>';
    }).join('');
  }
  function cobInner() {
    var sel = S.datos.cobertura;
    var chips = sel.map(function (r) {
      return '<span class="nwt-tag nwt-tag--active" nwt-size="small">' + esc(r) + '<span class="pf-ms__x" role="button" aria-label="Quitar ' + esc(r) + '" data-act="cob-del" data-x="' + esc(r) + '">' + icon('close') + '</span></span>';
    }).join('') || '<span class="pf-ms__ph">Selecciona Nacional o uno o varios departamentos</span>';
    var control = '<div class="nwt-dropdown__content pf-ms__content" role="combobox" tabindex="0" aria-expanded="' + cobOpen + '" data-act="cob-toggle"><div class="pf-ms__chips">' + chips + '</div><div class="nwt-dropdown__chevron pf-ms__chev' + (cobOpen ? ' nwt-dropdown__chevron--open' : '') + '">' + icon('chevron-down') + '</div></div>';
    var list = cobOpen ? '<div class="nwt-dropdown__list pf-ms__list"><div class="pf-ms__search">' + icon('search') + '<input class="pf-ms__q" type="text" autocomplete="off" placeholder="Buscar departamento" value="' + esc(cobQuery) + '" aria-label="Buscar departamento"/></div><ul class="nwt-dropdown__options" id="pfCobOpts">' + cobOptsHTML() + '</ul></div>' : '';
    return inputBox('Cobertura territorial', false, control, '«Nacional» incluye todos los departamentos. Quítalo para elegir departamentos específicos.', 'datos.cobertura') + list;
  }
  function cobRedraw() {
    var el = $('#pfCob'); if (!el) return;
    el.classList.toggle('nwt-dropdown--open', cobOpen);
    el.innerHTML = cobInner();
    if (cobOpen) cobPlace(el);
  }
  /* La lista nunca puede tapar el pie ni salirse del área visible: se abre hacia donde haya espacio y limita su alto. */
  function cobPlace(el) {
    var list = el.querySelector('.pf-ms__list'), ctl = el.querySelector('.nwt-dropdown__content'), opts = list && list.querySelector('.nwt-dropdown__options');
    if (!list || !ctl) return;
    var sc = $('#pfScroll'), foot = $('.pf-footer'), head = $('#pfHead');
    var GAP = 6, NEED = 200;
    function room() {
      var c = ctl.getBoundingClientRect();
      return { below: foot.getBoundingClientRect().top - c.bottom - GAP * 2, above: c.top - head.getBoundingClientRect().bottom - GAP * 2 };
    }
    var r = room(), cr0 = ctl.getBoundingClientRect();
    var visible = cr0.top >= head.getBoundingClientRect().bottom && cr0.bottom <= foot.getBoundingClientRect().top;
    if (!visible || Math.max(r.below, r.above) < NEED) { // fuera de vista o con poco espacio: se centra el control en el área visible
      ctl.scrollIntoView({ block: 'center' }); r = room();
    }
    var up = r.below < NEED && r.above > r.below, avail = Math.max(120, Math.min(300, (up ? r.above : r.below) - 16));
    opts.style.maxHeight = Math.max(100, avail - 52) + 'px';
    var e = el.getBoundingClientRect(), c = ctl.getBoundingClientRect();
    list.classList.toggle('pf-ms__list--up', up);
    if (up) { list.style.top = 'auto'; list.style.bottom = (e.bottom - c.top + GAP) + 'px'; }
    else { list.style.bottom = 'auto'; list.style.top = (c.bottom - e.top + GAP) + 'px'; }
  }
  function cobSet(r) {
    var c = S.datos.cobertura.slice();
    if (r === 'Nacional') c = c.indexOf('Nacional') > -1 ? [] : ['Nacional']; // marcar Nacional reemplaza todo; desmarcarla libera los departamentos
    else { if (c.indexOf('Nacional') > -1) return; var i = c.indexOf(r); if (i > -1) c.splice(i, 1); else c.push(r); }
    S.datos.cobertura = c; cobRedraw(); saveDraft(true);
    var box = document.querySelector('[data-box="datos.cobertura"]'); if (box && c.length) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
  }

  /* Cantidad de tipos definida en el paso 2 → tarjetas del paso 3 */
  function tiposObjetivo() { return S.rubro.tipos === 'uno' ? 1 : Math.max(2, Math.min(10, parseInt(S.rubro.n, 10) || 2)); }
  function syncInc() {
    var t = tiposObjetivo(), removed = 0;
    if (S.rubro.tipos !== 'uno') S.rubro.n = t;
    while (S.inc.length < t) S.inc.push(newInc());
    while (S.inc.length > t) { var x = S.inc.pop(); if (x.nombre || x.valor || x.cantidad) removed++; }
    if (removed) toast('Se quitaron ' + removed + (removed > 1 ? ' tipos que ya tenían datos.' : ' tipo que ya tenía datos.'), 'caution');
  }

  /* ── Paso 2 · Rubro ─────────────────────────────────────────── */
  function step2() {
    var r = S.rubro, varios = r.tipos !== 'uno', n = tiposObjetivo();
    var nOpts = []; for (var i = 2; i <= 10; i++) nOpts.push(String(i));
    var hint = varios
      ? alertBox('El rubro se repartirá en <b>' + n + ' tipos</b> de incentivos.', 'informative')
      : alertBox('Todo el rubro se destinará a este <b>único tipo</b> de incentivo. Si necesitas más de uno, cambia a <b>Varios tipos</b>.', 'informative');
    return '<div class="pf-sec">' + head('Rubro', 'Monto que el Ministerio destina al programa y en cuántos tipos de incentivo se reparte. Se descuenta con cada entrega. <b>La fuente presupuestal no se solicita</b>.') +
      card('Presupuesto total', '', '<div class="pf-inc">' +
        '<div class="pf-grid">' + tf({ label: 'Presupuesto total del programa (COP)', k: 'rubro.valor', val: r.valor ? Number(r.valor).toLocaleString('es-CO') : '', ph: '0', mode: 'numeric', pre: '$', hint: 'Monto asignado por el Ministerio; se descuenta por cada asignación.' }) + '</div>' +
        alertBox('Con presupuesto, el sistema calcula <b>inicial, ejecutado y disponible</b> en tiempo real, bloquea asignaciones cuando llega a cero y reintegra el saldo al revertir una entrega.', 'informative') +
      '</div>', { n: 1 }) +
      card('Tipos de incentivo', 'Define cuántos tipos de incentivo tendrá el programa. Cada uno se parametriza en el paso 3.', '<div class="pf-inc">' +
        radios({ act: 'rubro-tipos', value: r.tipos, dir: 'horizontal', options: [
          { v: 'uno', l: 'Un solo tipo de incentivo', s: 'Todo el rubro va a la misma categoría (ej. solo becas educativas).' },
          { v: 'varios', l: 'Varios tipos', s: 'Divide el rubro entre varias categorías (becas + kits + bonos).' }
        ] }) +
        (varios ? '<div class="pf-grid">' + sel({ label: '¿Cuántos tipos de incentivo?', k: 'rubro.n', val: String(n), opts: nOpts, attrs: ' data-struct="1"', hint: 'Entre 2 y 10. Es la cantidad de tarjetas que verás en el paso 3.' }) + '</div>' : '') +
        hint +
      '</div>', { n: 2 }) + '</div>';
  }

  /* ── Paso 3 · Tipos ─────────────────────────────────────────── */
  function incCard(inc, idx) {
    var m = inc.modalidad, k = 'inc.' + inc.id + '.';
    var ALL_MODS = [
      { v: 'codigo', l: 'Entrega única con código', s: 'Bono, kit, beca… Cada código es único y equivale a una unidad entregable.' },
      { v: 'certificado', l: 'Certificado digital / reconocimiento', s: 'Entrega única sin código: PDF con firma digital y QR de verificación.' },
      { v: 'fijo', l: 'Incentivo fijo recurrente', s: 'Apoyo periódico de sostenimiento. Sin código; exige documentación previa.' }
    ];
    var cv = conValor(inc), allowed = modsOf(inc), cat = catOf(inc);
    var mod = radios({ label: 'Modalidad', act: 'inc-modalidad', d: inc.id, value: m, dir: 'horizontal', options: ALL_MODS.map(function (o) {
      var dis = allowed.indexOf(o.v) < 0;
      return { v: o.v, l: o.l, s: o.s, dis: dis, why: !cat ? 'Selecciona primero la categoría' : (o.v === 'certificado' ? 'El certificado solo aplica a la categoría Diploma / reconocimiento' : 'No aplica a ' + cat.l) };
    }) }) + (cat ? '' : '<p class="pf-hint">Selecciona primero la categoría para elegir la modalidad.</p>');
    var extra = '';
    if (m === 'codigo') {
      extra = alertBox('Los códigos se cargan en el paso 5 o después, y no se pueden eliminar si ya registran entregas.', 'informative');
    } else if (m === 'certificado') {
      extra = '<div class="pf-grid">' + sel({ label: 'Plantilla institucional del certificado', k: k + 'plantilla', val: inc.plantilla, opts: ['Diploma institucional', 'Reconocimiento al mérito deportivo'] }) +
        '<div>' + alertBox('Incluye firma digital y <b>código QR</b> de verificación.', 'caution', 'attention') + '</div></div>';
    } else {
      extra = '<div class="pf-grid">' + sel({ label: 'Frecuencia de recurrencia', req: 1, k: k + 'frecuencia', val: inc.frecuencia, opts: FRECUENCIAS, attrs: ' data-struct="1"' }) +
        (inc.frecuencia === 'otra' ? '<div class="pf-grid" style="grid-template-columns:1fr 1fr">' + tf({ label: 'Cada', req: 1, type: 'number', k: k + 'frecuenciaN', val: inc.frecuenciaN, ph: '2' }) + sel({ label: 'Unidad', k: k + 'frecuenciaU', val: inc.frecuenciaU, opts: ['días', 'semanas', 'meses'] }) + '</div>' : '<div></div>') + '</div>' +
        alertBox('No requiere código y <b>exige registro y aprobación documental previa</b>.', 'informative');
    }
    var foto = '<div class="pf-switch-row">' + toggle(inc.foto, 'inc-foto', inc.id) + '<span>Exige fotografía de evidencia en la entrega</span></div>';
    var cantLabel = m === 'codigo' ? 'Cantidad / stock de códigos' : (m === 'fijo' ? 'Cantidad de beneficiarios' : 'Cantidad');
    var valorLabel = m === 'fijo' ? 'Valor total por ciclo' : 'Valor total';
    var n = S.inc.length;
    return '<div class="nwt-card" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body">' +
      '<div class="nwt-card__header"><div class="pf-card-head-row"><h3 class="pf-card-title"><span class="pf-num">' + (idx + 1) + '</span>Tipo de incentivo #' + (idx + 1) + (n > 1 ? ' de ' + n : '') + '</h3></div></div>' +
      '<div class="nwt-card__content"><div class="pf-inc">' +
        '<div class="pf-grid">' +
          tf({ label: 'Nombre', req: 1, k: k + 'nombre', val: inc.nombre, ph: 'Ej. Beca educativa · Medallistas de oro' }) +
          sel({ label: 'Categoría', req: 1, k: k + 'categoria', val: inc.categoria, ph: 'Selecciona categoría', opts: CATEGORIAS.map(function (c) { return [c.k, c.l]; }), attrs: ' data-struct="1"', hint: inc.categoria ? (cv ? 'Con valor numérico: se pide el valor total.' : 'Sin valor monetario: no se pide valor.') : '' }) +
        '</div>' +
      '<div class="pf-modal-box">' + mod + extra + '</div>' +
      '<div class="pf-grid">' +
        (cv ? tf({ label: valorLabel, req: 1, k: k + 'valor', val: inc.valor ? Number(inc.valor).toLocaleString('es-CO') : '', ph: '0', mode: 'numeric', pre: '$', hint: m === 'fijo' ? 'Monto total que se paga en cada ciclo a todos los beneficiarios.' : 'Monto total destinado a este tipo de incentivo.' }) : '') +
        tf({ label: cantLabel, k: k + 'cantidad', val: inc.cantidad, ph: '0', mode: 'numeric', hint: cupoText(inc) }) +
            '</div>' + foto + '</div></div><div class="nwt-card__footer"></div></div></div>';
  }
  function step3() {
    var n = S.inc.length;
    return '<div class="pf-sec">' + head('Tipos de incentivo', 'Para cada tipo define su <b>nombre y categoría</b> (la categoría decide si lleva valor numérico), la <b>modalidad</b>, la cantidad y si exige foto de evidencia.') +
      '<div class="pf-types-bar">' + alertBox(n === 1 ? 'Este programa tiene <b>un solo tipo</b> de incentivo, definido en el paso 2.' : 'Este programa tiene <b>' + n + ' tipos</b> de incentivo, definidos en el paso 2.', 'informative', 'categories') + btn('Cambiar en el paso 2', 'goto', { v: 'quiet', s: 'medium', x: '2', i: 'edit' }) + '</div>' +
      '<div id="pfIncs" class="pf-sec">' + S.inc.map(incCard).join('') + '</div>' +
      '<div id="pfDist"></div></div>';
  }
  function totalCupo() { return S.inc.reduce(function (a, i) { return a + (Number(i.cantidad) || 0); }, 0); }
  function updateDist() {
    var host = $('#pfDist'); if (!host) return;
    var total = S.inc.reduce(function (a, i) { return a + (Number(i.valor) || 0); }, 0); // el valor de cada tipo ya es su total
    var cupo = totalCupo(), rub = Number(S.rubro.valor) || 0;
    var cupoTxt = cupo ? ' · cupo de <b>' + cupo.toLocaleString('es-CO') + ' entregas</b>' : '';
    var recTxt = hasModalidad('fijo') ? ' (los recurrentes cuentan un ciclo)' : '';
    if (!total && !cupo) { host.innerHTML = ''; return; }
    if (!rub) { host.innerHTML = alertBox((total ? 'Distribución: <b>' + money(total) + '</b> entre los tipos' + recTxt : 'Sin valor monetario') + cupoTxt + '. Define un presupuesto en el paso 2 para compararla.', 'informative'); return; }
    host.innerHTML = total > rub ? alertBox('La distribución <b>' + money(total) + '</b> supera el presupuesto <b>' + money(rub) + '</b> en ' + money(total - rub) + recTxt + cupoTxt + '.', 'negative', 'attention')
      : alertBox('Distribuido <b>' + money(total) + '</b> de <b>' + money(rub) + '</b> · disponible ' + money(rub - total) + recTxt + cupoTxt + '.', 'positive', 'positive');
  }

  /* ── Paso 4 · Condiciones, documentación y etapas — POR TIPO DE INCENTIVO ───────── */
  function famInUse(inc) {
    var u = {}; inc.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (FIELDS[r.f]) u[FIELDS[r.f].fam] = 1; }); }); return u;
  }
  function fieldGroups(cur) {
    return Object.keys(FAMILIAS).map(function (fam) {
      return '<optgroup label="' + FAMILIAS[fam] + '">' + Object.keys(FIELDS).filter(function (k) { return FIELDS[k].fam === fam; }).map(function (k) { return '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + FIELDS[k].label + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  }
  function ruleRow(inc, gi, ri, r) {
    var f = FIELDS[r.f], key = inc.id + '.' + gi + '.' + ri, multi = r.op === '∈' || r.op === '∉';
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
        if (multi) {
          var arr = Array.isArray(r.v) ? r.v : [];
          val = '<div>' + (ri === 0 ? '<span class="pf-label">Valores</span>' : '') + '<div class="pf-rule__chips">' + f.opts.map(function (o) { return tag(o, arr.indexOf(o) > -1, 'rule-multi', key, o); }).join('') + '</div></div>';
        } else {
          val = sel({ label: ri === 0 ? 'Valor' : '', k: 'rule.' + key + '.v', val: Array.isArray(r.v) ? '' : r.v, ph: 'Selecciona', opts: f.opts });
        }
      }
    } else { opSel = '<div></div>'; val = '<div></div>'; }
    return '<div class="pf-rule">' + fieldSel + opSel + val + '<div>' + iconBtn('close', 'rule-del', 'Quitar condición', inc.id, gi + '.' + ri) + '</div></div>';
  }
  /* Lenguaje natural de una condición (null si está incompleta) */
  function listaO(v) { return v.length > 1 ? v.slice(0, -1).join(', ') + ' o ' + v[v.length - 1] : v[0]; }
  function ruleNat(r) {
    var f = FIELDS[r.f]; if (!f) return null;
    var v = r.v;
    if (f.type === 'num') {
      if (v === '' || v == null) return null;
      return r.op === '≥' ? 'Edad de ' + v + ' años o más' : r.op === '≤' ? 'Edad de ' + v + ' años o menos' : r.op === '≠' ? 'Edad distinta de ' + v + ' años' : 'Edad de ' + v + ' años';
    }
    if (r.op === '∈' || r.op === '∉') { if (!Array.isArray(v) || !v.length) return null; return f.label + (r.op === '∈' ? ' es ' : ' no es ') + (r.op === '∈' ? '' : 'ninguno de: ') + listaO(v); }
    if (v === '' || v == null || Array.isArray(v)) return null;
    return f.label + (r.op === '≠' ? ' no es ' : ' es ') + v;
  }
  function previewText(inc) {
    var gs = inc.grupos.map(function (g) {
      var t = g.rows.map(ruleNat).filter(Boolean).map(esc);
      return t.length ? t.join(g.op === 'AND' ? ' <em>y</em> ' : ' <em>o</em> ') : null;
    }).filter(Boolean);
    if (!gs.length) return null;
    return gs.length === 1 ? gs[0] : gs.map(function (s) { return '(' + s + ')'; }).join(' <em>o bien</em> ');
  }
  function previewHTML(inc) {
    var t = previewText(inc);
    return t ? 'Podrá recibirlo quien cumpla: ' + t + '.' : '<em>Sin condiciones: cualquier persona podrá acceder a este incentivo.</em>';
  }
  /* Grupos plegables: solo el Grupo 1 arranca abierto. Es estado de pantalla, no del programa. */
  var grpOpen = {};
  function isGrpOpen(id, gi) { var k = id + ':' + gi; return k in grpOpen ? grpOpen[k] : gi === 0; }
  function grpShift(id, gi, n) { // al quitar el grupo gi, los siguientes conservan su estado
    for (var i = gi; i < n; i++) { var nx = id + ':' + (i + 1); if (nx in grpOpen) grpOpen[id + ':' + i] = grpOpen[nx]; else delete grpOpen[id + ':' + i]; }
    delete grpOpen[id + ':' + n];
  }
  function groupSummary(g) {
    var t = g.rows.map(ruleNat).filter(Boolean).map(esc);
    return t.length ? t.join(g.op === 'AND' ? ' <em>y</em> ' : ' <em>o</em> ') : '<span class="pf-hint" style="display:inline">Sin condiciones</span>';
  }
  function groupsHTML(inc) {
    var used = famInUse(inc), id = inc.id;
    return '<div class="pf-families">' + Object.keys(FAMILIAS).map(function (f) { return '<span class="nwt-tag' + (used[f] ? ' nwt-tag--active' : '') + '" nwt-size="small">' + FAMILIAS[f] + '</span>'; }).join('') + '</div>' +
      inc.grupos.map(function (g, gi) {
        var open = isGrpOpen(id, gi);
        return (gi > 0 ? '<div class="pf-or">— O —</div>' : '') + '<div class="pf-group' + (open ? '' : ' pf-group--closed') + '"><div class="pf-group__head">' +
          '<button type="button" class="pf-group__toggle" data-act="grp-toggle" data-i="' + id + '" data-x="' + gi + '" aria-expanded="' + open + '">' +
            '<span class="pf-group__chev' + (open ? ' is-open' : '') + '">' + icon('chevron-down') + '</span><span class="pf-group__label">Grupo ' + (gi + 1) + '</span>' +
            (open ? '' : '<span class="pf-group__sum">' + groupSummary(g) + '</span>') + '</button>' +
          (open ? tag('Todas deben cumplirse (Y)', g.op === 'AND', 'grp-op', id, gi + ':AND') + tag('Basta una (O)', g.op === 'OR', 'grp-op', id, gi + ':OR') : '') +
          (open ? '<span style="flex:1"></span>' : '') + (inc.grupos.length > 1 ? btn('Quitar grupo', 'grp-del', { v: 'mute', d: id, x: gi, i: 'delete' }) : '') + '</div>' +
          (open ? g.rows.map(function (r, ri) { return ruleRow(inc, gi, ri, r); }).join('') + btn('Añadir condición', 'rule-add', { d: id, x: gi, i: 'add' }) : '') + '</div>';
      }).join('') +
      '<div>' + btn('Agregar grupo alternativo (O)', 'grp-add', { d: id, i: 'add' }) + '</div>' +
      '<div><span class="pf-label">Así se leerá la regla</span><div class="pf-preview" id="pfPreview-' + id + '">' + previewHTML(inc) + '</div></div>';
  }
  function docsHTML(inc) {
    var d = inc.doc, forced = isRec(inc), id = inc.id;
    var out = '<div class="pf-switch-row">' + (forced ? toggle(true, 'noop') : toggle(d.req, 'doc-req', id)) + '<span>¿Este tipo de incentivo pide documentos al beneficiario?' + (forced ? ' <b>Sí (obligatorio en el recurrente)</b>' : '') + '</span></div>';
    if (!docOn(inc)) return out + alertBox('<b>Flujo directo:</b> sin postulación ni cargue de documentos. El beneficiario elegible queda habilitado para que el Operador le asigne el incentivo.', 'informative');
    out += alertBox('<b>Con postulación documental:</b> el beneficiario carga soportes (PDF, JPG, PNG) en la ventana de fechas, el Gestor de programa los revisa y solo con <b>Documentación aprobada</b> el Operador puede asignar.', 'informative');
    out += '<div><span class="pf-label">Documentos que pide</span><div class="pf-sec" style="gap:8px">' + (d.list.length ? d.list.map(function (x, i) {
      return '<div class="pf-doc"><span class="pf-doc__name">' + esc(x.name) + '</span>' + checkbox('Obligatorio', x.oblig, 'doc-oblig', id, i) + iconBtn('close', 'doc-del', 'Quitar documento', id, i) + '</div>';
    }).join('') : '<p class="pf-hint">Agrega al menos un documento obligatorio.</p>') + '</div></div>';
    out += '<div class="pf-row">' + DOC_SUGERIDOS.filter(function (n) { return !d.list.some(function (x) { return x.name === n; }); }).map(function (n) { return tag('+ ' + n, false, 'doc-add-s', id, n); }).join('') + '</div>';
    out += '<div class="pf-add">' + tf({ label: 'Otro documento', k: 'ui.docNuevo.' + id, val: '', ph: 'Nombre del documento' }) + btn('Agregar', 'doc-add', { v: 'quiet', s: 'medium', d: id, i: 'add' }) + '</div>';
    return out;
  }

  /* ── Etapas / cronograma por tipo (HU-06): recurrente → días de cada ciclo; si no, ventana con fechas ── */
  function frecuenciaTxt(inc) { return inc.frecuencia === 'otra' ? 'cada ' + (inc.frecuenciaN || '?') + ' ' + (inc.frecuenciaU || 'meses') : inc.frecuencia; }
  function cronoSummary(inc) {
    var c = inc.crono, rec = isRec(inc);
    return FASES.map(function (f) { return f[1] + ' ' + (rec ? 'día ' + c[f[0]].ini + '–' + c[f[0]].fin : fmtDT(c[f[0]].ini) + ' → ' + fmtDT(c[f[0]].fin)); }).join(' · ') + ' · Gracia ' + c.gracia + ' días hábiles';
  }
  function cronoBlock(inc) {
    var rec = isRec(inc), c = inc.crono, id = inc.id, kk = 'crono.' + id + '.';
    var rows = FASES.map(function (f, i) {
      var k = f[0];
      return '<div class="pf-phase"><div class="pf-phase__head"><span class="pf-num">' + (i + 1) + '</span><div><b>' + f[1] + '</b><p class="pf-hint">' + f[2] + '</p></div></div><div class="pf-grid">' +
        (rec ? tf({ label: 'Desde el día del ciclo', req: 1, type: 'number', k: kk + k + '.ini', val: c[k].ini, ph: '1' }) + tf({ label: 'Hasta el día del ciclo', req: 1, type: 'number', k: kk + k + '.fin', val: c[k].fin, ph: '30' })
          : tf({ label: 'Inicio', req: 1, type: 'datetime-local', k: kk + k + '.ini', val: c[k].ini }) + tf({ label: 'Cierre', req: 1, type: 'datetime-local', k: kk + k + '.fin', val: c[k].fin })) +
      '</div></div>';
    }).join('');
    var top = '<div class="pf-grid">' + (rec ? tf({ label: 'Inicio del primer ciclo', req: 1, type: 'date', k: kk + 'primer', val: c.primer, hint: 'Desde esta fecha corre la frecuencia del incentivo.' }) : '<div></div>') +
      sel({ label: 'Plazo de gracia para subsanar', k: kk + 'gracia', val: c.gracia, opts: [['3', '3 días hábiles'], ['4', '4 días hábiles'], ['5', '5 días hábiles']], hint: 'Excluye sábados, domingos y festivos de Colombia.' }) + '</div>';
    var note = rec ? alertBox('Estas etapas se <b>repiten en cada ciclo</b> (' + frecuenciaTxt(inc) + '). El Gestor de programa puede ajustarlas; cada cambio queda auditado.', 'informative', 'calendar')
      : alertBox('Fuera de la ventana de cargue se bloquea la postulación, salvo <b>habilitación excepcional</b>. El Gestor de programa puede ajustarla; cada cambio queda auditado.', 'informative', 'calendar');
    return '<div class="pf-subsec"><h4 class="pf-sub">' + (rec ? 'Etapas de cada ciclo' : 'Ventana de cargue') + '</h4>' + note + top + rows + '<div id="pfCronoChg-' + id + '">' + cronoChgHTML(inc) + '</div></div>';
  }
  function cronoChanges(inc) {
    if (!SNAP) return [];
    var s = SNAP.inc.filter(function (x) { return x.id === inc.id; })[0]; if (!s) return [];
    var out = [], a = s.crono, b = inc.crono, rec = isRec(inc);
    FASES.forEach(function (f) { ['ini', 'fin'].forEach(function (w) { if (a[f[0]][w] !== b[f[0]][w]) out.push({ campo: f[1] + (w === 'ini' ? ' · inicio' : ' · cierre'), antes: rec ? 'día ' + a[f[0]][w] : fmtDT(a[f[0]][w]), despues: rec ? 'día ' + b[f[0]][w] : fmtDT(b[f[0]][w]) }); }); });
    if (a.gracia !== b.gracia) out.push({ campo: 'Plazo de gracia', antes: a.gracia + ' días hábiles', despues: b.gracia + ' días hábiles' });
    if (rec && a.primer !== b.primer) out.push({ campo: 'Inicio del primer ciclo', antes: fmtDate(a.primer), despues: fmtDate(b.primer) });
    return out;
  }
  function allCronoChanges() { return S.inc.map(function (i) { return { inc: i, changes: cronoChanges(i) }; }).filter(function (x) { return x.changes.length; }); }
  function cronoChgHTML(inc) {
    if (!EDIT) return '';
    var ch = cronoChanges(inc);
    if (!ch.length) return '<p class="pf-hint">Sin cambios en las etapas. Si ajustas una fecha, deberás indicar el motivo y quedará en la bitácora.</p>';
    return alertBox('Cambios a las etapas (<b>no generan versión</b>, quedan en la bitácora): ' + ch.map(function (x) { return esc(x.campo) + ' <b>' + esc(x.antes) + ' → ' + esc(x.despues) + '</b>'; }).join(' · '), 'caution', 'attention') +
      ta({ label: 'Motivo del cambio', req: 1, k: 'crono.' + inc.id + '.motivo', val: inc.crono.motivo, rows: 2, ph: 'Ej. Ampliación por solicitud de la federación (Res. 123)', hint: 'Obligatorio. Se guarda con usuario, rol, fecha, hora e IP.' });
  }
  function logCard() {
    if (!EDIT) return '';
    var rows = LOG.map(function (l) {
      return '<div class="pf-log"><div class="pf-log__top"><b>' + esc(l.ev) + '</b><span class="pf-hint">' + esc(l.ts) + '</span></div><div>' + esc(l.det) + '</div><div class="pf-hint">' + esc(l.user) + ' · ' + esc(l.rol) + ' · IP ' + esc(l.ip) + (l.motivo && l.motivo !== '—' ? ' · <b>Motivo:</b> ' + esc(l.motivo) : '') + '</div></div>';
    }).join('');
    return card('Bitácora de etapas', 'Registro inmutable de cada cambio: quién, cuándo, qué cambió y por qué.', '<div class="pf-sec" style="gap:12px">' + rows + '</div>', { n: S.inc.length + 1 });
  }

  function incPanel(inc, idx) {
    var cat = catOf(inc), rec = isRec(inc);
    var badges = '<span class="pf-row" style="gap:6px">' + (cat ? badge(cat.l, 'neutral') : '') + badge({ codigo: 'Con código', certificado: 'Certificado', fijo: 'Fijo ' + frecuenciaTxt(inc) }[inc.modalidad], rec ? 'caution' : 'neutral') + '</span>';
    var locked = CONDITIONS_LOCKED;
    var body = '<div class="pf-inc"><div ' + (locked ? 'inert class="pf-sec pf-readonly"' : 'class="pf-sec"') + '>' +
      '<div class="pf-subsec"><h4 class="pf-sub">Condiciones de elegibilidad</h4><p class="pf-hint">Quién puede recibir este incentivo. Se combinan con Y; si falla una, el sistema <b>bloquea y dice cuál</b>.</p>' + groupsHTML(inc) + '</div>' +
      '<div class="pf-subsec"><h4 class="pf-sub">Documentación</h4>' + docsHTML(inc) + '</div>' +
      '</div>' + (docOn(inc) ? cronoBlock(inc) : '') + '</div>';
    return card(inc.nombre || ('Tipo de incentivo #' + (idx + 1)), (S.inc.length > 1 ? 'Tipo ' + (idx + 1) + ' de ' + S.inc.length + ' · ' : '') + 'Sus propias condiciones, documentos y etapas.', body, { n: idx + 1, right: badges });
  }
  function step4() {
    var lockMsg = CONDITIONS_LOCKED ? alertBox('Tu rol <b>solo visualiza</b> las condiciones y los documentos. Puedes ajustar las <b>etapas</b>; para lo demás, solicítalo al Gestor de incentivos.', 'caution', 'padlock-close') : '';
    return '<div class="pf-sec">' + head('Condiciones de elegibilidad', 'Para <b>cada tipo de incentivo</b> define quién puede recibirlo, si pide documentos y, si es recurrente, las etapas de cada ciclo. <b>Bloqueo estricto:</b> sin cumplir el 100% el sistema impide la operación e indica qué condición falla.') + lockMsg +
      S.inc.map(incPanel).join('') + logCard() +
      alertBox('<b>Habilitación excepcional:</b> no se configura aquí. Con el programa activo, el Gestor de programa puede habilitar a personas concretas (individual o masiva por Excel/CSV) eximiendo fechas, condicionales o ambas, con justificación y auditoría.', 'informative') + '</div>';
  }

  /* ── Paso 5 · Códigos y revisión ────────────────────────────── */
  function routeHTML() {
    return '<div class="pf-sec" style="gap:12px">' + S.inc.map(function (inc) {
      var steps = [previewText(inc) ? 'Motor valida elegibilidad' : 'Sin condiciones'];
      if (docOn(inc)) steps.push('Beneficiario carga soportes', 'Gestor de programa revisa');
      steps.push('Operador asigna');
      if (isRec(inc)) steps.push('Gestor confirma ciclo');
      return '<div><b>' + esc(inc.nombre || 'Sin nombre') + '</b><div class="pf-route" style="margin-top:6px">' + steps.map(function (s, i) { return (i ? '<span class="pf-arrow">→</span>' : '') + badge(s, i === steps.length - 1 ? 'positive' : 'neutral'); }).join('') + '</div></div>';
    }).join('') + '</div>';
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
    var rubTxt = (rub.valor ? money(rub.valor) : 'Sin presupuesto (opcional)') + (totalCupo() ? ' · cupo ' + totalCupo().toLocaleString('es-CO') + ' entregas' : '');
    var incTxt = S.inc.map(function (i) { var v = Number(i.valor) || 0, c = Number(i.cantidad) || 0; return '<div>' + esc(i.nombre || 'Sin nombre') + (catOf(i) ? ' (' + esc(catOf(i).l) + ')' : '') + ' · ' + badge({ codigo: 'Con código', certificado: 'Certificado', fijo: 'Fijo ' + (i.frecuencia === 'otra' ? 'cada ' + (i.frecuenciaN || '?') + ' ' + (i.frecuenciaU || 'meses') : i.frecuencia) }[i.modalidad], i.modalidad === 'fijo' ? 'caution' : 'neutral') + ' ' + (v ? money(v) + (i.modalidad === 'fijo' ? ' por ciclo' : ' total') : '') + (c ? ' · ' + c.toLocaleString('es-CO') + (i.modalidad === 'fijo' ? ' beneficiarios' : ' cupos') + (v ? ' de ' + money2(v / c) : '') : '') + '</div>'; }).join('');
    var rev = card('Resumen del programa', 'Revisa antes de guardar. Puedes volver a cualquier paso.', '<div class="pf-sum"><dl style="margin:0">' +
      kv('Programa', esc(d.nombre) + ' ' + (EDIT ? badge('Activo · V1.0', 'positive') : badge('Configuración', 'caution'))) + kv('Evento', esc(d.evento || '—')) + kv('Responsable', esc(d.responsable || '—')) + kv('Área · Gestor asignado', esc(d.area) + ' · ' + esc(d.gestor)) +
      kv('Vigencia', fmtDate(d.desde) + ' → ' + fmtDate(d.hasta)) + kv('Cobertura', esc(d.cobertura.join(', '))) + kv('Justificación', d.justificacion.trim() ? esc(d.justificacion) : '<span style="color:var(--naotech-app-color-600);font-weight:400">No registrada</span>') + kv('Doc. de la resolución', d.anexo ? esc(d.anexo.name) + ' (' + fmtSize(d.anexo.size) + ')' : '<span style="color:var(--naotech-app-color-600);font-weight:400">Sin archivo adjunto</span>') + kv('Rubro', esc(rubTxt)) + kv('Incentivos', incTxt) +
      kv('Elegibilidad por tipo', S.inc.map(function (i) { return '<div><b>' + esc(i.nombre || 'Sin nombre') + ':</b> <span style="font-weight:400">' + previewHTML(i) + '</span></div>'; }).join('')) +
      kv('Documentos y etapas por tipo', S.inc.map(function (i) { return '<div><b>' + esc(i.nombre || 'Sin nombre') + ':</b> <span style="font-weight:400">' + (docOn(i) ? esc(i.doc.list.map(function (x) { return x.name + (x.oblig ? '' : ' (opcional)'); }).join(', ') || '—') + ' · ' + esc(cronoSummary(i)) : 'No pide documentos (flujo directo)') + '</span></div>'; }).join('')) +
    '</dl></div>', { n: 2 });
    var route = card('Ruta de cada tipo', 'Así fluirá una persona desde la elegibilidad hasta la entrega.', routeHTML(), { n: 3 });
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
      if (!d.cobertura.length) e.push(['datos.cobertura', 'Selecciona «Nacional» o al menos un departamento.', 1]);
      if (!d.area) e.push(['datos.area', 'Selecciona el área responsable.', 1]);
      if (!d.gestor) e.push(['datos.gestor', 'Asigna un gestor de programa.', 1]);
      if (!d.desde) e.push(['datos.desde', 'Indica la fecha de inicio.', 1]);
      if (!d.hasta) e.push(['datos.hasta', 'Indica la fecha de fin.', 1]);
      if (d.desde && d.hasta && d.hasta < d.desde) e.push(['datos.hasta', 'La fecha de fin debe ser posterior al inicio.', 1]);
      if (d.activacion && d.desde && d.activacion < d.desde) e.push(['datos.activacion', 'La activación no puede ser anterior a la vigencia.', 1]);
    }
    if (step >= 3) S.inc.forEach(function (i) {
      if (!i.nombre.trim()) e.push(['inc.' + i.id + '.nombre', 'Nombra el incentivo.', 3]);
      if (!i.categoria) e.push(['inc.' + i.id + '.categoria', 'Selecciona la categoría.', 3]);
      if (conValor(i) && !Number(i.valor)) e.push(['inc.' + i.id + '.valor', 'Indica el valor total.', 3]);
      if (i.modalidad === 'fijo' && i.frecuencia === 'otra' && !Number(i.frecuenciaN)) e.push(['inc.' + i.id + '.frecuenciaN', 'Indica cada cuánto se repite.', 3]);
    });
    if (step >= 4) S.inc.forEach(function (inc) {
      var nm = '«' + (inc.nombre || 'tipo sin nombre') + '»';
      inc.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (r.f && !ruleNat(r)) e.push(['', 'Condición incompleta en ' + nm + ': ' + FIELDS[r.f].label + '.', 4]); }); });
      if (docOn(inc) && !inc.doc.list.some(function (x) { return x.oblig; })) e.push(['', nm + ': agrega al menos un documento obligatorio.', 4]);
      if (docOn(inc)) cronoErrors(e, inc);
      if (EDIT && cronoChanges(inc).length && !inc.crono.motivo.trim()) e.push(['crono.' + inc.id + '.motivo', 'Indica el motivo del cambio de etapas.', 4]);
    });
    return e;
  }
  function cronoErrors(e, inc) {
    var c = inc.crono, rec = isRec(inc), prev = null, prevName = '', kk = 'crono.' + inc.id + '.';
    if (rec && !c.primer) e.push([kk + 'primer', 'Indica cuándo inicia el primer ciclo.', 4]);
    FASES.forEach(function (f) {
      var k = f[0], a = c[k].ini, b = c[k].fin;
      if (!a) e.push([kk + k + '.ini', 'Falta el inicio.', 4]);
      if (!b) e.push([kk + k + '.fin', 'Falta el cierre.', 4]);
      if (a && b) {
        if (rec) {
          if (+a < 1 || +b > 31) e.push([kk + k + '.fin', 'Usa días entre 1 y 31.', 4]);
          else if (+b < +a) e.push([kk + k + '.fin', 'El cierre no puede ser antes del inicio.', 4]);
          else if (prev != null && +a < prev) e.push([kk + k + '.ini', f[1] + ' no puede empezar antes de que cierre ' + prevName + ' (día ' + prev + ').', 4]);
          if (!(+b < +a)) { prev = +b; prevName = f[1]; }
        } else {
          if (b <= a) e.push([kk + k + '.fin', 'El cierre debe ser posterior al inicio.', 4]);
          else if (prev && a < prev) e.push([kk + k + '.ini', f[1] + ' no puede empezar antes de que cierre ' + prevName + '.', 4]);
          if (S.datos.desde && a.slice(0, 10) < S.datos.desde) e.push([kk + k + '.ini', 'Queda fuera de la vigencia del programa.', 4]);
          if (S.datos.hasta && b.slice(0, 10) > S.datos.hasta) e.push([kk + k + '.fin', 'Queda fuera de la vigencia del programa.', 4]);
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
    S.inc.forEach(function (i) {
      var s = SNAP.inc.filter(function (x) { return x.id === i.id; })[0]; if (!s) return;
      var nm = i.nombre || 'tipo';
      if (JSON.stringify(i.grupos) !== JSON.stringify(s.grupos)) ch.push('Condicionales de elegibilidad (' + nm + ')');
      if (JSON.stringify([i.modalidad, i.frecuencia, i.frecuenciaN, i.frecuenciaU]) !== JSON.stringify([s.modalidad, s.frecuencia, s.frecuenciaN, s.frecuenciaU])) ch.push('Frecuencia / modalidad (' + nm + ')');
      if (JSON.stringify([docOn(i), i.doc.list]) !== JSON.stringify([docOn(s), s.doc.list])) ch.push('Documentos requeridos (' + nm + ')');
    });
    return ch;
  }
  function banner() {
    var host = $('#pfBanner'), h = '';
    if (!EDIT && !CAN_EDIT_PROGRAM) h = alertBox('Tu rol no crea programas: lo hace el Gestor de incentivos, Administrador o Superadmin. Puedes explorar el formulario, pero no guardar.', 'caution', 'padlock-close');
    if (EDIT) {
      var ch = versionChanges(), cc = allCronoChanges().reduce(function (a, x) { return a.concat(x.changes); }, []);
      h = ch.length ? alertBox('Editas <b>V1.0 (Activo)</b>. Estos cambios generarán la <b>nueva versión V2.0</b>: ' + ch.join(' · ') + '. Lo ya entregado en V1.0 queda congelado e inmutable.', 'caution', 'attention')
        : alertBox('Editas <b>V1.0 (Activo)</b>. Cambiar <b>condicionales, frecuencia o documentos</b> crea una nueva versión (V2.0). Cambiar estado, extender vigencia, <b>ajustar las etapas</b> o cargar códigos <b>no versiona</b>.', 'informative');
      if (cc.length && !ch.length) h += alertBox('Ajustas las <b>etapas</b> (' + cc.length + ' cambio' + (cc.length > 1 ? 's' : '') + '): se conserva V1.0 y queda registrado en la bitácora con tu motivo.', 'caution', 'calendar');
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
      return '<div class="nwt-stepper__item' + (act ? ' nwt-stepper__item--active' : '') + (dn ? ' nwt-stepper__item--done' : '') + (n > S.max ? ' nwt-stepper__item--disabled' : '') + '" data-act="goto" data-x="' + n + '"><div class="nwt-stepper__item__content"><div class="nwt-stepper__item__badge">' + (dn ? icon('positive') : n) + '</div><span class="pf-step__text"><span class="pf-step__kicker">Paso ' + n + '</span><span class="nwt-stepper__item__label">' + l + '</span></span></div></div>';
    }).join('');
  }
  function render(keepScroll) {
    cobOpen = false;
    var html = [step1, step2, step3, step4, step5][S.step - 1]();
    if (EDIT && role === 'programa' && S.step <= 2) html = alertBox('Los datos y el rubro del programa los edita el Gestor de incentivos. Tu rol <b>solo los visualiza</b>.', 'caution', 'padlock-close') + '<div inert class="pf-sec pf-readonly">' + html + '</div>';
    $('#pfStep').innerHTML = html;
    renderStepper(); banner();
    $('#pfPrev').style.visibility = S.step === 1 ? 'hidden' : 'visible';
    var nx = $('#pfNext .nwt-button__content');
    if (S.step < 5) nx.innerHTML = 'Continuar' + icon('arrow-right');
    if (S.step === 3) updateDist();
    if (S.step === 5) { banner(); issues(); }
    if (!keepScroll) $('#pfScroll').scrollTo({ top: 0, behavior: 'smooth' });
    saveDraft(true);
  }
  function issues() {
    var host = $('#pfIssues'); if (!host) return;
    var e = validate(4);
    host.innerHTML = e.length ? alertBox('Faltan datos para guardar: <b>' + e.map(function (x) { return esc(x[1]); }).join(' · ') + '</b>', 'negative', 'attention') : alertBox('Todo listo: el programa tiene los datos mínimos para guardarse.', 'positive', 'positive');
  }
  function updateRules(incId) {
    var inc = incById(incId); if (!inc) return;
    var p = $('#pfPreview-' + incId); if (p) p.innerHTML = previewHTML(inc);
    var pn = p && p.closest('.pf-subsec'), fam = pn && pn.querySelector('.pf-families');
    if (fam) { var u = famInUse(inc); fam.querySelectorAll('.nwt-tag').forEach(function (t) { var k = Object.keys(FAMILIAS).filter(function (f) { return FAMILIAS[f] === t.textContent; })[0]; t.classList.toggle('nwt-tag--active', !!u[k]); }); }
    banner();
  }

  /* ── Estado: bind por path ──────────────────────────────────── */
  function setByKey(k, raw) {
    var p = k.split('.');
    if (p[0] === 'datos') S.datos[p[1]] = raw;
    else if (p[0] === 'rubro') S.rubro[p[1]] = digits(raw);
    else if (p[0] === 'inc') { var i = incById(p[1]); i[p[2]] = (p[2] === 'valor' || p[2] === 'cantidad' || p[2] === 'frecuenciaN') ? digits(raw) : raw; }
    else if (p[0] === 'crono') { var ic = incById(p[1]); if (p.length === 4) ic.crono[p[2]][p[3]] = raw; else ic.crono[p[2]] = raw; }
    else if (p[0] === 'rule') {
      var inc = incById(p[1]), r = inc.grupos[+p[2]].rows[+p[3]], f = p[4];
      if (f === 'f') { r.f = raw; var fd = FIELDS[raw]; r.op = fd.type === 'num' ? '≥' : '='; r.v = ''; }
      else if (f === 'op') { r.op = raw; if (raw === '∈' || raw === '∉') { if (!Array.isArray(r.v)) r.v = []; } else if (Array.isArray(r.v)) r.v = ''; }
      else r.v = raw;
    }
  }
  function onInput(e) {
    var t = e.target; if (!t.dataset || !t.dataset.k) return;
    var k = t.dataset.k;
    if (k.indexOf('ui.docNuevo') === 0) return;
    var isMoney = /(\.valor|\.cantidad|^rubro\.)/.test(k);
    if (isMoney) { var d = digits(t.value); if (e.type === 'change' && k.indexOf('cantidad') < 0) t.value = d ? Number(d).toLocaleString('es-CO') : ''; else if (e.type === 'input') t.value = d && (k.indexOf('cantidad') < 0) ? Number(d).toLocaleString('es-CO') : d; }
    setByKey(k, t.value);
    if (k === 'rubro.n') syncInc();
    var mc = /^inc\.([^.]+)\.categoria$/.exec(k); if (mc && incById(mc[1])) applyCategoria(incById(mc[1]));
    var mv = /^inc\.([^.]+)\.(valor|cantidad)$/.exec(k);
    if (mv) { var msg = document.querySelector('[data-box="inc.' + mv[1] + '.cantidad"] .nwt-input-box__message span'), inc0 = incById(mv[1]); if (msg && inc0) msg.textContent = cupoText(inc0); }
    if (t.dataset.struct && e.type === 'change') { render(true); return; }
    var box = t.closest('.nwt-input-box'); if (box && box.classList.contains('nwt-input-box--error')) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
    if (k.indexOf('rule.') === 0) updateRules(k.split('.')[1]);
    if (k.indexOf('crono.') === 0 && !/\.motivo$/.test(k)) { var cid = k.split('.')[1], ch = $('#pfCronoChg-' + cid), ci = incById(cid); if (ch && ci && e.type === 'change') ch.innerHTML = cronoChgHTML(ci); banner(); }
    if (S.step === 3) updateDist();
    if (EDIT) banner();
    refreshDraftBtn();
  }

  /* ── Acciones ───────────────────────────────────────────────── */
  var ACT = {
    'cob-toggle': function () { cobOpen = !cobOpen; cobQuery = ''; cobRedraw(); if (cobOpen) { var q = $('#pfCob .pf-ms__q'); if (q) q.focus({ preventScroll: true }); } },
    'cob-opt': function (x) { cobSet(x); },
    'cob-del': function (x) { cobSet(x); },
    'anexo-del': function () { S.datos.anexo = null; saveDraft(true); anexoRedraw(); },
    'rubro-tipos': function (x) { S.rubro.tipos = x; syncInc(); render(true); },
    'inc-modalidad': function (x, i) { var n = incById(i); if (modsOf(n).indexOf(x) < 0) return; n.modalidad = x; n.foto = (x === 'codigo'); if (x === 'fijo') { n.doc.req = true; if (!n.doc.list.length) n.doc.list = [{ name: 'Documento de identidad', oblig: true }]; } render(true); },
    'inc-foto': function (x, i) { var n = incById(i); n.foto = !n.foto; render(true); },
    'grp-op': function (x, id) { var p = x.split(':'); incById(id).grupos[+p[0]].op = p[1]; render(true); },
    'grp-toggle': function (x, id) { grpOpen[id + ':' + x] = !isGrpOpen(id, +x); render(true); },
    'grp-add': function (x, id) { var n = incById(id).grupos.push({ op: 'AND', rows: [{ f: '', op: '=', v: '' }] }); grpOpen[id + ':' + (n - 1)] = true; render(true); }, // el grupo nuevo se abre
    'grp-del': function (x, id) { var n = incById(id).grupos.length; incById(id).grupos.splice(+x, 1); grpShift(id, +x, n - 1); render(true); },
    'rule-add': function (x, id) { incById(id).grupos[+x].rows.push({ f: '', op: '=', v: '' }); render(true); },
    'rule-del': function (x, id) { var p = x.split('.'); incById(id).grupos[+p[0]].rows.splice(+p[1], 1); render(true); },
    'rule-multi': function (x, key) { var p = key.split('.'), r = incById(p[0]).grupos[+p[1]].rows[+p[2]]; if (!Array.isArray(r.v)) r.v = []; var i = r.v.indexOf(x); if (i > -1) r.v.splice(i, 1); else r.v.push(x); render(true); },
    'doc-req': function (x, id) { var n = incById(id); n.doc.req = !n.doc.req; if (n.doc.req && !n.doc.list.length) n.doc.list = [{ name: 'Documento de identidad', oblig: true }]; render(true); },
    'doc-oblig': function (x, id) { var d = incById(id).doc.list[+x]; d.oblig = !d.oblig; render(true); },
    'doc-del': function (x, id) { incById(id).doc.list.splice(+x, 1); render(true); },
    'doc-add-s': function (x, id) { incById(id).doc.list.push({ name: x, oblig: true }); render(true); },
    'doc-add': function (x, id) { var inp = $('[data-k="ui.docNuevo.' + id + '"]'), v = inp && inp.value.trim(); if (!v) return toast('Escribe el nombre del documento.', 'caution'); incById(id).doc.list.push({ name: v, oblig: true }); render(true); },
    'cod-modo': function (x, i) { (S.codigos[i] || (S.codigos[i] = { n: 0 })).modo = x; render(true); },
    'cod-sim': function (x, i) { S.codigos[i].n = 50; render(true); },
    'cod-tpl': function () { toast('Plantilla de ejemplo (demo): codigo, observación.', 'informative'); },
    activar: function (x) { S.activar = x; render(true); },
    'save-draft': function () { savedSnap = snapState(); saveDraft(); toast('Borrador guardado. Podrás retomarlo cuando quieras.', 'positive'); },
    goto: function (x) { var n = +x; if (n <= S.max && n !== S.step) go(n); },
    edit: function (x) { go(+x); },
    noop: function () {}
  };
  function onClick(e) {
    if (cobOpen && !e.target.closest('#pfCob')) { cobOpen = false; cobRedraw(); }
    var t = e.target.closest('[data-act]'); if (!t) return;
    if (t.closest('[inert]')) return;
    var fn = ACT[t.dataset.act]; if (!fn) return;
    if (t.tagName === 'LABEL') e.preventDefault();
    fn(t.dataset.x, t.dataset.i);
    refreshDraftBtn();
  }
  function onAnexoClick(e) {
    var c = e.target.closest && e.target.closest('#pfAnexo .nwt-file-field__content');
    if (!c || e.target.id === 'pfAnexoInput') return;
    var inp = $('#pfAnexoInput'); if (inp) inp.click();
  }
  function onAnexoChange(e) {
    if (!e.target || e.target.id !== 'pfAnexoInput') return;
    var f = e.target.files && e.target.files[0]; if (f) anexoStart(f); e.target.value = '';
  }
  function onKey(e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.nwt-tag[data-act], .nwt-checkbox[data-act], .nwt-switch[data-act], .pf-ms__content')) { e.preventDefault(); e.target.click(); } if (e.key === 'Escape' && cobOpen) { cobOpen = false; cobRedraw(); } }

  function go(n) { S.step = n; if (n > S.max) S.max = n; render(); }
  function next() {
    if (S.done) return;
    var errs = validate(S.step), general = showErrors(errs, S.step);
    if (S.step === 4 && errs.some(function (x) { return x[2] === 4; })) { // abre los grupos que tengan una condición incompleta
      var reveal = false;
      S.inc.forEach(function (inc) { inc.grupos.forEach(function (g, gi) { if (g.rows.some(function (r) { return r.f && !ruleNat(r); }) && !isGrpOpen(inc.id, gi)) { grpOpen[inc.id + ':' + gi] = true; reveal = true; } }); });
      if (reveal) render(true);
    }
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
      allCronoChanges().forEach(function (x) {
        var entry = { ts: ts, user: who[0], rol: who[1], ev: 'Edición de etapas · ' + (x.inc.nombre || 'tipo'), det: x.changes.map(function (c) { return c.campo + ': ' + c.antes + ' → ' + c.despues; }).join(' · '), motivo: x.inc.crono.motivo.trim(), ip: '190.24.18.' + (20 + now.getSeconds() % 70) };
        try { var st = JSON.parse(localStorage.getItem(LOG_KEY)) || []; st.unshift(entry); localStorage.setItem(LOG_KEY, JSON.stringify(st)); } catch (_) {}
        nlog += x.changes.length;
      });
    }
    var activo = EDIT || S.activar === 'activo';
    $('#pfBanner').innerHTML = '';
    $('#pfStep').innerHTML = '<div class="pf-ok"><div class="nwt-avatar-icon" nwt-theme="positive">' + icon('positive') + '</div>' +
      '<h2 class="pf-h2">' + (EDIT ? 'Cambios guardados' : 'Programa creado') + '</h2>' +
      '<p class="pf-lead"><b>' + esc(S.datos.nombre) + '</b> ' + (activo ? 'está <b>Activo · ' + ver + '</b>.' : 'quedó en <b>Configuración</b>. Actívalo cuando esté listo.') + ' Se registró auditoría con usuario, fecha, hora e IP.' + (nlog ? ' <b>' + nlog + ' cambio' + (nlog > 1 ? 's' : '') + ' de etapas</b> ' + (nlog > 1 ? 'quedaron' : 'quedó') + ' en la bitácora con su motivo.' : '') + '</p>' +
      '<div class="pf-row">' + badge(activo ? 'Activo · ' + ver : 'Configuración', activo ? 'positive' : 'caution') + badge(routeLabel(), 'neutral') + '</div>' +
      '<div class="pf-row"><a class="nwt-button" nwt-variant="loud" nwt-size="medium" href="incentivo-03-programas.html"><span class="nwt-button__content">Ver programas</span></a><a class="nwt-button" nwt-variant="quiet" nwt-size="medium" href="incentivo-04-programa-crear.html"><span class="nwt-button__content">Crear otro</span></a></div></div>';
    $('.pf-footer').hidden = true; $('#pfStepper').innerHTML = ''; $('#pfScroll').scrollTo({ top: 0, behavior: 'smooth' });
  }
  function routeLabel() { return (hasModalidad('fijo') ? 'Recurrente' : 'Pago único') + ' · ' + (anyDoc() ? 'Con documentos' : 'Flujo directo'); }

  /* ── Guardar borrador: solo se habilita si hay cambios respecto al último guardado ── */
  var savedSnap = '', pristineSnap = '';
  function snapState() { return JSON.stringify([S.datos, S.rubro, S.inc, S.codigos, S.activar]); }
  function refreshDraftBtn() {
    var b = $('.top-header [data-act="save-draft"]'); if (!b) return;
    var off = snapState() === savedSnap;
    b.disabled = off; b.setAttribute('aria-disabled', String(off));
    b.title = off ? 'Aún no hay cambios por guardar' : '';
  }

  /* ── Toast y borrador ───────────────────────────────────────── */
  var toastT;
  function toast(msg, theme) {
    $('#pfToast').innerHTML = alertBox(msg, theme || 'informative', theme === 'positive' ? 'positive' : theme === 'negative' || theme === 'caution' ? 'attention' : 'info');
    clearTimeout(toastT); toastT = setTimeout(function () { $('#pfToast').innerHTML = ''; }, 3600);
  }
  function saveDraft(silent) {
    refreshDraftBtn();
    if (EDIT) return;
    if (snapState() === pristineSnap) { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} return; } // sin cambios: no hay borrador
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ S: S, uid: uid })); } catch (_) {}
  }
  function loadDraft() {
    if (EDIT) return false;
    try {
      var raw = localStorage.getItem(DRAFT_KEY); if (!raw) return false;
      var o = JSON.parse(raw); if (!o.S || o.S.done) return false;
      S = o.S; uid = o.uid || uid;
      S.inc.forEach(function (i) { /* migra borradores de cuando las condiciones, documentos y cronograma eran del programa */
        if (!i.grupos) i.grupos = S.cond ? clone(S.cond.grupos) : [{ op: 'AND', rows: [] }];
        if (!i.doc) i.doc = S.cond ? clone(S.cond.doc) : { req: false, list: [] };
        if (!i.crono) i.crono = S.crono ? clone(S.crono) : newCrono();
        if (i.modalidad === 'fijo') i.doc.req = true;
      });
      delete S.cond; delete S.crono;
      S.rubro = { valor: (S.rubro && S.rubro.valor) || '', tipos: S.inc.length > 1 ? 'varios' : 'uno', n: Math.max(2, S.inc.length) }; return true;
    } catch (_) { return false; }
  }


  /* ── Encabezado de pasos: sombra + compactación al hacer scroll del contenedor ── */
  function initChrome() {
    var sc = $('#pfScroll'), pf = sc, on = false;
    function onScroll() {
      var y = sc.scrollTop;
      if (!on && y > 24) { on = true; pf.classList.add('is-scrolled'); }
      else if (on && y < 4) { on = false; pf.classList.remove('is-scrolled'); }
    }
    sc.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ── Arranque ───────────────────────────────────────────────── */
  function init() {
    if (!EDIT) { var _p = PERSONAS[role] || PERSONAS.admin; S.datos.responsable = _p[0] + ' · ' + _p[1]; }
    pristineSnap = snapState();
    var restored = loadDraft();
    if (!EDIT) { var _w = PERSONAS[role] || PERSONAS.admin; S.datos.responsable = _w[0] + ' · ' + _w[1]; } // responsable = usuario logueado
    if (EDIT) {
      seedEdit(); SNAP = clone({ inc: S.inc });
      $('#pfCrumb').textContent = S.datos.nombre; $('#pfTitle').textContent = 'Editar programa';
      $('#pfStateBadge').innerHTML = badge('Activo · V1.0', 'positive');
    } else {
      $('#pfStateBadge').innerHTML = badge('Configuración', 'caution');
    }
    var h = parseInt((location.hash.match(/step=(\d)/) || [])[1], 10);
    if (h >= 1 && h <= 5) { S.step = h; if (h > S.max) S.max = h; }
    var root = $('#pfStep');
    root.addEventListener('input', onInput); root.addEventListener('change', onInput);
    root.addEventListener('click', onAnexoClick); root.addEventListener('change', onAnexoChange);
    root.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('pf-ms__q')) { cobQuery = e.target.value; var ul = $('#pfCobOpts'); if (ul) ul.innerHTML = cobOptsHTML(); } });
    document.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
    root.addEventListener('focusin', function (e) { var b = e.target.closest('.nwt-input-box'); if (b && !b.classList.contains('pf-ro-box')) { b.classList.add('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.add(f.className.split(' ')[0] + '--focused'); } });
    root.addEventListener('focusout', function (e) { var b = e.target.closest('.nwt-input-box'); if (b) { b.classList.remove('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.remove(f.className.split(' ')[0] + '--focused'); } });
    $('#pfPrev').addEventListener('click', function () { if (S.step > 1) go(S.step - 1); });
    $('#pfNext').addEventListener('click', next);
    $('[data-act="save-draft"]').style.display = EDIT ? 'none' : '';
    savedSnap = snapState();
    initChrome();
    render(true);
    if (restored) toast('Recuperamos tu borrador sin terminar.', 'informative');
  }
  init();
})();
