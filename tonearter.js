/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-TNRT. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – TONEARTER OG FORTEGN
   ---------------------------------------------------------------------
   Felles for kvintsirkelen (kvintsirkelen.html) og quizen (quiz-kvintsirkelen.html):
   alle 15 durtonearter med parallell moll, tonenavn på norsk, engelsk og polsk,
   og fortegn tegnet på en ekte notelinje.
   Legges nederst i <body>, før sidens eget skript:
     <script src="tonearter.js"></script>
   ===================================================================== */
window.VBM_TONEARTER = (function(){
  'use strict';
  function T(s, v){ return window.VBM_T ? window.VBM_T(s, v) : String(s).replace(/\{(\w+)\}/g, function(m, k){ return v && v[k] != null ? v[k] : m; }); }
  function sprak(){ return window.VBM_SPRAK || 'no'; }

  /* ---------- Tonenavn ---------- */
  var BH = [0, 2, 4, 5, 7, 9, 11];   // C D E F G A H
  var NAVN = {
    no: { 0: ['C', 'D', 'E', 'F', 'G', 'A', 'H'], 1: ['Ciss', 'Diss', 'Eiss', 'Fiss', 'Giss', 'Aiss', 'Hiss'], '-1': ['Ces', 'Dess', 'Ess', 'Fes', 'Gess', 'Ass', 'B'] },
    pl: { 0: ['C', 'D', 'E', 'F', 'G', 'A', 'H'], 1: ['Cis', 'Dis', 'Eis', 'Fis', 'Gis', 'Ais', 'His'], '-1': ['Ces', 'Des', 'Es', 'Fes', 'Ges', 'As', 'B'] },
    en: { 0: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], 1: ['C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯'], '-1': ['C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭'] }
  };
  function tone(n){
    var t = NAVN[sprak()] || NAVN.no;
    if (t[n.f]) return t[n.f][n.b];
    return t[0][n.b] + (n.f > 0 ? '𝄪' : '𝄫');   // dobbeltfortegn (vises sjelden som tekst)
  }
  /* Tonen slik den skrives i akkordsymboler: bokstav med ♯ eller ♭ (E♭, F♯m, A♭7), som i jukseboka og de fleste sangbøker.
     På norsk og polsk beholdes B (= engelsk B♭) og H (= engelsk B); på engelsk er det vanlige engelske navn.
     I løpende tekst brukes tone() (Ess, Fiss, Ass). */
  function akkordTone(n){
    if (sprak() === 'en') return tone(n);
    if (n.b === 6 && n.f === -1) return 'B';
    var L = ['C', 'D', 'E', 'F', 'G', 'A', 'H'][n.b];
    return L + ({ 1: '♯', 2: '𝄪', '-1': '♭', '-2': '𝄫' }[n.f] || '');
  }
  function dur(n){ return sprak() === 'en' ? tone(n) + ' major' : tone(n) + '-dur'; }
  function moll(n){ return sprak() === 'en' ? tone(n) + ' minor' : tone(n).toLowerCase() + '-moll'; }
  /* Korte navn til sirkelen: stor bokstav for dur, liten for moll (engelsk: «Am»). */
  function kortDur(n){ return tone(n); }
  function kortMoll(n){ return sprak() === 'en' ? tone(n) + 'm' : tone(n).toLowerCase(); }

  /* ---------- Tonearter ----------
     fortegn: antall kryss (positivt) eller b-er (negativt). */
  function lagToneart(b, f, fortegn){
    var mb = (b + 5) % 7, mpc = (BH[b] + f + 9) % 12, mf = mpc - BH[mb];
    if (mf > 6) mf -= 12; if (mf < -6) mf += 12;
    return { fortegn: fortegn, dur: { b: b, f: f }, moll: { b: mb, f: mf } };
  }
  var ALLE = [
    lagToneart(0, 0, 0), lagToneart(4, 0, 1), lagToneart(1, 0, 2), lagToneart(5, 0, 3), lagToneart(2, 0, 4),
    lagToneart(6, 0, 5), lagToneart(3, 1, 6), lagToneart(0, 1, 7),
    lagToneart(3, 0, -1), lagToneart(6, -1, -2), lagToneart(2, -1, -3), lagToneart(5, -1, -4),
    lagToneart(1, -1, -5), lagToneart(4, -1, -6), lagToneart(0, -1, -7)
  ];
  function medFortegn(n){ for (var i = 0; i < ALLE.length; i++) if (ALLE[i].fortegn === n) return ALLE[i]; return null; }
  /* De 12 plassene i sirkelen, med klokka fra toppen. Nederst finnes to navn (enharmoniske). */
  var SIRKEL = [[0], [1], [2], [3], [4], [5, -7], [6, -6], [7, -5], [-4], [-3], [-2], [-1]];

  /* ---------- Fortegnene ---------- */
  var KRYSS = [[3, 5], [0, 5], [4, 5], [1, 5], [5, 4], [2, 5], [6, 4]];   // F C G D A E H, med oktav
  var BER   = [[6, 4], [2, 5], [5, 4], [1, 5], [4, 4], [0, 5], [3, 4]];   // H E A D G C F
  function fortegnNavn(n){
    var liste = n > 0 ? KRYSS.slice(0, n) : BER.slice(0, -n);
    return liste.map(function(p){ return tone({ b: p[0], f: n > 0 ? 1 : -1 }); });
  }
  function liste(ord){
    if (ord.length < 2) return ord.join('');
    return ord.slice(0, -1).join(', ') + ' ' + T('og') + ' ' + ord[ord.length - 1];
  }
  function antall(n){
    if (!n) return T('ingen fortegn');
    if (n > 0) return n === 1 ? T('1 kryss') : T('{n} kryss', { n: n });
    return n === -1 ? T('1 b') : T('{n} b-er', { n: -n });
  }

  /* ---------- Notelinje med fortegn ----------
     Samme notelinje, g-nøkkel og fortegn som i juksebøkene. */
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
    + '<g id="acc-flat"><rect x="-3.6" y="-15.5" width="1.3" height="20.8"/><path d="M-2.3,-1.5C0,-4.8 5.6,-5 5.3,-1.6C5,1.3 1.2,3.6 -2.3,5.3L-2.3,3.4C0.3,1.8 2.8,0.1 2.8,-1.7C2.8,-3.5 -0.1,-3.1 -2.3,-0.3Z"/></g>'
    + '<g id="acc-sharp"><rect x="-2.8" y="-9.5" width="1.2" height="20"/><rect x="1.6" y="-10.5" width="1.2" height="20"/><path d="M-5,-2.1L5,-5.1L5,-2.5L-5,0.5Z"/><path d="M-5,4.7L5,1.7L5,4.3L-5,7.3Z"/></g>'
    + '<path id="gclef" d="M434 2Q464 -103 464 -170Q464 -223 427.0 -257.0Q390 -291 337 -291Q287 -291 250.0 -261.5Q213 -232 213 -190Q213 -160 233.5 -133.5Q254 -107 283.5 -107.0Q313 -107 331.5 -128.5Q350 -150 350 -178Q350 -240 280 -240Q298 -268 338 -268Q353 -268 368.5 -263.5Q384 -259 401.0 -248.0Q418 -237 428.5 -213.5Q439 -190 439 -157Q439 -136 411 -6Q389 -12 356 -12Q259 -12 189.5 60.0Q120 132 120 232Q120 267 131.5 303.0Q143 339 157.5 366.5Q172 394 200.5 428.5Q229 463 248.5 483.5Q268 504 303 539Q280 621 280 689Q280 779 313.0 839.5Q346 900 379 900Q389 900 401.5 887.0Q414 874 426.0 851.0Q438 828 446.5 790.5Q455 753 455 710Q455 551 342 447L368 329Q384 332 397 332Q458 332 500.0 282.5Q542 233 542 162Q542 44 434 2ZM426 746Q426 801 394 801Q358 801 333.0 748.0Q308 695 308 630Q308 588 321 557Q359 580 392.5 639.5Q426 699 426 746ZM498 128Q498 183 466.0 216.0Q434 249 383 249L428 23Q498 52 498 128ZM407 17 361 247Q334 241 311.5 214.0Q289 187 289 158Q289 143 295.0 128.5Q301 114 309.5 104.0Q318 94 327.0 86.0Q336 78 342.0 74.5Q348 71 348 71L340 66Q307 75 277.5 106.0Q248 137 248 184Q248 231 277.5 270.5Q307 310 343 323L325 430Q168 299 168 177Q168 104 223.0 55.0Q278 6 348 6Q365 6 407 17Z"/>'
    + '</defs></svg>';
  function sikreDefs(){
    if (document.getElementById('acc-sharp')) return;
    document.body.insertAdjacentHTML('afterbegin', DEFS);
  }
  function y(p){ return 140 - (p[1] * 7 + p[0] - 30) * 6.5; }   // E4 ligger på nederste linje
  function fortegnSvg(n, etikett){
    sikreDefs();
    var s = '<svg viewBox="0 64 220 104" role="img" aria-label="' + (etikett || antall(n)) + '">';
    for (var i = 0; i < 5; i++) s += '<line x1="6" y1="' + (88 + i * 13) + '" x2="214" y2="' + (88 + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
    s += '<use href="#gclef" transform="translate(6 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>';
    var liste = n > 0 ? KRYSS.slice(0, n) : BER.slice(0, -n);
    liste.forEach(function(p, i){
      s += '<use href="#' + (n > 0 ? 'acc-sharp' : 'acc-flat') + '" transform="translate(' + (64 + i * 13) + ' ' + y(p) + ')" fill="currentColor"/>';
    });
    return s + '</svg>';
  }

  /* ---------- Lyd: skala og treklang ---------- */
  function grunntone(n){ var m = 60 + ((BH[n.b] + n.f) % 12 + 12) % 12; return m > 66 ? m - 12 : m; }
  function skala(n, molltrinn){
    var g = grunntone(n), trinn = molltrinn ? [0, 2, 3, 5, 7, 8, 10, 12] : [0, 2, 4, 5, 7, 9, 11, 12];
    return trinn.map(function(t){ return [g + t]; });
  }
  function treklang(n, mollklang){ var g = grunntone(n); return [g, g + (mollklang ? 3 : 4), g + 7]; }

  return { ALLE: ALLE, SIRKEL: SIRKEL, medFortegn: medFortegn, tone: tone, akkordTone: akkordTone, dur: dur, moll: moll,
           kortDur: kortDur, kortMoll: kortMoll, fortegnNavn: fortegnNavn, liste: liste, antall: antall,
           fortegnSvg: fortegnSvg, skala: skala, treklang: treklang, T: T };
})();
