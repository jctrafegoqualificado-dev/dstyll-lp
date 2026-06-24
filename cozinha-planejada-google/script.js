(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      texto += ' Quero um orçamento de ' + ambiente + '.';
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
