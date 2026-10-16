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
  var DRAFT_KEY = 'inc-programa-draft-v3';
  var params = new URLSearchParams(location.search);
  var EDIT = params.get('edit') === '1';
  var CUR_VER = 'V1.0', NEXT_VER = 'V2.0'; // versión vigente del programa que se edita y la que se publicaría
  var EDIT_ID = params.get('id') || ''; // programa que se edita (si falta, se usa el ejemplo)
  var role = (function () { try { return localStorage.getItem('naowee-incentivos-role') || 'admin'; } catch (_) { return 'admin'; } })();
  var CAN_EDIT_PROGRAM = role === 'admin' || role === 'gestor';
  var CONDITIONS_LOCKED = EDIT && role === 'programa'; // el Gestor de programa solo lee condicionales (HU-03)

  /* ── Catálogos ─────────────────────────────────────────────── */
  var EVENTOS = ['Juegos Intercolegiados Nacionales 2026', 'Juegos Deportivos Nacionales 2026', 'Juegos Paranacionales 2026', 'Campeonato nacional de atletismo 2026', 'Sin evento asociado'];
  var ROLES = ['Deportista', 'Paradeportista', 'Entrenador', 'Personal de apoyo', 'Médico', 'Metodólogo', 'Juez / árbitro', 'Delegado', 'Institución educativa', 'Escenarios deportivos'];
  var ENTIDADES = ['Escenarios deportivos', 'Institución educativa']; // roles que son entidades, no personas
  var CAMPOS_PERSONA = ['edad', 'genero', 'escolaridad', 'grado', 'categoria', 'logro', 'etapa']; // no aplican a entidades
  var EVENTO_EDAD = { 'Juegos Intercolegiados Nacionales 2026': 17 }; // edad máxima de los participantes del evento
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
  /* La modalidad se deriva: Diploma / reconocimiento → certificado digital; si el programa es recurrente → fijo recurrente; si no → entrega única, con o sin código según elija el usuario. */
  function hasCodes(i) { return i.modalidad !== 'certificado' && i.codigos !== false; } // los certificados no llevan código; los demás, según elija el usuario (también en recurrentes)
  function modalidadOf(i) { var c = catOf(i); return c && c.cert ? 'certificado' : (S.rec.on ? 'fijo' : (i.codigos === false ? 'sincodigo' : 'codigo')); }
  function setModalidad(inc) { var m = modalidadOf(inc); if (inc.modalidad !== m) { inc.modalidad = m; inc.foto = true; } }
  function syncModalidades() { S.inc.forEach(function (i) { if (i.categoria) setModalidad(i); }); }
  function applyCategoria(inc) {
    var c = catOf(inc); if (!c) return;
    if (!c.valor) { inc.valor = ''; inc.unit = ''; }
    setModalidad(inc); recalc(inc);
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
  function newCrono() { return { gracia: '', primer: '', carga: { ini: '', fin: '' }, revision: { ini: '', fin: '' }, asignacion: { ini: '', fin: '' }, motivo: '' }; }
  /* tope: 'sin' = solo valor unitario · 'bottom' = unitario × cantidad = total · 'top' = tope total; la cantidad sale del unitario. Todo opcional. */
  function newInc() { return { id: nextId(), nombre: '', categoria: '', modalidad: 'codigo', codigos: true, tope: 'bottom', unit: '', valor: '', cantidad: '', foto: true, grupos: [{ op: 'AND', rows: [] }], docOff: [] }; }

  var S = {
    step: 1, max: 1, done: false,
    datos: { nombre: '', desc: '', eventos: [], gestores: [], extra: [], desde: '', hasta: '', justificacion: '', anexo: null },
    pob: { roles: [], rolesExtra: [], cobertura: ['Nacional'], municipios: [], seleccion: ['plataforma'] },
    rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
    doc: { req: false, list: [] },
    crono: newCrono(),
    rubro: { tipos: 'uno', n: 2 },
    inc: [newInc()],
    codigos: {},
    activar: 'config'
  };
  var LAST = 4;
  var LOG_KEY = 'inc-crono-log-v1';
  var PERSONAS = { admin: ['Danna Arrieta', 'Gestor de incentivos'], gestor: ['Danna Arrieta', 'Gestor de incentivos'], programa: ['Isa Pabon', 'Gestor de programa'], operador: ['Jorge Guzman', 'Operador'] };
  var FASES = [['carga', 'Carga de documentos', 'El beneficiario sube sus soportes'], ['revision', 'Revisión documental', 'El Gestor de programa aprueba o rechaza'], ['asignacion', 'Asignación', 'El Operador entrega el beneficio']];
  var LOG = [];
  var SNAP = null; // foto del programa publicado (modo edición) para detectar versionamiento

  function seedEdit() {
    var i1 = newInc(); i1.nombre = 'Beca educativa · Medallistas de oro'; i1.categoria = 'beca'; i1.modalidad = 'fijo'; i1.codigos = false; i1.tope = 'top'; i1.valor = '200000000'; i1.unit = '1000000'; i1.cantidad = '200';
    var i2 = newInc(); i2.codigos = false; i2.nombre = 'Beca educativa · Medallistas de plata'; i2.categoria = 'beca'; i2.modalidad = 'fijo'; i2.tope = 'bottom'; i2.unit = '700000'; i2.cantidad = '150'; i2.valor = '105000000';
    S.datos = { extra: [], nombre: 'Becas deportivas medallistas 2026', desc: 'Beca dirigida a deportistas medallistas de los Juegos Nacionales para apoyar su formación profesional.', eventos: [EVENTOS[1]], gestores: ['Isa Pabon'], desde: '2026-04-22', hasta: '2026-12-31', justificacion: 'Resolución 0123 de 2026 del Ministerio del Deporte, que crea el programa de becas para deportistas medallistas de los Juegos Nacionales.', anexo: { name: 'Resolucion-0123-2026.pdf', size: 482000 } };
    S.pob = { roles: ['Deportista'], rolesExtra: [], cobertura: ['Nacional'], municipios: [], seleccion: ['plataforma'] };
    S.rec = { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' };
    S.doc = { req: true, list: [{ name: 'Documento de identidad', oblig: true }, { name: 'Certificado de resultado', oblig: true }, { name: 'Certificación bancaria', oblig: true }] };
    S.crono = { gracia: '3', primer: '2026-05-01', carga: { ini: '15', fin: '18' }, revision: { ini: '20', fin: '25' }, asignacion: { ini: '25', fin: '30' }, motivo: '' };
    S.rubro = { tipos: 'varios', n: 2 };
    S.inc = [i1, i2];
    i1.grupos = [{ op: 'AND', rows: [{ f: 'edad', op: '≥', v: '18' }, { f: 'categoria', op: '=', v: 'Juvenil' }] }, { op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }];
    i2.grupos = [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de plata'] }] }];
    LOG = [{ ts: '22/04/2026 09:14', user: 'Danna Arrieta', rol: 'Gestor de incentivos', ev: 'Creación del cronograma · programa', det: 'Carga día 15–18 · Revisión día 20–25 · Asignación día 25–30 · Gracia 3 días hábiles', motivo: '—', ip: '190.24.18.07' }];
    try { LOG = (JSON.parse(localStorage.getItem(LOG_KEY)) || []).concat(LOG); } catch (_) {}
    S.step = 1; S.max = LAST;
  }

  /* ── Utilidades ─────────────────────────────────────────────── */
  /* ── Utilidades ─────────────────────────────────────────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$ ' + Number(n || 0).toLocaleString('es-CO'); }
  function money2(n) { return '$ ' + Number(n || 0).toLocaleString('es-CO', { maximumFractionDigits: 2 }); }
  /* Debajo de los valores: explica cómo se calcula según el tipo de tope */
  function cupoText(inc) {
    var fijo = inc.modalidad === 'fijo', u = Number(inc.unit) || 0, c = Number(inc.cantidad) || 0, v = Number(inc.valor) || 0;
    if (!conValor(inc)) return 'Número de cupos de este tipo. No tiene valor monetario.';
    if (inc.tope === 'sin') return u ? 'Sin tope: cada beneficiario recibe ' + money(u) + (fijo ? ' por ciclo' : '') + '. No hay cantidad ni total.' : 'Sin tope: indica solo cuánto cuesta entregar este incentivo a cada persona.';
    if (inc.tope === 'bottom') return (u && c) ? 'Total = ' + money(u) + ' × ' + c.toLocaleString('es-CO') + ' = ' + money(u * c) + (fijo ? ' por ciclo' : '') + '.' : 'Valor unitario × cantidad = valor total del tipo.';
    return (v && u) ? 'Con este tope alcanza para ' + Math.floor(v / u).toLocaleString('es-CO') + (fijo ? ' beneficiarios' : ' entregas') + ' de ' + money(u) + '.' : 'Define el tope total y el valor unitario: la cantidad se calcula sola.';
  }
  /* Mantiene coherentes unitario, cantidad y total según el tipo de tope */
  function recalc(inc) {
    if (!conValor(inc)) return;
    var u = Number(inc.unit) || 0, c = Number(inc.cantidad) || 0, v = Number(inc.valor) || 0;
    if (inc.tope === 'bottom') inc.valor = (u && c) ? String(u * c) : '';
    else if (inc.tope === 'top') inc.cantidad = (v && u) ? String(Math.floor(v / u)) : '';
    else { inc.valor = ''; inc.cantidad = ''; }
  }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function fmtDate(d) { if (!d) return '—'; var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function incById(id) { return S.inc.filter(function (i) { return i.id === id; })[0]; }
  function hasModalidad(m) { return S.inc.some(function (i) { return i.modalidad === m; }); }
  function recOn() { return !!S.rec.on; }
  function docsReq() { return S.rec.on || !!S.doc.req; }
  function anyDoc() { return docsReq(); }
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

  /* ── Paso 1 · Datos generales del programa ─────────────────── */
  function step1() {
    var d = S.datos, n = 0, lock = EDIT && role === 'programa';
    function N() { n += 1; return { n: n }; }
    function wrap(h) { return lock ? '<div inert class="pf-sec pf-readonly">' + h + '</div>' : h; }
    var lockMsg = lock ? alertBox('Tu rol <b>solo visualiza</b> los datos del programa. Puedes ajustar las <b>fechas y etapas</b> en el paso 2; para lo demás, solicítalo al Gestor de incentivos.', 'caution', 'padlock-close') : '';
    var generales =
      card('Información general', '', '<div class="pf-grid">' +
        '<div class="pf-span2">' + tf({ label: 'Nombre del programa', req: 1, k: 'datos.nombre', val: d.nombre, ph: 'Ej. Becas deportivas medallistas 2026', hint: 'Aparecerá en listados, reportes y notificaciones.' }) + '</div>' +
        '<div class="pf-span2">' + ta({ label: 'Descripción breve', k: 'datos.desc', val: d.desc, ph: 'A quién va dirigido y para qué.' }) + '</div>' +
        '<div class="pf-span2">' + msHost('evento') + '</div>' +
      '</div>', N()) +
      card('Gestores del programa', 'Quienes revisan documentación y entregan beneficios. Cada uno solo verá y gestionará los programas que tiene a cargo.', '<div class="pf-inc">' + msHost('gestor') + '</div>', N()) +
      card('Vigencia', 'Opcional. El programa rige desde que se activa; si defines fecha de fin, se inactiva solo al cumplirse.', '<div class="pf-grid">' +
        tf({ label: 'Vigencia desde', type: 'date', k: 'datos.desde', val: d.desde, hint: 'Opcional. Si la dejas vacía, rige desde la activación.' }) +
        tf({ label: 'Vigencia hasta', type: 'date', k: 'datos.hasta', val: d.hasta, hint: 'Opcional. Sin fecha de fin no se inactiva solo: lo cierras tú.' }) +
        '<div class="pf-ro"><div><span class="pf-label">Estado inicial</span>' + badge('Configuración', 'caution') + '</div></div>' +
      '</div>', N()) +
      card('Soporte del programa', 'Acto administrativo que respalda el programa. Es opcional.', '<div class="pf-inc">' +
        ta({ label: 'Justificación / acto administrativo', k: 'datos.justificacion', val: d.justificacion, rows: 3, ph: 'Resolución / acto administrativo que soporta el programa...' }) +
        '<div id="pfAnexo">' + anexoInner() + '</div></div>', N());
    return '<div class="pf-sec">' + head('Datos generales del programa', 'Identidad del programa. El estado inicial es <b>Configuración</b>: solo opera (postulaciones y asignaciones) cuando esté <b>Activo</b>.') + lockMsg + wrap(generales) + '</div>';
  }

  /* ── Paso 2 · Información específica del programa ──────────── */
  function step2() {
    var p = S.pob, n = 0, lock = EDIT && role === 'programa';
    function N() { n += 1; return { n: n }; }
    function wrap(h) { return lock ? '<div inert class="pf-sec pf-readonly">' + h + '</div>' : h; }
    var lockMsg = lock ? alertBox('Tu rol <b>solo visualiza</b> esta información. Puedes ajustar las <b>fechas y etapas</b>; para lo demás, solicítalo al Gestor de incentivos.', 'caution', 'padlock-close') : '';
    var especificas =
      card('Población a la que apunta', 'A quién va dirigido el programa. Las condiciones finas de cada incentivo se definen en el paso 3.', '<div class="pf-inc">' +
        msHost('rol') + '<div class="pf-grid">' + msHost('cob') + msHost('mun') + '</div>' +
        '<div><span class="pf-label">Tipo de selección de beneficiarios</span><div class="pf-grid">' +
          [['plataforma', 'Cargue por plataforma', 'Las personas salen de las condiciones de elegibilidad con los datos de SUID.'], ['manual', 'Registro manual', 'El Gestor de programa busca y habilita personas (una a una o por lista) cuando la plataforma no puede identificarlas.']].map(function (o) {
            return '<div class="pf-modal-box pf-opt-box">' + checkbox(o[1], p.seleccion.indexOf(o[0]) > -1, 'seleccion', null, o[0]) + '<p class="pf-hint">' + o[2] + '</p></div>';
          }).join('') + '</div><p class="pf-hint">Puedes marcar una o ambas.</p></div>' +
      '</div>', N()) +
      card('Recurrencia', 'Define si el programa se entrega una sola vez o en ciclos.', '<div class="pf-inc">' +
        '<div class="pf-rec-row"><div class="pf-switch-row">' + toggle(S.rec.on, 'rec-on') + '<span>El programa es <b>recurrente</b> (se entrega en ciclos)</span></div>' +
        (S.rec.on ? sel({ label: 'Periodicidad', req: 1, k: 'rec.frecuencia', val: S.rec.frecuencia, opts: FRECUENCIAS, attrs: ' data-struct="1"' }) : '') + '</div>' +
        (S.rec.on && S.rec.frecuencia === 'otra' ? '<div class="pf-grid">' + tf({ label: 'Cada', req: 1, type: 'number', k: 'rec.frecuenciaN', val: S.rec.frecuenciaN, ph: '2' }) + sel({ label: 'Unidad', k: 'rec.frecuenciaU', val: S.rec.frecuenciaU, opts: ['días', 'semanas', 'meses'] }) + '</div>' : '') +
        (S.rec.on ? alertBox('Al ser recurrente, el programa <b>siempre pide documentos</b> y los tipos de incentivo se entregan en cada ciclo. Cada tipo elige si lleva códigos.', 'informative')
          : alertBox('Entrega única: el beneficiario recibe el incentivo una vez, con código o como certificado.', 'informative')) +
      '</div>', N()) +
      card('Documentación requerida', 'Documentos que el beneficiario carga. Son los mismos para todo el programa; en el paso 3 eliges a qué tipo aplica cada uno.', '<div class="pf-inc">' + docsHTML() + '</div>', N());
    var crono = docsReq() ? card(recOn() ? 'Etapas de cada ciclo' : 'Fechas de cargue y revisión', 'Fechas únicas para todo el programa: no cambian por tipo de incentivo.', cronoBlock(), N()) : '';
    var tipos = card('Tipos de incentivo', 'Cuántos tipos tendrá el programa y cómo se valora cada uno. Todo es opcional.', '<div class="pf-inc">' + tiposHead() + '<div id="pfIncs" class="pf-sec">' + S.inc.map(incCard).join('') + '</div><div id="pfDist"></div></div>', N());
    return '<div class="pf-sec">' + head('Información específica del programa', 'A quién apunta, si es recurrente, qué documentos pide y qué tipos de incentivo entrega.') + lockMsg +
      wrap(especificas) + crono + wrap(tipos) + (EDIT ? logCard(n) : '') + '</div>';
  }
  function tiposHead() {
    var r = S.rubro, varios = r.tipos !== 'uno', n = tiposObjetivo(), nOpts = []; for (var i = 2; i <= 10; i++) nOpts.push(String(i));
    return radios({ act: 'rubro-tipos', value: r.tipos, dir: 'horizontal', options: [
        { v: 'uno', l: 'Un solo tipo de incentivo', s: 'Todo el programa entrega lo mismo (ej. solo becas).' },
        { v: 'varios', l: 'Varios tipos', s: 'Combina categorías (becas + kits + bonos).' }
      ] }) +
      (varios ? '<div class="pf-grid">' + sel({ label: '¿Cuántos tipos de incentivo?', k: 'rubro.n', val: String(n), opts: nOpts, attrs: ' data-struct="1"', hint: 'Entre 2 y 10.' }) + '</div>' : '');
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

  /* ── Dropdowns con multiselección (composición SDK: nwt-dropdown + opciones con checkbox): cobertura, municipios, gestores y roles ── */
  var MUNI = { 'Amazonas': ['Leticia', 'Puerto Nariño'], 'Antioquia': ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Rionegro', 'Apartadó'], 'Arauca': ['Arauca', 'Saravena', 'Tame'], 'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'], 'Bogotá D.C.': ['Bogotá D.C.'], 'Bolívar': ['Cartagena', 'Magangué', 'Turbaco'], 'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'], 'Caldas': ['Manizales', 'La Dorada', 'Chinchiná'], 'Caquetá': ['Florencia', 'San Vicente del Caguán'], 'Casanare': ['Yopal', 'Aguazul', 'Villanueva'], 'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'], 'Cesar': ['Valledupar', 'Aguachica', 'Codazzi'], 'Chocó': ['Quibdó', 'Istmina', 'Tadó'], 'Córdoba': ['Montería', 'Cereté', 'Sahagún', 'Lorica'], 'Cundinamarca': ['Soacha', 'Fusagasugá', 'Zipaquirá', 'Girardot', 'Chía'], 'Guainía': ['Inírida'], 'Guaviare': ['San José del Guaviare', 'Calamar'], 'Huila': ['Neiva', 'Pitalito', 'Garzón'], 'La Guajira': ['Riohacha', 'Maicao', 'Uribia'], 'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'], 'Meta': ['Villavicencio', 'Acacías', 'Granada'], 'Nariño': ['Pasto', 'Tumaco', 'Ipiales'], 'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'], 'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito'], 'Quindío': ['Armenia', 'Calarcá', 'Montenegro'], 'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'], 'San Andrés y Providencia': ['San Andrés', 'Providencia'], 'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Barrancabermeja', 'San Gil'], 'Sucre': ['Sincelejo', 'Corozal', 'Sampués'], 'Tolima': ['Ibagué', 'Espinal', 'Honda', 'Chaparral'], 'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga', 'Cartago'], 'Vaupés': ['Mitú'], 'Vichada': ['Puerto Carreño', 'La Primavera'] }; // muestra representativa para el prototipo
  var MSO = {}; // estado de pantalla: { key, q }
  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function muniDepto(m) { return String(m).split(' · ')[1]; }
  function msCfg(key) {
    return {
      cob: { id: 'pfCob', label: 'Cobertura territorial', req: 0, ph: 'Nacional o departamentos', sp: 'Buscar departamento', box: 'pob.cobertura', get: function () { return S.pob.cobertura; }, options: function () { return REGIONES; }, exclusive: 'Nacional', hint: '' },
      mun: { id: 'pfMun', label: 'Municipios (opcional)', req: 0, ph: 'Todos los municipios', sp: 'Buscar municipio', box: 'pob.municipios', get: function () { return S.pob.municipios; }, options: function () { var o = []; S.pob.cobertura.forEach(function (d) { (MUNI[d] || []).forEach(function (m) { o.push(m + ' · ' + d); }); }); return o; },
        off: function () { return S.pob.cobertura.indexOf('Nacional') > -1 ? 'Nacional' : (!S.pob.cobertura.length ? 'Elige un departamento' : ''); }, hint: '' },
      gestor: { id: 'pfGest', label: 'Gestores asignados', req: 1, ph: 'Selecciona uno o varios gestores', sp: 'Buscar gestor', box: 'datos.gestores', get: function () { return S.datos.gestores; }, options: function () { return GESTORES.concat(S.datos.extra); }, add: 'Agregar a otra persona', addKey: 'gestor', hint: 'Puedes elegir más de uno o agregar a otra persona.' },
      evento: { id: 'pfEvt', label: 'Evento / categoría asociado', req: 0, ph: 'Selecciona uno o varios eventos', sp: 'Buscar evento', box: 'datos.eventos', get: function () { return S.datos.eventos; }, options: function () { return EVENTOS; }, exclusive: 'Sin evento asociado', exTitle: 'Excluido por «Sin evento asociado»', hint: 'Útil para reportería y para validar las condiciones. Un programa puede existir sin evento.' },
      rol: { id: 'pfRol', label: 'Roles', req: 0, ph: 'Selecciona uno o varios roles', sp: 'Buscar rol', box: 'pob.roles', get: function () { return S.pob.roles; }, options: function () { return ROLES.concat(S.pob.rolesExtra); }, add: 'Agregar otro rol', addKey: 'rol', hint: 'Es el público al que apunta el programa. Puedes elegir varios o agregar otro rol.' }
    }[key];
  }
  function msHost(key) { var c = msCfg(key); return '<div class="nwt-dropdown pf-ms" id="' + c.id + '" data-ms="' + key + '" nwt-size="medium">' + msInner(key) + '</div>'; }
  function msIsOpen(key) { return MSO.key === key; }
  function msOptsHTML(key) {
    var c = msCfg(key), sel = c.get(), q = norm((MSO.q || '').trim()), nac = c.exclusive && sel.indexOf(c.exclusive) > -1;
    var list = c.options().filter(function (r) { return !q || norm(r).indexOf(q) > -1; });
    if (!list.length) return '<li class="nwt-dropdown__option nwt-dropdown__option--empty"><span>Sin resultados</span></li>';
    return list.map(function (r) {
      var on = sel.indexOf(r) > -1, off = nac && r !== c.exclusive; // «Nacional» ya los incluye a todos
      return '<li class="nwt-dropdown__option' + (off ? ' nwt-dropdown__option--disabled' : '') + '" role="option" aria-selected="' + on + '"' + (off ? ' aria-disabled="true" title="' + esc(c.exTitle || 'Incluido en «Nacional»') + '"' : ' data-act="ms-opt" data-i="' + key + '" data-x="' + esc(r) + '"') + '><span class="nwt-dropdown__option-checkbox' + (on ? ' nwt-dropdown__option-checkbox--selected' : '') + '">' + (on ? icon('positive') : '') + '</span><span>' + esc(r) + '</span></li>';
    }).join('');
  }
  function msInner(key) {
    var c = msCfg(key), sel = c.get(), open = msIsOpen(key), off = c.off ? c.off() : '';
    var chips = sel.map(function (r) {
      return '<span class="nwt-tag nwt-tag--active" nwt-size="small">' + esc(r) + '<span class="pf-ms__x" role="button" aria-label="Quitar ' + esc(r) + '" data-act="ms-del" data-i="' + key + '" data-x="' + esc(r) + '">' + icon('close') + '</span></span>';
    }).join('') || '<span class="pf-ms__ph">' + esc(off || c.ph) + '</span>';
    var control = '<div class="nwt-dropdown__content pf-ms__content' + (off ? ' pf-ms__content--off' : '') + '" role="combobox" tabindex="' + (off ? -1 : 0) + '" aria-expanded="' + open + '"' + (off ? ' aria-disabled="true"' : ' data-act="ms-toggle" data-i="' + key + '"') + '><div class="pf-ms__chips">' + chips + '</div><div class="nwt-dropdown__chevron pf-ms__chev' + (open ? ' nwt-dropdown__chevron--open' : '') + '">' + icon('chevron-down') + '</div></div>';
    var add = c.add ? '<div class="pf-ms__add"><input class="pf-ms__newq" type="text" autocomplete="off" data-ms="' + key + '" placeholder="' + esc(c.add) + (key === 'rol' ? '' : ' (nombre)') + '" aria-label="' + esc(c.add) + '"/>' + btn('Agregar', 'ms-add', { d: key, s: 'small', i: 'add' }) + '</div>' : '';
    var list = open ? '<div class="nwt-dropdown__list pf-ms__list"><div class="pf-ms__search">' + icon('search') + '<input class="pf-ms__q" type="text" autocomplete="off" data-ms="' + key + '" placeholder="' + esc(c.sp) + '" value="' + esc(MSO.q || '') + '" aria-label="' + esc(c.sp) + '"/></div><ul class="nwt-dropdown__options" id="' + c.id + 'Opts">' + msOptsHTML(key) + '</ul>' + add + '</div>' : '';
    return inputBox(c.label, c.req, control, c.hint, c.box, off ? 'nwt-input-box--disabled' : '') + list;
  }
  /* Si las selecciones no caben en una línea, se muestran las que quepan y un «+N» con el resto */
  function msFit(root) {
    (root || document).querySelectorAll('.pf-ms__chips').forEach(function (box) {
      box.querySelectorAll('.pf-ms__more').forEach(function (m) { m.remove(); });
      var tags = [].slice.call(box.querySelectorAll('.nwt-tag'));
      tags.forEach(function (t) { t.style.display = ''; });
      if (!tags.length || box.scrollWidth <= box.clientWidth + 1) return;
      var more = document.createElement('span'); more.className = 'nwt-tag pf-ms__more'; more.setAttribute('nwt-size', 'small'); box.appendChild(more);
      var hidden = 0;
      for (var i = tags.length - 1; i > 0; i--) {
        tags[i].style.display = 'none'; hidden++; more.textContent = '+' + hidden;
        if (box.scrollWidth <= box.clientWidth + 1) break;
      }
      more.title = tags.slice(tags.length - hidden).map(function (t) { return t.firstChild.textContent; }).join(', ');
    });
  }
  function msRedraw(key) {
    var c = msCfg(key), el = $('#' + c.id); if (!el) return;
    var open = msIsOpen(key);
    el.classList.toggle('nwt-dropdown--open', open);
    el.innerHTML = msInner(key);
    msFit(el);
    if (open) msPlace(el);
  }
  function msClose() { if (!MSO.key) return; var k = MSO.key; MSO = {}; msRedraw(k); }
  /* La lista nunca puede tapar el pie ni salirse del área visible: se abre hacia donde haya espacio y limita su alto. */
  function msPlace(el) {
    var list = el.querySelector('.pf-ms__list'), ctl = el.querySelector('.nwt-dropdown__content'), opts = list && list.querySelector('.nwt-dropdown__options');
    if (!list || !ctl) return;
    var foot = $('.pf-footer'), head = $('#pfHead');
    var GAP = 6, NEED = 200, extra = list.querySelector('.pf-ms__add') ? 48 : 0;
    function room() {
      var c = ctl.getBoundingClientRect();
      return { below: foot.getBoundingClientRect().top - c.bottom - GAP * 2, above: c.top - head.getBoundingClientRect().bottom - GAP * 2 };
    }
    var r = room(), cr0 = ctl.getBoundingClientRect();
    var visible = cr0.top >= head.getBoundingClientRect().bottom && cr0.bottom <= foot.getBoundingClientRect().top;
    if (!visible || Math.max(r.below, r.above) < NEED) { ctl.scrollIntoView({ block: 'center' }); r = room(); }
    var up = r.below < NEED && r.above > r.below, avail = Math.max(120, Math.min(300, (up ? r.above : r.below) - 16));
    opts.style.maxHeight = Math.max(100, avail - 52 - extra) + 'px';
    var e = el.getBoundingClientRect(), c = ctl.getBoundingClientRect();
    list.classList.toggle('pf-ms__list--up', up);
    if (up) { list.style.top = 'auto'; list.style.bottom = (e.bottom - c.top + GAP) + 'px'; }
    else { list.style.bottom = 'auto'; list.style.top = (c.bottom - e.top + GAP) + 'px'; }
  }
  function msToggleVal(key, r) {
    var c = msCfg(key), v = c.get().slice(), i = v.indexOf(r);
    if (c.exclusive && r === c.exclusive) v = i > -1 ? [] : [r]; // marcar «Nacional» reemplaza todo; desmarcarla libera los departamentos
    else { if (c.exclusive && v.indexOf(c.exclusive) > -1) return; if (i > -1) v.splice(i, 1); else v.push(r); }
    if (key === 'cob') { S.pob.cobertura = v; S.pob.municipios = S.pob.municipios.filter(function (m) { return v.indexOf(muniDepto(m)) > -1; }); }
    else if (key === 'mun') S.pob.municipios = v;
    else if (key === 'gestor') S.datos.gestores = v;
    else if (key === 'rol') S.pob.roles = v;
    else if (key === 'evento') S.datos.eventos = v;
    msRedraw(key); if (key === 'cob') msRedraw('mun'); saveDraft(true); refreshDraftBtn();
    var box = document.querySelector('[data-box="' + c.box + '"]'); if (box && v.length) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
  }
  function msAdd(key) {
    var c = msCfg(key), inp = $('#' + c.id + ' .pf-ms__newq'), v = inp && inp.value.trim(), who = key === 'rol' ? 'el nombre del rol' : 'el nombre de la persona';
    if (!v) { toast('Escribe ' + who + '.', 'caution'); return; }
    if (c.options().map(norm).indexOf(norm(v)) > -1) { toast(key === 'rol' ? 'Ese rol ya está en la lista.' : 'Esa persona ya está en la lista.', 'caution'); return; }
    if (key === 'rol') { S.pob.rolesExtra.push(v); S.pob.roles.push(v); } else { S.datos.extra.push(v); S.datos.gestores.push(v); }
    msRedraw(key); saveDraft(true); refreshDraftBtn();
    var q = $('#' + c.id + ' .pf-ms__newq'); if (q) q.focus({ preventScroll: true });
    var box = document.querySelector('[data-box="' + c.box + '"]'); if (box) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
  }

  /* Cantidad de tipos definida en el paso 2 → tarjetas del paso 3 */
  function tiposObjetivo() { return S.rubro.tipos === 'uno' ? 1 : Math.max(2, Math.min(10, parseInt(S.rubro.n, 10) || 2)); }
  function syncInc() {
    var t = tiposObjetivo(), removed = 0;
    if (S.rubro.tipos !== 'uno') S.rubro.n = t;
    while (S.inc.length < t) S.inc.push(newInc());
    while (S.inc.length > t) { var x = S.inc.pop(); if (x.nombre || x.valor || x.cantidad || x.unit) removed++; }
    if (removed) toast('Se quitaron ' + removed + (removed > 1 ? ' tipos que ya tenían datos.' : ' tipo que ya tenía datos.'), 'caution');
  }

  /* ── Tipos de incentivo (dentro del paso 1) ─────────────────── */
  var MOD_TXT = { codigo: 'Entrega única con código', sincodigo: 'Entrega única sin código', certificado: 'Certificado digital / reconocimiento', fijo: 'Incentivo fijo recurrente' };
  function numTxt(v) { return v ? Number(v).toLocaleString('es-CO') : ''; }
  function incCard(inc, idx) {
    var m = inc.modalidad, k = 'inc.' + inc.id + '.', cv = conValor(inc), cat = catOf(inc), n = S.inc.length, fijo = m === 'fijo';
    var extra = '';
    if (m === 'certificado') extra = '<div class="pf-codes pf-codes--off"><div class="pf-switch-row">' + toggle(false, 'noop') + '<span>El incentivo <b>lleva códigos</b></span></div><p class="pf-hint">No aplica: los certificados no llevan código.</p></div>';
    else extra = '<div class="pf-codes"><div class="pf-switch-row">' + toggle(inc.codigos !== false, 'inc-codigos', inc.id) + '<span>El incentivo <b>lleva códigos</b> (cada código es único y equivale a una unidad entregable)</span></div>' +
      '<p class="pf-hint">' + (inc.codigos !== false ? 'Podrás cargarlos en el paso 4; es opcional y no se pueden eliminar si ya registran entregas.' : 'Se entrega sin código: el Operador solo registra la entrega.') + '</p></div>';
    var unitL = fijo ? 'Valor unitario por ciclo' : 'Valor unitario', totL = fijo ? 'Valor total por ciclo' : 'Valor total';
    var cantL = hasCodes(inc) ? 'Cantidad / stock de códigos' : (fijo ? 'Cantidad de beneficiarios' : 'Cantidad');
    var vals = '';
    if (cv && cat) {
      var u = tf({ label: unitL, k: k + 'unit', val: numTxt(inc.unit), ph: '0', mode: 'numeric', pre: '$' });
      var c = tf({ label: cantL, k: k + 'cantidad', val: inc.cantidad, ph: '0', mode: 'numeric' });
      var v = tf({ label: totL, k: k + 'valor', val: numTxt(inc.valor), ph: '0', mode: 'numeric', pre: '$' });
      var grid = inc.tope === 'sin' ? u : inc.tope === 'bottom' ? u + c + tf({ label: totL + ' (se calcula)', k: k + 'valor', val: numTxt(inc.valor), ph: '—', pre: '$', ro: 1 })
        : v + u + tf({ label: cantL + ' (se calcula)', k: k + 'cantidad', val: numTxt(inc.cantidad), ph: '—', ro: 1 });
      vals = radios({ label: 'Cómo se valora este tipo', act: 'inc-tope', d: inc.id, value: inc.tope, dir: 'horizontal', options: [
          { v: 'sin', l: 'Sin tope', s: 'Solo cuánto cuesta cada entrega.' },
          { v: 'bottom', l: 'De abajo hacia arriba', s: 'Valor unitario × cantidad = total.' },
          { v: 'top', l: 'De arriba hacia abajo', s: 'Tope total; la cantidad sale del unitario.' }
        ] }) + '<div class="pf-grid">' + grid + '</div><p class="pf-hint" id="pfCupo-' + inc.id + '">' + esc(cupoText(inc)) + '</p>';
    } else if (cat) {
      vals = '<div class="pf-grid">' + tf({ label: cantL, k: k + 'cantidad', val: inc.cantidad, ph: '0', mode: 'numeric', hint: cupoText(inc) }) + '</div>';
    }
    return '<div class="nwt-card" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body">' +
      '<div class="nwt-card__header"><div class="pf-card-head-row"><h3 class="pf-card-title"><span class="pf-num">' + (idx + 1) + '</span>Tipo de incentivo #' + (idx + 1) + (n > 1 ? ' de ' + n : '') + '</h3></div></div>' +
      '<div class="nwt-card__content"><div class="pf-inc">' +
        '<div class="pf-grid">' +
          tf({ label: 'Nombre', req: 1, k: k + 'nombre', val: inc.nombre, ph: 'Ej. Beca educativa · Medallistas de oro' }) +
          sel({ label: 'Categoría', req: 1, k: k + 'categoria', val: inc.categoria, ph: 'Selecciona categoría', opts: CATEGORIAS.map(function (c) { return [c.k, c.l]; }), attrs: ' data-struct="1"', hint: inc.categoria ? (cv ? 'Con valor numérico.' : 'Sin valor monetario: no se pide valor.') : '' }) +
        '</div>' + extra + vals +
      '</div></div><div class="nwt-card__footer"></div></div></div>';
  }
  function totalCupo() { return S.inc.reduce(function (a, i) { return a + (Number(i.cantidad) || 0); }, 0); }
  function updateDist() {
    var host = $('#pfDist'); if (!host) return;
    var total = S.inc.reduce(function (a, i) { return a + (Number(i.valor) || 0); }, 0), cupo = totalCupo();
    if (!total && !cupo) { host.innerHTML = ''; return; }
    host.innerHTML = alertBox('Total del programa: <b>' + (total ? money(total) : 'sin valor') + '</b>' + (recOn() && total ? ' por ciclo' : '') + (cupo ? ' · cupo de <b>' + cupo.toLocaleString('es-CO') + ' entregas</b>' : '') + '. Se calcula con los tipos que tienen valor y cantidad.', 'informative');
  }

  /* ── Paso 4 · Condiciones, documentación y etapas — POR TIPO DE INCENTIVO ───────── */
  function soloEntidades() { return S.pob.roles.length > 0 && S.pob.roles.every(function (r) { return ENTIDADES.indexOf(r) > -1; }); }
  function fieldGroups(cur) {
    return Object.keys(FAMILIAS).map(function (fam) {
      return '<optgroup label="' + FAMILIAS[fam] + '">' + Object.keys(FIELDS).filter(function (k) { return FIELDS[k].fam === fam && (k === cur || !(soloEntidades() && CAMPOS_PERSONA.indexOf(k) > -1)); }).map(function (k) { return '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + FIELDS[k].label + '</option>'; }).join('') + '</optgroup>';
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
  /* Cobertura y roles del paso 2 son condiciones de todos los incentivos del programa */
  function heredadas() {
    var h = [], p = S.pob;
    if (p.roles.length) h.push(['Rol', p.roles.length > 1 ? 'es uno de: ' + listaO(p.roles) : 'es ' + p.roles[0]]);
    if (p.cobertura.length && p.cobertura.indexOf('Nacional') < 0) h.push(['Departamento', p.cobertura.length > 1 ? 'es uno de: ' + listaO(p.cobertura) : 'es ' + p.cobertura[0]]);
    if (p.municipios.length) { var m = p.municipios.map(function (x) { return x.split(' · ')[0]; }); h.push(['Municipio', m.length > 1 ? 'es uno de: ' + listaO(m) : 'es ' + m[0]]); }
    return h;
  }
  function heredadasTxt() { return heredadas().map(function (x) { return esc(x[0] + ' ' + x[1]); }); }
  function heredadasHTML() {
    var h = heredadas();
    if (!h.length) return '';
    return '<div class="pf-inherit"><div class="pf-inherit__head"><b>Condiciones del programa</b>' + btn('Cambiar en el paso 2', 'goto', { v: 'mute', x: '2', i: 'edit' }) + '</div>' +
      '<p class="pf-hint">Vienen de la población (paso 2): aplican a todos los incentivos y se suman con Y a las de este tipo. No se editan aquí.</p>' +
      h.map(function (x) { return '<div class="pf-inherit__row">' + icon('padlock-close') + '<span><b>' + esc(x[0]) + '</b> ' + esc(x[1]) + '</span></div>'; }).join('') + '</div>';
  }
  function previewHTML(inc) {
    var t = previewText(inc), h = heredadasTxt();
    if (h.length) return 'Podrá recibirlo quien cumpla: ' + h.join(' <em>y</em> ') + (t ? ' <em>y</em> (' + t + ')' : '') + '.';
    return t ? 'Podrá recibirlo quien cumpla: ' + t + '.' : '<span class="pf-pv-empty">Sin condiciones: cualquier persona podrá acceder a este incentivo.</span>';
  }
  function groupsHTML(inc) {
    var id = inc.id;
    return inc.grupos.map(function (g, gi) {
        return (gi > 0 ? '<div class="pf-or"><span>O</span></div>' : '') + '<div class="pf-group"><div class="pf-group__head"><span class="pf-group__label">Grupo ' + (gi + 1) + '</span>' +
          '<span style="flex:1"></span>' + (inc.grupos.length > 1 ? btn('Quitar grupo', 'grp-del', { v: 'mute', d: id, x: gi, i: 'delete' }) : '') + '</div>' +
          g.rows.map(function (r, ri) { return ruleRow(inc, gi, ri, r); }).join('') +
          btn('Añadir condición', 'rule-add', { d: id, x: gi, i: 'add' }) + '</div>';
      }).join('') +
      '<div>' + btn('Agregar grupo alternativo (O)', 'grp-add', { d: id, i: 'add' }) + '</div>' +
      '<div><span class="pf-label">Así se leerá la regla</span><div class="pf-preview" id="pfPreview-' + id + '">' + previewHTML(inc) + '</div></div>';
  }

  /* Documentación requerida (a nivel de programa) */
  function docsHTML() {
    var d = S.doc, forced = recOn();
    var out = forced ? '' : '<div class="pf-switch-row">' + toggle(d.req, 'doc-req') + '<span>¿El programa pide documentos al beneficiario?</span></div>';
    if (!docsReq()) return out + alertBox('<b>Flujo directo:</b> sin postulación ni cargue de documentos. El beneficiario elegible queda habilitado para que el Operador le asigne el incentivo.', 'informative');
    out += alertBox((forced ? '<b>Obligatoria por ser recurrente:</b> ' : '<b>Con postulación documental:</b> ') + 'el beneficiario carga soportes (PDF, JPG, PNG) en la ventana de fechas, el Gestor de programa los revisa y solo con <b>Documentación aprobada</b> el Operador puede asignar.', 'informative');
    out += '<div><span class="pf-label">Documentos que pide</span><div class="pf-sec" style="gap:8px">' + (d.list.length ? d.list.map(function (x, i) {
      return '<div class="pf-doc"><span class="pf-doc__name">' + esc(x.name) + '</span>' + checkbox('Obligatorio', x.oblig, 'doc-oblig', null, i) + iconBtn('close', 'doc-del', 'Quitar documento', null, i) + '</div>';
    }).join('') : '<p class="pf-hint">Agrega al menos un documento obligatorio.</p>') + '</div></div>';
    out += '<div class="pf-row">' + DOC_SUGERIDOS.filter(function (n) { return !d.list.some(function (x) { return x.name === n; }); }).map(function (n) { return tag('+ ' + n, false, 'doc-add-s', null, n); }).join('') + '</div>';
    out += '<div class="pf-add">' + tf({ label: 'Otro documento', k: 'ui.docNuevo', val: '', ph: 'Nombre del documento' }) + btn('Agregar', 'doc-add', { v: 'quiet', s: 'medium', i: 'add' }) + '</div>';
    return out;
  }

  /* ── Etapas / cronograma del programa (HU-06): recurrente → días de cada ciclo; si no, ventana con fechas ── */
  function frecuenciaTxt() { return S.rec.frecuencia === 'otra' ? 'cada ' + (S.rec.frecuenciaN || '?') + ' ' + (S.rec.frecuenciaU || 'meses') : S.rec.frecuencia; }
  function cronoSummary() {
    var c = S.crono, rec = recOn();
    var fases = FASES.filter(function (f) { return c[f[0]].ini || c[f[0]].fin; }).map(function (f) {
      var a = c[f[0]].ini, b = c[f[0]].fin;
      return f[1] + ' ' + (rec ? (a ? 'desde el día ' + a : '') + (a && b ? ' ' : '') + (b ? 'hasta el día ' + b : '') : (a ? 'desde ' + fmtDT(a) : '') + (a && b ? ' ' : '') + (b ? 'hasta ' + fmtDT(b) : ''));
    });
    return (fases.length ? fases.join(' · ') : 'Etapas sin fechas definidas') + (c.gracia ? ' · Gracia ' + c.gracia + ' días hábiles' : ' · Sin plazo de gracia');
  }
  function cronoBlock() {
    var rec = recOn(), c = S.crono, kk = 'crono.';
    var rows = FASES.map(function (f, i) {
      var k = f[0];
      return '<div class="pf-phase"><div class="pf-phase__head"><span class="pf-num">' + (i + 1) + '</span><div><b>' + f[1] + '</b><p class="pf-hint">' + f[2] + '</p></div></div><div class="pf-grid">' +
        (rec ? tf({ label: 'Desde el día del ciclo', type: 'number', k: kk + k + '.ini', val: c[k].ini, ph: '1', hint: 'Opcional.' }) + tf({ label: 'Cierre: hasta el día del ciclo', type: 'number', k: kk + k + '.fin', val: c[k].fin, ph: '30', hint: 'Opcional. Si la defines, es estricta.' })
          : tf({ label: 'Inicio', type: 'datetime-local', k: kk + k + '.ini', val: c[k].ini, hint: 'Opcional.' }) + tf({ label: 'Cierre', type: 'datetime-local', k: kk + k + '.fin', val: c[k].fin, hint: 'Opcional. Si la defines, es estricta.' })) +
      '</div></div>';
    }).join('');
    var top = '<div class="pf-grid">' + tf({ label: 'Plazo de gracia para subsanar (días hábiles)', type: 'number', k: kk + 'gracia', val: c.gracia, ph: 'Ej. 3', hint: 'Opcional. Excluye sábados, domingos y festivos de Colombia.' }) + '<div></div></div>';
    var note = rec ? alertBox('El primer ciclo empieza el <b>día en que se activa</b> el programa (nunca antes) y se repite (' + frecuenciaTxt() + '). Las etapas son <b>independientes</b>: puedes cargar, revisar y asignar desde el mismo día; solo los <b>cierres</b> se hacen cumplir. Valen para todos los tipos y cada cambio queda auditado.', 'informative', 'calendar')
      : alertBox('Las etapas son <b>independientes</b>: puedes cargar, revisar y asignar desde el mismo día; solo los <b>cierres</b> se hacen cumplir. Fuera de la ventana se bloquea la postulación, salvo <b>habilitación excepcional</b>. Valen para todos los tipos y cada cambio queda auditado.', 'informative', 'calendar');
    return '<div class="pf-inc">' + note + top + rows + '<div id="pfCronoChg">' + cronoChgHTML() + '</div></div>';
  }
  function cronoChanges() {
    if (!SNAP || !SNAP.crono) return [];
    var out = [], a = SNAP.crono, b = S.crono, rec = recOn();
    FASES.forEach(function (f) { ['ini', 'fin'].forEach(function (w) { if (a[f[0]][w] !== b[f[0]][w]) out.push({ campo: f[1] + (w === 'ini' ? ' · inicio' : ' · cierre'), antes: rec ? 'día ' + a[f[0]][w] : fmtDT(a[f[0]][w]), despues: rec ? 'día ' + b[f[0]][w] : fmtDT(b[f[0]][w]) }); }); });
    if (a.gracia !== b.gracia) out.push({ campo: 'Plazo de gracia', antes: a.gracia ? a.gracia + ' días hábiles' : 'sin plazo', despues: b.gracia ? b.gracia + ' días hábiles' : 'sin plazo' });
    return out;
  }
  function cronoChgHTML() {
    if (!EDIT) return '';
    var ch = cronoChanges();
    if (!ch.length) return '<p class="pf-hint">Sin cambios en las etapas. Si ajustas una fecha, deberás indicar el motivo y quedará en la bitácora.</p>';
    return alertBox('Cambios a las etapas (<b>no generan versión</b>, quedan en la bitácora): ' + ch.map(function (x) { return esc(x.campo) + ' <b>' + esc(x.antes) + ' → ' + esc(x.despues) + '</b>'; }).join(' · '), 'caution', 'attention') +
      ta({ label: 'Motivo del cambio', req: 1, k: 'crono.motivo', val: S.crono.motivo, rows: 2, ph: 'Ej. Ampliación por solicitud de la federación (Res. 123)', hint: 'Obligatorio. Se guarda con usuario, rol, fecha, hora e IP.' });
  }
  function logCard(n) {
    if (!EDIT) return '';
    var rows = LOG.map(function (l) {
      return '<div class="pf-log"><div class="pf-log__top"><b>' + esc(l.ev) + '</b><span class="pf-hint">' + esc(l.ts) + '</span></div><div>' + esc(l.det) + '</div><div class="pf-hint">' + esc(l.user) + ' · ' + esc(l.rol) + ' · IP ' + esc(l.ip) + (l.motivo && l.motivo !== '—' ? ' · <b>Motivo:</b> ' + esc(l.motivo) : '') + '</div></div>';
    }).join('');
    return card('Bitácora de etapas', 'Registro inmutable de cada cambio: quién, cuándo, qué cambió y por qué.', '<div class="pf-sec" style="gap:12px">' + rows + '</div>', { n: n + 1 });
  }

  /* ── Paso 2 · Condiciones de elegibilidad — POR TIPO DE INCENTIVO ───────── */
  /* Tipos plegables: solo el primero arranca abierto. Es estado de pantalla, no del programa. */
  var tipoOpen = {};
  function isTipoOpen(inc, idx) { return inc.id in tipoOpen ? tipoOpen[inc.id] : idx === 0; }
  function incIssues(inc) { // pendientes del tipo (para avisar aunque esté plegado)
    var e = [];
    inc.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (r.f && !ruleNat(r)) e.push(1); }); });
    return e;
  }
  function docsAplican(inc) { return S.doc.list.filter(function (x) { return inc.docOff.indexOf(x.name) < 0; }); }
  function incSummary(inc) {
    var nr = inc.grupos.reduce(function (a, g) { return a + g.rows.filter(ruleNat).length; }, 0), nd = docsAplican(inc).length;
    var nh = heredadas().length;
    return [nr ? nr + (nr > 1 ? ' condiciones' : ' condición') : 'sin condiciones propias', nh ? nh + ' del programa' : null, docsReq() ? nd + (nd === 1 ? ' documento' : ' documentos') : 'sin documentos'].filter(Boolean).join(' · ');
  }
  /* Si el evento tiene una población acotada, avisa (sin bloquear: un programa puede apuntar a antiguos participantes) */
  function eventWarn(inc) {
    if (S.pob.roles.indexOf('Personal de apoyo') > -1 && S.pob.roles.length === 1) return '';
    var out = '';
    S.datos.eventos.forEach(function (ev) {
      var max = EVENTO_EDAD[ev]; if (max == null) return;
      var hit = inc.grupos.some(function (g) { return g.rows.some(function (r) { return r.f === 'edad' && r.v !== '' && (r.op === '≥' || r.op === '=') && +r.v > max; }); });
      if (hit) out += alertBox('<b>' + esc(ev) + '</b> solo tiene participantes de hasta ' + max + ' años: una condición de edad mayor no encontrará deportistas de ese evento. Si el programa apunta a antiguos participantes que hoy son mayores de edad, puedes continuar.', 'caution', 'attention');
    });
    return out;
  }
  function docsAplicaHTML(inc) {
    if (!docsReq()) return alertBox('El programa no pide documentos: este tipo sigue el <b>flujo directo</b>.', 'informative');
    return '<p class="pf-hint">Marca los documentos que exige este tipo. Las fechas de cargue y revisión son las del paso 2 y no cambian por tipo.</p><div class="pf-sec" style="gap:8px">' + S.doc.list.map(function (x, i) {
      return '<div class="pf-doc"><span class="pf-doc__name">' + esc(x.name) + (x.oblig ? '' : ' <span class="pf-hint">(opcional)</span>') + '</span>' + checkbox('Aplica a este tipo', inc.docOff.indexOf(x.name) < 0, 'tipo-doc', inc.id, i) + '</div>';
    }).join('') + '</div>';
  }
  function incPanel(inc, idx) {
    var cat = catOf(inc), open = isTipoOpen(inc, idx), issues = incIssues(inc).length;
    var badges = '<span class="pf-row" style="gap:6px;flex-shrink:0">' + (issues ? badge('Incompleto', 'caution') : '') + (cat ? badge(cat.l, 'neutral') : '') + badge({ codigo: 'Con código', sincodigo: 'Sin código', certificado: 'Certificado', fijo: 'Fijo ' + frecuenciaTxt() }[inc.modalidad], inc.modalidad === 'fijo' ? 'caution' : 'neutral') + (inc.modalidad === 'fijo' && hasCodes(inc) ? badge('Con código', 'neutral') : '') + '</span>';
    var body = '<div class="pf-inc"><div ' + (CONDITIONS_LOCKED ? 'inert class="pf-sec pf-readonly"' : 'class="pf-sec"') + '>' +
      '<div class="pf-subsec"><h4 class="pf-sub">Condiciones de elegibilidad</h4><p class="pf-hint">Quién puede recibir este incentivo. Se combinan con Y; si falla una, el sistema <b>bloquea y dice cuál</b>.' + (soloEntidades() ? ' Para entidades (escenarios, instituciones) no aplican los campos de personas, como edad o género.' : '') + '</p>' + heredadasHTML() + groupsHTML(inc) + eventWarn(inc) + '</div>' +
      '<div class="pf-subsec"><h4 class="pf-sub">Documentación</h4>' + docsAplicaHTML(inc) + '</div>' +
      '</div></div>';
    var title = esc(inc.nombre || ('Tipo de incentivo #' + (idx + 1)));
    return '<div class="nwt-card pf-type' + (open ? '' : ' pf-type--closed') + '" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body">' +
      '<div class="nwt-card__header"><div class="pf-card-head-row">' +
        '<button type="button" class="pf-type-toggle" data-act="tipo-toggle" data-i="' + inc.id + '" aria-expanded="' + open + '">' +
          '<span class="pf-type__chev' + (open ? ' is-open' : '') + '">' + icon('chevron-down') + '</span><span class="pf-num">' + (idx + 1) + '</span><span class="pf-type__name">' + title + '</span></button>' + badges +
      '</div>' + (open ? '' : '<p class="pf-card-sub pf-type__sum">' + esc(incSummary(inc)) + '</p>') + '</div>' +
      (open ? '<div class="nwt-card__content">' + body + '</div>' : '') + '<div class="nwt-card__footer"></div></div></div>';
  }
  function step3() {
    var lockMsg = CONDITIONS_LOCKED ? alertBox('Tu rol <b>solo visualiza</b> las condiciones y los documentos. Puedes ajustar las <b>fechas y etapas</b> en el paso 2; para lo demás, solicítalo al Gestor de incentivos.', 'caution', 'padlock-close') : '';
    var man = S.pob.seleccion.indexOf('manual') > -1 ? alertBox('Con <b>registro manual</b> las condiciones son opcionales: el Gestor de programa habilita a las personas que la plataforma no puede identificar.', 'informative') : '';
    return '<div class="pf-sec">' + head('Condiciones de elegibilidad', 'Define condiciones por cada tipo de incentivo. Dentro de un grupo todas las condiciones se cumplen simultáneamente (Y). Agrega otro grupo si aceptas reglas alternativas (O entre grupos).') + lockMsg + man +
      (S.inc.length >= 3 ? '<div class="pf-row" style="justify-content:flex-end">' + btn('Abrir todos', 'tipo-all', { v: 'mute', d: 'open', i: 'chevron-down' }) + btn('Colapsar', 'tipo-all', { v: 'mute', d: 'close', i: 'chevron-up' }) + '</div>' : '') +
      S.inc.map(incPanel).join('') + '</div>';
  }

  /* ── Inventario de códigos ────────────────────────────── */
  function kv(k, v) { return '<div class="pf-kv"><dt>' + esc(k) + '</dt><dd>' + v + '</dd></div>'; }
  function codState(id) {
    var c = S.codigos[id] || (S.codigos[id] = { modo: '', n: 0 });
    if (c.modo === 'ahora') c.modo = 'masivo';
    if (c.modo === 'despues') c.modo = '';
    if (!Array.isArray(c.lista) || !c.lista.length) c.lista = [''];
    return c;
  }
  function codManual(c) {
    var seen = {}, ok = 0, dup = 0;
    c.lista.forEach(function (v) { v = v.trim().toLowerCase(); if (!v) return; if (seen[v]) dup++; else { seen[v] = 1; ok++; } });
    return { ok: ok, dup: dup };
  }
  function codCountText(inc) {
    var c = codState(inc.id), st = c.modo === 'manual' ? codManual(c) : { ok: c.n, dup: 0 }, q = Number(inc.cantidad) || 0;
    var t = st.ok + ' código' + (st.ok === 1 ? '' : 's') + ' válido' + (st.ok === 1 ? '' : 's') + (q ? ' de ' + q.toLocaleString('es-CO') + ' cupos' : '');
    if (st.dup) t += ' · ' + st.dup + ' repetido' + (st.dup === 1 ? '' : 's') + ' (cada código debe ser único)';
    else if (q && st.ok > q) t += ' · sobran ' + (st.ok - q);
    else if (q && st.ok && st.ok < q) t += ' · faltan ' + (q - st.ok) + ' para completar el inventario';
    else if (q && st.ok === q) t += ' · inventario completo';
    return t;
  }

  /* ── Paso 3 · Códigos y activación ──────────────────────────── */
  function rolesTxt() { return S.pob.roles.join(', '); }
  function incValTxt(i) {
    if (!conValor(i)) return (Number(i.cantidad) ? ' · ' + Number(i.cantidad).toLocaleString('es-CO') + ' cupos' : '');
    var u = Number(i.unit) || 0, c = Number(i.cantidad) || 0, v = Number(i.valor) || 0, cic = i.modalidad === 'fijo' ? ' por ciclo' : '';
    if (i.tope === 'sin') return u ? ' · sin tope · ' + money(u) + cic + ' por entrega' : ' · sin tope';
    if (i.tope === 'bottom') return (u ? ' · ' + money(u) + ' c/u' : '') + (c ? ' × ' + c.toLocaleString('es-CO') : '') + (v ? ' = ' + money(v) + cic : '');
    return (v ? ' · tope ' + money(v) + cic : '') + (u ? ' · ' + money(u) + ' c/u' : '') + (c ? ' → ' + c.toLocaleString('es-CO') + ' entregas' : '');
  }
  function step4() {
    var cod = S.inc.filter(hasCodes);
    var codHTML = cod.length ? cod.map(function (i) {
      var c = codState(i.id);
      var body = '';
      if (c.modo === 'masivo') body = '<div class="pf-drop">' + icon('upload') + (c.n ? '<b>' + c.n + ' códigos válidos cargados</b><span>1 duplicado omitido</span>' : '<span>Arrastra una plantilla Excel/CSV o selecciónala</span>') + '<div class="pf-row">' + btn('Descargar plantilla', 'cod-tpl', { i: 'download' }) + btn(c.n ? 'Reemplazar carga' : 'Simular carga', 'cod-sim', { v: 'loud', d: i.id, i: 'upload' }) + '</div></div>';
      else if (c.modo === 'manual') body = '<div class="pf-cod-rows">' + c.lista.map(function (v, ix) {
        return '<div class="pf-cod-row">' + tf({ label: ix === 0 ? 'Código' : '', k: 'cod.' + i.id + '.' + ix, val: v, ph: 'Ej. BONO-0001' }) + '<div>' + (c.lista.length > 1 ? iconBtn('close', 'cod-del', 'Quitar código', i.id, ix) : '') + '</div></div>';
      }).join('') + '</div>' + btn('Agregar código', 'cod-add', { d: i.id, i: 'add' });
      else body = '<p class="pf-hint">Opcional: si no los cargas ahora, el Gestor de programa o el de incentivos podrán cargarlos cuando quieran, sin versionar el programa. Vuelve a tocar la opción elegida para quitarla.</p>';
      return '<div class="pf-modal-box"><b>' + esc(i.nombre || 'Incentivo sin nombre') + '</b>' + radios({ act: 'cod-modo', d: i.id, value: c.modo, dir: 'horizontal', compact: 1, options: [{ v: 'masivo', l: 'Carga masiva (archivo)' }, { v: 'manual', l: 'Carga manual' }] }) + body +
        (!c.modo ? '' : '<p class="pf-hint" id="pfCodCount-' + i.id + '">' + codCountText(i) + '</p>') + '</div>';
    }).join('') : alertBox('Ningún incentivo de este programa lleva códigos: no hay inventario que cargar. Si alguno debe llevarlos, actívalo en el paso 2, en el tipo de incentivo.', 'informative') + '<div>' + btn('Ir a los tipos de incentivo', 'goto', { v: 'quiet', x: '2', i: 'edit' }) + '</div>';

    var d = S.datos, p = S.pob, nada = '<span style="color:var(--naotech-app-color-600);font-weight:400">';
    var total = S.inc.reduce(function (a, i) { return a + (Number(i.valor) || 0); }, 0);
    var incTxt = S.inc.map(function (i) { return '<div>' + esc(i.nombre || 'Sin nombre') + (catOf(i) ? ' (' + esc(catOf(i).l) + ')' : '') + ' · ' + badge({ codigo: 'Con código', sincodigo: 'Sin código', certificado: 'Certificado', fijo: 'Fijo ' + frecuenciaTxt() }[i.modalidad], i.modalidad === 'fijo' ? 'caution' : 'neutral') + (i.modalidad === 'fijo' && hasCodes(i) ? ' ' + badge('Con código', 'neutral') : '') + esc(incValTxt(i)) + '</div>'; }).join('');
    var rev = card('Resumen del programa', 'Revisa antes de guardar. Puedes volver a cualquier paso.', '<div class="pf-sum"><dl style="margin:0">' +
      kv('Programa', esc(d.nombre) + ' ' + (EDIT ? badge('Activo · ' + CUR_VER, 'positive') : badge('Configuración', 'caution'))) + kv('Eventos', esc(d.eventos.join(', ') || '—')) + kv('Gestores', esc(d.gestores.join(', ') || '—')) +
      kv('Vigencia', (d.desde ? fmtDate(d.desde) : 'Desde la activación') + ' → ' + (d.hasta ? fmtDate(d.hasta) : 'Sin fecha de fin')) + kv('Roles', p.roles.length ? esc(rolesTxt()) : nada + 'Sin roles definidos</span>') + kv('Cobertura', esc(p.cobertura.join(', ')) + (p.municipios.length ? '<br><span style="font-weight:400">Municipios: ' + esc(p.municipios.map(function (m) { return m.split(' · ')[0]; }).join(', ')) + '</span>' : '')) +
      kv('Selección de beneficiarios', esc(p.seleccion.map(function (s) { return s === 'manual' ? 'Registro manual' : 'Cargue por plataforma'; }).join(' + '))) +
      kv('Recurrencia', recOn() ? 'Recurrente · ' + esc(frecuenciaTxt()) : 'Entrega única') +
      kv('Documentos y fechas', docsReq() ? esc(S.doc.list.map(function (x) { return x.name + (x.oblig ? '' : ' (opcional)'); }).join(', ') || '—') + '<br>' + esc(cronoSummary()) : 'No pide documentos (flujo directo)') +
      kv('Justificación', d.justificacion.trim() ? esc(d.justificacion) : nada + 'No registrada</span>') + kv('Doc. de la resolución', d.anexo ? esc(d.anexo.name) + ' (' + fmtSize(d.anexo.size) + ')' : nada + 'Sin archivo adjunto</span>') +
      kv('Incentivos', incTxt + (total ? '<div><b>Total: ' + money(total) + (recOn() ? ' por ciclo' : '') + '</b></div>' : '')) +
      kv('Elegibilidad por tipo', S.inc.map(function (i) { return '<div><b>' + esc(i.nombre || 'Sin nombre') + ':</b> <span style="font-weight:400">' + previewHTML(i) + '</span></div>'; }).join('')) +
      (docsReq() ? kv('Documentos por tipo', S.inc.map(function (i) { return '<div><b>' + esc(i.nombre || 'Sin nombre') + ':</b> <span style="font-weight:400">' + (esc(docsAplican(i).map(function (x) { return x.name; }).join(', ')) || 'Ninguno') + '</span></div>'; }).join('')) : '') +
    '</dl></div>', { n: 2 });
    var ch = EDIT ? versionChanges() : [];
    var act = EDIT ? card('Versión resultante', 'Las reglas de versionamiento del programa Activo.', ch.length
      ? alertBox('Se publicará la <b>versión ' + NEXT_VER + '</b>. Cambios que la generan: <b>' + ch.join(' · ') + '</b>. La ' + CUR_VER + ' y todo lo entregado bajo ella quedan congelados e inmutables; si cambian los documentos, las aprobaciones previas pasan a «Expirada / Histórica por nueva versión» al iniciar el siguiente ciclo.', 'caution', 'attention')
      : alertBox('Sin cambios de fondo: se conserva la <b>versión ' + CUR_VER + '</b>. Solo se registra la edición en la bitácora de auditoría.', 'positive', 'positive'), { n: 3 })
    : card('Activación', 'El programa solo opera cuando está <b>Activo</b>. Al activarlo queda en <b>versión V1.0</b>.', radios({ act: 'activar', value: S.activar, options: [
      { v: 'config', l: 'Guardar en Configuración', s: 'Queda como borrador operativo. Puedes terminar de parametrizar y activar después.' },
      { v: 'activo', l: 'Activar ahora', s: 'Habilita postulaciones y asignaciones. Se registra auditoría con usuario, fecha, hora e IP.' }
    ] }), { n: 3 });
    return '<div class="pf-sec">' + head('Códigos y activación', 'Carga el inventario de códigos (opcional, solo incentivos con código) y revisa el programa completo.') +
      card('Inventario de códigos', 'Aplica solo a incentivos de entrega única con código. Es opcional: puedes cargarlos después.', '<div class="pf-inc">' + codHTML + '</div>', { n: 1 }) + rev + act + '<div id="pfIssues"></div></div>';
  }

  /* ── Validación por paso ────────────────────────────────────── */
  function validate(step) {
    var e = [], d = S.datos;
    if (step >= 1) {
      if (!d.nombre.trim()) e.push(['datos.nombre', 'Escribe el nombre del programa.', 1]);
      if (!d.gestores.length) e.push(['datos.gestores', 'Asigna al menos un gestor de programa.', 1]);
      if (d.desde && d.hasta && d.hasta < d.desde) e.push(['datos.hasta', 'La fecha de fin debe ser posterior al inicio.', 1]);
    }
    if (step >= 2) {
      if (!S.pob.cobertura.length) e.push(['pob.cobertura', 'Selecciona «Nacional» o al menos un departamento.', 2]);
      if (recOn() && S.rec.frecuencia === 'otra' && !Number(S.rec.frecuenciaN)) e.push(['rec.frecuenciaN', 'Indica cada cuánto se repite.', 2]);
      if (docsReq() && !S.doc.list.some(function (x) { return x.oblig; })) e.push(['', 'Agrega al menos un documento obligatorio.', 2]);
      if (docsReq()) cronoErrors(e);
      if (EDIT && cronoChanges().length && !S.crono.motivo.trim()) e.push(['crono.motivo', 'Indica el motivo del cambio de etapas.', 2]);
      S.inc.forEach(function (i) {
        if (!i.nombre.trim()) e.push(['inc.' + i.id + '.nombre', 'Nombra el incentivo.', 2]);
        if (!i.categoria) e.push(['inc.' + i.id + '.categoria', 'Selecciona la categoría.', 2]);
      });
    }
    if (step >= 3) S.inc.forEach(function (inc) {
      var nm = '«' + (inc.nombre || 'tipo sin nombre') + '»';
      inc.grupos.forEach(function (g) { g.rows.forEach(function (r) { if (r.f && !ruleNat(r)) e.push(['', 'Condición incompleta en ' + nm + ': ' + FIELDS[r.f].label + '.', 3]); }); });
    });
    return e;
  }
  function cronoErrors(e) {
    var c = S.crono, rec = recOn(), kk = 'crono.';
    if (c.gracia !== '' && !(+c.gracia > 0)) e.push([kk + 'gracia', 'Usa un número de días mayor que cero o déjalo vacío.', 2]);
    FASES.forEach(function (f) { // las etapas son independientes: solo se valida cada una contra sí misma y contra la vigencia
      var k = f[0], a = c[k].ini, b = c[k].fin;
      if (a && b) {
        if (rec) {
          if (+a < 1 || +b > 31) e.push([kk + k + '.fin', 'Usa días entre 1 y 31.', 2]);
          else if (+b < +a) e.push([kk + k + '.fin', 'El cierre no puede ser antes del inicio.', 2]);
        } else if (b <= a) e.push([kk + k + '.fin', 'El cierre debe ser posterior al inicio.', 2]);
      }
      if (rec && a && (+a < 1 || +a > 31)) e.push([kk + k + '.ini', 'Usa días entre 1 y 31.', 2]);
      if (rec && b && (+b < 1 || +b > 31)) e.push([kk + k + '.fin', 'Usa días entre 1 y 31.', 2]);
      if (!rec) {
        if (a && S.datos.desde && a.slice(0, 10) < S.datos.desde) e.push([kk + k + '.ini', 'Queda fuera de la vigencia del programa.', 2]);
        if (b && S.datos.hasta && b.slice(0, 10) > S.datos.hasta) e.push([kk + k + '.fin', 'Queda fuera de la vigencia del programa.', 2]);
      }
    });
    /* Los cierres que se definan no pueden ir al revés: asignación no cierra antes que revisión, ni revisión antes que cargue */
    var prev = null, prevName = '';
    FASES.forEach(function (f) {
      var b = c[f[0]].fin; if (!b) return;
      var v = rec ? +b : b;
      if (prev !== null && v < prev) e.push([kk + f[0] + '.fin', 'El cierre de ' + f[1].toLowerCase() + ' no puede ser antes del cierre de ' + prevName.toLowerCase() + '.', 2]);
      else { prev = v; prevName = f[1]; }
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
    if (JSON.stringify(S.rec) !== JSON.stringify(SNAP.rec)) ch.push('Recurrencia / frecuencia');
    if (JSON.stringify([docsReq(), S.doc.list]) !== JSON.stringify([SNAP.rec.on || SNAP.doc.req, SNAP.doc.list])) ch.push('Documentos requeridos');
    S.inc.forEach(function (i) {
      var s = SNAP.inc.filter(function (x) { return x.id === i.id; })[0]; if (!s) return;
      var nm = i.nombre || 'tipo';
      if (JSON.stringify(i.grupos) !== JSON.stringify(s.grupos)) ch.push('Condicionales de elegibilidad (' + nm + ')');
      if (i.modalidad !== s.modalidad) ch.push('Modalidad (' + nm + ')');
      if (JSON.stringify(i.docOff) !== JSON.stringify(s.docOff)) ch.push('Documentos requeridos (' + nm + ')');
    });
    return ch;
  }
  function banner() {
    var host = $('#pfBanner'), h = '';
    if (!EDIT && !CAN_EDIT_PROGRAM) h = alertBox('Tu rol no crea programas: lo hace el Gestor de incentivos, Administrador o Superadmin. Puedes explorar el formulario, pero no guardar.', 'caution', 'padlock-close');
    if (EDIT) {
      var ch = versionChanges(), cc = cronoChanges();
      h = ch.length ? alertBox('Editas <b>' + CUR_VER + ' (Activo)</b>. Estos cambios generarán la <b>nueva versión ' + NEXT_VER + '</b>: ' + ch.join(' · ') + '. Lo ya entregado en ' + CUR_VER + ' queda congelado e inmutable.', 'caution', 'attention')
        : alertBox('Editas <b>' + CUR_VER + ' (Activo)</b>. Cambiar <b>condicionales, frecuencia o documentos</b> crea una nueva versión (' + NEXT_VER + '). Cambiar estado, extender vigencia, <b>ajustar las etapas</b> o cargar códigos <b>no versiona</b>.', 'informative');
      if (cc.length && !ch.length) h += alertBox('Ajustas las <b>etapas</b> (' + cc.length + ' cambio' + (cc.length > 1 ? 's' : '') + '): se conserva ' + CUR_VER + ' y queda registrado en la bitácora con tu motivo.', 'caution', 'calendar');
    }
    host.innerHTML = h;
    var fin = $('#pfNext .nwt-button__content');
    if (S.step === LAST && fin) fin.innerHTML = (EDIT ? (versionChanges().length ? 'Publicar ' + NEXT_VER : 'Guardar cambios') : (S.activar === 'activo' ? 'Crear y activar' : 'Crear programa')) + icon('positive');
  }

  /* ── Render ─────────────────────────────────────────────────── */
  var STEPS = ['Datos generales', 'Información específica', 'Condiciones', 'Códigos y activación'];
  function renderStepper() {
    $('#pfStepper').innerHTML = STEPS.map(function (l, i) {
      var n = i + 1, act = S.step === n, dn = S.step > n;
      return '<div class="nwt-stepper__item' + (act ? ' nwt-stepper__item--active' : '') + (dn ? ' nwt-stepper__item--done' : '') + (n > S.max ? ' nwt-stepper__item--disabled' : '') + '" data-act="goto" data-x="' + n + '"><div class="nwt-stepper__item__content"><div class="nwt-stepper__item__badge">' + (dn ? icon('positive') : n) + '</div><span class="pf-step__text"><span class="pf-step__kicker">Paso ' + n + '</span><span class="nwt-stepper__item__label">' + l + '</span></span></div></div>';
    }).join('');
  }
  function render(keepScroll) {
    MSO = {};
    var html = [step1, step2, step3, step4][S.step - 1]();
    $('#pfStep').innerHTML = html;
    msFit($('#pfStep'));
    renderStepper(); banner();
    $('#pfPrev').style.visibility = S.step === 1 ? 'hidden' : 'visible';
    var nx = $('#pfNext .nwt-button__content');
    if (S.step < LAST) nx.innerHTML = 'Continuar' + icon('arrow-right');
    if (S.step === 2) updateDist();
    if (S.step === LAST) { banner(); issues(); }
    if (!keepScroll) $('#pfScroll').scrollTo({ top: 0, behavior: 'smooth' });
    saveDraft(true);
  }
  function issues() {
    var host = $('#pfIssues'); if (!host) return;
    var e = validate(3);
    host.innerHTML = e.length ? alertBox('Faltan datos para guardar: <b>' + e.map(function (x) { return esc(x[1]); }).join(' · ') + '</b>', 'negative', 'attention') : alertBox('Todo listo: el programa tiene los datos mínimos para guardarse.', 'positive', 'positive');
  }
  function updateRules(incId) {
    var inc = incById(incId); if (!inc) return;
    var p = $('#pfPreview-' + incId); if (p) p.innerHTML = previewHTML(inc);
    banner();
  }

  /* ── Estado: bind por path ──────────────────────────────────── */
  function setByKey(k, raw) {
    var p = k.split('.');
    if (p[0] === 'datos') S.datos[p[1]] = raw;
    else if (p[0] === 'pob') S.pob[p[1]] = raw;
    else if (p[0] === 'rec') S.rec[p[1]] = p[1] === 'frecuenciaN' ? digits(raw) : raw;
    else if (p[0] === 'rubro') S.rubro[p[1]] = digits(raw);
    else if (p[0] === 'inc') { var i = incById(p[1]); i[p[2]] = (p[2] === 'valor' || p[2] === 'unit' || p[2] === 'cantidad') ? digits(raw) : raw; }
    else if (p[0] === 'cod') { codState(p[1]).lista[+p[2]] = raw; }
    else if (p[0] === 'crono') { if (p.length === 3) S.crono[p[1]][p[2]] = raw; else S.crono[p[1]] = raw; }
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
    var isMoney = /(\.valor|\.unit|\.cantidad)$/.test(k);
    if (isMoney) { var d = digits(t.value); if (e.type === 'change' && k.indexOf('cantidad') < 0) t.value = d ? Number(d).toLocaleString('es-CO') : ''; else if (e.type === 'input') t.value = d && (k.indexOf('cantidad') < 0) ? Number(d).toLocaleString('es-CO') : d; }
    setByKey(k, t.value);
    if (k === 'rubro.n') syncInc();
    if (k.indexOf('cod.') === 0) { var ci0 = incById(k.split('.')[1]), ce = $('#pfCodCount-' + k.split('.')[1]); if (ci0 && ce) ce.textContent = codCountText(ci0); }
    var mc = /^inc\.([^.]+)\.categoria$/.exec(k); if (mc && incById(mc[1])) applyCategoria(incById(mc[1]));
    var mv = /^inc\.([^.]+)\.(valor|unit|cantidad)$/.exec(k);
    if (mv) {
      var inc0 = incById(mv[1]); recalc(inc0);
      ['valor', 'cantidad'].forEach(function (f) { var el = document.querySelector('input[data-k="inc.' + mv[1] + '.' + f + '"]'); if (el && el.readOnly) el.value = numTxt(inc0[f]); });
      var msg = $('#pfCupo-' + mv[1]); if (msg) msg.textContent = cupoText(inc0);
    }
    if (t.dataset.struct && e.type === 'change') { render(true); return; }
    var box = t.closest('.nwt-input-box'); if (box && box.classList.contains('nwt-input-box--error')) { box.classList.remove('nwt-input-box--error'); var m = box.querySelector('.pf-err'); if (m) m.remove(); }
    if (k.indexOf('rule.') === 0) updateRules(k.split('.')[1]);
    if (k.indexOf('crono.') === 0 && !/\.motivo$/.test(k)) { var ch = $('#pfCronoChg'); if (ch && e.type === 'change') ch.innerHTML = cronoChgHTML(); banner(); }
    if (S.step === 2) updateDist();
    if (EDIT) banner();
    refreshDraftBtn();
  }

  /* ── Acciones ───────────────────────────────────────────────── */
  var ACT = {
    'ms-toggle': function (x, key) { if (MSO.key === key) { msClose(); return; } var prev = MSO.key; MSO = { key: key, q: '' }; if (prev) msRedraw(prev); msRedraw(key); var q = $('#' + msCfg(key).id + ' .pf-ms__q'); if (q) q.focus({ preventScroll: true }); },
    'ms-opt': function (x, key) { msToggleVal(key, x); },
    'ms-del': function (x, key) { msToggleVal(key, x); },
    'ms-add': function (x, key) { msAdd(key); },
    'anexo-del': function () { S.datos.anexo = null; saveDraft(true); anexoRedraw(); },
    'rubro-tipos': function (x) { S.rubro.tipos = x; syncInc(); render(true); },
    'seleccion': function (x) { var s = S.pob.seleccion, i = s.indexOf(x); if (i > -1) { if (s.length === 1) return toast('Elige al menos una forma de selección.', 'caution'); s.splice(i, 1); } else s.push(x); render(true); },
    'rec-on': function () { S.rec.on = !S.rec.on; S.inc.forEach(function (i) { i.codigos = !S.rec.on; }); if (S.rec.on && !S.doc.list.length) S.doc.list = [{ name: 'Documento de identidad', oblig: true }]; syncModalidades(); render(true); },
    'inc-codigos': function (x, i) { var n = incById(i); n.codigos = n.codigos === false; setModalidad(n); render(true); },
    'inc-tope': function (x, i) { var n = incById(i); n.tope = x; recalc(n); render(true); },
    'tipo-doc': function (x, id) { var n = incById(id), name = S.doc.list[+x].name, i = n.docOff.indexOf(name); if (i > -1) n.docOff.splice(i, 1); else n.docOff.push(name); render(true); },
    'tipo-toggle': function (x, id) { var i = S.inc.findIndex(function (n) { return n.id === id; }); tipoOpen[id] = !isTipoOpen(S.inc[i], i); render(true); },
    'tipo-all': function (x, mode) { S.inc.forEach(function (n) { tipoOpen[n.id] = (mode === 'open'); }); render(true); },
    'grp-add': function (x, id) { incById(id).grupos.push({ op: 'AND', rows: [{ f: '', op: '=', v: '' }] }); render(true); },
    'grp-del': function (x, id) { incById(id).grupos.splice(+x, 1); render(true); },
    'rule-add': function (x, id) { incById(id).grupos[+x].rows.push({ f: '', op: '=', v: '' }); render(true); },
    'rule-del': function (x, id) { var p = x.split('.'); incById(id).grupos[+p[0]].rows.splice(+p[1], 1); render(true); },
    'rule-multi': function (x, key) { var p = key.split('.'), r = incById(p[0]).grupos[+p[1]].rows[+p[2]]; if (!Array.isArray(r.v)) r.v = []; var i = r.v.indexOf(x); if (i > -1) r.v.splice(i, 1); else r.v.push(x); render(true); },
    'doc-req': function () { S.doc.req = !S.doc.req; if (S.doc.req && !S.doc.list.length) S.doc.list = [{ name: 'Documento de identidad', oblig: true }]; render(true); },
    'doc-oblig': function (x) { var d = S.doc.list[+x]; d.oblig = !d.oblig; render(true); },
    'doc-del': function (x) { var n = S.doc.list.splice(+x, 1)[0]; S.inc.forEach(function (i) { var k = i.docOff.indexOf(n.name); if (k > -1) i.docOff.splice(k, 1); }); render(true); },
    'doc-add-s': function (x) { S.doc.list.push({ name: x, oblig: true }); render(true); },
    'doc-add': function () { var inp = $('[data-k="ui.docNuevo"]'), v = inp && inp.value.trim(); if (!v) return toast('Escribe el nombre del documento.', 'caution'); S.doc.list.push({ name: v, oblig: true }); render(true); },
    'cod-modo': function (x, i) { var c = codState(i); c.modo = c.modo === x ? '' : x; render(true); },
    'cod-sim': function (x, i) { var inc = incById(i); S.codigos[i].n = (inc && Number(inc.cantidad)) || 50; render(true); },
    'cod-add': function (x, i) { codState(i).lista.push(''); render(true); },
    'cod-del': function (x, i) { var l = codState(i).lista; if (l.length > 1) l.splice(+x, 1); render(true); },
    'cod-tpl': function () { toast('Plantilla de ejemplo (demo): codigo, observación.', 'informative'); },
    activar: function (x) { S.activar = x; render(true); },
    'save-draft': function () { savedSnap = snapState(); saveDraftProgram(); toast('Borrador guardado. Podrás retomarlo cuando quieras.', 'positive'); },
    goto: function (x) { var n = +x; if (n <= S.max && n !== S.step) go(n); },
    edit: function (x) { go(+x); },
    noop: function () {}
  };
  function onClick(e) {
    if (MSO.key && !e.target.closest('.pf-ms')) msClose();
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
  function onKey(e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.nwt-tag[data-act], .nwt-checkbox[data-act], .nwt-switch[data-act], .pf-ms__content')) { e.preventDefault(); e.target.click(); } if (e.key === 'Escape' && MSO.key) msClose(); if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('pf-ms__newq')) { e.preventDefault(); msAdd(e.target.dataset.ms); } }

  function go(n) { S.step = n; if (n > S.max) S.max = n; render(); }
  function next() {
    if (S.done) return;
    var errs = validate(S.step);
    if (S.step === 3 && errs.some(function (x) { return x[2] === 3; })) { // abre los tipos plegados que tengan algo pendiente
      var opened = false;
      S.inc.forEach(function (inc, i) { if (incIssues(inc).length && !isTipoOpen(inc, i)) { tipoOpen[inc.id] = true; opened = true; } });
      if (opened) render(true);
    }
    var general = showErrors(errs, S.step);
    if (errs.some(function (x) { return x[2] === S.step; })) {
      toast(general.length ? general[0] : 'Revisa los campos marcados para continuar.', 'negative');
      var b = $('#pfNext'); b.classList.remove('pf-shake'); void b.offsetWidth; return;
    }
    if (S.step < LAST) { go(S.step + 1); return; }
    var all = validate(3);
    if (all.length) { toast('Completa los datos faltantes antes de guardar.', 'negative'); return; }
    if (!EDIT && !CAN_EDIT_PROGRAM) { toast('Tu rol no puede crear programas.', 'caution'); return; }
    finish();
  }
  /* ── Puente con los datos de los programas (shared/programs-data.js) ── */
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtLong(iso) { if (!iso) return ''; var p = iso.slice(0, 10).split('-'); return p[2] + ' ' + MESES[+p[1] - 1] + ' ' + p[0]; }
  var ICON_BY_CAT = { bono: ['#e6f4e7', '#1f8923'], beca: ['#fff3e6', '#d74009'], kit: ['#eef5ff', '#1f78d1'], transporte: ['#f3e8ff', '#7c3aed'], inscripcion: ['#fff3e6', '#d74009'], descuento: ['#fff0ee', '#b42318'], pase: ['#f5f6fa', '#646587'], dinero: ['#e6f4e7', '#1f8923'], diploma: ['#f5f6fa', '#646587'] };
  var VARIANT_BY_CAT = { bono: 'positive', beca: 'informative', kit: 'caution', transporte: 'neutral', inscripcion: 'informative', descuento: 'caution', pase: 'neutral', dinero: 'positive', diploma: 'neutral' };
  function findProgram(id) { return (window.PROGRAMS_DATA || []).filter(function (x) { return x.id === id; })[0] || null; }
  function codeLoaded(i) { var c = S.codigos[i.id]; if (!c || !hasCodes(i)) return 0; return c.modo === 'manual' ? codManual(c).ok : (c.modo === 'masivo' ? c.n : 0); }
  function seedGroups(inc) {
    return inc.grupos.map(function (g) {
      return { logic: 'AND', rules: g.rows.filter(ruleNat).map(function (r) { var f = FIELDS[r.f]; return { field: f.label, op: r.op, value: Array.isArray(r.v) ? '{' + r.v.join(', ') + '}' : String(r.v) }; }) };
    }).filter(function (g) { return g.rules.length; });
  }
  function buildProgram(existing, status) {
    var d = S.datos, p = S.pob, cat0 = catOf(S.inc[0]), ico = ICON_BY_CAT[cat0 ? cat0.k : ''] || ['#f5f6fa', '#646587'];
    var total = S.inc.reduce(function (a, i) { return a + (Number(i.valor) || 0); }, 0), codes = S.inc.reduce(function (a, i) { return a + codeLoaded(i); }, 0);
    var cov = p.cobertura.join(', ') || '—'; if (p.cobertura.length > 3) cov = p.cobertura.length + ' departamentos'; if (p.municipios.length) cov += ' · ' + p.municipios.length + (p.municipios.length === 1 ? ' municipio' : ' municipios');
    var incentives = S.inc.map(function (i) {
      var c = catOf(i), lab = c ? c.l : 'Incentivo', u = Number(i.unit) || 0, q = Number(i.cantidad) || 0, fijo = i.modalidad === 'fijo';
      var badges = [{ text: lab, variant: VARIANT_BY_CAT[c ? c.k : ''] || 'neutral' }];
      if (fijo) badges.push({ text: 'Fijo ' + frecuenciaTxt(), variant: 'caution' });
      if (hasCodes(i)) badges.push({ text: 'Con código', variant: 'neutral' }); else if (i.modalidad === 'certificado') badges.push({ text: 'Certificado', variant: 'neutral' });
      return { name: i.nombre || 'Incentivo sin nombre', category: lab, detail: (MOD_TXT[i.modalidad] || '') + (q ? ' · ' + q.toLocaleString('es-CO') + (fijo ? ' beneficiarios' : ' cupos') : '') + (i.tope === 'sin' && conValor(i) ? ' · sin tope' : ''),
        value: u, valueLabel: u ? money(u) : '—', valueFoot: u ? (fijo ? 'por ciclo' : 'por beneficiario') : '', badges: badges,
        conditions: { groups: seedGroups(i), summary: previewHTML(i) } };
    });
    var cfg = { gestores: d.gestores.slice(), eventos: d.eventos.slice(), desde: d.desde, hasta: d.hasta, roles: p.roles.slice(), cobertura: p.cobertura.slice(), municipios: p.municipios.slice(), seleccion: p.seleccion.slice(),
      rec: clone(S.rec), doc: clone(S.doc), crono: clone(S.crono), activacion: status === 'active' ? ((existing && existing.config && existing.config.activacion) || new Date().toISOString().slice(0, 10)) : '',
      inc: S.inc.map(function (i) { return { categoria: i.categoria, tope: i.tope, unit: Number(i.unit) || 0, valor: Number(i.valor) || 0, cantidad: Number(i.cantidad) || 0, codigos: hasCodes(i), grupos: clone(i.grupos), docOff: clone(i.docOff) }; }) };
    var ver = existing ? (EDIT && versionChanges().length ? NEXT_VER : CUR_VER) : 'V1.0';
    return { id: existing ? existing.id : window.nextProgramId(), name: d.nombre.trim() || 'Programa sin nombre', shortDesc: (d.desc || '').slice(0, 80) || cov, longDesc: d.desc || '', iconBg: ico[0], iconColor: ico[1], status: status,
      event: d.eventos.join(', ') || '—', coverage: cov, responsible: d.gestores.join(', ') || '—', rubro: total, exec: existing ? existing.exec || 0 : 0, unit: (Number(S.inc[0].unit) || 0),
      codes: (function () { var ex = existing && existing.codes || { total: 0, avail: 0, asig: 0, rev: 0 }, any = S.inc.some(hasCodes); if (!any) return { total: 0, avail: 0, asig: ex.asig || 0, rev: ex.rev || 0 }; return codes ? { total: (ex.total || 0) + codes, avail: (ex.avail || 0) + codes, asig: ex.asig || 0, rev: ex.rev || 0 } : ex; })(),
      codesList: (function () { var list = []; S.inc.forEach(function (i) { var c = hasCodes(i) && S.codigos[i.id]; if (!c) return; var pf = (String(i.nombre || '').normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() || 'COD') + '-', v = Number(i.unit) || 0; if (c.modo === 'manual') { var seen = {}; c.lista.forEach(function (x) { x = x.trim(); if (x && !seen[x.toLowerCase()]) { seen[x.toLowerCase()] = 1; list.push({ code: x, tipo: i.nombre, valor: v }); } }); } else if (c.modo === 'masivo') { for (var k = 1; k <= (c.n || 0); k++) list.push({ code: pf + String(k).padStart(5, '0'), tipo: i.nombre, valor: v }); } }); var prev = existing && existing.codesList || []; return S.inc.some(hasCodes) ? prev.concat(list) : []; })(),
      from: d.desde ? fmtLong(d.desde) : 'Desde la activación', to: d.hasta ? fmtLong(d.hasta) : 'Sin fecha de fin', actoAdmin: d.anexo ? d.anexo.name : (d.justificacion ? d.justificacion.slice(0, 60) : '—'), fuente: 'Ministerio del Deporte · 2026',
      incentives: incentives, conditions: { groups: [], summary: '' }, config: cfg, version: ver, _userCreated: !existing || !!existing._userCreated, createdAt: existing && existing.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  }
  function loadFromProgram(pr) {
    var c = window.getProgramConfig(pr), n = 0;
    S.datos = { nombre: pr.name, desc: pr.longDesc || '', eventos: c.eventos.slice(), gestores: c.gestores.slice(), extra: c.gestores.filter(function (g) { return GESTORES.indexOf(g) < 0; }), desde: c.desde, hasta: c.hasta, justificacion: pr.actoAdmin && pr.actoAdmin !== '—' ? pr.actoAdmin : '', anexo: null };
    S.pob = { roles: c.roles.slice(), rolesExtra: c.roles.filter(function (r) { return ROLES.indexOf(r) < 0; }), cobertura: c.cobertura.slice(), municipios: c.municipios.slice(), seleccion: c.seleccion.slice() };
    S.rec = clone(c.rec); S.doc = clone(c.doc);
    S.crono = Object.assign(newCrono(), clone(c.crono));
    S.inc = (pr.incentives || []).map(function (inc, i) {
      var x = c.inc[i] || {}, m = newInc(); n += 1;
      m.nombre = inc.name; m.categoria = x.categoria || ''; m.tope = x.tope || 'bottom'; m.unit = x.unit ? String(x.unit) : ''; m.valor = x.valor ? String(x.valor) : ''; m.cantidad = x.cantidad ? String(x.cantidad) : '';
      m.codigos = x.codigos !== false; m.grupos = x.grupos && x.grupos.length ? clone(x.grupos) : [{ op: 'AND', rows: [] }]; m.docOff = x.docOff ? x.docOff.slice() : [];
      m.modalidad = modalidadOf(m); return m;
    });
    if (!S.inc.length) S.inc = [newInc()];
    S.rubro = { tipos: S.inc.length > 1 ? 'varios' : 'uno', n: Math.max(2, S.inc.length) };
    S.codigos = {}; S.activar = 'config'; S.step = 1; S.max = LAST;
  }
  function finish() {
    S.done = true; try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
    var ver = EDIT ? (versionChanges().length ? NEXT_VER : CUR_VER) : 'V1.0';
    var nlog = 0;
    if (EDIT) {
      var who = PERSONAS[role] || PERSONAS.admin, now = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
      var ts = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
      var cc = cronoChanges();
      if (cc.length) {
        var entry = { ts: ts, user: who[0], rol: who[1], ev: 'Edición de etapas · programa', det: cc.map(function (c) { return c.campo + ': ' + c.antes + ' → ' + c.despues; }).join(' · '), motivo: S.crono.motivo.trim(), ip: '190.24.18.' + (20 + now.getSeconds() % 70) };
        try { var st = JSON.parse(localStorage.getItem(LOG_KEY)) || []; st.unshift(entry); localStorage.setItem(LOG_KEY, JSON.stringify(st)); } catch (_) {}
        nlog += cc.length;
      }
    }
    var activo = EDIT || S.activar === 'activo';
    var existing = EDIT_ID ? findProgram(EDIT_ID) : null, prog = buildProgram(existing, activo ? 'active' : 'draft');
    if (existing) window.persistProgramEdit(existing.id, prog); else window.persistCreatedProgram(prog);
    $('#pfBanner').innerHTML = '';
    $('.pf-footer').hidden = true;
    var msg = '<b>' + esc(S.datos.nombre) + '</b> ' + (activo ? 'está <b>Activo · ' + ver + '</b>.' : 'quedó en <b>Configuración</b>. Actívalo cuando esté listo.') + ' Se registró auditoría con usuario, fecha, hora e IP.' + (nlog ? ' <b>' + nlog + ' cambio' + (nlog > 1 ? 's' : '') + ' de etapas</b> ' + (nlog > 1 ? 'quedaron' : 'quedó') + ' en la bitácora con su motivo.' : '');
    pfModal({ icon: 'positive', theme: 'positive', title: EDIT ? 'Cambios guardados' : 'Programa creado', message: msg, extra: badge(activo ? 'Activo · ' + ver : 'Configuración', activo ? 'positive' : 'caution') + ' ' + badge(routeLabel(), 'neutral'),
      buttons: (EDIT ? [] : [{ label: 'Crear otro', variant: 'mute', fn: function () { location.href = 'incentivo-04-programa-crear.html'; } }]).concat([{ label: 'Ver lista', variant: 'quiet', fn: function () { leave(); } }, { label: 'Ver programa', variant: 'loud', fn: function () { location.href = 'incentivo-05-programa-detalle.html?id=' + encodeURIComponent(prog.id); } }]) });
  }
  function routeLabel() { return (recOn() ? 'Recurrente' : 'Pago único') + ' · ' + (anyDoc() ? 'Con documentos' : 'Flujo directo'); }

  /* ── Guardar borrador: solo se habilita si hay cambios respecto al último guardado ── */
  var savedSnap = '', pristineSnap = '';
  function snapState() { return JSON.stringify([S.datos, S.pob, S.rec, S.doc, S.crono, S.rubro, S.inc, S.codigos, S.activar]); }
  function refreshDraftBtn() {
    var b = $('.top-header [data-act="save-draft"]'); if (!b) return;
    var off = snapState() === savedSnap;
    b.disabled = off; b.setAttribute('aria-disabled', String(off));
    b.title = off ? 'Aún no hay cambios por guardar' : '';
  }

  /* ── Ventana emergente (composición SDK: nwt-modal + nwt-confirmation-modal) ── */
  function pfModal(o) {
    pfModalClose();
    var el = document.createElement('div');
    el.id = 'pfModal'; el.className = 'nwt-modal nwt-confirmation-modal nwt-modal--visible'; el.setAttribute('nwt-theme', o.theme || 'neutral'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="nwt-modal__content">' + (o.dismissible ? '<span class="nwt-modal__close pf-modal-x" role="button" tabindex="0" aria-label="Cerrar" data-modal-close="1">' + icon('close') + '</span>' : '') + '<div class="nwt-modal__component">' +
      '<div class="nwt-confirmation-modal__content"><div class="nwt-confirmation-modal__icon">' + icon(o.icon || 'attention') + '</div>' +
      '<div class="nwt-confirmation-modal__text"><h2 class="nwt-confirmation-modal__title">' + esc(o.title) + '</h2><p class="nwt-confirmation-modal__message">' + o.message + '</p>' + (o.extra ? '<div class="pf-modal-extra">' + o.extra + '</div>' : '') + '</div></div>' +
      '<div class="nwt-confirmation-modal__footer"><div class="nwt-divider nwt-divider--horizontal nwt-confirmation-modal__divider"></div><div class="nwt-confirmation-modal__buttons">' +
      o.buttons.map(function (b, i) { return '<button type="button" class="nwt-button" nwt-variant="' + (b.variant || 'quiet') + '" nwt-size="large" data-modal="' + i + '"><span class="nwt-button__content">' + esc(b.label) + '</span></button>'; }).join('') +
      '</div></div></div></div><div class="nwt-modal__backdrop"></div>';
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) { pfModalClose(); return; }
      var b = e.target.closest('[data-modal]'); if (b) { var f = o.buttons[+b.dataset.modal].fn; pfModalClose(); if (f) f(); return; }
      if (o.dismissible && e.target.classList.contains('nwt-modal__backdrop')) pfModalClose();
    });
    document.body.appendChild(el);
  }
  function pfModalClose() { var m = $('#pfModal'); if (m) m.remove(); }
  function leave() { if (typeof fadeAndGo === 'function') fadeAndGo('incentivo-03-programas.html'); else location.href = 'incentivo-03-programas.html'; }
  function cancelar() {
    if (S.done || snapState() === savedSnap) { leave(); return; } // sin cambios por guardar
    if (EDIT) {
      pfModal({ icon: 'attention', theme: 'caution', title: '¿Descartar los cambios?', message: 'Hiciste cambios en este programa que no se han guardado. Si sales ahora, se pierden.', dismissible: true,
        buttons: [{ label: 'Descartar y salir', variant: 'quiet', fn: leave }, { label: 'Seguir editando', variant: 'loud' }] });
      return;
    }
    pfModal({ icon: 'attention', theme: 'caution', title: '¿Guardar como borrador?', message: 'Tienes cambios sin terminar. Guárdalos como borrador para retomarlos después o sal sin guardar.', dismissible: true,
      buttons: [
        { label: 'No guardar', variant: 'quiet', fn: function () { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} leave(); } },
        { label: 'Guardar borrador', variant: 'loud', fn: function () { savedSnap = snapState(); saveDraftProgram(); leave(); } }
      ] });
  }

  /* Un borrador de un programa que ya existe se guarda sobre ese programa; uno nuevo, en el borrador local del formulario */
  function saveDraftProgram() {
    if (EDIT) { saveDraft(); return; }
    var ex = EDIT_ID ? findProgram(EDIT_ID) : null, prog = buildProgram(ex, 'draft');
    if (ex) window.persistProgramEdit(ex.id, prog); else { window.persistCreatedProgram(prog); EDIT_ID = prog.id; }
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
  }
  /* ── Toast y borrador ───────────────────────────────────────── */
  var toastT;
  function toast(msg, theme) {
    $('#pfToast').innerHTML = alertBox(msg, theme || 'informative', theme === 'positive' ? 'positive' : theme === 'negative' || theme === 'caution' ? 'attention' : 'info');
    clearTimeout(toastT); toastT = setTimeout(function () { $('#pfToast').innerHTML = ''; }, 3600);
  }
  function saveDraft(silent) {
    refreshDraftBtn();
    if (EDIT || EDIT_ID) return;
    if (snapState() === pristineSnap) { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} return; } // sin cambios: no hay borrador
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ S: S, uid: uid })); } catch (_) {}
  }
  function loadDraft() {
    if (EDIT || EDIT_ID) return false;
    try {
      var raw = localStorage.getItem(DRAFT_KEY); if (!raw) return false;
      var o = JSON.parse(raw); if (!o.S || o.S.done || !o.S.pob || !o.S.rec || !o.S.doc || !o.S.crono) return false;
      S = o.S; uid = o.uid || uid; if (!S.pob.municipios) S.pob.municipios = []; if (typeof S.pob.seleccion === 'string') S.pob.seleccion = [S.pob.seleccion]; if (!S.pob.rolesExtra) S.pob.rolesExtra = []; if (S.pob.roles.indexOf('Otro') > -1) { S.pob.roles.splice(S.pob.roles.indexOf('Otro'), 1); if (S.pob.otroRol && S.pob.otroRol.trim()) { S.pob.rolesExtra.push(S.pob.otroRol.trim()); S.pob.roles.push(S.pob.otroRol.trim()); } } delete S.pob.otroRol; if (!S.datos.eventos) { S.datos.eventos = S.datos.evento ? [S.datos.evento] : []; delete S.datos.evento; } if (!S.datos.extra) S.datos.extra = []; return true;
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
    pristineSnap = snapState();
    var restored = loadDraft();
    if (EDIT) {
      var prog = EDIT_ID ? findProgram(EDIT_ID) : null;
      if (prog) loadFromProgram(prog); else seedEdit();
      if (!prog || prog.status !== 'draft') { // programa activo (o cerrado): se versiona
        if (prog) { CUR_VER = prog.version || 'V1.0'; NEXT_VER = 'V' + ((parseInt(CUR_VER.slice(1), 10) || 1) + 1) + '.0'; }
        SNAP = clone({ inc: S.inc, doc: S.doc, rec: S.rec, crono: S.crono });
        $('#pfCrumb').textContent = S.datos.nombre; $('#pfTitle').textContent = 'Editar programa';
        $('#pfStateBadge').innerHTML = badge('Activo · ' + CUR_VER, 'positive');
      } else { // borrador: se edita como un programa nuevo con los datos ya cargados
        EDIT = false; CONDITIONS_LOCKED = false;
        $('#pfCrumb').textContent = S.datos.nombre; $('#pfTitle').textContent = 'Editar borrador';
        $('#pfStateBadge').innerHTML = badge('Configuración', 'caution');
        $('[data-act="save-draft"]').style.display = '';
      }
    } else {
      $('#pfStateBadge').innerHTML = badge('Configuración', 'caution');
    }
    var h = parseInt((location.hash.match(/step=(\d)/) || [])[1], 10);
    if (h >= 1 && h <= LAST) { S.step = h; if (h > S.max) S.max = h; }
    var root = $('#pfStep');
    root.addEventListener('input', onInput); root.addEventListener('change', onInput);
    root.addEventListener('click', onAnexoClick); root.addEventListener('change', onAnexoChange);
    root.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('pf-ms__q')) { var k = e.target.dataset.ms; MSO.q = e.target.value; var ul = $('#' + msCfg(k).id + 'Opts'); if (ul) ul.innerHTML = msOptsHTML(k); } });
    document.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
    root.addEventListener('focusin', function (e) { var b = e.target.closest('.nwt-input-box'); if (b && !b.classList.contains('pf-ro-box')) { b.classList.add('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.add(f.className.split(' ')[0] + '--focused'); } });
    root.addEventListener('focusout', function (e) { var b = e.target.closest('.nwt-input-box'); if (b) { b.classList.remove('nwt-input-box--focused'); var f = e.target.closest('.nwt-text-field,.nwt-select,.nwt-text-area'); if (f) f.classList.remove(f.className.split(' ')[0] + '--focused'); } });
    $('#pfPrev').addEventListener('click', function () { if (S.step > 1) go(S.step - 1); });
    $('#pfNext').addEventListener('click', next);
    $('[data-act="save-draft"]').style.display = EDIT ? 'none' : '';
    var cx = $('.pf-hdr-actions a.nwt-button'); if (cx) cx.addEventListener('click', function (e) { e.preventDefault(); cancelar(); });
    savedSnap = snapState();
    initChrome();
    render(true);
    window.addEventListener('resize', function () { msFit($('#pfStep')); });
    if (restored) toast('Recuperamos tu borrador sin terminar.', 'informative');
  }
  init();
})();

