/* Velkow Digital — скриптове на сайта */

/* ============ НАСТРОЙКИ (попълни тук) ============ */
// Ключ от web3forms.com (идва на имейла ти). Докато е празен, формата показва телефона.
var WEB3FORMS_KEY = '';
// Google Analytics 4 ID, напр. 'G-XXXXXXXXXX'. Докато е празно, не се зарежда нищо и няма банер за бисквитки.
var GA_ID = '';
/* ================================================= */

(function () {
  var html = document.documentElement;
  var lang = html.lang === 'en' ? 'en' : 'bg';
  var T = {
    bg: {
      dark: 'Тъмна тема', light: 'Светла тема',
      sending: 'Изпращане…', sent: 'Благодаря! Получих запитването ви и ще се свържа с вас до 24 часа.',
      fail: 'Възникна грешка. Моля, обадете се на 0887 088 557 или пишете на denis@velkoww.com.',
      nokey: 'Формата се настройва в момента. Моля, обадете се на 0887 088 557 или пишете на denis@velkoww.com.',
      cookie: 'Използвам бисквитки за анонимна статистика (Google Analytics) само с ваше съгласие.',
      privacy: 'Поверителност', accept: 'Приемам', deny: 'Отказвам',
      empty: 'Изберете поне една услуга, за да видите цената.',
      site: 'Уебсайт', siteM: 'Поддръжка на сайта', social: 'Социални мрежи', socialM: 'Поддръжка на социални мрежи',
      maps: 'Google & Apple Maps', mapsM: 'Поддръжка на Maps', create: 'създаване', update: 'актуализиране',
      free: 'Подарък', perMonth: '/мес.', from: 'от ',
      quoteTitle: 'Конфигурация от калкулатора', once: 'Еднократно', monthly: 'Месечно (от 2-ри месец)', advance: 'Аванс 50%'
    },
    en: {
      dark: 'Dark theme', light: 'Light theme',
      sending: 'Sending…', sent: 'Thank you! I received your request and will get back to you within 24 hours.',
      fail: 'Something went wrong. Please call +359 887 088 557 or email denis@velkoww.com.',
      nokey: 'The form is being set up. Please call +359 887 088 557 or email denis@velkoww.com.',
      cookie: 'I use cookies for anonymous statistics (Google Analytics) only with your consent.',
      privacy: 'Privacy', accept: 'Accept', deny: 'Decline',
      empty: 'Select at least one service to see the price.',
      site: 'Website', siteM: 'Website maintenance', social: 'Social media', socialM: 'Social media maintenance',
      maps: 'Google & Apple Maps', mapsM: 'Maps maintenance', create: 'setup', update: 'refresh',
      free: 'Free', perMonth: '/mo', from: 'from ',
      quoteTitle: 'Configuration from the calculator', once: 'One-time', monthly: 'Monthly (from month 2)', advance: '50% deposit'
    }
  }[lang];

  function sGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- Тема ---- */
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function effective() { var t = html.getAttribute('data-theme'); return t || (mq && mq.matches ? 'dark' : 'light'); }
  function paintTheme() {
    var e = effective();
    html.setAttribute('data-theme-effective', e);
    document.querySelectorAll('.theme-btn').forEach(function (b) {
      var label = e === 'dark' ? T.light : T.dark;
      b.setAttribute('aria-label', label); b.setAttribute('title', label);
    });
  }
  paintTheme();
  if (mq && mq.addEventListener) mq.addEventListener('change', paintTheme);
  document.querySelectorAll('.theme-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = effective() === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next); sSet('theme', next); paintTheme();
    });
  });

  /* ---- Мобилно меню ---- */
  var mBtn = document.querySelector('.menu-btn'), mMenu = document.getElementById('mobile-menu');
  if (mBtn && mMenu) {
    mBtn.addEventListener('click', function () {
      var open = mMenu.classList.toggle('open');
      mBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Калкулатор ---- */
  var calc = document.getElementById('calc');
  var lastQuote = '';
  function fmt(n) {
    var s = (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);
    return lang === 'bg' ? s.replace('.', ',') + ' €' : '€' + s;
  }
  if (calc) {
    var P = {
      site: { setup: 140, maint: 20, variable: true },
      social: { create: 25, update: 15, maint: 20 },
      maps: { create: 25, update: 15, maint: 10 }
    };
    function val(name) { var el = calc.querySelector('[name="' + name + '"]:checked'); return el ? el.value : null; }
    function on(name) { var el = calc.querySelector('[name="' + name + '"]'); return !!(el && el.checked); }

    function compute() {
      var sel = { site: on('site'), social: on('social'), maps: on('maps') };
      calc.querySelectorAll('.calc-item').forEach(function (it) {
        it.classList.toggle('on', sel[it.getAttribute('data-svc')]);
      });
      var items = {};
      if (sel.site) items.site = { setup: P.site.setup, maint: on('siteMaint') ? P.site.maint : 0, wantM: on('siteMaint') };
      if (sel.social) {
        var sHas = val('socialHas') === 'yes';
        items.social = { setup: sHas ? P.social.update : P.social.create, maint: on('socialMaint') ? P.social.maint : 0, wantM: on('socialMaint'), has: sHas };
      }
      if (sel.maps) {
        var mHas = val('mapsHas') === 'yes';
        items.maps = { setup: mHas ? P.maps.update : P.maps.create, maint: on('mapsMaint') ? P.maps.maint : 0, wantM: on('mapsMaint'), has: mHas };
      }
      // по подразбиране без отстъпка
      Object.keys(items).forEach(function (k) { items[k].setupFinal = items[k].setup; items[k].maintFinal = items[k].maint; items[k].tag = ''; });

      var extras = ['social', 'maps'].filter(function (k) { return items[k]; });
      if (items.site && extras.length === 1) {
        // Сайт + 1 услуга: втората е с 50% отстъпка (създаване/актуализиране и поддръжка)
        var x = items[extras[0]];
        x.setupFinal = x.setup / 2; x.maintFinal = x.maint / 2; x.tag = '-50%';
      } else if (items.site && extras.length === 2) {
        // И трите: най-евтината (по цена за създаване, при равенство – по-евтината поддръжка) е подарък
        var a = items.social, b = items.maps, cheap, other;
        if (a.setup < b.setup || (a.setup === b.setup && P.social.maint < P.maps.maint)) { cheap = 'social'; other = 'maps'; }
        else { cheap = 'maps'; other = 'social'; }
        var c = items[cheap];
        c.setupFinal = 0; c.tag = 'free';
        // поддръжката ѝ отпада, докато се плаща поддръжката на другите две
        if (items.site.wantM && items[other].wantM) c.maintFinal = 0;
      }

      var lines = [], once = 0, monthly = 0, quote = [];
      function line(label, full, final, perMonth, variable) {
        var star = variable ? '<span class="req">*</span>' : '';
        var pre = variable ? T.from : '';
        var price;
        if (final === 0 && full > 0) price = '<s>' + fmt(full) + '</s><span class="free">' + T.free + '</span>';
        else if (final < full) price = '<s>' + fmt(full) + '</s><b>' + pre + fmt(final) + (perMonth ? T.perMonth : '') + '</b>';
        else price = '<b>' + pre + fmt(final) + (perMonth ? T.perMonth : '') + star + '</b>';
        lines.push('<li><span>' + label + '</span><span>' + price + '</span></li>');
        quote.push('- ' + label + ': ' + (final === 0 && full > 0 ? T.free : pre + fmt(final) + (perMonth ? T.perMonth : '')));
      }
      if (items.site) {
        line(T.site, items.site.setup, items.site.setupFinal, false, true); once += items.site.setupFinal;
        if (items.site.wantM) { line(T.siteM, items.site.maint, items.site.maintFinal, true, true); monthly += items.site.maintFinal; }
      }
      ['social', 'maps'].forEach(function (k) {
        var it = items[k]; if (!it) return;
        var name = (k === 'social' ? T.social : T.maps) + ' (' + (it.has ? T.update : T.create) + ')';
        line(name, it.setup, it.setupFinal, false, false); once += it.setupFinal;
        if (it.wantM) { line(k === 'social' ? T.socialM : T.mapsM, it.maint, it.maintFinal, true, false); monthly += it.maintFinal; }
      });

      var out = document.getElementById('calc-out');
      var hasItems = Object.keys(items).length > 0;
      var pre = items.site ? T.from : '';
      var star = items.site ? '<span class="req">*</span>' : '';
      if (!hasItems) {
        out.innerHTML = '<p class="sum-empty">' + T.empty + '</p>';
        lastQuote = '';
      } else {
        out.innerHTML = '<ul class="sum-lines">' + lines.join('') + '</ul>' +
          '<div class="sum-total"><span>' + T.once + '</span><b>' + pre + fmt(once) + star + '</b></div>' +
          '<div class="sum-sub"><span>' + T.advance + '</span><span>' + pre + fmt(once / 2) + '</span></div>' +
          '<div class="sum-sub"><span>' + T.monthly + '</span><span>' + (monthly ? pre + fmt(monthly) + T.perMonth : '—') + '</span></div>';
        lastQuote = T.quoteTitle + ':\n' + quote.join('\n') + '\n' + T.once + ': ' + pre + fmt(once) + '\n' + T.monthly + ': ' + (monthly ? pre + fmt(monthly) + T.perMonth : '—');
      }
      var send = document.getElementById('calc-send');
      if (send) {
        send.setAttribute('aria-disabled', hasItems ? 'false' : 'true');
        send.href = send.getAttribute('data-base') + (hasItems ? '?quote=' + encodeURIComponent(lastQuote) : '') + '#form';
      }
    }
    calc.addEventListener('change', compute);
    compute();
  }

  /* ---- Предварително попълване на формата от калкулатора ---- */
  var msg = document.getElementById('f-msg');
  if (msg) {
    try {
      var q = new URLSearchParams(location.search).get('quote');
      if (q) msg.value = q.slice(0, 1500) + '\n\n';
    } catch (e) {}
  }

  /* ---- Форма ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.className = 'form-status';
      if (!WEB3FORMS_KEY) { status.textContent = T.nokey; status.className = 'form-status err'; return; }
      var btn = form.querySelector('button[type="submit"]'), old = btn.textContent;
      btn.disabled = true; btn.textContent = T.sending;
      var data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      data.append('subject', 'Ново запитване от velkoww.com');
      data.append('from_name', 'velkoww.com');
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.success) { status.textContent = T.sent; status.className = 'form-status ok'; form.reset(); if (window.gtag) gtag('event', 'generate_lead'); }
          else throw new Error('fail');
        })
        .catch(function () { status.textContent = T.fail; status.className = 'form-status err'; })
        .then(function () { btn.disabled = false; btn.textContent = old; });
    });
  }

  /* ---- Google Analytics със съгласие ---- */
  function loadGA() {
    if (!GA_ID || window.__ga) return; window.__ga = 1;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  if (GA_ID) {
    var c = sGet('consent');
    if (c === 'yes') loadGA();
    else if (c !== 'no') {
      var box = document.createElement('div');
      box.className = 'cookie'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookies');
      var pv = lang === 'en' ? '/en/privacy' : '/privacy';
      box.innerHTML = '<div>' + T.cookie + ' <a href="' + pv + '">' + T.privacy + '</a></div>' +
        '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" data-c="no">' + T.deny + '</button>' +
        '<button type="button" class="btn btn-primary btn-sm" data-c="yes">' + T.accept + '</button></div>';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) {
        var v = e.target.getAttribute && e.target.getAttribute('data-c'); if (!v) return;
        sSet('consent', v); box.remove(); if (v === 'yes') loadGA();
      });
    }
  }

  /* ---- Проследяване на обаждания/Viber като събития ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="viber:"]');
    if (a && window.gtag) gtag('event', a.href.indexOf('tel:') === 0 ? 'call_click' : 'viber_click');
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
