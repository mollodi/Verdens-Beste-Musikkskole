/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-AKKJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – AKKORDANALYSE
   ---------------------------------------------------------------------
   Felles for leksjonen (akkordanalyse.html) og quizen (quiz-akkordanalyse.html):
   akkordene på hvert trinn i dur og harmonisk moll, akkordtype, besifring,
   trinnanalyse, funksjonsanalyse og stemmeføring på notelinjen.
   Må lastes etter tonearter.js, intervall.js og skalaer.js.

   Navn og symboler følger Den ultimate jukseboka: Cmaj7, C7, Cm7, Cm7♭5, Cdim7, C+, Cm(maj7).
   Trinnanalyse: romertall (store for dur og forstørret, små for moll og forminsket) med generalbass-
   tall for omvendingene (⁶, ⁶₄, ⁷, ⁶₅, ⁴₃, ⁴₂). Funksjonsanalyse: T, S og D (store bokstaver også i moll, slik som i opptaksprøven), med tallet
   for basstonen under bokstaven (D₃ = dominant med tersen i bassen, D⁷₃ = dominantseptim med tersen i bassen).
   ===================================================================== */
window.VBM_AKKORD = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, S = window.VBM_SKALAER, I = window.VBM_INTERVALL, T = K.T;

  var DUR = [[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,11]];
  var HMOLL = [[0,0],[1,2],[2,3],[3,5],[4,7],[5,8],[6,11]];   // harmonisk moll: hevet 7. trinn (ledetone)
  /* Molltonearter med færrest fortegn: c, ciss, d, ess, e, f, fiss, g, giss, a, b, h */
  var MOLL_ROT = [[0,0],[0,1],[1,0],[2,-1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[6,-1],[6,0]];
  function rot(nr, moll){ if (moll) { var x = MOLL_ROT[nr]; return { b: x[0], f: x[1] }; } return S.durRot(nr); }
  function tonartNavn(r, moll){ return moll ? K.moll(r) : K.dur(r); }
  /* Fortegn i tonearten (dur: fra rot, moll: fra parallelltonearten en liten ters over) */
  function fortegn(r, moll){
    var p = moll ? I.lag({ b: r.b, f: r.f, oktav: 4 }, 3, 'liten', true) : r;
    return [0, 2, 4, -1, 1, 3, 5][p.b] + 7 * p.f;
  }
  function skala(r, moll){ return S.toner({ b: r.b, f: r.f, oktav: 4 }, moll ? HMOLL : DUR); }

  /* Akkorden på trinn t (0 = I ... 6 = VII): grunntone, ters, kvint (og septim), stablet oppover fra grunntonen */
  function akkord(r, moll, t, septim){
    var sk = skala(r, moll), toner = [];
    [0, 2, 4, 6].slice(0, septim ? 4 : 3).forEach(function(d){
      var i = t + d, n = sk[i % 7];
      toner.push({ b: n.b, f: n.f, oktav: n.oktav + Math.floor(i / 7) });
    });
    return { trinn: t, moll: !!moll, septim: !!septim, toner: toner, type: type(toner), rot: r };
  }
  /* Akkordtypen ut fra intervallene over grunntonen */
  function type(toner){
    var g = toner[0], t = I.navn(g, toner[1]).kval, k = I.navn(g, toner[2]).kval, s = toner[3] ? I.navn(g, toner[3]).kval : null;
    var tre = t === 'stor' && k === 'ren' ? 'dur' : t === 'liten' && k === 'ren' ? 'moll' : t === 'liten' && k === 'forminsket' ? 'dim' : t === 'stor' && k === 'forstørret' ? 'aug' : '?';
    if (!s) return tre;
    return { 'dur,stor': 'maj7', 'dur,liten': '7', 'moll,liten': 'm7', 'dim,liten': 'm7b5', 'dim,forminsket': 'dim7', 'moll,stor': 'mmaj7', 'aug,stor': 'augmaj7' }[tre + ',' + s] || '?';
  }
  var SUFFIKS = { dur: '', moll: 'm', dim: 'dim', aug: '+', maj7: 'maj7', '7': '7', m7: 'm7', m7b5: 'm7♭5', dim7: 'dim7', mmaj7: 'm(maj7)', augmaj7: '+maj7' };
  var TYPE_NAVN = { dur: 'durtreklang', moll: 'molltreklang', dim: 'forminsket treklang', aug: 'forstørret treklang',
    maj7: 'majorseptimakkord (maj7)', '7': 'dominantseptimakkord', m7: 'mollseptimakkord', m7b5: 'halvforminsket septimakkord',
    dim7: 'forminsket septimakkord', mmaj7: 'moll-maj7-akkord', augmaj7: 'forstørret maj7-akkord' };
  var INV_NAVN = [['grunnstilling', 'sekstakkord', 'kvartsekstakkord'], ['grunnstilling', 'kvintsekstakkord', 'terskvartakkord', 'sekundakkord']];
  var INV_TALL = [['', '⁶', '⁶₄'], ['⁷', '⁶₅', '⁴₃', '⁴₂']];
  var BASS_TALL = ['', '₃', '₅', '₇'];
  var ROMER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  function symbol(ak, inv){ var s = K.tone(ak.toner[0]) + SUFFIKS[ak.type]; return inv ? s + '/' + K.tone(ak.toner[inv]) : s; }
  function typeNavn(ak){ return T(TYPE_NAVN[ak.type]); }
  function invNavn(ak, inv){ return T(INV_NAVN[ak.septim ? 1 : 0][inv]); }
  /* Romertall: store for dur og forstørret, små for moll og forminsket, med ° (forminsket), ø (halvforminsket) og + (forstørret) */
  function romertall(ak, inv){
    var stor = { dur: 1, aug: 1, maj7: 1, '7': 1, augmaj7: 1 }[ak.type], r = ROMER[ak.trinn];
    if (!stor) r = r.toLowerCase();
    if (ak.type === 'dim' || ak.type === 'dim7') r += '°';
    if (ak.type === 'm7b5') r += 'ø';
    if (ak.type === 'aug' || ak.type === 'augmaj7') r += '+';
    return r + INV_TALL[ak.septim ? 1 : 0][inv || 0];
  }
  /* Funksjon for hovedakkordene (I, IV og V, i moll i, iv og V), med store bokstaver i begge modi. Bitreklangene kommer i neste leksjon (null her). */
  function funksjon(ak, inv){
    var f = { 0: 'T', 3: 'S', 4: 'D' }[ak.trinn];   // store bokstaver også i moll, slik opptaksprøven skriver dem
    if (!f) return null;
    if (ak.septim && ak.trinn !== 4) return null;   // septimakkorder bare på dominanten (D⁷)
    return f + (ak.septim ? '⁷' : '') + BASS_TALL[inv || 0];
  }

  /* ---------- Stemmeføring på notelinjen ---------- */
  function trinnNr(n){ return n.oktav * 7 + n.b; }
  function iOktav(n, o){ return { b: n.b, f: n.f, oktav: o }; }
  /* Tett beliggenhet i G-nøkkel: basstonen nederst (C4 til A4), resten stablet rett over */
  function tett(ak, inv){
    var orden = ak.toner.slice(inv).concat(ak.toner.slice(0, inv)), res = [], forrige = null;
    orden.forEach(function(n, i){
      var x = iOktav(n, i === 0 ? 4 : forrige.oktav);
      if (i === 0) { while (trinnNr(x) > 33) x.oktav--; while (trinnNr(x) < 28) x.oktav++; }
      else while (trinnNr(x) <= trinnNr(forrige)) x.oktav++;
      res.push(x); forrige = x;
    });
    return res;
  }
  /* Firstemmig sats på to linjer [bass, tenor, alt, sopran], spredt beliggenhet.
     Treklang: grunntonen dobles (forminsket treklang og sekstakkorder: ikke ledetonen, så tersen eller kvinten dobles i stedet). */
  function hjelpelinjer(n, diskant){ var d = trinnNr(n); return diskant ? (d < 30 ? Math.ceil((30 - d) / 2) : d > 38 ? Math.ceil((d - 38) / 2) : 0) : (d < 18 ? Math.ceil((18 - d) / 2) : d > 26 ? Math.ceil((d - 26) / 2) : 0); }
  function midi(n){ return S.midi(n); }
  function sats(ak, inv, tilfeldig){
    var bass = ak.toner[inv], ovre;
    if (ak.septim) ovre = ak.toner.filter(function(n, i){ return i !== inv; });
    else if (inv === 1 && ak.type !== 'dim') ovre = [ak.toner[0], ak.toner[2], ak.toner[0]];   // sekstakkord: tersen er i bassen, grunntone og kvint over
    else ovre = [ak.toner[0], ak.toner[1], ak.toner[2]];
    var beste = null, bp = Infinity;
    [2, 3].forEach(function(oB){
      var b = iOktav(bass, oB); if (trinnNr(b) < 15 || trinnNr(b) > 24) return;   // D2 til F3
      /* Alle rekkefølger av de tre øvre tonene, i to oktaver */
      [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].forEach(function(p){
        [3, 4].forEach(function(oT){
          var ten = iOktav(ovre[p[0]], oT), alt = iOktav(ovre[p[1]], oT), sop = iOktav(ovre[p[2]], oT);
          while (trinnNr(alt) <= trinnNr(ten)) alt.oktav++;
          while (trinnNr(sop) <= trinnNr(alt)) sop.oktav++;
          var mb = midi(b), mt = midi(ten), ma = midi(alt), ms = midi(sop);
          if (mt <= mb || mt - mb > 24 || ma - mt > 12 || ms - ma > 12) return;
          if (trinnNr(ten) < 19 || trinnNr(ten) > 30 || trinnNr(alt) < 26 || trinnNr(sop) < 30 || trinnNr(sop) > 40) return;
          var poeng = hjelpelinjer(b, false) * 2 + hjelpelinjer(ten, false) * 2 + hjelpelinjer(alt, true) * 2 + hjelpelinjer(sop, true) * 2
            + Math.abs(trinnNr(sop) - 35) * 0.15 + (tilfeldig ? Math.random() * 1.5 : 0);
          if (poeng < bp) { bp = poeng; beste = [b, ten, alt, sop]; }
        });
      });
    });
    return beste;
  }
  /* Lyd: MIDI-tallene til tonene */
  function lyd(noter){ return noter.map(midi); }

  return { DUR: DUR, HMOLL: HMOLL, rot: rot, tonartNavn: tonartNavn, fortegn: fortegn, skala: skala, akkord: akkord, type: type,
           symbol: symbol, typeNavn: typeNavn, invNavn: invNavn, romertall: romertall, funksjon: funksjon, tett: tett, sats: sats, lyd: lyd,
           SUFFIKS: SUFFIKS, TYPE_NAVN: TYPE_NAVN, INV_NAVN: INV_NAVN, T: T };
})();
