/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-HRMN. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – HARMONI
   ---------------------------------------------------------------------
   Firstemmige akkorder (bass, tenor, alt, sopran) for funksjoner, kadenser,
   kvartsekstakkorder, beliggenhet og skråstrekakkorder. Alt er skrevet i C
   som [bokstavsteg, halvtoner] fra grunntonen (C4), og flyttes til andre
   tonearter med riktig stavemåte. Stemmeføringen er kontrollert: ingen
   parallelle kvinter eller oktaver, ledetonen går opp og septimen ned.
   Bruker tonearter.js og skalaer.js, så de må lastes først.
   ===================================================================== */
window.VBM_HARMONI = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, S = window.VBM_SKALAER;

  /* ---------- Akkordene i C ----------
     stemmer: [bass, tenor, alt, sopran]; rot: akkordens grunntone; kval: '' dur, 'm' moll, '7' dominantseptim */
  function a(rom, fun, rot, kval, stemmer){ return { rom: rom, fun: fun, rot: rot, kval: kval, stemmer: stemmer }; }
  var DUR = {
    I:     a('I', 'T', [0,0], '',   [[-7,-12], [-3,-5], [2,4], [7,12]]),
    I_hel: a('I', 'T', [0,0], '',   [[-7,-12], [0,0],   [2,4], [7,12]]),
    IV:    a('IV', 'S', [3,5], '',  [[-4,-7],  [-2,-3], [3,5], [7,12]]),
    V:     a('V', 'D', [4,7], '',   [[-10,-17], [-3,-5], [1,2], [6,11]]),
    V7:    a('V7', 'D', [4,7], '7', [[-10,-17], [-1,-1], [3,5], [8,14]]),
    vi_s:  a('vi', 'Tp', [5,9], 'm', [[-9,-15], [-5,-8], [0,0], [7,12]]),
    vi:    a('vi', 'Tp', [5,9], 'm', [[-9,-15], [-5,-8], [0,0], [5,9]]),
    ii:    a('ii', 'Sp', [1,2], 'm', [[-6,-10], [-2,-3], [3,5], [8,14]]),
    iii:   a('iii', 'Dp', [2,4], 'm', [[-5,-8], [-1,-1], [4,7], [9,16]]),
    I64:   a('I', 'T', [0,0], '',   [[-10,-17], [-3,-5], [2,4], [7,12]]),
    /* Kadensens kvartsekstakkord: tonene i I, men skrevet V⁶₄ og D, slik opptaksprøven og mange nyere bøker gjør */
    K64:   a('V', 'D', [0,0], '',   [[-10,-17], [-3,-5], [2,4], [7,12]]),
    V64g:  a('V', 'D', [4,7], '',   [[-6,-10], [-3,-5], [1,2], [6,11]]),
    I6:    a('I', 'T', [0,0], '',   [[-5,-8],  [-3,-5], [0,0], [7,12]]),
    IV64:  a('IV', 'S', [3,5], '',  [[-7,-12], [-2,-3], [3,5], [7,12]]),
    Ikv:   a('I', 'T', [0,0], '',   [[-7,-12], [0,0],   [2,4], [4,7]]),
    Iters: a('I', 'T', [0,0], '',   [[-7,-12], [0,0],   [4,7], [9,16]]),
    CH:    a('I', 'T', [0,0], '',   [[-8,-13], [-3,-5], [2,4], [7,12]]),
    Am:    a('vi', 'Tp', [5,9], 'm', [[-9,-15], [-2,-3], [2,4], [7,12]]),
    AmG:   a('vi', 'Tp', [5,9], 'm', [[-10,-17], [-2,-3], [2,4], [7,12]]),
    F:     a('IV', 'S', [3,5], '',  [[-11,-19], [-2,-3], [3,5], [7,12]]),
    CD:    a('I', 'T', [0,0], '',   [[-6,-10], [-3,-5], [2,4], [7,12]]),
    GC:    a('V', 'D', [4,7], '',   [[-7,-12], [-1,-1], [1,2], [4,7]]),
    I_slutt: a('I', 'T', [0,0], '', [[-7,-12], [0,0],   [2,4], [7,12]])
  };
  /* Moll: tersen i tonika og subdominant og VI er senket; dominanten har ledetonen (harmonisk moll). */
  function moll(x, endr){ var y = JSON.parse(JSON.stringify(x)); endr(y); return y; }
  var MOLL = {
    I:     moll(DUR.I, function(y){ y.rom = 'i'; y.fun = 't'; y.kval = 'm'; y.stemmer[2] = [2,3]; }),
    I_hel: moll(DUR.I_hel, function(y){ y.rom = 'i'; y.fun = 't'; y.kval = 'm'; y.stemmer[2] = [2,3]; }),
    IV:    moll(DUR.IV, function(y){ y.rom = 'iv'; y.fun = 's'; y.kval = 'm'; y.stemmer[1] = [-2,-4]; }),
    V:     DUR.V,
    V7:    DUR.V7,
    vi_s:  moll(DUR.vi_s, function(y){ y.rom = 'VI'; y.fun = 'sP'; y.rot = [5,8]; y.kval = ''; y.stemmer[0] = [-9,-16]; y.stemmer[1] = [-5,-9]; }),
    I64:   moll(DUR.I64, function(y){ y.rom = 'i'; y.fun = 't'; y.kval = 'm'; y.stemmer[2] = [2,3]; }),
    K64:   moll(DUR.K64, function(y){ y.kval = 'm'; y.stemmer[2] = [2,3]; })
  };

  /* ---------- Rekkene ---------- */
  var KADENSER = [
    { id: 'hel',   navn: 'Hel kadens',       eng: 'authentic cadence', rekke: ['I', 'IV', 'V7', 'I_hel'] },
    { id: 'plagal', navn: 'Plagal kadens',   eng: 'plagal cadence',    rekke: ['I', 'IV', 'I'] },
    { id: 'halv',  navn: 'Halvkadens',       eng: 'half cadence',      rekke: ['I', 'IV', 'V'] },
    { id: 'skuff', navn: 'Skuffende kadens', eng: 'deceptive cadence', rekke: ['I', 'IV', 'V', 'vi_s'] }
  ];
  var KVARTSEKST = [
    { id: 'kadens', navn: 'Kadensens kvartsekstakkord', rekke: ['I', 'IV', 'K64', 'V', 'I'], tall: [null, null, ['6', '4'], null, null] },
    { id: 'gjennom', navn: 'Gjennomgangskvartsekstakkord', rekke: ['I', 'V64g', 'I6'], tall: [null, ['6', '4'], ['6']] },
    { id: 'ligg', navn: 'Liggende kvartsekstakkord (orgelpunkt)', rekke: ['I', 'IV64', 'I'], tall: [null, ['6', '4'], null] }
  ];
  var BELIGGENHET = ['I', 'Iters', 'Ikv'];   // oktav-, ters- og kvintbeliggenhet
  var LEIE = ['Ikv', 'I'];                   // tett og åpen leie
  var SKRASTREK = [
    { id: 'trinnbass', rekke: ['I', 'CH', 'Am', 'AmG', 'F'] },
    { id: 'pedal', rekke: ['I', 'IV64', 'GC', 'Ikv'] },
    { id: 'cd', rekke: ['CD'] }
  ];
  var FUNKSJONER = [['I', 'IV', 'V'], ['vi', 'ii', 'iii']];

  /* ---------- Toneart og oktav ----------
     Hver tonehøyde (0–11) får stavemåten med færrest fortegn, og grunntonen legges
     i den oktaven som gir færrest hjelpelinjer. */
  var DUR_SKALA = { trinn: [[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,11],[7,12]] };
  var MOLL_SKALA = { trinn: [[0,0],[1,2],[2,3],[3,5],[4,7],[5,8],[6,10],[7,12]] };
  function tonikk(nr, erMoll){ return S.rotFor(nr, erMoll ? MOLL_SKALA : DUR_SKALA); }
  function noterFor(rot, akk){ return S.toner(rot, akk.stemmer); }
  function hjelpelinjer(rot, liste){
    var n = 0;
    liste.forEach(function(akk){ noterFor(rot, akk).forEach(function(t, v){
      var d = t.oktav * 7 + t.b;
      if (v >= 2) { if (d < 30) n += Math.ceil((30 - d) / 2); if (d > 38) n += Math.ceil((d - 38) / 2); }
      else { if (d < 18) n += Math.ceil((18 - d) / 2); if (d > 26) n += Math.ceil((d - 26) / 2); }
    }); });
    return n;
  }
  function plasser(r, liste){
    var a4 = { b: r.b, f: r.f, oktav: 4 }, a3 = { b: r.b, f: r.f, oktav: 3 };
    return hjelpelinjer(a3, liste) < hjelpelinjer(a4, liste) ? a3 : a4;
  }
  function fortegn(r, erMoll){
    for (var i = 0; i < K.ALLE.length; i++) {
      var x = K.ALLE[i], t = erMoll ? x.moll : x.dur;
      if (t.b === r.b && t.f === r.f) return x.fortegn;
    }
    return 0;
  }
  function symbol(rot, akk){
    var r = S.toner(rot, [akk.rot])[0], bass = noterFor(rot, akk)[0];
    var navn = K.tone(r) + (akk.kval === 'm' ? 'm' : akk.kval === '7' ? '7' : '');
    return bass.b === r.b && bass.f === r.f ? navn : navn + '/' + K.tone(bass);
  }
  /* Bygger en rekke: [{ noter, tall, midi, sym, akk }] i tonearten nr (0 = C).
     navn er navnene over (['I', 'IV', 'V7']) eller egne akkorder i samme form (transponering.js bruker det). */
  function rekke(nr, erMoll, navn, tall, merk){
    var bok = erMoll ? MOLL : DUR, liste = navn.map(function(n){ return typeof n === 'string' ? (bok[n] || DUR[n]) : n; });
    var rot = plasser(tonikk(nr, erMoll), liste);
    return { rot: rot, fortegn: fortegn(rot, erMoll), akkorder: liste.map(function(akk, i){
      var noter = noterFor(rot, akk);
      var t = merk === 'sym' ? [symbol(rot, akk)] : merk === 'funksjon' ? [akk.rom, akk.fun] : [akk.rom].concat(tall && tall[i] ? tall[i] : []);
      return { noter: noter, tall: t, midi: noter.map(S.midi), sym: symbol(rot, akk), akk: akk };
    }) };
  }

  return { DUR: DUR, MOLL: MOLL, KADENSER: KADENSER, KVARTSEKST: KVARTSEKST, BELIGGENHET: BELIGGENHET, LEIE: LEIE,
           SKRASTREK: SKRASTREK, FUNKSJONER: FUNKSJONER, rekke: rekke, tonikk: tonikk, symbol: symbol };
})();
