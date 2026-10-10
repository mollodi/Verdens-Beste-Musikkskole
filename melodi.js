/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-MELJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – MELODILESING OG MELODIDIKTAT
   ---------------------------------------------------------------------
   Felles for leksjonen (melodilesing.html) og quizen (quiz-melodi.html):
   skalatrinn i dur og moll, en enkel generator for tonale melodier og varianter
   med én eller to toner endret (til melodilesing og melodikorreksjon).
   Må lastes etter tonearter.js, intervall.js, skalaer.js og akkord.js.

   En melodi er en liste med skalatrinn: 0 = 1. trinn (tonika), 4 = 5. trinn, -1 = 7. trinn under tonika.
   I moll brukes harmonisk moll (hevet 7. trinn), og melodiene går aldri rett mellom 6. og 7. trinn,
   så den forstørrede sekunden unngås, slik lærebøkene anbefaler for sangbare melodier.
   ===================================================================== */
window.VBM_MELODI = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, S = window.VBM_SKALAER, A = window.VBM_AKKORD, T = K.T;
  function tilfeldig(a){ return a[Math.floor(Math.random() * a.length)]; }

  /* Tonen på skalatrinn d i tonearten (oktav: flytt hele melodien opp eller ned) */
  function tone(rot, moll, d, oktav){
    var sk = A.skala(rot, moll), i = ((d % 7) + 7) % 7, o = Math.floor(d / 7), n = sk[i];
    return { b: n.b, f: n.f, oktav: n.oktav + o + (oktav || 0) };
  }
  function hjelpelinjer(liste){ return liste.reduce(function(s, n){ var d = n.oktav * 7 + n.b; return s + (d < 30 ? Math.ceil((30 - d) / 2) : d > 38 ? Math.ceil((d - 38) / 2) : 0); }, 0); }
  /* Melodien som toner, i oktaven med færrest hjelpelinjer */
  function toner(rot, moll, trinn){
    var beste = null, bp = Infinity;
    [-1, 0, 1].forEach(function(o){ var l = trinn.map(function(d){ return tone(rot, moll, d, o); }), p = hjelpelinjer(l); if (p < bp) { bp = p; beste = l; } });
    return beste;
  }
  /* Ulovlig steg i moll: rett mellom 6. og 7. trinn (forstørret sekund) */
  function forstSekund(a, b, moll){ if (!moll) return false; var x = ((a % 7) + 7) % 7, y = ((b % 7) + 7) % 7; return (x === 5 && y === 6) || (x === 6 && y === 5); }
  var TREKLANG = [0, 2, 4];
  /* En tonal melodi: begynner på 1, 3 eller 5, går mest trinnvis, hopper bare til tonikatreklangen,
     og slutter med 2–1 eller 7–1. Avansert: lengre, flere og større sprang. */
  function lag(lengde, moll, avansert){
    for (var forsok = 0; forsok < 200; forsok++) {
      var m = [tilfeldig([0, 2, 4])], ok = true;
      while (m.length < lengde - 2) {
        var x = m[m.length - 1], valg = [];
        [-1, 1].forEach(function(r){ valg.push(x + r, x + r); });
        if (avansert) [-1, 1].forEach(function(r){ valg.push(x + 2 * r); });
        /* Sprang til en tone i tonikatreklangen (ters eller større) */
        [-7, 0, 7].forEach(function(o){ TREKLANG.forEach(function(t){ var y = t + o; if (Math.abs(y - x) >= 2 && Math.abs(y - x) <= (avansert ? 5 : 4)) valg.push(y); }); });
        valg = valg.filter(function(y){ return y >= -3 && y <= 7 && !forstSekund(x, y, moll); });
        var y = tilfeldig(valg);
        if (m.length >= 2 && m[m.length - 1] === y && m[m.length - 2] === y) continue;
        m.push(y);
      }
      var slutt = tilfeldig([1, -1]);
      if (forstSekund(m[m.length - 1], slutt, moll) || Math.abs(m[m.length - 1] - slutt) > 2) continue;   // inn mot slutten trinnvis eller med en ters (aldri tritonus)
      m.push(slutt, 0);
      if (ok) return m;
    }
    return [0, 1, 2, 1, 0];
  }
  /* Variant der antall toner (ikke første og siste) er flyttet et trinn opp eller ned */
  function variant(m, antall, moll){
    for (var f = 0; f < 100; f++) {
      var v = m.slice(), plasser = [], i;
      while (plasser.length < antall) { i = 1 + Math.floor(Math.random() * (m.length - 2)); if (plasser.indexOf(i) < 0) plasser.push(i); }
      var ok = true;
      plasser.forEach(function(p){ v[p] = m[p] + tilfeldig([-1, 1]); });
      for (i = 1; i < v.length; i++) if (forstSekund(v[i - 1], v[i], moll) || v[i] < -3 || v[i] > 8) ok = false;
      if (ok && v.join() !== m.join()) return { trinn: v, plasser: plasser };
    }
    return { trinn: m.slice(), plasser: [] };
  }
  function lyd(liste){ return liste.map(function(n){ return [S.midi(n)]; }); }
  /* Trinnet som tekst (1 til 7) */
  function trinnTall(d){ return ((d % 7) + 7) % 7 + 1; }

  return { tone: tone, toner: toner, lag: lag, variant: variant, lyd: lyd, trinnTall: trinnTall, T: T };
})();
