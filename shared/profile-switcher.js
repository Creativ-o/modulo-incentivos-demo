/* ═══════════════════════════════════════════════════════════════
   PROFILE SWITCHER — script compartido (auto-wire)
   Se monta sobre cualquier elemento con .profile-switcher:
   - Si falta id="profileSwitcher", lo añade.
   - Si falta el <div class="profile-dd">, lo inyecta con los roles.
   - Wire-up de clic en chip + chevron sin necesidad de onclick inline.
   - Cierra al clickear fuera.
   - Aplica el rol persistido en localStorage.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  const STORAGE_KEY = 'naowee-incentivos-role';

  const ROLES = {
    admin:    { name:'Danna Arrieta',    label:'Gestor de incentivos', initials:'DA', bg:'#c4b5fd', fg:'#4c1d95', meta:'Parametriza y audita' },
    operador: { name:'Jorge Guzman',     label:'Operador',             initials:'JG', bg:'#ffdfb5', fg:'#92400e', meta:'Asigna incentivos en campo' },
    // Gestor de programa: sólo ve el(los) programa(s) que tiene asignado(s).
    // Persona ficticia distinta de Danna para diferenciar visualmente la vista.
    programa: { name:'Isa Pabon',        label:'Gestor de programa',   initials:'IP', bg:'#bfdbfe', fg:'#1e3a8a', meta:'Gestiona su programa asignado',
                assignedPrograms: ['PRG-2026-003'] },
    // Deportista: carga sus documentos. La persona concreta la elige la pantalla «Mis documentos» («Ver como»).
    deportista: { name:'Esteban Mora',   label:'Deportista',           initials:'EM', bg:'#bbf7d0', fg:'#14532d', meta:'Carga sus documentos' }
  };

  // Qué roles muestra el dropdown por default cuando se auto-inyecta.
  // Incluye programa para que el switcher permita probar la vista filtrada.
  const DEFAULT_ROLES_IN_DD = ['admin', 'programa', 'operador', 'deportista'];

  function currentRole(){
    return localStorage.getItem(STORAGE_KEY) || 'admin';
  }

  function applyRole(role){
    const r = ROLES[role] || ROLES.admin;
    // Actualiza el avatar del chip
    document.querySelectorAll('.user-chip .ava-ring').forEach(ring => {
      ring.textContent = r.initials;
      ring.style.background = r.bg;
      ring.style.color = r.fg;
    });
    // Actualiza la etiqueta del rol en el chip
    document.querySelectorAll('.user-chip .user-role').forEach(lbl => {
      lbl.textContent = r.label;
    });
    // Actualiza el nombre del usuario (varía según el rol: Danna, Isa o Jorge)
    document.querySelectorAll('.user-chip .user-name').forEach(lbl => {
      lbl.textContent = r.name;
    });
    // Mantiene compatibilidad con IDs antiguos del template
    const ring = document.getElementById('avaRing');
    if(ring){ ring.textContent = r.initials; ring.style.background = r.bg; ring.style.color = r.fg; }
    const lblById = document.getElementById('userRoleLabel');
    if(lblById) lblById.textContent = r.label;
    // Active state en los items del dropdown
    document.querySelectorAll('.profile-dd__item').forEach(el => {
      el.classList.toggle('active', el.dataset.role === role);
    });
    // Visibilidad por rol — generalizado a cualquier elemento con data-role
    // (ej: nav-row, bloques de acciones admin-only). Excluye los items del
    // dropdown del switcher (.profile-dd__item) — esos siempre están visibles
    // porque son la lista de perfiles disponibles a elegir, no contenido
    // restringido por rol.
    document.querySelectorAll('[data-role]').forEach(el => {
      if(el.classList.contains('profile-dd__item')) return;
      const dr = el.dataset.role;
      el.style.display = (dr === 'all' || dr === role) ? '' : 'none';
    });
    // Gestor de programa: Dashboard, Mis programas, Códigos, Historial (de SUS programas)
    // y Revisión documental. Se resuelve aquí y no por data-role, porque no todas
    // las páginas traen el atributo. Reportería y creación quedan fuera.
    if(role === 'programa'){
      const NAV_PROGRAMA = ['Dashboard','Programas','Mis programas','Códigos','Historial de asignaciones','Revisión documental','Asignar incentivos'];
      document.querySelectorAll('.sidebar-nav .nav-row').forEach(row => {
        const lbl = row.querySelector('.lbl');
        const txt = lbl ? lbl.textContent.trim() : '';
        row.style.display = NAV_PROGRAMA.indexOf(txt) > -1 ? '' : 'none';
        if(lbl && txt === 'Programas') lbl.textContent = 'Mis programas';
      });
      if(/incentivo-(04|06|13|15)/.test(location.pathname)){
        location.replace(PROGRAMA_HOME);
        return;
      }
    }
    // Danna e Isa dentro del flujo de asignación (08-11): estas pantallas traen el menú del operador; se reemplaza por el de gestión
    if((role === 'admin' || role === 'programa') && /incentivo-(02|03|04|05|07|08|09|10|11|12|15|16|18)/.test(location.pathname)) buildAdminNav(role);
    else if(role !== 'operador' && /incentivo-(08|09|10|11)/.test(location.pathname)) buildGestionNav(role);
    if(role === 'operador' || !/incentivo-(08|09|10|11)/.test(location.pathname)) document.documentElement.removeAttribute('data-gest-pending');
    // Deportista: solo vive en «Mis documentos»; cualquier otro perfil que abra esa pantalla vuelve a su inicio
    if(role === 'deportista' && !/incentivo-17/.test(location.pathname)){ location.replace(DEPORTISTA_HOME); return; }
    if(role !== 'deportista' && /incentivo-17/.test(location.pathname)){ location.replace(role === 'operador' ? OPERATOR_HOME : role === 'programa' ? PROGRAMA_HOME : ADMIN_HOME); return; }
    // Operador: solo vive en el flujo de asignación; las pantallas de gestión lo devuelven a su inicio
    if(role === 'operador' && /incentivo-(02|03|04|05|06|07|12|13|15|16|18)/.test(location.pathname)){
      location.replace(OPERATOR_HOME);
      return;
    }
    // Revisión documental: la ve el Gestor de programa (titular) y los roles con alcance global (apoyo).
    if((role === 'programa' || (role === 'admin' && !document.querySelector('.sidebar-nav[data-gestion]'))) && !document.querySelector('.sidebar-nav[data-gestion]') && !document.querySelector('.sidebar-nav .nav-row[data-nav="revision"]')) injectRevisionNav();
    // Danna e Isa también asignan (Isa solo sobre sus programas: la búsqueda ya sale filtrada por scopedPrograms)
    if((role === 'programa' || (role === 'admin' && !document.querySelector('.sidebar-nav[data-gestion]'))) && !document.querySelector('.sidebar-nav[data-gestion]') && !/incentivo-(08|09|10|11)/.test(location.pathname) && !document.querySelector('.sidebar-nav .nav-row[data-nav="asignar"]')) injectAsignarNav();
    ensureBell(role);
    // Hook opcional por página: si la página define onRoleApplied(role),
    // se llama después del filtrado base. Permite a cada vista reaccionar
    // (ej: cambiar título, hidratar un hero card, etc) sin depender del
    // timing frágil de setTimeout(0) vs scripts deferred.
    try { if(typeof window.onRoleApplied === 'function') window.onRoleApplied(role); } catch(_) {}
  }

  // Mapeo de páginas por rol: en qué vive cada perfil por default.
  // Si el rol seleccionado no corresponde al tipo de página actual,
  // se redirige al "home" del perfil para que la UX refleje el cambio.
  const OPERATOR_PAGES = /incentivo-(08|09|10|11|14)/;
  const ADMIN_PAGES    = /incentivo-(02|03|04|05|06|07|08|09|10|11|12|13|15|16|18)/;
  // Gestor de programa sólo vive en la lista (filtrada) y el detalle.
  const PROGRAMA_PAGES = /incentivo-(02|03|05|07|08|09|10|11|12|16|18)/;
  const OPERATOR_HOME  = 'incentivo-08-asignar-buscar.html';
  const ADMIN_HOME     = 'incentivo-02-dashboard.html';
  const PROGRAMA_HOME  = 'incentivo-03-programas.html';
  const DEPORTISTA_HOME = 'incentivo-17-mis-documentos.html';

  /* Contador de pendientes del menú: al final de la fila, sin tapar el nombre; con el menú colapsado queda en la esquina del icono */
  function ensureNavCountStyle(){
    if(document.getElementById('navCountStyle')) return;
    const st = document.createElement('style'); st.id = 'navCountStyle';
    st.textContent = '.sidebar-nav .nav-row .nav-count{position:static;margin-left:auto;margin-right:0;background:#d74009;color:#fff;border-radius:10px;font-size:10px;font-weight:700;padding:0 6px;line-height:16px;min-width:8px;text-align:center;box-sizing:content-box}' +
      '.sidebar.collapsed .sidebar-nav .nav-row .nav-count{position:absolute;left:44px;top:4px;margin:0;border:2px solid #fff;padding:0 5px;line-height:15px}';
    document.head.appendChild(st);
  }
  /* Menú del Gestor de incentivos, agrupado: Dashboard · Parametrización · Gestión de programas · Administración */
  function buildAdminNav(role){
    const nav = document.querySelector('.sidebar-nav'); if(!nav) return;
    const p = location.pathname;
    const ico = (d, c) => '<div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></div>';
    const I = {
      dash: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
      prog: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/>',
      cod: '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3z"/>',
      rev: '<circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/>',
      asig: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
      hist: '<path d="M8 7h13M8 12h13M8 17h13"/><circle cx="4" cy="7" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="17" r="1"/>',
      rep: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
      users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
    };
    const act = /incentivo-02/.test(p) ? 'dash' : /incentivo-(03|04|05)/.test(p) ? 'prog' : /incentivo-07/.test(p) ? 'cod' : /incentivo-16/.test(p) ? 'rev'
      : /incentivo-(08|09|10|11)/.test(p) ? 'asig' : /incentivo-12/.test(p) ? 'hist' : /incentivo-15/.test(p) ? 'rep' : /incentivo-18/.test(p) ? 'users' : '';
    const L = {dash:['Dashboard','incentivo-02-dashboard.html'], prog:['Programas','incentivo-03-programas.html'], cod:['Códigos','incentivo-07-codigos.html'],
      rev:['Revisión documental','incentivo-16-revision-documental.html'], asig:['Asignar incentivos','incentivo-08-asignar-buscar.html'],
      hist:['Historial de asignaciones','incentivo-12-asignaciones.html'], rep:['Reportería','incentivo-15-reporteria.html'], users:['Gestión de usuarios','incentivo-18-gestion-usuarios.html']};
    const row = k => {
      const on = k === act, here = p.indexOf(L[k][1]) > -1;
      return '<div class="nav-row' + (on ? ' active' : '') + '"' + (k === 'rev' ? ' data-nav="revision"' : k === 'asig' ? ' data-nav="asignar"' : '') + (here ? '' : ' onclick="fadeAndGo(\'' + L[k][1] + '\')"') + '>'
        + (on ? '<div class="active-bar"></div>' : '') + ico(I[k], on ? '#d74009' : '#646587') + '<span class="lbl">' + L[k][0] + '</span></div>';
    };
    const admin = role === 'admin';
    if(!admin) L.prog[0] = 'Mis programas';   // el Gestor de programa solo ve los suyos
    nav.dataset.gestion = role;
    nav.innerHTML = row('dash')
      + '<div class="nav-section">Parametrización</div>' + row('prog') + row('cod')
      + '<div class="nav-section">Gestión de programas</div>' + row('rev') + row('asig') + row('hist') + (admin ? row('rep') : '')
      + '<div class="nav-section">Admin</div>' + row('users');
    ensureNavCountStyle();
    try {
      const rv = nav.querySelector('.nav-row[data-nav="revision"]'), n = window.pendingReviewCount ? window.pendingReviewCount() : 0;
      if(rv && n > 0) rv.insertAdjacentHTML('beforeend', '<span class="nav-count" id="navRevCount">' + n + '</span>');
    } catch(_){}
    document.documentElement.removeAttribute('data-gest-pending');
  }
  /* Menú de gestión para Danna e Isa dentro del flujo de asignación, con «Asignar incentivos» activo. */
  function buildGestionNav(role){
    const nav = document.querySelector('.sidebar-nav'); if(!nav) return;
    const ico = (d, c) => '<div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></div>';
    const items = [
      ['Dashboard', 'incentivo-02-dashboard.html', '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'],
      [role === 'programa' ? 'Mis programas' : 'Programas', 'incentivo-03-programas.html', '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/>'],
      ['Códigos', 'incentivo-07-codigos.html', '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3z"/>'],
      ['Historial de asignaciones', 'incentivo-12-asignaciones.html', '<path d="M8 7h13M8 12h13M8 17h13"/><circle cx="4" cy="7" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="17" r="1"/>'],
      ...(role === 'admin' ? [['Reportería', 'incentivo-15-reporteria.html', '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>']] : []),
      ['Revisión documental', 'incentivo-16-revision-documental.html', '<circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/>'],
      ['Asignar incentivos', null, '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>']
    ];
    nav.dataset.gestion = role;
    nav.innerHTML = '<div class="nav-section">INCENTIVOS</div>' + items.map(it => it[1]
      ? '<div class="nav-row"' + (it[0] === 'Revisión documental' ? ' data-nav="revision"' : '') + ' onclick="fadeAndGo(\'' + it[1] + '\')">' + ico(it[2], '#646587') + '<span class="lbl">' + it[0] + '</span></div>'
      : '<div class="nav-row active" data-nav="asignar"><div class="active-bar"></div>' + ico(it[2], '#d74009') + '<span class="lbl">' + it[0] + '</span></div>').join('');
    // Contador de revisiones pendientes, igual que el que inyecta injectRevisionNav en las demás pantallas
    ensureNavCountStyle();
    try {
      const rv = nav.querySelector('.nav-row[data-nav="revision"]'), n = window.pendingReviewCount ? window.pendingReviewCount() : 0;
      if(rv && n > 0) rv.insertAdjacentHTML('beforeend', '<span class="nav-count" id="navRevCount">' + n + '</span>');
    } catch(_){}
    document.documentElement.removeAttribute('data-gest-pending');
  }
  /* ── Bandeja de notificaciones (Gestor de programa y roles con alcance global) ──
     Avisa cuando un deportista completa sus documentos obligatorios: «Hay soportes pendientes de revisión». */
  function bellEsc(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function renderBell(){
    const wrap = document.getElementById('notifBell'); if(!wrap || !window.getNotifications) return;
    const list = window.getNotifications(), nuevas = list.filter(x => !x.leida).length, cnt = wrap.querySelector('.notif__count');
    cnt.textContent = nuevas > 9 ? '9+' : nuevas; cnt.hidden = !nuevas;
    wrap.querySelector('.notif__btn').setAttribute('aria-label', 'Notificaciones' + (nuevas ? ', ' + nuevas + ' sin leer' : ''));
    wrap.querySelector('.notif__list').innerHTML = list.length ? list.slice(0, 12).map(x =>
      '<button type="button" class="notif__it' + (x.leida ? '' : ' is-new') + '" data-go="1"><span class="notif__dot"></span><span class="notif__tx"><b>' + bellEsc(x.texto) + '</b>' +
      '<span>' + bellEsc(x.persona) + ' completó sus documentos obligatorios en ' + bellEsc(x.progName) + '.</span><small>' + bellEsc(x.fecha) + ' · ' + bellEsc(x.hora) + '</small></span></button>').join('')
      : '<div class="notif__empty">No tienes notificaciones.</div>';
  }
  function ensureBell(role){
    const hdr = document.querySelector('.top-header'); if(!hdr) return;
    let wrap = document.getElementById('notifBell');
    if(role !== 'programa' && role !== 'admin'){ if(wrap) wrap.remove(); return; }
    if(!window.getNotifications) return;
    if(!document.getElementById('notifStyle')){
      const st = document.createElement('style'); st.id = 'notifStyle';
      st.textContent = '.notif{position:relative}.notif__btn{position:relative;width:40px;height:40px;border-radius:50%;border:1px solid #e7e9f3;background:#fff;color:#646587;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
        '.notif__btn:hover{background:#f4f5f9}.notif__btn svg{width:20px;height:20px}' +
        '.notif__count{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#d74009;color:#fff;font-size:10px;font-weight:700;line-height:18px;text-align:center;border:2px solid #fff;box-sizing:content-box}' +
        '.notif__panel{position:absolute;top:calc(100% + 8px);right:0;width:360px;max-width:92vw;background:#fff;border:1px solid #e7e9f3;border-radius:14px;box-shadow:0 12px 32px rgba(40,40,52,.16);z-index:120;overflow:hidden}' +
        '.notif__panel[hidden]{display:none}.notif__hd{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eef0f6;font-size:13.5px;font-weight:700;color:#282834}' +
        '.notif__all{border:0;background:transparent;color:#d74009;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer}' +
        '.notif__list{max-height:360px;overflow:auto}.notif__it{display:flex;gap:10px;width:100%;text-align:left;border:0;border-bottom:1px solid #f1f2f8;background:#fff;padding:12px 16px;cursor:pointer;font:inherit}' +
        '.notif__it:hover{background:#fafbfd}.notif__dot{width:8px;height:8px;border-radius:50%;background:transparent;flex:none;margin-top:6px}.notif__it.is-new .notif__dot{background:#d74009}' +
        '.notif__tx{display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:#646587;line-height:1.4}.notif__tx b{font-size:13px;color:#282834}.notif__tx small{font-size:11.5px;color:#9c9ebf}' +
        '.notif__empty{padding:28px 16px;text-align:center;font-size:13px;color:#646587}';
      document.head.appendChild(st);
    }
    if(!wrap){
      wrap = document.createElement('div'); wrap.className = 'notif'; wrap.id = 'notifBell';
      wrap.innerHTML = '<button class="notif__btn" type="button" aria-haspopup="true" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg><span class="notif__count" hidden>0</span></button>' +
        '<div class="notif__panel" hidden><div class="notif__hd"><span>Notificaciones</span><button type="button" class="notif__all">Marcar como leídas</button></div><div class="notif__list"></div></div>';
      hdr.insertBefore(wrap, hdr.querySelector('.profile-switcher'));
      const panel = wrap.querySelector('.notif__panel'), btn = wrap.querySelector('.notif__btn');
      btn.addEventListener('click', e => { e.stopPropagation(); renderBell(); panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', !panel.hidden); });
      wrap.querySelector('.notif__all').addEventListener('click', () => { window.markNotificationsRead(); renderBell(); });
      wrap.querySelector('.notif__list').addEventListener('click', e => {
        if(!e.target.closest('[data-go]')) return;
        window.markNotificationsRead();
        const url = 'incentivo-16-revision-documental.html';
        if(typeof window.fadeAndGo === 'function') window.fadeAndGo(url); else window.location.href = url;
      });
      document.addEventListener('click', e => { if(!e.target.closest('#notifBell')){ panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
      window.addEventListener('storage', renderBell); window.addEventListener('focus', renderBell); window.addEventListener('pageshow', renderBell);
    }
    renderBell();
  }
  /* Entrada "Asignar incentivos" (Gestor de incentivos y Gestor de programa): lleva al flujo del operador. */
  function injectAsignarNav(){
    const nav = document.querySelector('.sidebar-nav'); if(!nav) return;
    const rows = nav.querySelectorAll('.nav-row'); const last = rows[rows.length - 1]; if(!last) return;
    const row = document.createElement('div');
    row.className = 'nav-row';
    row.setAttribute('data-nav', 'asignar');
    row.setAttribute('onclick', "fadeAndGo('incentivo-08-asignar-buscar.html')");
    row.innerHTML = '<div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#646587" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></div><span class="lbl">Asignar incentivos</span>';
    last.insertAdjacentElement('afterend', row);
  }
  /* Entrada "Revisión documental" (solo Gestor de programa): se inyecta tras Historial. */
  function injectRevisionNav(){
    const nav = document.querySelector('.sidebar-nav'); if(!nav) return;
    const rows = nav.querySelectorAll('.nav-row'); const last = rows[rows.length - 1]; if(!last) return;
    const active = /incentivo-16/.test(location.pathname);
    const row = document.createElement('div');
    row.className = 'nav-row' + (active ? ' active' : '');
    row.setAttribute('data-nav', 'revision');
    if(!active) row.setAttribute('onclick', "fadeAndGo('incentivo-16-revision-documental.html')");
    const st = active ? '#d74009' : '#646587';
    row.innerHTML = (active ? '<div class="active-bar"></div>' : '') +
      '<div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + st + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/></svg></div>' +
      '<span class="lbl">Revisión documental</span><span class="nav-count" id="navRevCount"></span>';
    ensureNavCountStyle();
    last.insertAdjacentElement('afterend', row);
    try { const n = window.pendingReviewCount ? window.pendingReviewCount() : 0; const c = row.querySelector('#navRevCount'); if(n > 0) c.textContent = n; else c.remove(); } catch(_){}
  }

  function switchRole(role){
    localStorage.setItem(STORAGE_KEY, role);
    applyRole(role);
    closeAllSwitchers();

    const path = location.pathname;
    const onOperadorPage = OPERATOR_PAGES.test(path);
    const onAdminPage    = ADMIN_PAGES.test(path);
    const onProgramaPage = PROGRAMA_PAGES.test(path);

    if(role === 'deportista' && !/incentivo-17/.test(path)){
      setTimeout(() => { window.location.href = DEPORTISTA_HOME; }, 180);
    } else if(role === 'operador' && !onOperadorPage){
      setTimeout(() => { window.location.href = OPERATOR_HOME; }, 180);
    } else if(role === 'programa' && !onProgramaPage){
      // Gestor de programa: redirijo a su lista filtrada (PRG asignado).
      setTimeout(() => { window.location.href = PROGRAMA_HOME; }, 180);
    } else if(role === 'admin' && !onAdminPage){
      // Gestor de incentivos (admin) vive en el dashboard; si estoy en
      // pages del operador, redirijo.
      setTimeout(() => { window.location.href = ADMIN_HOME; }, 180);
    }
  }

  /* Helper: devuelve los IDs de programas asignados al rol actual.
     Retorna null si el rol no tiene restricciones (ve todo). Las páginas
     que renderizan listas pueden filtrar contra este array. */
  function getRoleAssignments(){
    const r = ROLES[currentRole()];
    if(!(r && Array.isArray(r.assignedPrograms))) return null;
    const ids = r.assignedPrograms.slice();
    /* Además de los asignados de demo, el gestor ve los programas donde fue elegido en el formulario (Gestores del programa). */
    if(window.PROGRAMS_DATA && window.getProgramConfig){
      window.PROGRAMS_DATA.forEach(p => {
        try { if(window.getProgramConfig(p).gestores.indexOf(r.name) > -1 && ids.indexOf(p.id) < 0) ids.push(p.id); } catch(_){}
      });
    }
    return ids;
  }

  function toggleProfileDD(ev){
    if(ev) ev.stopPropagation();
    const sw = ev?.currentTarget?.closest?.('.profile-switcher')
            || document.querySelector('.profile-switcher');
    if(!sw) return;
    const isOpen = sw.classList.contains('open');
    closeAllSwitchers();
    if(!isOpen) sw.classList.add('open');
  }

  function closeAllSwitchers(){
    document.querySelectorAll('.profile-switcher').forEach(sw => sw.classList.remove('open'));
  }

  // Construye el dropdown (profile-dd) cuando una página no lo tiene.
  function buildProfileDD(activeRole){
    const items = DEFAULT_ROLES_IN_DD.map(key => {
      const r = ROLES[key];
      if(!r) return '';
      const isActive = key === activeRole ? ' active' : '';
      return `
        <div class="profile-dd__item${isActive}" data-role="${key}">
          <div class="ava"><div class="ava-ring" style="background:${r.bg};color:${r.fg};width:28px;height:28px;font-size:11px">${r.initials}</div></div>
          <div class="role-meta">
            <strong>${r.name}</strong>
            <small>${r.label} · ${r.meta}</small>
          </div>
          <svg class="dd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>`;
    }).join('');
    const dd = document.createElement('div');
    dd.className = 'profile-dd';
    dd.innerHTML = `<div class="profile-dd__label">Cambiar de perfil</div>${items}`;
    return dd;
  }

  function mountSwitcher(sw){
    if(sw.dataset.wzMounted === '1') return;
    sw.dataset.wzMounted = '1';

    // Asegura id (no es estrictamente necesario, pero mantiene compat con
    // código legacy que buscaba por #profileSwitcher)
    if(!sw.id) sw.id = 'profileSwitcher';

    // Wire-up del chip → toggle. Skipeamos si ya tiene onclick inline
    // (páginas legacy con toggleProfileDD inline) para evitar doble fire.
    const chip = sw.querySelector('.user-chip');
    if(chip && !chip.dataset.wzClick && !chip.hasAttribute('onclick')){
      chip.dataset.wzClick = '1';
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', toggleProfileDD);
    }
    // Chevron sólo necesita stopPropagation para no doble-togglear con el chip
    const chevron = sw.querySelector('.user-chip__chevron');
    if(chevron && !chevron.dataset.wzClick){
      chevron.dataset.wzClick = '1';
      chevron.addEventListener('click', (e) => { e.stopPropagation(); toggleProfileDD(e); });
    }

    // Inyecta profile-dd si no existe
    if(!sw.querySelector('.profile-dd')){
      const dd = buildProfileDD(currentRole());
      sw.appendChild(dd);
    }

    // Wire-up de los items del dropdown. Skipeamos si ya tienen onclick
    // inline (páginas legacy) para evitar doble-fire de switchRole.
    sw.querySelectorAll('.profile-dd__item').forEach(item => {
      if(item.dataset.wzClick || item.hasAttribute('onclick')) return;
      item.dataset.wzClick = '1';
      item.addEventListener('click', () => switchRole(item.dataset.role));
    });
  }

  // Botón flotante «Recorridos de la DEMO»: abre el recorrido en la misma pantalla y perfil (no dentro del propio recorrido)
  function botonRecorridos(){
    let embebido = false; try { embebido = window.parent !== window; } catch(e){ embebido = true; }
    if(embebido || document.querySelector('.rc-launch-lnk')) return;
    const a = document.createElement('a');
    const archivo = location.pathname.split('/').pop() || 'index.html';
    a.className = 'rc-launch-lnk';
    a.href = 'recorrido/?panel=1&desde=' + encodeURIComponent(archivo + location.search);
    a.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5"/></svg>Recorridos de la DEMO';
    a.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:8000;display:flex;align-items:center;gap:8px;background:#002b5b;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:10px 17px;font:700 12.5px 'Inter',sans-serif;text-decoration:none;box-shadow:0 10px 30px -10px rgba(0,43,91,.55)";
    document.body.appendChild(a);
  }

  function mountAll(){
    botonRecorridos();
    document.querySelectorAll('.profile-switcher').forEach(mountSwitcher);
    applyRole(currentRole());
  }

  // Cerrar al clickear fuera de cualquier switcher
  document.addEventListener('click', (e) => {
    const inside = e.target.closest?.('.profile-switcher');
    if(!inside) closeAllSwitchers();
  });

  // Logout (opcional)
  document.addEventListener('DOMContentLoaded', () => {
    mountAll();
    const btnLogout = document.getElementById('btnLogout');
    if(btnLogout){
      // Se clona para descartar handlers inline que apuntaban al login y se vuelve a la portada de roles.
      const clean = btnLogout.cloneNode(true);
      btnLogout.replaceWith(clean);
      clean.addEventListener('click', () => {
        if(window.incGoLanding) window.incGoLanding(clean); else window.location.href = 'index.html';
      });
    }
  });

  // Si el DOM ya está listo cuando se carga el script, montar ya.
  if(document.readyState !== 'loading'){
    mountAll();
  }

  // Exposición global para compatibilidad con onclick inline en páginas viejas
  window.ROLES = ROLES;
  window.currentRole = currentRole;
  window.applyRole = applyRole;
  window.switchRole = switchRole;
  window.toggleProfileDD = toggleProfileDD;
  window.getRoleAssignments = getRoleAssignments;
})();
