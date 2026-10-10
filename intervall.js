/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-INTJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – INTERVALLER
   ---------------------------------------------------------------------
   Felles regler for intervaller: navn (tall og kvalitet), bygge et intervall
   fra en tone, omvending og konsonans. Brukes av Intervaller (intervaller-teori.html),
   Teoriquiz: intervaller (quiz-intervaller.html) og transponering.js.
   Må lastes etter tonearter.js:  <script src="intervall.js"></script>

   En tone er { b: bokstav (0 = C ... 6 = H), f: fortegn (-2 til 2), oktav }.
   Tallet i et intervall er antall bokstaver medregnet begge tonene (C til E = 3, en ters).
   Kvaliteten er hvor mange halvtoner det er, sammenlignet med dur-skalaen fra den nederste tonen.
   ===================================================================== */
window.VBM_INTERVALL = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, T = K.T;
  var BH = [0, 2, 4, 5, 7, 9, 11];   // halvtoner fra C i C-dur
  /* Tallnavnene, 1 = prim ... 15 = kvintdecim (dobbel oktav). Skrivemåten følger Intervall-jukseboka. */
  var TALL = ['prim', 'sekund', 'ters', 'kvart', 'kvint', 'sekst', 'septim', 'oktav',
              'none', 'decim', 'undecim', 'duodecim', 'tredecim', 'kvartdecim', 'kvintdecim'];
  var REN_TALL = { 1: 1, 4: 1, 5: 1, 8: 1 };   // enkle tall som er rene (prim, kvart, kvint, oktav)

  function midi(n){ return (n.oktav + 1) * 12 + BH[n.b] + n.f; }
  function trinn(n){ return n.oktav * 7 + n.b; }
  /* Bokstavsteg og halvtoner fra a til b (positivt når b ligger over a) */
  function mellom(a, b){ return { b: trinn(b) - trinn(a), h: midi(b) - midi(a) }; }
  function enkelt(tall){ return ((tall - 1) % 7) + 1; }        // 9 (none) blir 2 (sekund), 8 (oktav) er 8
  function erRen(tall){ var e = tall === 8 || tall === 15 ? 8 : enkelt(tall); return !!REN_TALL[e]; }
  /* Halvtoner i det store eller rene intervallet med dette tallet (stor ters = 4, ren kvint = 7) */
  function grunnHalv(tall){ var o = Math.floor((tall - 1) / 7); return o * 12 + BH[(tall - 1) % 7]; }

  /* Kvaliteten ut fra tall og halvtoner. Gir null hvis forskjellen er for stor (mer enn dobbelt). */
  var KVAL_REN = { '-2': 'dobbelt forminsket', '-1': 'forminsket', '0': 'ren', '1': 'forstørret', '2': 'dobbelt forstørret' };
  var KVAL_STOR = { '-3': 'dobbelt forminsket', '-2': 'forminsket', '-1': 'liten', '0': 'stor', '1': 'forstørret', '2': 'dobbelt forstørret' };
  function kvalitet(tall, h){ var d = h - grunnHalv(tall); return (erRen(tall) ? KVAL_REN : KVAL_STOR)[d] || null; }
  function avvikFor(tall, kval){
    var tab = erRen(tall) ? KVAL_REN : KVAL_STOR;
    for (var d in tab) if (tab[d] === kval) return +d;
    return null;
  }

  /* Intervallet mellom to toner (i hvilken som helst rekkefølge). opp = om den andre tonen ligger høyere. */
  function navn(a, b){
    var m = mellom(a, b), opp = m.b > 0 || (m.b === 0 && m.h >= 0);
    if (!opp) m = { b: -m.b, h: -m.h };
    var tall = m.b + 1;
    return { tall: tall, kval: kvalitet(tall, m.h), h: m.h, opp: opp };
  }
  /* Bygg et intervall fra tonen n: tall (1 til 15) og kvalitet, opp eller ned */
  function lag(n, tall, kval, opp){
    var r = opp === false ? -1 : 1, d = trinn(n) + r * (tall - 1), h = grunnHalv(tall) + avvikFor(tall, kval);
    var ny = { b: ((d % 7) + 7) % 7, oktav: Math.floor(d / 7), f: 0 };
    ny.f = midi(n) + r * h - midi(ny);
    return ny;
  }
  /* Flytt med { b: bokstavsteg, h: halvtoner } (brukes av transponering.js) */
  function flytt(n, iv, opp){
    var r = opp ? 1 : -1, d = trinn(n) + r * iv.b, m = midi(n) + r * iv.h;
    var ny = { b: ((d % 7) + 7) % 7, oktav: Math.floor(d / 7), f: 0 };
    ny.f = m - midi(ny);
    return ny;
  }

  /* Omvending av et enkelt intervall: tallene blir 9 til sammen, halvtonene 12, og kvaliteten snus */
  var SNU = { 'ren': 'ren', 'stor': 'liten', 'liten': 'stor', 'forstørret': 'forminsket', 'forminsket': 'forstørret',
              'dobbelt forstørret': 'dobbelt forminsket', 'dobbelt forminsket': 'dobbelt forstørret' };
  function omvend(iv){ var tall = iv.tall === 1 ? 8 : iv.tall === 8 ? 1 : 9 - iv.tall; return { tall: tall, kval: SNU[iv.kval], h: 12 - iv.h }; }

  /* Konsonans: 'fullkommen' (prim, oktav, kvint), 'kvart' (avhenger av sammenhengen),
     'ufullkommen' (store og små terser og seksters) eller 'dissonans' (resten) */
  function konsonans(iv){
    var e = iv.tall === 8 || iv.tall === 15 ? 8 : enkelt(iv.tall);
    if (iv.kval === 'ren') return e === 4 ? 'kvart' : 'fullkommen';
    if ((e === 3 || e === 6) && (iv.kval === 'stor' || iv.kval === 'liten')) return 'ufullkommen';
    return 'dissonans';
  }

  /* Navnet som tekst på sidens språk: «stor ters», «major 3rd», «tercja wielka». 15 og ren = dobbel oktav. */
  function tekst(iv){
    if (iv.tall === 15 && iv.kval === 'ren') return T('dobbel oktav');
    return T('{kvalitet} {intervall}', { kvalitet: T(iv.kval), intervall: T(TALL[iv.tall - 1]) });
  }
  function stor(t){ return String(t).replace(/^./, function(c){ return c.toUpperCase(); }); }
  function like(a, b){ return a.tall === b.tall && a.kval === b.kval; }

  return { TALL: TALL, midi: midi, mellom: mellom, erRen: erRen, grunnHalv: grunnHalv, kvalitet: kvalitet, navn: navn,
           lag: lag, flytt: flytt, omvend: omvend, konsonans: konsonans, tekst: tekst, stor: stor, like: like, T: T };
})();
