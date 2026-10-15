/* ═══════════════════════════════════════════════════════════════
   Transición continua portada ⇄ vistas de rol.
   Entrar:  la tarjeta crece a pantalla completa (portada) y, ya en la vista del rol,
            ese mismo naranja SE REDUCE hasta el chip de usuario → se siente la misma vista.
   Volver:  window.incGoLanding(origen) expande desde el botón a pantalla completa y la
            portada lo reduce hasta la tarjeta del rol en el que estabas.
   Solo anima clip-path/opacity. Respeta prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var KEY_IN = 'inc-enter', KEY_BACK = 'inc-back';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROLE_LABEL = { admin: 'Gestor de incentivos', gestor: 'Gestor de incentivos', programa: 'Gestor de programa', operador: 'Operador' };

  function get(k) { try { var v = JSON.parse(sessionStorage.getItem(k)); sessionStorage.removeItem(k); return v && Date.now() - v.t < 6000 ? v : null; } catch (_) { return null; } }
  function set(k, o) { try { o.t = Date.now(); sessionStorage.setItem(k, JSON.stringify(o)); } catch (_) {} }
  function currentRole() { try { return localStorage.getItem('naowee-incentivos-role') || 'admin'; } catch (_) { return 'admin'; } }

  function inset(r) { return 'inset(' + Math.max(r.top, 0) + 'px ' + Math.max(innerWidth - r.right, 0) + 'px ' + Math.max(innerHeight - r.bottom, 0) + 'px ' + Math.max(r.left, 0) + 'px round ' + Math.min(24, r.height / 2) + 'px)'; }
  function makeOverlay(label) {
    var o = document.createElement('div');
    o.setAttribute('aria-hidden', 'true');
    o.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#d74009;color:#fff;display:flex;align-items:center;justify-content:center;font:700 28px/1.2 Inter,system-ui,sans-serif;pointer-events:none;clip-path:inset(0 0 0 0 round 0px)';
    var t = document.createElement('span'); t.textContent = label || ''; t.style.cssText = 'transition:opacity .25s ease'; o.appendChild(t); o._t = t;
    (document.body || document.documentElement).appendChild(o);
    return o;
  }
  function remove(o) { if (o && o.parentNode) o.parentNode.removeChild(o); }

  /* Reduce el overlay a pantalla completa hasta `rect` y luego lo desvanece. */
  function shrinkTo(o, rect, done) {
    if (reduced || !rect) { o.style.transition = 'opacity .2s ease'; requestAnimationFrame(function () { o.style.opacity = '0'; }); setTimeout(function () { remove(o); done && done(); }, 240); return; }
    o._t.style.opacity = '0';
    setTimeout(function () {
      o.style.transition = 'clip-path .55s cubic-bezier(.22,1,.36,1)';
      o.style.clipPath = inset(rect);
      setTimeout(function () { o.style.transition = 'opacity .22s ease'; o.style.opacity = '0'; setTimeout(function () { remove(o); done && done(); }, 240); }, 560);
    }, 160);
  }

  /* ── ENTRAR: ya estamos en la vista del rol ─────────────────── */
  var inn = get(KEY_IN);
  if (inn) {
    var ov = makeOverlay(inn.name);
    var go = function () {
      var chip = document.querySelector('.user-chip');
      var rect = chip ? chip.getBoundingClientRect() : null;
      shrinkTo(ov, rect);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(go, 120); });
    else setTimeout(go, 120);
    setTimeout(function () { remove(ov); }, 4000); // red de seguridad
  }

  /* ── VOLVER: aterrizamos en la portada ──────────────────────── */
  function onLanding() {
    var back = get(KEY_BACK);
    if (!back) return;
    var cards = document.querySelectorAll('[data-role-go]');
    if (!cards.length) return;
    document.documentElement.classList.add('inc-no-anim');
    var ovb = makeOverlay(back.label || '');
    var card = document.querySelector('[data-role-go="' + back.role + '"]') || cards[0];
    setTimeout(function () { shrinkTo(ovb, card.getBoundingClientRect()); }, 120);
    setTimeout(function () { remove(ovb); }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onLanding); else onLanding();

  /* ── API: ir a la portada con transición ────────────────────── */
  window.incGoLanding = function (from) {
    var role = currentRole(), label = ROLE_LABEL[role] || '';
    set(KEY_BACK, { role: role === 'gestor' ? 'admin' : role, label: label });
    var url = 'index.html';
    if (reduced || !from || !from.getBoundingClientRect) { location.href = url; return; }
    var r = from.getBoundingClientRect();
    var o = makeOverlay(label); o._t.style.opacity = '0';
    o.style.clipPath = inset(r);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      o.style.transition = 'clip-path .45s cubic-bezier(.7,0,.9,.4)'; o.style.clipPath = 'inset(0 0 0 0 round 0px)';
      setTimeout(function () { o._t.style.opacity = '1'; }, 220);
      setTimeout(function () { location.href = url; }, 700);
    }); });
  };
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.querySelectorAll('body > div[aria-hidden="true"][style*="2147483000"]').forEach(remove); });
})();
