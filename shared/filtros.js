/* Filtros desplegables: misma etiqueta («Prefijo: valor») y misma marca de selección en todas las vistas.
   Cada página arma sus menús; este script solo uniforma el resultado, sin tocar la lógica de cada una. */
(function () {
  'use strict';
  var PREF = { ddStatusWrap: 'Estado', ddEstadoWrap: 'Estado', ddEstWrap: 'Estado', ddTipoWrap: 'Tipo', ddProgWrap: 'Programa', ddRegionWrap: 'Región', ddCicloWrap: 'Ciclo',
    ddRolWrap: 'Rol', ddBenOrigenWrap: 'Origen', ddBenTipoWrap: 'Incentivo', ddBenDocWrap: 'Documentación', ddPeriodWrap: 'Período', ddAnoWrap: 'Año', ddMesWrap: 'Mes', ddLogroWrap: 'Logro' };
  var TODOS = /^(todos?|todas?|cualquier logro|todo el año)$/i;

  function etiqueta(w) {
    var lab = w.querySelector('.toolbar-dd > span'), pref = PREF[w.id]; if (!lab || !pref) return null;
    var txt = lab.textContent.trim(), val = txt.replace(/^[^:]+:\s*/, ''), ok = pref + ': ' + val;
    if (txt !== ok) lab.textContent = ok;
    return val;
  }
  function seleccion(w, val) {
    var items = [].slice.call(w.querySelectorAll('.toolbar-dd-item')); if (!items.length || val == null) return;
    if (items.some(function (i) { return i.getAttribute('aria-selected') === 'true'; })) return;   // la página ya marcó uno
    var hit = TODOS.test(val) ? items[0] : items.filter(function (i) { return i.textContent.trim() === val; })[0];
    if (hit) hit.setAttribute('aria-selected', 'true');
  }
  function uniformar(w) { var v = etiqueta(w); seleccion(w, v); }

  function iniciar() {
    [].slice.call(document.querySelectorAll('.toolbar-dd-wrap')).forEach(function (w) {
      if (!PREF[w.id]) return;
      uniformar(w);
      new MutationObserver(function () { uniformar(w); }).observe(w, { childList: true, characterData: true, subtree: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
