/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-E8WE. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – FELLES SKRIPT FOR ALLE SIDER
   ---------------------------------------------------------------------
   Legges i <head> rett etter <title>, og stil.css rett etter:
     <script src="felles.js"></script>
     <link rel="stylesheet" href="stil.css">

   Innhold:
     1. Innstillinger   (språk, dato, lydkreditter: endre her)
     2. Språk           (velger språk og henter sprak-XX.js)
     3. Oversettelse    (bytter tekst på siden)
     4. Farger / svart-hvitt
     5. Knapperaden     (Farger | Svart-hvitt og NO | EN | PL)
     6. Bunntekst       (fylles inn i <footer data-lyd="...">)
     7. Lenke til originalen (bare når siden ligger et annet sted)
     8. Oppstart

   Alt utseende ligger i stil.css. Denne filen lager ingen CSS.
   ===================================================================== */
/* Versjonsnummeret fra lenken til denne fila (felles.js?v=39) brukes også for filene som lastes herfra (språk og materialer),
   så nettleseren henter nye utgaver etter en oppdatering i stedet for gamle kopier fra hurtigminnet. */
window.VBM_VERSJON = (function(){ var s = document.currentScript && document.currentScript.src, m = s && /[?&]v=([^&#]+)/.exec(s); return m ? m[1] : ''; })();
(function(){
  'use strict';
  var VERSJON = window.VBM_VERSJON ? '?v=' + window.VBM_VERSJON : '';

  /* ==================== 1. Innstillinger ==================== */
  var SPRAK = ['no', 'en', 'pl'];                        // rekkefølgen på knappene
  var NAVN  = { no: 'Norsk', en: 'English', pl: 'Polski' };
  var ANDRE = 'en';                                      // språk for alle andre land
  var NOKKEL = 'vbm-sprak';                              // lagret valg i nettleseren
  var ORIGINAL = 'https://verdensbestemusikkskole.no/';
  /* Adressene som er originalen. Alle andre steder viser sidene et banner med lenke hit.
     mollodi.github.io er eierens egen GitHub (den gamle adressen sender videre til domenet,
     og testsiden VBM-test ligger der). */
  var EGNE = ['verdensbestemusikkskole.no', 'www.verdensbestemusikkskole.no', 'mollodi.github.io'];

  /* Bunnteksten. Navnene står alltid på norsk. De andre delene oversettes
     i sprak-XX.js, så husk å endre dem der også hvis du endrer dem her. */
  var BUNN = {
    designet: 'Designet og levert av',
    hjelp: 'med liten hjelp av Claude AI',
    dato: 'september 2026'
  };
  /* Lydkreditter. Siden velger med <footer data-lyd="alle">, data-lyd="piano" eller data-lyd="stemming". */
  var LYD = {
    alle: 'Lyd: Salamander Grand Piano av Alexander Holm (CC BY 3.0). Strykere fra VS Chamber Orchestra Community Edition av Versilian Studios (CC0).',
    piano: 'Lyd: Salamander Grand Piano av Alexander Holm (CC BY 3.0).',
    stemming: 'Lyd: orgel spilt inn av Simon Dalzell (Ivy Audio) og strykere, begge fra VS Chamber Orchestra Community Edition av Versilian Studios (CC0). Piano: Salamander Grand Piano av Alexander Holm (CC BY 3.0).',
    rytme: 'Lyd: trommer fra Versilian Community Sample Library (CC0). Piano: Salamander Grand Piano av Alexander Holm (CC BY 3.0). Strykere fra VS Chamber Orchestra Community Edition av Versilian Studios (CC0).'
  };

  /* ==================== 2. Språk ==================== */
  var root = document.documentElement;
  function kort(k){ k = String(k || '').toLowerCase().slice(0, 2); return (k === 'nb' || k === 'nn') ? 'no' : k; }
  var kilde = kort(root.getAttribute('lang') || 'no');   // språket siden er skrevet på

  function finnSprak(){
    /* For testing: side.html?sprak=en viser siden på engelsk uten å lagre valget. */
    var m = location.search.match(/[?&]sprak=(\w+)/);
    if (m && SPRAK.indexOf(m[1]) >= 0) return m[1];
    try { var s = localStorage.getItem(NOKKEL); if (SPRAK.indexOf(s) >= 0) return s; } catch(e){}
    var liste = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < liste.length; i++) { var k = kort(liste[i]); if (SPRAK.indexOf(k) >= 0) return k; }
    return ANDRE;
  }
  var sprak = finnSprak();
  window.VBM_SPRAK = sprak;
  root.setAttribute('lang', sprak);
  root.setAttribute('data-sprak', sprak);

  var side = root.getAttribute('data-side') || (location.pathname.split('/').pop() || 'index.html');
  var ord = {}, menyOrd = {};
  /* Ordbøkene (sprak-XX.js) kaller denne funksjonen. Menyen bruker startsidens oversettelser av titlene. */
  window.VBM_ORDBOK = function(sp, bok){
    if (sp !== sprak) return;
    var f = bok.felles || {}, s = (bok.sider || {})[side] || {}, k;
    for (k in f) ord[k] = f[k];
    for (k in s) ord[k] = s[k];
    menyOrd = (bok.sider || {})['index.html'] || {};
    oversettHode();
  };
  var trengs = sprak !== 'no' || kilde !== 'no';
  if (trengs && !window.VBM_INGEN_LASTING) document.write('<script src="sprak-' + sprak + '.js' + VERSJON + '"><\/script>');
  if (trengs) root.classList.add('vbm-oversetter');      // siden vises når teksten er byttet
  setTimeout(function(){ root.classList.remove('vbm-oversetter'); }, 2500);   // sikkerhet

  function fyll(t, v){
    return String(t).replace(/\{(\w+)\}/g, function(m, k){ return v && v[k] != null ? v[k] : m; });
  }
  function slaOpp(s){ return Object.prototype.hasOwnProperty.call(ord, s) ? ord[s] : undefined; }
  /* VBM_T('norsk tekst med {plass}', {plass: 5}) gir teksten på valgt språk. */
  var T = window.VBM_T = function(s, v){
    var o = slaOpp(s);
    if (typeof o === 'function') return o(v || {});
    return fyll(typeof o === 'string' ? o : s, v);
  };

  /* ==================== 3. Oversettelse ==================== */
  var INL = /^(B|I|EM|STRONG|A|SPAN|SUP|SUB|SMALL|U|ABBR|MARK|CODE|S|Q|CITE|BR|KBD|WBR)$/;
  var ATTR = ['aria-label', 'title', 'alt', 'placeholder'];
  var ferdig = new WeakSet();
  function norm(s){ return s.replace(/\s+/g, ' ').trim(); }
  function hopp(el){ return !el || (el.closest && el.closest('script,style,noscript,[translate="no"]')); }
  function bareInline(el){
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1 && (!INL.test(c.tagName) || !bareInline(c))) return false;
    }
    return true;
  }
  function skjul(el){ if (el) { el.hidden = true; el.style.setProperty('display', 'none', 'important'); } }
  function tekstNode(n){
    if (ferdig.has(n)) return;
    ferdig.add(n);
    var raa = n.nodeValue, k = norm(raa);
    if (!k || hopp(n.parentElement)) return;
    var o = slaOpp(k);
    if (o === false) { skjul(n.parentElement); return; }
    if (typeof o === 'function') o = o({});
    if (typeof o !== 'string' || o === k) return;
    n.nodeValue = raa.match(/^\s*/)[0] + o + raa.match(/\s*$/)[0];
  }
  function attributter(el){
    for (var i = 0; i < ATTR.length; i++) {
      var a = el.getAttribute(ATTR[i]);
      if (!a) continue;
      var o = slaOpp(norm(a));
      if (typeof o === 'string' && o !== a) el.setAttribute(ATTR[i], o);
    }
  }
  /* Et avsnitt med <strong>, <em> osv. kan oversettes som en helhet (nøkkelen er HTML). */
  function element(el){
    if (el.nodeType !== 1 || hopp(el)) return false;
    if (el.firstElementChild && bareInline(el) && el.innerHTML.length < 4000) {
      var o = slaOpp(norm(el.innerHTML));
      if (o === false) { skjul(el); return true; }
      if (typeof o === 'string') {
        el.innerHTML = o;
        var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), t;
        while ((t = w.nextNode())) ferdig.add(t);
        return true;
      }
    }
    return false;
  }
  function tre(rot){
    if (rot.nodeType === 3) { tekstNode(rot); return; }
    if (rot.nodeType !== 1 || hopp(rot)) return;
    if (element(rot)) { attributter(rot); return; }
    attributter(rot);
    var liste = rot.querySelectorAll('*'), i;
    for (i = 0; i < liste.length; i++) { if (!hopp(liste[i])) attributter(liste[i]); }
    for (i = 0; i < liste.length; i++) { if (liste[i].isConnected && rot.contains(liste[i])) element(liste[i]); }
    var w = document.createTreeWalker(rot, NodeFilter.SHOW_TEXT), n, alle = [];
    while ((n = w.nextNode())) alle.push(n);
    alle.forEach(tekstNode);
  }
  function oversettHode(){
    var t = slaOpp(norm(document.title)); if (typeof t === 'string') document.title = t;
    var md = document.querySelector('meta[name="description"]');
    if (md) { var d = slaOpp(md.content); if (typeof d === 'string') md.content = d; }
  }

  /* ==================== 4. Farger / svart-hvitt ====================
     Gjelder sider med data-svart-hvitt på <html>.
     side.html gir farger, side.html?svart-hvitt gir svart-hvitt.
     Tekst for bare én versjon: class="kun-farge" eller class="kun-sh". */
  var SH = 'svart-hvitt';
  var harSH = root.hasAttribute('data-svart-hvitt');
  var grunnTittel = null;
  function villSH(){ return new RegExp('(^|[?&])' + SH + '(=|&|$)').test(location.search.slice(1)); }
  function settSH(sh){
    root.classList.toggle('sh', sh);
    if (grunnTittel !== null) document.title = sh ? T('(Svart-hvitt) ') + grunnTittel : grunnTittel;
    var b = document.querySelectorAll('.vbm-modus button');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', (b[i].getAttribute('data-sh') === '1') === sh ? 'true' : 'false');
  }
  /* Juksebøkene har ikke lenger egne knapper for farger og svart-hvitt: det velges under Innstillinger
     (tannhjulet), og gjelder bare notene. Gamle lenker med ?svart-hvitt slår på svart-hvitt der. */
  if (villSH()) { try { localStorage.setItem('vbm-visning', 'sh'); } catch(e){} try { history.replaceState(null, '', location.pathname + location.hash); } catch(e){} }

  /* ==================== 5. Knapperaden ==================== */
  function pille(klasse, etikett){
    var g = document.createElement('div');
    g.className = 'vbm-pille ' + klasse; g.setAttribute('role', 'group'); g.setAttribute('aria-label', etikett);
    return g;
  }
  function knapp(tekst){
    var b = document.createElement('button'); b.type = 'button';
    b.innerHTML = '<span>' + tekst + '</span>';
    return b;
  }
  function byggKnapper(){
    if (document.querySelector('.vbm-sprak')) return;
    var nav = document.querySelector('.vbm-back'), plass = document.querySelector('[data-vbm-sprak]');
    var valg = null;
    if (nav) { valg = document.createElement('div'); valg.className = 'vbm-valg'; nav.appendChild(valg); }

    if (false) {   // de gamle knappene for farger og svart-hvitt er erstattet av Innstillinger
      var m = pille('vbm-modus', 'Farger eller svart-hvitt');
      [['0', 'Farger'], ['1', 'Svart-hvitt']].forEach(function(o){
        var b = knapp(o[1]); b.setAttribute('data-sh', o[0]);
        b.addEventListener('click', function(){
          var sh = o[0] === '1'; settSH(sh);
          try { history.replaceState(null, '', location.pathname + (sh ? '?' + SH : '') + location.hash); } catch(e){}
        });
        m.appendChild(b);
      });
      valg.appendChild(m);
      settSH(root.classList.contains('sh'));
    }

    var g = pille('vbm-sprak', { no: 'Velg språk', en: 'Choose language', pl: 'Wybierz język' }[sprak] || 'Language');
    g.setAttribute('translate', 'no');
    SPRAK.forEach(function(k){
      var b = knapp(k.toUpperCase());
      b.setAttribute('lang', k); b.setAttribute('title', NAVN[k]); b.setAttribute('aria-label', k.toUpperCase() + ', ' + NAVN[k]);
      b.setAttribute('aria-pressed', k === sprak ? 'true' : 'false');
      b.addEventListener('click', function(){
        if (k === sprak) return;
        try { localStorage.setItem(NOKKEL, k); } catch(e){}
        var u = location.search.replace(/([?&])sprak=\w+&?/, '$1').replace(/[?&]$/, '');
        location.href = location.pathname + u + location.hash;
      });
      g.appendChild(b);
    });
    if (plass) plass.appendChild(g); else if (valg) valg.appendChild(g);
  }

  /* ==================== 6. Bunntekst ====================
     <footer data-lyd="alle">  signatur + kreditt for piano og strykere
     <footer data-lyd="stemming"> signatur + kreditt for orgel, strykere og piano (sidene om stemming)
     <footer data-lyd="piano"> signatur + kreditt for piano
     <footer data-lyd="">      bare signatur
     Det som står i <footer> fra før (f.eks. en merknad), blir stående over. */
  function byggBunn(){
    var f = document.querySelector('footer[data-lyd]');
    if (!f || f.querySelector('.vbm-signatur')) return;
    var sig = document.createElement('span');
    sig.className = 'vbm-signatur';
    sig.innerHTML = '<span translate="no">&copy; Verdens Beste Musikkskole.</span> <span>' + BUNN.designet + '</span> '
      + '<span translate="no">Verdens Beste Musikklærer</span>, <span>' + BUNN.hjelp + '</span>, <span>' + BUNN.dato + '</span>.';
    f.appendChild(sig);
    var lyd = LYD[f.getAttribute('data-lyd')];
    if (lyd) {
      var k = document.createElement('span');
      k.className = 'vbm-kreditt'; k.innerHTML = '<span>' + lyd + '</span>';
      f.appendChild(k);
    }
  }

  /* ==================== 7. Lenke til originalen ==================== */
  function byggOriginal(){
    if (EGNE.indexOf(location.hostname) >= 0) return;
    var d = document.createElement('div');
    d.className = 'vbm-original'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', T('Original'));
    d.innerHTML = T('Originalen av denne siden finnes på ')
      + '<a href="' + ORIGINAL + side + '">' + T('Verdens Beste Musikkskole') + '</a>.';
    document.body.insertBefore(d, document.body.firstChild);
  }

  /* ==================== 8. Meny øverst på alle sider ====================
     «Alle ressurser» fører til startsiden, og «Meny» viser alle sidene, gruppert som på startsiden.
     Listen hentes fra materialer.js, så en ny side kommer med i menyen av seg selv. */
  function menyT(s){ var o = menyOrd[s]; if (typeof o === 'string') return o; return T(s); }
  /* Nivåfilteret (Innstillinger): «alle», «grunnleggende», «avansert» eller «ekspert» */
  function nivaValg(){ try { return localStorage.getItem('vbm-niva') || 'alle'; } catch(e){ return 'alle'; } }
  var NIVANAVN = { grunnleggende: 'Grunnleggende', avansert: 'Avansert', ekspert: 'Ekspert' };
  function hentMaterialer(ferdigFn){
    if (window.VBM && window.VBM.materialer) { ferdigFn(); return; }
    var sk = document.createElement('script'); sk.src = 'materialer.js' + VERSJON;
    sk.onload = ferdigFn; document.head.appendChild(sk);
  }
  /* Nivåmerke under overskriften og «Se også» nederst, fra materialer.js (niva og relatert) */
  function byggNivaOgRelatert(){
    if (side === 'index.html') return;
    hentMaterialer(function(){
      var M = window.VBM || {}, alle = M.materialer || [], meg = null;
      alle.forEach(function(m){ if (!meg && m.fil.split('?')[0] === side) meg = m; });
      if (!meg) return;
      var hero = document.querySelector('.hero, header');
      if (meg.niva && hero && !document.querySelector('.vbm-niva-linje')) {
        var linje = document.createElement('p'); linje.className = 'vbm-niva-linje';
        linje.innerHTML = '<span class="vbm-niva niva-' + meg.niva + '">' + T('Nivå') + ': ' + T(NIVANAVN[meg.niva]) + '</span>';
        var h1 = hero.querySelector('h1'); if (h1) h1.parentNode.insertBefore(linje, h1.nextSibling); else hero.appendChild(linje);
      }
      var rel = (meg.relatert || []).map(function(f){ var funnet = null; alle.forEach(function(m){ if (!funnet && m.fil.split('?')[0] === f) funnet = m; }); return funnet; }).filter(Boolean);
      if (!rel.length || document.querySelector('.vbm-relatert')) return;
      var nav = document.createElement('nav'); nav.className = 'vbm-relatert'; nav.setAttribute('aria-label', T('Se også'));
      /* Leksjonene i Musikkteori henger sammen som et kurs: forrige og neste leksjon i rekkefølgen fra materialer.js */
      var kurs = alle.filter(function(m){ return m.seksjon === meg.seksjon && meg.seksjon === 'teori' && !m.skjult; }), nr = kurs.indexOf(meg), steg = '';
      if (nr >= 0) {
        if (nr > 0) steg += '<a class="vbm-rel-lenke vbm-kurs-lenke" href="' + kurs[nr - 1].fil + '"><span class="vbm-kurs-retning">&larr; ' + T('Forrige leksjon') + '</span><span>' + menyT(kurs[nr - 1].tittel) + '</span></a>';
        if (nr < kurs.length - 1) steg += '<a class="vbm-rel-lenke vbm-kurs-lenke vbm-kurs-neste" href="' + kurs[nr + 1].fil + '"><span class="vbm-kurs-retning">' + T('Neste leksjon') + ' &rarr;</span><span>' + menyT(kurs[nr + 1].tittel) + '</span></a>';
      }
      nav.innerHTML = (steg ? '<div class="vbm-kurs">' + steg + '</div>' : '') + '<p class="vbm-relatert-tittel">' + T('Se også') + '</p><ul>' + rel.map(function(m){
        return '<li><a class="vbm-rel-lenke" href="' + m.fil + '"><span>' + menyT(m.tittel) + '</span>' + (m.niva ? '<span class="vbm-niva niva-' + m.niva + '">' + T(NIVANAVN[m.niva]) + '</span>' : '') + '</a></li>';
      }).join('') + '</ul>';
      /* Inni <main>, så blokken holder seg i samme ramme og bredde som resten av siden */
      var hoved = document.querySelector('main'), fot = document.querySelector('footer');
      if (hoved) hoved.appendChild(nav); else if (fot) fot.parentNode.insertBefore(nav, fot); else document.body.appendChild(nav);
    });
  }
  function byggMeny(){
    var nav = document.querySelector('.vbm-back');
    /* Startsiden: menyknappen til venstre og språkknappene til høyre i samme linje øverst,
       slik som på de andre sidene, men uten lenke tilbake (siden er selv oversikten). */
    if (!nav && side === 'index.html') {
      nav = document.createElement('nav'); nav.className = 'vbm-back vbm-back--start'; nav.setAttribute('aria-label', T('Nettsted'));
      var banner = document.querySelector('.vbm-original');
      document.body.insertBefore(nav, banner ? banner.nextSibling : document.body.firstChild);
      var plass = document.querySelector('[data-vbm-sprak]'), pille = plass && plass.querySelector('.vbm-sprak');
      if (pille) { var v = document.createElement('div'); v.className = 'vbm-valg'; v.appendChild(pille); nav.appendChild(v); plass.hidden = true; plass.style.display = 'none'; }
    }
    if (!nav || nav.querySelector('.vbm-meny-knapp')) return;
    nav.classList.add('vbm-topp');
    /* «Alle ressurser» står ikke lenger i linjen, men øverst inne i menyen */
    var hjem = nav.querySelector('a[href="index.html"]'), hjemTekst = '';
    if (hjem) { hjemTekst = hjem.innerHTML; hjem.parentNode.removeChild(hjem); }
    /* Samme menylinje på alle sider: helt øverst over hele bredden, mørk med lys tekst.
       I juksebøkene står linjen inne i innholdet, så den flyttes ut til toppen av siden. */
    /* Banneret om originalen står også helt øverst over hele bredden, som på de andre sidene */
    var over = document.querySelector('.vbm-original');
    if (over && over.parentNode !== document.body) document.body.insertBefore(over, document.body.firstChild);
    if (nav.parentNode !== document.body || (over && nav.previousElementSibling !== over)) {
      document.body.insertBefore(nav, over ? over.nextSibling : document.body.firstChild);
    }
    nav.classList.remove('vbm-back--book');
    /* Har siden marg på sidene (juksebøkene), går linjen og banneret likevel helt ut til kanten */
    var bsr = getComputedStyle(document.body), pl = parseFloat(bsr.paddingLeft) || 0, pr = parseFloat(bsr.paddingRight) || 0;
    if (pl || pr) {
      [nav, over].forEach(function(el){ if (el) { el.style.marginLeft = -pl + 'px'; el.style.marginRight = -pr + 'px'; } });
      nav.style.setProperty('--utvid', Math.max(pl, pr) + 'px');
    }
    /* … og helt opp til toppen, selv om siden har luft øverst */
    var pt = parseFloat(bsr.paddingTop) || 0;
    if (pt) { var forst = over && over.parentNode === document.body ? over : nav; forst.style.marginTop = -pt + 'px'; nav.style.marginBottom = pt + 'px'; }   // luften kommer under linjen i stedet
    var b = document.createElement('button'); b.type = 'button'; b.className = 'vbm-meny-knapp';
    b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'vbm-meny');
    b.innerHTML = '<span class="vbm-meny-ikon" aria-hidden="true"></span><span>' + T('Meny') + '</span>';
    var panel = document.createElement('div'); panel.id = 'vbm-meny'; panel.className = 'vbm-meny'; panel.hidden = true;
    var valg = nav.querySelector('.vbm-valg');
    if (valg) nav.insertBefore(b, valg); else nav.appendChild(b);
    nav.appendChild(panel);
    /* Hopp til et kapittel (#kapittel-3, #innhold) skal stoppe under menylinjen, ikke bak den */
    function luft(){ if (!nav.classList.contains('vbm-meny-apen')) root.style.scrollPaddingTop = (nav.getBoundingClientRect().height + 12) + 'px'; }
    luft(); window.addEventListener('resize', luft);
    /* Mens menyen er åpen, står linjen ikke fast øverst, så hele listen kan rulles og leses */
    function lukk(){ panel.hidden = true; b.setAttribute('aria-expanded', 'false'); nav.classList.remove('vbm-meny-apen'); luft(); }
    b.addEventListener('click', function(){
      if (!panel.hidden) { lukk(); return; }
      hentMaterialer(function(){
        var M = window.VBM || {}, html = '';
        if (hjemTekst) html += '<div class="vbm-meny-hjem"><a class="vbm-hjem" href="index.html">' + hjemTekst + '</a></div>';
        (M.seksjoner || []).forEach(function(sk){
          var nf = nivaValg(), liste = (M.materialer || []).filter(function(m){ return m.seksjon === sk.id && !m.skjult && (nf === 'alle' || m.niva === nf); });
          if (!liste.length) return;
          html += '<div class="vbm-meny-gruppe"><p class="vbm-meny-tittel">' + menyT(sk.overskrift) + '</p><ul>';
          liste.forEach(function(m){
            var her = m.fil.split('?')[0] === side;
            html += '<li><a class="vbm-meny-lenke" href="' + m.fil + '"' + (her ? ' aria-current="page"' : '') + '>' + menyT(m.tittel) + (m.niva ? ' <span class="vbm-meny-niva">' + T(NIVANAVN[m.niva]) + '</span>' : '') + '</a></li>';
          });
          html += '</ul></div>';
        });
        panel.innerHTML = html;
        panel.hidden = false; b.setAttribute('aria-expanded', 'true'); nav.classList.add('vbm-meny-apen');
        /* Er siden rullet ned, rulles den opp så menyen begynner øverst på skjermen */
        var y = nav.getBoundingClientRect().top + window.pageYOffset;
        if (window.pageYOffset > y) window.scrollTo(0, y);
      });
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !panel.hidden) { lukk(); b.focus(); } });
    document.addEventListener('click', function(e){ if (!panel.hidden && !nav.contains(e.target)) lukk(); });
  }

  /* ==================== 9. Lenker i forklaringene ====================
     Når en forklaring nevner en annen side, blir navnet en lenke (på alle tre språk).
     «kapittel 3» blir bare lenke i juksebokens egne forklaringer, der det betyr bokens kapittel.
     En side lenker aldri til seg selv, og et avsnitt lenker ikke to ganger til samme sted. */
  var BOK = 'akkorder-og-intervaller.html';
  var LENKER = {
    no: [[/kapittel (\d) i Den ultimate jukseboka/, BOK + '#kapittel-$1'], [/Den ultimate jukseboka(?: for akkorder og intervaller)?/, BOK],
         [/kapittel (\d)/, '#kapittel-$1', 0, BOK], [/Skalaer og modi/, 'skalaer.html'], [/lytteguiden/, 'lytteguide-septim-og-nonakkorder.html'],
         [/(se )(Kvintsirkelen)/, 'kvintsirkelen.html', 2], [/Akkordheftet/, 'akkordhefte.html'], [/(i kadensen i )(gehørquizen)/, 'gehorquiz-akkorder.html', 2],
         [/Gehørquiz: omvendinger/, 'gehorquiz-omvendinger.html'], [/Gehørquiz: kadenser og funksjoner/, 'gehorquiz-harmoni.html'],
         [/Teoriquiz: notelesing/, 'quiz-notelesing.html'], [/(I )(rytmequizen)/, 'quiz-rytme.html', 2]],
    en: [[/chapter (\d) of The Ultimate Cheat Book/, BOK + '#kapittel-$1'], [/The Ultimate Cheat Book(?: for Chords and Intervals)?/, BOK],
         [/chapter (\d)/, '#kapittel-$1', 0, BOK], [/Scales and modes/, 'skalaer.html'], [/(see )(the listening guide)/, 'lytteguide-septim-og-nonakkorder.html', 2],
         [/(see )(The circle of fifths)/, 'kvintsirkelen.html', 2], [/Chord workbook/, 'akkordhefte.html'], [/(in the cadence in the )(ear quiz)/, 'gehorquiz-akkorder.html', 2],
         [/Ear quiz: inversions/, 'gehorquiz-omvendinger.html'], [/Ear quiz: cadences and functions/, 'gehorquiz-harmoni.html'],
         [/Theory quiz: reading music/, 'quiz-notelesing.html'], [/(In the )(rhythm quiz)/, 'quiz-rytme.html', 2]],
    pl: [[/rozdzia(?:le|ł) (\d) Najlepszej ściągi/, BOK + '#kapittel-$1'], [/Najlepsz(?:ej|a) ścią(?:dze|gi|ga)(?: z akordów i interwałów)?/, BOK],
         [/rozdzia(?:łu|le|ł) (\d)/, '#kapittel-$1', 0, BOK], [/Skale i skale modalne/, 'skalaer.html'], [/przewodnik słuchowy/, 'lytteguide-septim-og-nonakkorder.html'],
         [/(zobacz )(Koło kwintowe)/, 'kvintsirkelen.html', 2], [/Zeszycie akordów/, 'akkordhefte.html'], [/(w kadencji w )(quizie słuchowym)/, 'gehorquiz-akkorder.html', 2],
         [/quizie słuchowym Przewroty/, 'gehorquiz-omvendinger.html'], [/quizie słuchowym Kadencje i funkcje/, 'gehorquiz-harmoni.html'],
         [/quizie teoretycznym Czytanie nut/, 'quiz-notelesing.html'], [/quizie rytmicznym/, 'quiz-rytme.html']]
  };
  var LENKE_I = 'main p, main li, main figcaption, .hero .lede, .chapter .caption, .chapter .group-note, article p';
  var LENKE_IKKE = 'a, button, nav, svg, h1, h2, h3, h4, label, .label, .step-label, .eyebrow, .vbm-back, .vbm-original, .cover, .song-info, .svar-grupper, .fremgang, .brikker, footer, [translate="no"]';
  function lenkInn(rot){
    var regler = LENKER[sprak]; if (!regler || side === 'index.html' || rot.nodeType !== 1) return;
    var bokser = [].slice.call(rot.querySelectorAll(LENKE_I));
    if (rot.matches && rot.matches(LENKE_I)) bokser.push(rot);
    bokser.forEach(function(boks){
      if (boks.closest(LENKE_IKKE) || boks.getAttribute('data-vbm-lenket')) return;
      boks.setAttribute('data-vbm-lenket', '1');
      var brukt = {}, w = document.createTreeWalker(boks, NodeFilter.SHOW_TEXT), noder = [], n;
      while ((n = w.nextNode())) if (!n.parentElement.closest(LENKE_IKKE)) noder.push(n);
      noder.forEach(function(node){
        var tekst = node.nodeValue, del = node;
        while (true) {
          var best = null;
          regler.forEach(function(r){
            if (r[3] && r[3] !== side) return;
            var m = r[0].exec(del.nodeValue);
            if (!m) return;
            var g = r[2] || 0, href = r[1].replace('$1', m[1] || '');
            var maal = href.split('#')[0];
            if (maal === side || (!maal && side !== BOK) || brukt[href]) return;
            var start = m.index + (g ? m[0].indexOf(m[g]) : 0), lengde = (g ? m[g] : m[0]).length;
            if (!best || start < best.start) best = { start: start, lengde: lengde, href: href };
          });
          if (!best) break;
          var etter = del.splitText(best.start), rest = etter.splitText(best.lengde);
          var a = document.createElement('a'); a.className = 'vbm-lenket'; a.href = best.href;
          etter.parentNode.insertBefore(a, etter); a.appendChild(etter);
          ferdig.add(del); ferdig.add(etter); ferdig.add(rest);
          brukt[best.href] = true;
          del = rest;
        }
      });
    });
  }

  /* ==================== 10. Tilgjengelighet for skjermlesere ====================
     «Hopp til innholdet» først på siden, spill-knapper som sier hva de spiller, og noter
     som har fått et for generelt navn («Noter»), får navnet til kortet de står i. */
  function hoppLenke(){
    if (document.querySelector('.vbm-hopp')) return;
    var mal = document.querySelector('main') || document.querySelector('.sheet') || document.querySelector('.wrap');
    if (!mal) return;
    if (!mal.id) mal.id = 'innholdet';
    if (!mal.hasAttribute('tabindex')) mal.setAttribute('tabindex', '-1');
    var a = document.createElement('a'); a.className = 'vbm-hopp'; a.href = '#' + mal.id; a.textContent = T('Hopp til innholdet');
    document.body.insertBefore(a, document.body.firstChild);
  }
  var SPILL = /(spill|play|odtwórz|►)/i;
  function kortNavn(el, unntak){
    var k = el.closest('.rytme-eks, .sats, .delblokk, .chord, .interval, .song, .card, section, li, article');
    if (!k) return '';
    var svg = [].filter.call(k.querySelectorAll('svg[aria-label]'), function(x){ return x !== unntak && !x.closest('button') && !/^(Noter|Notes|Nuty)$/.test(x.getAttribute('aria-label')); })[0];
    if (svg) return svg.getAttribute('aria-label');
    var h = k.querySelector('h3, h2, .song-title, .chord-name, .name, .card-head h2');
    return h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  function tilgjengelig(rot){
    if (!rot || rot.nodeType !== 1) return;
    [].forEach.call(rot.querySelectorAll('button'), function(b){
      if (b.getAttribute('aria-label') || !SPILL.test(b.textContent)) return;
      var tekst = b.textContent.replace(/[►▶︎\uFE0E]/g, '').replace(/\s+/g, ' ').trim();
      /* Bare knapper med en generell tekst («spill») trenger navnet til kortet; «Durskalaen» sier selv hva den gjør */
      if (tekst && !/^(spill|play|odtwórz)$/i.test(tekst)) return;
      var navn = kortNavn(b); if (!navn) return;
      b.setAttribute('aria-label', (tekst || T('spill')) + ': ' + navn.slice(0, 90));
    });
    [].forEach.call(rot.querySelectorAll('svg[aria-label]'), function(svg){
      if (!/^(Noter|Notes|Nuty)$/.test(svg.getAttribute('aria-label'))) return;
      var navn = kortNavn(svg, svg); if (navn) svg.setAttribute('aria-label', svg.getAttribute('aria-label') + ': ' + navn);
    });
  }

  /* ==================== 11. Tonefarger og tonenavn ====================
     Notehoder med data-f (farge) og data-navn får fargen sin mens de spilles, og navnene vises
     i en lapp over notelinjen. Quizene farger notene, men viser ingen navn. */
  /* På for hele nettstedet, også juksebøkene */
  var TONEFARGER = true;
  /* Navnet på tonen som klinger vises i en knappeformet lapp øverst til høyre over notelinjen, i tonens farge.
     Plassen over notelinjen er alltid satt av (fast minstehøyde), så ingenting flytter seg når lappen kommer.
     Bare når én tone klinger (skalaer, melodier); når en akkord klinger, vises ikke noe navn. Quizene viser ingen navn. */
  function synkFarger(svg){
    if (svg.closest('[data-uten-navn]')) return;
    var holder = svg.parentNode, lapp = holder.querySelector(':scope > .tn-knapp');
    if (!lapp) { lapp = document.createElement('span'); lapp.className = 'tn-knapp tn-tom'; lapp.setAttribute('aria-hidden', 'true'); holder.appendChild(lapp); }
    var klinger = {}, liste = [];
    [].forEach.call(svg.querySelectorAll('.spilles[data-f]'), function(n){
      var k = n.getAttribute('data-navn') + '|' + n.getAttribute('data-f');
      if (!klinger[k]) { klinger[k] = true; liste.push(n); }
    });
    if (liste.length === 1) {
      lapp.textContent = liste[0].getAttribute('data-navn');
      lapp.setAttribute('data-f', liste[0].getAttribute('data-f'));
      lapp.classList.remove('tn-tom');
    } else { lapp.classList.add('tn-tom'); }
  }
  /* Har linjen over notelinjen ledig plass til høyre for lappen? Hvis ikke (for eksempel kromatisk skala
     på mobil, der «Trinn» fyller hele bredden), får denne notelinjen en egen fast stripe. Sjekkes når siden
     lastes og når skjermen endrer størrelse, aldri mens noe spilles, så ingenting flytter seg da. */
  /* Notelinjer som er skjult når siden lastes (for eksempel «nedover» på Intervaller og sanger) kan ikke måles.
     De sjekkes på nytt i det øyeblikket de blir synlige. */
  var synligVakt = window.IntersectionObserver ? new IntersectionObserver(function(liste){
    liste.forEach(function(x){
      if (!(x.isIntersecting && x.boundingClientRect.height > 0)) return;
      synligVakt.unobserve(x.target);
      /* Nå kan notelinjen måles: full bredde, piano og plass til navnelappen */
      var sv = x.target.querySelector(':scope > svg');
      if (sv) { utvidStav(sv); lagPiano(sv); }
      plassSjekk(x.target);
    });
  }, { rootMargin: '100000px' }) : null;   // stor margin: reagerer når notelinjen vises, uansett hvor på siden den er
  function plassSjekk(holder){
    if (!holder.getBoundingClientRect().height) { if (synligVakt) synligVakt.observe(holder); return; }
    var lapp = holder.querySelector(':scope > .tn-knapp');
    if (!lapp) { lapp = document.createElement('span'); lapp.className = 'tn-knapp tn-tom'; lapp.setAttribute('aria-hidden', 'true'); lapp.textContent = 'Giss'; holder.appendChild(lapp); }
    holder.classList.remove('tn-plass'); lapp.style.bottom = '';
    /* Ligger streken under .card-head eller over .noter-blokk der lappen ville stått, flyttes lappen rett over streken */
    var h = holder.getBoundingClientRect(), l0 = lapp.getBoundingClientRect(), kort0 = holder.closest('article, section, .card') || holder.parentNode, strek = null;
    [].forEach.call(kort0.querySelectorAll('.noter-blokk'), function(e){
      if (e.contains(holder) && !e.classList.contains('noter-blokk')) return;
      var r = e.getBoundingClientRect(), y = e.classList.contains('card-head') ? r.bottom : r.top;
      if (y <= h.top + 1 && y >= l0.top - 2 && (strek === null || y > strek)) strek = y;
    });
    var iHodet = false;
    [].forEach.call(kort0.querySelectorAll('.card-head'), function(e){
      var y = e.getBoundingClientRect().bottom; if (y <= h.top + 1 && y > l0.top) iHodet = true;   // lappen ville stått i korthodet
    });
    if (strek !== null && !iHodet) lapp.style.bottom = 'calc(100% + ' + Math.round(h.top - strek + 10) + 'px)';
    if (iHodet) { holder.classList.add('tn-plass'); return; }
    var a = lapp.getBoundingClientRect(), kort = holder.closest('article, section, .card, .rytme-eks') || holder.parentNode, kolliderer = false;
    var w = document.createTreeWalker(kort, NodeFilter.SHOW_TEXT), n;
    while (!kolliderer && (n = w.nextNode())) {
      if (!n.nodeValue.trim() || holder.contains(n)) continue;
      var rg = document.createRange(); rg.selectNodeContents(n);
      [].forEach.call(rg.getClientRects(), function(r){ if (r.right > a.left - 6 && r.left < a.right && r.bottom > a.top && r.top < a.bottom) kolliderer = true; });
    }
    if (!kolliderer) [].forEach.call(kort.querySelectorAll('svg, button, img'), function(e){
      if (holder.contains(e)) return;
      var r = e.getBoundingClientRect(); if (r.right > a.left && r.left < a.right && r.bottom > a.top && r.top < a.bottom) kolliderer = true;
    });
    holder.classList.toggle('tn-plass', kolliderer);
  }
  var plassTimer = null;
  function alleplasser(){ [].forEach.call(document.querySelectorAll('.har-tn'), plassSjekk); }
  window.addEventListener('resize', function(){ clearTimeout(plassTimer); plassTimer = setTimeout(alleplasser, 200); });
  /* Skriftene lastes ofte etter at notene er tegnet, og gjør overskriftene høyere. Da sjekkes plassen på nytt. */
  window.addEventListener('load', function(){ alleplasser(); setTimeout(alleplasser, 600); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(alleplasser, 50); });
  /* Felles hjelper for sidene: farger notene med data-i i et notebilde mens de klinger.
     Brukes som vedToner i VBM_LYD_SPILL: VBM_FARG(notebilde) gir en funksjon som tar indeksene som klinger. */
  window.VBM_FARG = function(holder){
    return function(idx){
      var svg = typeof holder === 'function' ? holder() : (holder && (holder.tagName === 'svg' ? holder : holder.querySelector('svg')));
      if (!svg) return;
      [].forEach.call(svg.querySelectorAll('.spilles'), function(x){ x.classList.remove('spilles'); });
      (idx || []).forEach(function(i){ [].forEach.call(svg.querySelectorAll('[data-i="' + i + '"]'), function(x){ x.classList.add('spilles'); }); });
    };
  };
  /* ---------- Piano under notelinjene (Innstillinger) ----------
     Viser tonene på notelinjen på et lite piano: i tonens farge, eller som nedtrykte tangenter i svart-hvitt.
     Tangenten som klinger får en kraftig kant. Alle tangenter kan spilles. I quizene merkes ingen tangenter
     før tonene spilles etter svaret, så pianoet aldri røper svaret. */
  var PIANO = 'vbm-piano';
  function pianoPaa(){ try { return localStorage.getItem(PIANO) === '1'; } catch(e){ return false; } }
  var SVARTE = [1, 3, 6, 8, 10];
  function cNavn(m, langt){
    var o = Math.floor(m / 12) - 1;
    if (sprak === 'en') return 'C' + o;
    return o >= 4 ? 'c' + '¹²³⁴⁵'.charAt(o - 4) : o === 3 ? 'c' : o === 2 ? 'C' : 'C' + (o === 1 ? '₁' : '₂');
  }
  function lagPiano(svg){
    var holder = svg.parentNode, gammel = holder.querySelector(':scope > .tn-piano');
    if (gammel) gammel.parentNode.removeChild(gammel);
    var alltid = holder.getAttribute('data-piano') === 'alltid';   // sider der pianoet er selve verktøyet (Notelesing)
    if (!holder.getBoundingClientRect().width) { if (synligVakt) synligVakt.observe(holder); return; }   // skjult fane: lages når den vises
    if (!alltid && (!pianoPaa() || svg.closest('[data-uten-navn]'))) return;
    var noter = [].slice.call(svg.querySelectorAll('[data-f][data-m]'));
    if (!noter.length) return;
    var ms = noter.map(function(n){ return +n.getAttribute('data-m'); });
    /* Fra C-en under den laveste tonen til den høyeste tonen, minst én oktav. Tangentene har fast størrelse:
       er det mer plass, vises flere tangenter (vekselvis under og over), ikke større tangenter. */
    var fra = holder.hasAttribute('data-piano-fra') ? +holder.getAttribute('data-piano-fra') : Math.floor(Math.min.apply(null, ms) / 12) * 12;
    var til = Math.max(Math.max.apply(null, ms), fra + 11);
    /* Pilene flytter pianoet en oktav om gangen (husket på notelinjen) */
    var skift = +(holder.getAttribute('data-skift') || 0) * 12;
    fra = Math.min(96, Math.max(21, fra + skift)); til = Math.max(fra + 11, Math.min(108, til + skift));   // A0 til C8, som et ekte piano
    if (SVARTE.indexOf(til % 12) >= 0) til++;   // ikke slutt på en svart tangent
    function antallHvite(a, b){ var n = 0; for (var q = a; q <= b; q++) if (SVARTE.indexOf(q % 12) < 0) n++; return n; }
    var TANGENT_PX = 26, plass = Math.floor(((holder.clientWidth || 300) - 84) / TANGENT_PX), under = true;   // 84 px til pilene
    while (antallHvite(fra, til) < plass && (fra > 21 || til < 108)) {
      if ((under && fra > 21) || til >= 108) { fra--; while (SVARTE.indexOf(fra % 12) >= 0) fra--; }
      else { til++; while (SVARTE.indexOf(til % 12) >= 0) til++; }
      under = !under;
    }
    var merket = {};
    noter.forEach(function(n){ merket[n.getAttribute('data-m')] = n.getAttribute('data-f'); });   // fargen brukes bare mens tangenten klinger
    var HV = 20, x = 0, hvite = '', svarte = '';
    for (var m = fra; m <= til; m++) {
      var svart = SVARTE.indexOf(m % 12) >= 0, f = merket[m] ? ' data-tf="' + merket[m] + '"' : '';   // eget navn, så notereglene aldri treffer tangentene
      var kl = 'tn-tangent ' + (svart ? 'svart' : 'hvit');
      if (svart) svarte += '<rect class="' + kl + '"' + f + ' data-m="' + m + '" x="' + (x - 6.5) + '" y="0" width="13" height="40" rx="2"/>';
      else {
        hvite += '<rect class="' + kl + '"' + f + ' data-m="' + m + '" x="' + x + '" y="0" width="' + HV + '" height="64" rx="2"' + (alltid ? ' role="button" tabindex="0" aria-label="' + cNavn(m, true) + '"' : '') + '/>';
        if (m % 12 === 0) hvite += '<text class="tn-c" x="' + (x + HV / 2) + '" y="58" text-anchor="middle">' + cNavn(m) + '</text>';
        x += HV;
      }
    }
    var div = document.createElement('div'); div.className = 'tn-piano'; if (!alltid) div.setAttribute('aria-hidden', 'true');
    div.innerHTML = '<button type="button" class="tn-pil" data-pil="-1" aria-label="' + T('En oktav ned') + '"' + (fra <= 21 ? ' disabled' : '') + '>&#9664;&#xFE0E;</button>'
      + '<svg viewBox="-1 -1 ' + (x + 2) + ' 66" style="width:' + Math.round((x + 2) * TANGENT_PX / HV) + 'px">' + hvite + svarte + '</svg>'
      + '<button type="button" class="tn-pil" data-pil="1" aria-label="' + T('En oktav opp') + '"' + (til >= 108 ? ' disabled' : '') + '>&#9654;&#xFE0E;</button>';
    holder.appendChild(div);
  }
  function pianoSynk(svg){
    var holder = svg.parentNode, p = holder.querySelector(':scope > .tn-piano'); if (!p) return;
    var klinger = {};
    [].forEach.call(svg.querySelectorAll('.spilles[data-m]'), function(n){ klinger[n.getAttribute('data-m')] = n.getAttribute('data-f'); });
    /* Er pianoet flyttet med pilene så tangenten som klinger ikke synes, flyttes det tilbake til den */
    var mangler = Object.keys(klinger).filter(function(m){ return !p.querySelector('.tn-tangent[data-m="' + m + '"]'); });
    if (mangler.length) {
      var lav = p.querySelector('.tn-tangent'), skift = +(holder.getAttribute('data-skift') || 0), m0 = +mangler[0];
      skift += lav && m0 < +lav.getAttribute('data-m') ? -Math.ceil((+lav.getAttribute('data-m') - m0) / 12) : Math.ceil((m0 - +p.querySelectorAll('.tn-tangent')[p.querySelectorAll('.tn-tangent').length - 1].getAttribute('data-m')) / 12);
      holder.setAttribute('data-skift', skift); lagPiano(svg); p = holder.querySelector(':scope > .tn-piano'); if (!p) return;
    }
    [].forEach.call(p.querySelectorAll('.tn-tangent'), function(t){
      var m = t.getAttribute('data-m'), pa = m in klinger;
      t.classList.toggle('tn-trykket', pa);   // eget navn: ingen side-regler for noter kan treffe tangentene
      if (pa) t.setAttribute('data-tf', klinger[m]);
    });
  }
  /* Trykk på en tangent: tonen spilles. Punktet fingeren traff avgjør tangenten (ikke nettleserens «justering»). */
  var sistPianoTrykk = 0;
  function pianoTrykk(e){
    var pil = e.type === 'click' && e.target.closest && e.target.closest('.tn-pil');
    if (pil) {
      var h = pil.closest('.tn-piano').parentNode, sv = h.querySelector(':scope > svg');
      h.setAttribute('data-skift', +(h.getAttribute('data-skift') || 0) + +pil.getAttribute('data-pil'));
      if (sv) lagPiano(sv);
      var ny = h.querySelector('.tn-pil[data-pil="' + pil.getAttribute('data-pil') + '"]'); if (ny && !ny.disabled) ny.focus();
      return;
    }
    var el = document.elementFromPoint(e.clientX, e.clientY), t = el && el.closest ? el.closest('.tn-piano .tn-tangent') : null;
    if (!t && e.type === 'keydown') t = e.target.closest && e.target.closest('.tn-tangent');
    if (!t || !window.VBM_LYD_SEKVENS) return;
    if (e.type === 'click' && Date.now() - sistPianoTrykk < 600) return;
    if (e.type === 'pointerup') sistPianoTrykk = Date.now();
    var eier = t.closest('.tn-piano').parentNode;
    if (eier.getAttribute('data-piano') === 'alltid') {
      /* Siden bestemmer selv hva et trykk gjør (Notelesing viser tonen på notelinjen og spiller den) */
      eier.dispatchEvent(new CustomEvent('vbm-tangent', { bubbles: true, detail: { m: +t.getAttribute('data-m') } }));
      return;
    }
    if (window.VBM_LYD_STOPP) window.VBM_LYD_STOPP();
    var piano = t.closest('.tn-piano');
    window.VBM_LYD_SEKVENS([[+t.getAttribute('data-m')]], piano, function(k){ t.classList.toggle('tn-trykket', k >= 0); });
  }
  document.addEventListener('pointerup', pianoTrykk);
  document.addEventListener('click', pianoTrykk);
  document.addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('tn-tangent')) { e.preventDefault(); pianoTrykk(e); } });
  function allePianoer(){ [].forEach.call(document.querySelectorAll('svg[data-tn]'), lagPiano); }
  /* Notelinjer med fast målestokk (bøkene, quizene, sangsiden) forlenges til hele bredden som er ledig:
     notene beholder størrelsen, og notelinjen går helt ut til høyre. */
  var STAV_SKALA = 1.15;   // samme målestokk for alle notelinjer: fast høyde på alle skjermer
  function utvidStav(svg){
    if (svg.closest('.tn-piano')) return;
    if (!parseFloat(svg.style.width)) {
      /* Notelinjer som strekkes med bredden (leksjonene) får fast målestokk som resten */
      var vb0 = svg.getAttribute('viewBox').split(' ').map(Number);
      svg.style.width = Math.round(vb0[2] * STAV_SKALA) + 'px'; svg.style.maxWidth = '100%'; svg.style.height = 'auto';
    }
    var b0 = parseFloat(svg.style.width); if (!b0) return;
    var vb = svg.getAttribute('viewBox').split(' ').map(Number);
    if (!svg.hasAttribute('data-vb0')) { svg.setAttribute('data-vb0', vb[2]); svg.setAttribute('data-px0', b0); }
    var w0 = +svg.getAttribute('data-vb0'), px0 = +svg.getAttribute('data-px0'), k = px0 / w0;
    var ledig = svg.parentNode.clientWidth; if (!ledig) { if (synligVakt) synligVakt.observe(svg.parentNode); return; }
    var w = Math.max(w0, ledig / k);
    [].forEach.call(svg.querySelectorAll('line'), function(l){
      if (!l.hasAttribute('data-x20')) l.setAttribute('data-x20', l.getAttribute('x2'));
      var x2 = +l.getAttribute('data-x20');
      if (Math.abs(x2 - (w0 - 6)) < 0.6 || Math.abs(x2 - (w0 - 4)) < 0.6) l.setAttribute('x2', w - (w0 - x2));   // notelinjene går helt ut
    });
    vb[2] = w; svg.setAttribute('viewBox', vb.join(' ')); svg.style.width = Math.round(w * k) + 'px';
  }
  /* VBM_GRUPPER(liste, lag, holder): tegner en rekke akkorder eller toner på én notelinje når den får plass i full
     målestokk (STAV_SKALA), og deler den på flere linjer med høyst fire i hver bare når skjermen er for smal.
     lag(del) gir SVG-koden for en del av lista. Svarer { html, str }, der str er hvor mange det er per linje. */
  window.VBM_GRUPPER = function(liste, lag, holder){
    var hel = lag(liste), m = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/.exec(hel), w = m ? +m[1] : 0;
    var plass = holder && holder.clientWidth ? holder.clientWidth : Math.max(280, (window.innerWidth || 800) - 80);
    if (liste.length <= 4 || w * STAV_SKALA <= plass) return { html: hel, str: liste.length };
    var antall = Math.ceil(liste.length / 4), str = Math.ceil(liste.length / antall), html = '';
    for (var i = 0; i < liste.length; i += str) html += lag(liste.slice(i, i + str));
    return { html: html, str: str };
  };
  /* VBM_VED_BREDDE(fn): kaller fn når vinduet blir bredere eller smalere (ikke når bare høyden endres, som når
     adresselinjen på mobilen skjules), så sidene kan tegne notelinjene om. */
  window.VBM_VED_BREDDE = function(fn){
    var bredde = window.innerWidth, timer = null;
    window.addEventListener('resize', function(){
      if (window.innerWidth === bredde) return;
      clearTimeout(timer); timer = setTimeout(function(){ bredde = window.innerWidth; fn(); }, 250);
    });
  };
  function alleStaver(){ [].forEach.call(document.querySelectorAll('svg[data-tn]'), utvidStav); }
  var stavTimer = null;
  window.addEventListener('resize', function(){ clearTimeout(stavTimer); stavTimer = setTimeout(function(){ alleStaver(); if (pianoPaa()) allePianoer(); }, 200); });
  window.addEventListener('load', alleStaver);

  /* Kort melding når strykerne ikke når tonen, og den spilles på piano i stedet */
  var meldingTimer = null;
  window.addEventListener('vbm-utenfor', function(e){
    var m = document.querySelector('.vbm-melding');
    if (!m) { m = document.createElement('div'); m.className = 'vbm-melding'; m.setAttribute('role', 'status'); document.body.appendChild(m); }
    m.textContent = T('{instrument} når ikke så dype eller høye toner, så de spilles på piano.', { instrument: T(e.detail.instrument) });
    m.classList.add('vis'); clearTimeout(meldingTimer); meldingTimer = setTimeout(function(){ m.classList.remove('vis'); }, 4500);
  });
  function tonefarger(rot){
    if (!TONEFARGER || !rot || rot.nodeType !== 1) return;
    var quiz = root.hasAttribute('data-quiz');
    var svgs = [].slice.call(rot.querySelectorAll('svg')); if (rot.tagName === 'svg') svgs.push(rot);
    svgs.forEach(function(svg){
      if (!svg.querySelector('[data-f]') || svg.getAttribute('data-tn') || svg.closest('.tn-piano')) return;   // pianoets egne tangenter er ikke noter
      svg.setAttribute('data-tn', '1');
      /* data-uten-navn: siden viser navnet selv (Notelesing), så bare fargen brukes */
      if (!svg.closest('[data-uten-navn]')) { svg.parentNode.classList.add('har-tn'); plassSjekk(svg.parentNode); }
      utvidStav(svg);
      lagPiano(svg);
      new MutationObserver(function(){ synkFarger(svg); pianoSynk(svg); }).observe(svg, { attributes: true, subtree: true, attributeFilter: ['class'] });
    });
  }

  /* ==================== 12. Innstillinger ====================
     Tannhjulet i menylinjen: Farger eller Svart-hvitt (for fargeblinde og for deg med kromestesi).
     Valget gjelder hele nettstedet og huskes. Flere innstillinger kommer her senere. */
  var VISNING = 'vbm-visning', TEMPO = 'vbm-tempo', TEMA = 'vbm-tema', NIVA = 'vbm-niva';
  /* Utseende: «lys» eller «mork» velges under Innstillinger. Automatisk (standard) følger nettleseren. */
  function temaValg(){ var v = ''; try { v = localStorage.getItem(TEMA) || ''; } catch(e){} return v === 'lys' || v === 'mork' ? v : ''; }
  function brukTema(){ var v = temaValg(); if (v) root.setAttribute('data-tema', v); else root.removeAttribute('data-tema'); }
  brukTema();
  /* Tempo for hele nettstedet: «raskt» (standard), «middels» eller «sakte». Rytmesidene bruker 100, 65 og 45 slag i minuttet,
     og resten av lyden blir langsommere i samme forhold (lyd.js). */
  function tempoValg(){ var v = ''; try { v = localStorage.getItem(TEMPO) || ''; } catch(e){} return v === 'sakte' || v === 'middels' ? v : 'raskt'; }
  window.VBM_TEMPO = tempoValg;
  window.VBM_TEMPO_BPM = function(){ return { raskt: 100, middels: 65, sakte: 45 }[tempoValg()]; };
  /* Svart-hvitt er standard. Fargene slås på under Innstillinger (lagres som «farger»). */
  function brukVisning(){ var v = null; try { v = localStorage.getItem(VISNING); } catch(e){} v = v === 'farger' ? 'farger' : 'sh'; root.classList.toggle('vbm-sh', v === 'sh'); if (root.getAttribute('data-stil') === 'bok') root.classList.toggle('sh', v === 'sh'); return v; }
  function byggInnstillinger(){
    if (!TONEFARGER) return;
    var nav = document.querySelector('.vbm-back'); if (!nav || nav.querySelector('.vbm-inst-knapp')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'vbm-inst-knapp';
    b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'vbm-inst');
    b.setAttribute('aria-label', T('Innstillinger'));   /* teksten skjules på smale skjermer, så knappen trenger et navn */
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg><span>' + T('Innstillinger') + '</span>';
    var panel = document.createElement('div'); panel.id = 'vbm-inst'; panel.className = 'vbm-inst'; panel.hidden = true;
    panel.innerHTML = '<p class="vbm-meny-tittel">' + T('Visning') + '</p>'
      + '<div class="vbm-pille vbm-inst-valg" role="group" aria-label="' + T('Visning') + '">'
      + '<button type="button" data-visning="farger"><span>' + T('Farger') + '</span></button><button type="button" data-visning="sh"><span>' + T('Svart-hvitt') + '</span></button></div>'
      + '<p class="vbm-inst-tekst">' + T('Har du synestesi, ikke slå på fargene! Bruk gaven din! Ellers er det veldig nyttig å knytte bestemte lyder til farger.') + '</p>'
      + '<p class="vbm-meny-tittel">' + T('Utseende') + '</p>'
      + '<div class="vbm-pille vbm-inst-valg" role="group" aria-label="' + T('Utseende') + '">'
      + '<button type="button" data-tema-valg=""><span>' + T('Automatisk') + '</span></button><button type="button" data-tema-valg="lys"><span>' + T('Lys') + '</span></button><button type="button" data-tema-valg="mork"><span>' + T('Mørk') + '</span></button></div>'
      + '<p class="vbm-inst-tekst">' + T('Automatisk følger innstillingen i nettleseren.') + '</p>'
      + '<p class="vbm-meny-tittel">' + T('Tempo') + '</p>'
      + '<div class="vbm-pille vbm-inst-valg" role="group" aria-label="' + T('Tempo') + '">'
      + '<button type="button" data-tempo-valg="sakte"><span>' + T('Sakte') + '</span></button><button type="button" data-tempo-valg="middels"><span>' + T('Middels') + '</span></button><button type="button" data-tempo-valg="raskt"><span>' + T('Raskt') + '</span></button></div>'
      + '<p class="vbm-inst-tekst">' + T('Gjelder alt som spilles på nettstedet: skalaer, akkorder, intervaller og rytmer.') + '</p>'
      + '<p class="vbm-meny-tittel">' + T('Piano under notene') + '</p>'
      + '<div class="vbm-pille vbm-inst-valg" role="group" aria-label="' + T('Piano under notene') + '">'
      + '<button type="button" data-piano-valg="1"><span>' + T('På') + '</span></button><button type="button" data-piano-valg="0"><span>' + T('Av') + '</span></button></div>'
      + '<p class="vbm-inst-tekst">' + T('Viser tonene på notelinjen på et piano under hver notelinje. Du kan trykke på tangentene for å høre dem.') + '</p>'
      + '<p class="vbm-inst-tittel">' + T('Nivå') + '</p>'
      + '<div class="vbm-pille vbm-inst-valg vbm-niva-valg" role="group" aria-label="' + T('Nivå') + '">'
      + '<button type="button" data-niva-valg="alle"><span>' + T('Alle') + '</span></button><button type="button" data-niva-valg="grunnleggende"><span>' + T('Grunnleggende') + '</span></button>'
      + '<button type="button" data-niva-valg="avansert"><span>' + T('Avansert') + '</span></button><button type="button" data-niva-valg="ekspert"><span>' + T('Ekspert') + '</span></button></div>'
      + '<p class="vbm-inst-tekst">' + T('Viser bare juksebøker, leksjoner og quizer på valgt nivå på startsiden og i menyen.') + '</p>';
    var meny = nav.querySelector('.vbm-meny-knapp');
    nav.insertBefore(b, meny ? meny.nextSibling : nav.firstChild);
    nav.appendChild(panel);
    function vis(){
      var v = brukVisning(), t = tempoValg();
      [].forEach.call(panel.querySelectorAll('[data-visning]'), function(k){ k.setAttribute('aria-pressed', k.getAttribute('data-visning') === v ? 'true' : 'false'); });
      [].forEach.call(panel.querySelectorAll('[data-tempo-valg]'), function(k){ k.setAttribute('aria-pressed', k.getAttribute('data-tempo-valg') === t ? 'true' : 'false'); });
      [].forEach.call(panel.querySelectorAll('[data-tema-valg]'), function(k){ k.setAttribute('aria-pressed', k.getAttribute('data-tema-valg') === temaValg() ? 'true' : 'false'); });
      [].forEach.call(panel.querySelectorAll('[data-piano-valg]'), function(k){ k.setAttribute('aria-pressed', (k.getAttribute('data-piano-valg') === '1') === pianoPaa() ? 'true' : 'false'); });
      [].forEach.call(panel.querySelectorAll('[data-niva-valg]'), function(k){ k.setAttribute('aria-pressed', k.getAttribute('data-niva-valg') === nivaValg() ? 'true' : 'false'); });
    }
    panel.addEventListener('click', function(e){
      var k = e.target.closest && e.target.closest('[data-visning], [data-tempo-valg], [data-piano-valg], [data-tema-valg], [data-niva-valg]'); if (!k) return;
      try {
        if (k.hasAttribute('data-niva-valg')) { localStorage.setItem(NIVA, k.getAttribute('data-niva-valg')); window.dispatchEvent(new Event('vbm-niva')); vis(); return; }
        if (k.hasAttribute('data-tema-valg')) { localStorage.setItem(TEMA, k.getAttribute('data-tema-valg')); brukTema(); }
        else if (k.hasAttribute('data-visning')) localStorage.setItem(VISNING, k.getAttribute('data-visning'));
        else if (k.hasAttribute('data-piano-valg')) { localStorage.setItem(PIANO, k.getAttribute('data-piano-valg')); allePianoer(); }
        else localStorage.setItem(TEMPO, k.getAttribute('data-tempo-valg'));
      } catch(e2){}
      if (window.VBM_LYD_STOPP) window.VBM_LYD_STOPP();
      vis();
    });
    b.addEventListener('click', function(){
      var apen = panel.hidden; panel.hidden = !apen; b.setAttribute('aria-expanded', apen ? 'true' : 'false'); vis();
      var m = document.getElementById('vbm-meny'); if (apen && m && !m.hidden) { var mk = nav.querySelector('.vbm-meny-knapp'); if (mk) mk.click(); }
    });
    document.addEventListener('click', function(e){ if (!panel.hidden && !nav.contains(e.target)) { panel.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
  }
  if (TONEFARGER) { brukVisning(); root.classList.add('vbm-tonefarger'); }

  /* ==================== 13. Oppstart ==================== */
  var obs = null;
  function start(){
    if (!document.body) return;
    grunnTittel = document.title.replace(/^\([^)]*\)\s*/, '');
    oversettHode();
    grunnTittel = document.title;
    byggOriginal();
    byggBunn();
    tre(document.body);
    lenkInn(document.body);
    tilgjengelig(document.body);
    tonefarger(document.body);
    hoppLenke();
    obs = new MutationObserver(function(rec){
      rec.forEach(function(r){
        if (r.type === 'childList') { for (var i = 0; i < r.addedNodes.length; i++) { tre(r.addedNodes[i]); lenkInn(r.addedNodes[i]); tilgjengelig(r.addedNodes[i]); tonefarger(r.addedNodes[i]); } }
        else if (r.type === 'characterData') { ferdig.delete(r.target); tekstNode(r.target); }
        else if (r.type === 'attributes' && r.target.nodeType === 1 && !hopp(r.target)) attributter(r.target);
      });
      obs.takeRecords();   // våre egne endringer skal ikke oversettes en gang til
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
    byggKnapper();                                       // etter oversettelsen, så knappene ikke forstyrrer den
    byggMeny();
    byggInnstillinger();
    byggNivaOgRelatert();
    root.classList.remove('vbm-oversetter');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
