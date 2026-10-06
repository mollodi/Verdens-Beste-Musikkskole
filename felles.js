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
  var ord = {};
  /* Ordbøkene (sprak-XX.js) kaller denne funksjonen. */
  window.VBM_ORDBOK = function(sp, bok){
    if (sp !== sprak) return;
    var f = bok.felles || {}, s = (bok.sider || {})[side] || {}, k;
    for (k in f) ord[k] = f[k];
    for (k in s) ord[k] = s[k];
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

  /* ==================== 8. Oppstart ==================== */
  var obs = null;
  function start(){
    if (!document.body) return;
    grunnTittel = document.title.replace(/^\([^)]*\)\s*/, '');
    oversettHode();
    grunnTittel = document.title;
    byggOriginal();
    byggBunn();
    tre(document.body);
    obs = new MutationObserver(function(rec){
      rec.forEach(function(r){
        if (r.type === 'childList') { for (var i = 0; i < r.addedNodes.length; i++) tre(r.addedNodes[i]); }
        else if (r.type === 'characterData') { ferdig.delete(r.target); tekstNode(r.target); }
        else if (r.type === 'attributes' && r.target.nodeType === 1 && !hopp(r.target)) attributter(r.target);
      });
      obs.takeRecords();   // våre egne endringer skal ikke oversettes en gang til
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
    byggKnapper();                                       // etter oversettelsen, så knappene ikke forstyrrer den
    root.classList.remove('vbm-oversetter');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
