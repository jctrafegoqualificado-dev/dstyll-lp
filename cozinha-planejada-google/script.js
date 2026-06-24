(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Barra de progresso de scroll ----------
  var progress = document.querySelector('.scroll-progress');
  if (progress && !reduce) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(window.scrollY / max, 1);
      progress.style.transform = 'scaleX(' + p + ')';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  // ---------- Contador animado (badge "30 anos") ----------
  var statEls = document.querySelectorAll('.stat-num[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    var animateNum = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      if (reduce) { el.textContent = target; return; }
      var dur = 1200, start = null;
      var step = function (t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    var nObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateNum(entry.target); nObs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { nObs.observe(el); });
  }

  // ---------- Lightbox da galeria de detalhes ----------
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbClose = lb && lb.querySelector('.lb-close');
  document.querySelectorAll('.g-item').forEach(function (item) {
    var open = function () {
      var src = item.getAttribute('data-src');
      var alt = item.querySelector('img') ? item.querySelector('img').alt : '';
      if (!src || !lb || !lbImg) return;
      lbImg.src = src; lbImg.alt = alt;
      if (typeof lb.showModal === 'function') lb.showModal();
      else lb.setAttribute('open', '');
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  if (lbClose) lbClose.addEventListener('click', function () { lb.close(); });
  if (lb) {
    lb.addEventListener('click', function (e) {
      var rect = lbImg.getBoundingClientRect();
      var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) lb.close();
    });
  }

  // ---------- Tilt 3D suave nos cards de diferenciais (desktop/mouse only) ----------
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reduce) {
    document.querySelectorAll('.dif').forEach(function (card) {
      var rect;
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotX = (-y * 4).toFixed(2);
        var rotY = (x * 4).toFixed(2);
        card.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  // ---------- Máscara WhatsApp ----------
  var wpp = document.getElementById('whatsapp');
  if (wpp) {
    wpp.addEventListener('input', function (e) {
      var v = e.target.value.replace(/\D/g, '').slice(0, 11);
      var out = '';
      if (v.length > 0) out = '(' + v.substring(0, 2);
      if (v.length >= 3) out += ') ' + v.substring(2, 3);
      if (v.length >= 4) out += ' ' + v.substring(3, 7);
      if (v.length >= 8) out += '-' + v.substring(7, 11);
      e.target.value = out;
    });
  }

  // ---------- Form: envia pro email (FormSubmit) + abre WhatsApp em paralelo ----------
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var nome = (document.getElementById('nome') || {}).value || '';
      var wppNum = (document.getElementById('whatsapp') || {}).value || '';
      var ambiente = (document.getElementById('ambiente') || {}).value || '';
      var msg = (document.getElementById('mensagem') || {}).value || '';
      var texto = 'Olá, sou ' + nome + '.';
      if (wppNum) texto += ' Meu WhatsApp é ' + wppNum + '.';
      texto += ' Quero iniciar um projeto de ' + ambiente + '.';
      if (msg) texto += ' ' + msg;
      var url = 'https://wa.me/5541984951207?text=' + encodeURIComponent(texto);
      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- Header com sombra ao rolar ----------
  var header = document.querySelector('.nav');
  if (header) {
    var setShadow = function () {
      if (window.scrollY > 6) header.style.boxShadow = '0 4px 14px rgba(58,53,47,.08)';
      else header.style.boxShadow = 'none';
    };
    setShadow();
    window.addEventListener('scroll', setShadow, { passive: true });
  }

  // ---------- Reveal por scroll ----------
  if ('IntersectionObserver' in window && !reduce) {
    var targets = ['.section-head', '.dif', '.detail-grid figure', '.contact-text', '.contact-form-card', '.hero-text', '.hero-visual'];
    var nodes = document.querySelectorAll(targets.join(','));
    nodes.forEach(function (el) {
      el.classList.add('reveal');
      var parent = el.parentElement;
      if (parent) {
        var sibIndex = Array.prototype.indexOf.call(parent.children, el);
        if (sibIndex >= 0 && sibIndex < 3) el.classList.add('delay-' + sibIndex);
      }
    });
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          rObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (el) { rObs.observe(el); });
  }
})();
