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
(function(){
  'use strict';

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
  /* Lydkreditter. Siden velger med <footer data-lyd="alle"> eller data-lyd="piano". */
  var LYD = {
    alle: 'Lyd: Salamander Grand Piano av Alexander Holm (CC BY 3.0). Gitar, fiolin og cello fra tonejs-instruments av Nicholas Brosowsky (CC BY 3.0).',
    piano: 'Lyd: Salamander Grand Piano av Alexander Holm (CC BY 3.0).',
    rytme: 'Lyd: trommer fra Versilian Community Sample Library (CC0). Piano: Salamander Grand Piano av Alexander Holm (CC BY 3.0). Gitar, fiolin og cello fra tonejs-instruments av Nicholas Brosowsky (CC BY 3.0).'
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
  if (trengs && !window.VBM_INGEN_LASTING) document.write('<script src="sprak-' + sprak + '.js"><\/script>');
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
  if (harSH) settSH(villSH());                           // før siden tegnes, så den ikke blinker i farger

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

    if (harSH && valg) {
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
      b.setAttribute('lang', k); b.setAttribute('title', NAVN[k]); b.setAttribute('aria-label', NAVN[k]);
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
     <footer data-lyd="alle">  signatur + kreditt for piano, gitar og strykere
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
    d.className = 'vbm-original'; d.setAttribute('role', 'note');
    d.innerHTML = T('Originalen av denne siden finnes på ')
      + '<a href="' + ORIGINAL + side + '">' + T('Verdens Beste Musikkskole') + '</a>.';
    document.body.insertBefore(d, document.body.firstChild);
  }

  /* ==================== 8. Meny øverst på alle sider ====================
     «Alle ressurser» fører til startsiden, og «Meny» viser alle sidene, gruppert som på startsiden.
     Listen hentes fra materialer.js, så en ny side kommer med i menyen av seg selv. */
  function menyT(s){ var o = menyOrd[s]; if (typeof o === 'string') return o; return T(s); }
  function hentMaterialer(ferdigFn){
    if (window.VBM && window.VBM.materialer) { ferdigFn(); return; }
    var sk = document.createElement('script'); sk.src = 'materialer.js';
    sk.onload = ferdigFn; document.head.appendChild(sk);
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
    var bs = getComputedStyle(document.body);
    nav.style.setProperty('--vbm-topp-bg', bs.backgroundColor && bs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bs.backgroundColor : '#fff');
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
          var liste = (M.materialer || []).filter(function(m){ return m.seksjon === sk.id && !m.skjult; });
          if (!liste.length) return;
          html += '<div class="vbm-meny-gruppe"><p class="vbm-meny-tittel">' + menyT(sk.overskrift) + '</p><ul>';
          liste.forEach(function(m){
            var her = m.fil.split('?')[0] === side;
            html += '<li><a class="vbm-meny-lenke" href="' + m.fil + '"' + (her ? ' aria-current="page"' : '') + '>' + menyT(m.tittel) + '</a></li>';
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

  /* ==================== 10. Oppstart ==================== */
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
    obs = new MutationObserver(function(rec){
      rec.forEach(function(r){
        if (r.type === 'childList') { for (var i = 0; i < r.addedNodes.length; i++) { tre(r.addedNodes[i]); lenkInn(r.addedNodes[i]); } }
        else if (r.type === 'characterData') { ferdig.delete(r.target); tekstNode(r.target); }
        else if (r.type === 'attributes' && r.target.nodeType === 1 && !hopp(r.target)) attributter(r.target);
      });
      obs.takeRecords();   // våre egne endringer skal ikke oversettes en gang til
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
    byggKnapper();                                       // etter oversettelsen, så knappene ikke forstyrrer den
    byggMeny();
    root.classList.remove('vbm-oversetter');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
