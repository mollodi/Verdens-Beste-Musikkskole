/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-STMJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – STEMMING OG TEMPERATUR
   ---------------------------------------------------------------------
   Felles for leksjonen (stemming.html) og quizen (quiz-stemming.html):
   frekvenser, cent, rene intervaller, svevninger og fire temperaturer.
   Lyden spilles med lyd.js, der desimaltall gir toner mellom tangentene
   (60.14 = midtre C pluss 14 cent).
   ===================================================================== */
window.VBM_STEMMING = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, T = K.T;

  /* ---------- Grunnleggende ---------- */
  function cent(forhold){ return 1200 * Math.log(forhold) / Math.LN2; }
  function hz(m){ return 440 * Math.pow(2, (m - 69) / 12); }      // MIDI-tall (gjerne med desimaler) til hertz
  function midiAv(f){ return 69 + 12 * Math.log(f / 440) / Math.LN2; }
  var REN_KVINT = cent(3 / 2);                                    // 701,955 cent
  var PYT_KOMMA = cent(Math.pow(1.5, 12) / 128);                  // 23,46 cent: 12 rene kvinter minus 7 oktaver
  var SYN_KOMMA = cent(81 / 80);                                  // 21,51 cent: fire rene kvinter minus en ren stor ters og to oktaver
  /* Tall med komma på norsk og polsk, punktum på engelsk */
  function tall(x, d){ var s = x.toFixed(d == null ? 1 : d); return (window.VBM_SPRAK || 'no') === 'en' ? s : s.replace('.', ','); }

  /* ---------- Rene intervaller ----------
     p:q er forholdet mellom frekvensene (øverste over nederste). kort = navnet uten «ren» (brukes i setninger). */
  var RENE = [
    { id: 'oktav', navn: 'Ren oktav', kort: 'oktav', p: 2, q: 1, halv: 12, b: 7 },
    { id: 'kvint', navn: 'Ren kvint', kort: 'kvint', p: 3, q: 2, halv: 7, b: 4 },
    { id: 'kvart', navn: 'Ren kvart', kort: 'kvart', p: 4, q: 3, halv: 5, b: 3 },
    { id: 'sters', navn: 'Stor ters', kort: 'stor ters', p: 5, q: 4, halv: 4, b: 2 },
    { id: 'lters', navn: 'Liten ters', kort: 'liten ters', p: 6, q: 5, halv: 3, b: 2 }
  ];
  RENE.forEach(function(x){ x.cent = cent(x.p / x.q); x.avvik = x.halv * 100 - x.cent; });   // likesvevende minus rent
  /* Svevninger i sekundet: nederste tones p-te deltone mot øverste tones q-te deltone */
  function svevninger(fLav, fHoy, iv){ return Math.abs(iv.p * fLav - iv.q * fHoy); }

  /* ---------- Overtonerekken ---------- */
  function deltone(grunnMidi, n){ return grunnMidi + 12 * Math.log(n) / Math.LN2; }

  /* ---------- Temperaturene ----------
     Hver temperatur er størrelsen på de 11 kvintene i kjeden Ess–B–F–C–G–D–A–E–H–Fiss–Ciss–Giss.
     Den tolvte kvinten (Giss–Ess) blir det som er igjen, i midttone den store «ulvekvinten». */
  var KJEDE = [3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8];   // tonehøydene i kjeden, fra Ess til Giss
  function lag(id, navn, kvinter){ return { id: id, navn: navn, kvinter: kvinter }; }
  var alle = function(c){ var a = []; for (var i = 0; i < 11; i++) a.push(c); return a; };
  var w = alle(REN_KVINT); [3, 4, 5, 8].forEach(function(i){ w[i] = REN_KVINT - PYT_KOMMA / 4; });   // C–G, G–D, D–A og H–Fiss
  var TEMPERATURER = [
    lag('pytagoreisk', 'Pytagoreisk stemming', alle(REN_KVINT)),
    lag('midttone', 'Midttonetemperatur', alle(REN_KVINT - SYN_KOMMA / 4)),
    lag('werckmeister', 'Werckmeister III', w),
    lag('likesvevende', 'Likesvevende temperatur', alle(700))
  ];
  /* Avvik i cent fra likesvevende for hver tonehøyde (0 = C ... 11 = H), med C som utgangspunkt */
  function avvik(t){
    var pos = {}, c = KJEDE.indexOf(0), i, x;
    pos[0] = 0;
    for (i = c, x = 0; i < 11; i++) { x += t.kvinter[i]; pos[KJEDE[i + 1]] = x; }
    for (i = c - 1, x = 0; i >= 0; i--) { x -= t.kvinter[i]; pos[KJEDE[i]] = x; }
    var res = [];
    for (var pc = 0; pc < 12; pc++) { var d = pos[pc] - pc * 100; d = ((d % 1200) + 1200) % 1200; if (d > 600) d -= 1200; res.push(d); }
    return res;
  }
  /* Et MIDI-tall stemt i temperaturen: tangenten pluss avviket i cent */
  function stem(m, t){ var a = avvik(t); return m + a[((Math.round(m) % 12) + 12) % 12] / 100; }
  /* Størrelsen i cent på intervallet fra MIDI-tall a til b i temperaturen */
  function storrelse(a, b, t){ return (stem(b, t) - stem(a, t)) * 100; }

  /* To toner samtidig på én notelinje (skalaer.js må være lastet). akkordrekka setter av plass under
     notelinjen til besifring, og den plassen tas bort her, slik at det ikke blir et tomt felt. */
  function samklang(noter, etikett){
    return window.VBM_SKALAER.akkordrekke([{ noter: noter, tall: [] }], etikett).replace(/viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/, function(m, x, y, w, h){ return 'viewBox="' + x + ' ' + y + ' ' + w + ' ' + (+h - 40) + '"'; });
  }

  return { cent: cent, hz: hz, midiAv: midiAv, REN_KVINT: REN_KVINT, PYT_KOMMA: PYT_KOMMA, SYN_KOMMA: SYN_KOMMA, tall: tall, samklang: samklang,
           RENE: RENE, svevninger: svevninger, deltone: deltone, TEMPERATURER: TEMPERATURER, avvik: avvik, stem: stem, storrelse: storrelse, T: T };
})();
