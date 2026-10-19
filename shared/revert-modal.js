/* Diálogo «Revertir asignación»: motivo y detalle obligatorios. Lo usan el Historial de asignaciones y Mis asignaciones. */
(function () {
  var MOT = [['devolucion', 'Devolución del beneficiario'], ['error', 'Error en la asignación'], ['no-elegible', 'Beneficiario no elegible'], ['fraude', 'Sospecha de fraude'], ['cambio', 'Cambio de categoría o programa'], ['otro', 'Otro']];
  var css = '.rvd-ov{position:fixed;inset:0;background:rgba(40,40,52,.6);display:none;align-items:center;justify-content:center;z-index:2000;padding:20px}.rvd-ov.open{display:flex}' +
    '.rvd{background:#fff;border-radius:20px;width:560px;max-width:100%;max-height:92vh;overflow:auto;box-shadow:0 24px 60px rgba(40,40,52,.3);font-family:Inter,sans-serif}' +
    '.rvd__h{padding:26px 30px 6px;display:flex;justify-content:space-between;gap:12px}.rvd__h h3{font-size:20px;font-weight:700;color:#282834;margin:0 0 4px}.rvd__h p{font-size:13.5px;color:#646587;margin:0}' +
    '.rvd__x{border:0;background:transparent;cursor:pointer;width:32px;height:32px;border-radius:8px;color:#646587;font-size:20px;line-height:1}.rvd__x:hover{background:#f4f5f9}' +
    '.rvd__b{padding:14px 30px 4px;display:flex;flex-direction:column;gap:14px}' +
    '.rvd__sum{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;background:#f4f5f9;border-radius:14px;padding:14px 16px;font-size:13.5px}.rvd__sum span{color:#646587}.rvd__sum b{color:#282834;font-weight:600;text-align:right}' +
    '.rvd__l{display:block;font-size:12.5px;font-weight:600;color:#3d3e55;margin-bottom:6px}.rvd__l i{color:#d74009;font-style:normal}' +
    '.rvd select,.rvd textarea{width:100%;box-sizing:border-box;font:inherit;font-size:14px;color:#282834;border:1px solid #d9dce8;border-radius:12px;padding:0 14px;background:#fff}.rvd select{height:46px}.rvd textarea{padding:12px 14px;min-height:76px;resize:vertical}' +
    '.rvd select:focus,.rvd textarea:focus{outline:2px solid #d74009;outline-offset:-1px;border-color:transparent}.rvd .bad select,.rvd .bad textarea{border-color:#b42318}' +
    '.rvd__info{font-size:13.5px;line-height:1.45;color:#282834;background:#d6f3ff;border-radius:14px;padding:12px 16px}' +
    '.rvd__err{display:none;font-size:13px;color:#b42318;background:#fff0ee;border-radius:12px;padding:10px 14px}.rvd__err.show{display:block}' +
    '.rvd__f{padding:18px 30px 26px;display:flex;justify-content:flex-end;gap:10px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var ov = document.createElement('div'); ov.className = 'rvd-ov'; ov.id = 'rvdOv';
  ov.innerHTML = '<div class="rvd" role="dialog" aria-modal="true" aria-labelledby="rvdT"><div class="rvd__h"><div><h3 id="rvdT">Revertir asignación</h3><p>El motivo queda registrado en la auditoría.</p></div><button class="rvd__x" type="button" aria-label="Cerrar" id="rvdX">×</button></div>' +
    '<div class="rvd__b"><div class="rvd__sum" id="rvdSum"></div>' +
    '<div id="rvdFM"><label class="rvd__l" for="rvdM">Motivo <i>*</i></label><select id="rvdM"><option value="">Selecciona un motivo</option>' + MOT.map(function (m) { return '<option value="' + m[0] + '">' + m[1] + '</option>'; }).join('') + '</select></div>' +
    '<div id="rvdFJ"><label class="rvd__l" for="rvdJ">Detalle <i>*</i></label><textarea id="rvdJ" placeholder="Explica por qué se revierte"></textarea></div>' +
    '<div class="rvd__info" id="rvdInfo"></div><div class="rvd__err" id="rvdErr"></div></div>' +
    '<div class="rvd__f"><button class="naowee-btn naowee-btn--mute naowee-btn--large" type="button" id="rvdC">Cancelar</button><button class="naowee-btn naowee-btn--loud naowee-btn--large" type="button" id="rvdOk">Revertir asignación</button></div></div>';
  document.body.appendChild(ov);
  var ctx = null, $ = function (id) { return document.getElementById(id); };
  function close() { ov.classList.remove('open'); ctx = null; }
  $('rvdX').onclick = $('rvdC').onclick = close;
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  $('rvdOk').onclick = function () {
    var m = $('rvdM').value, j = $('rvdJ').value.trim();
    $('rvdFM').classList.toggle('bad', !m); $('rvdFJ').classList.toggle('bad', !j);
    if (!m || !j) { $('rvdErr').textContent = 'El motivo y el detalle son obligatorios.'; $('rvdErr').classList.add('show'); return; }
    var c = ctx, label = MOT.filter(function (x) { return x[0] === m; })[0][1]; close();
    c.onConfirm({ motivo: m, motivoLabel: label, just: j });
  };
  window.RevertDialog = {
    open: function (c) {
      ctx = c; $('rvdM').value = ''; $('rvdJ').value = ''; $('rvdErr').classList.remove('show'); $('rvdFM').classList.remove('bad'); $('rvdFJ').classList.remove('bad');
      $('rvdSum').innerHTML = '<span>Beneficiario</span><b>' + c.persona + '</b><span>Programa</span><b>' + c.programa + '</b><span>Incentivo</span><b>' + c.incentivo + '</b>' +
        (c.code ? '<span>Código</span><b>' + c.code + '</b>' : '') + '<span>Entregado</span><b>' + c.fecha + '</b>' + (c.por ? '<span>Entregó</span><b>' + c.por + '</b>' : '');
      $('rvdInfo').textContent = (c.code ? 'El código queda como Revertido y disponible: el operador podrá asignarlo de nuevo. ' : '') + 'El cupo y el valor vuelven al programa y se retira el beneficio de la persona. Queda en la auditoría con tu nombre, rol, fecha, hora e IP.';
      ov.classList.add('open'); setTimeout(function () { $('rvdM').focus(); }, 80);
    }
  };
})();
