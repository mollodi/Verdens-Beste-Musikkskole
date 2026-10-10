/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-FORJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – BITREKLANGER OG FORHOLDNINGER
   ---------------------------------------------------------------------
   Felles for leksjonen (bitreklanger.html) og quizen (quiz-akkordforlop.html):
   akkordforløp i firstemmig sats, navnene på hvert trinn i de ulike analysesystemene,
   forholdninger og gjennomgangs- og vekseltoner.
   Må lastes etter tonearter.js, skalaer.js og harmoni.js.

   Stemmeføringen er kontrollert maskinelt: ingen parallelle eller skjulte kvinter og oktaver i ytterstemmene,
   ingen stemmer som krysser, ingen forstørret sekund i en stemme, aldri doblet ledetone, ledetonen går opp,
   og i den skuffende kadensen (V–vi, i moll V–VI) dobles tersen i vi/VI, slik lærebøkene anbefaler.

   Funksjonsnavnene følger systemet i den nasjonale opptaksprøven (etter Sigvald Tveit):
   T, S og D, og bitreklangene med m (medianten, en ters over) og s (submedianten, en ters under).
   Samme store bokstaver brukes i dur og moll; tonearten avgjør om akkorden er dur eller moll.
   Se Lilja (2024), «Harmony Analysis Tasks in the Music Theory Admission Test for Higher Music Education in Norway».
   ===================================================================== */
window.VBM_FORLOP = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, S = window.VBM_SKALAER, H = window.VBM_HARMONI, T = K.T;

  /* [romertall, grunntone [trinn, halvtoner], type ('' dur, 'm' moll, 'dim' forminsket), stemmer [bass, tenor, alt, sopran]] */
  var FORLOP = [
    { id: 'd1', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[-3,-5],[2,4],[7,12]]], ['vi', [5, 9], 'm', [[-9,-15],[-2,-3],[2,4],[7,12]]], ['IV', [3, 5], '', [[-11,-19],[-2,-3],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]], ['I', [0, 0], '', [[-7,-12],[-3,-5],[2,4],[7,12]]]] },
    { id: 'd2', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[-3,-5],[2,4],[7,12]]], ['vi', [5, 9], 'm', [[-9,-15],[-2,-3],[2,4],[7,12]]], ['ii', [1, 2], 'm', [[-6,-10],[-2,-3],[3,5],[8,14]]], ['V', [4, 7], '', [[-3,-5],[-1,-1],[4,7],[8,14]]], ['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]]] },
    { id: 'd3', moll: false, akk: [['ii', [1, 2], 'm', [[-6,-10],[-2,-3],[3,5],[8,14]]], ['V', [4, 7], '', [[-3,-5],[-1,-1],[4,7],[8,14]]], ['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]]] },
    { id: 'd4', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[-3,-5],[2,4],[7,12]]], ['IV', [3, 5], '', [[-4,-7],[-2,-3],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]], ['vi', [5, 9], 'm', [[-9,-15],[-5,-8],[0,0],[7,12]]]] },
    { id: 'd5', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[-3,-5],[2,4],[7,12]]], ['IV', [3, 5], '', [[-4,-7],[-2,-3],[3,5],[7,12]]], ['vii', [6, 11], 'dim', [[-8,-13],[-4,-7],[3,5],[8,14]]], ['iii', [2, 4], 'm', [[-5,-8],[-3,-5],[2,4],[6,11]]], ['vi', [5, 9], 'm', [[-9,-15],[-2,-3],[2,4],[7,12]]], ['ii', [1, 2], 'm', [[-6,-10],[-2,-3],[3,5],[8,14]]], ['V', [4, 7], '', [[-3,-5],[-1,-1],[4,7],[8,14]]], ['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]]] },
    { id: 'd6', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]], ['V', [4, 7], '', [[-10,-17],[-1,-1],[4,7],[8,14]]], ['vi', [5, 9], 'm', [[-9,-15],[-2,-3],[2,4],[7,12]]], ['IV', [3, 5], '', [[-4,-7],[-2,-3],[3,5],[7,12]]]] },
    { id: 'd7', moll: false, akk: [['vi', [5, 9], 'm', [[-9,-15],[-2,-3],[2,4],[7,12]]], ['ii', [1, 2], 'm', [[-6,-10],[-2,-3],[3,5],[8,14]]], ['V', [4, 7], '', [[-3,-5],[-1,-1],[4,7],[8,14]]], ['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]]] },
    { id: 'd8', moll: false, akk: [['I', [0, 0], '', [[-7,-12],[0,0],[4,7],[9,16]]], ['iii', [2, 4], 'm', [[-5,-8],[-1,-1],[4,7],[9,16]]], ['IV', [3, 5], '', [[-4,-7],[-2,-3],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]]] },
    { id: 'm1', moll: true, akk: [['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]], ['iv', [3, 5], 'm', [[-4,-7],[-2,-4],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]], ['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]]] },
    { id: 'm2', moll: true, akk: [['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]], ['VI', [5, 8], '', [[-9,-16],[-2,-4],[2,3],[7,12]]], ['iv', [3, 5], 'm', [[-11,-19],[-2,-4],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]]] },
    { id: 'm3', moll: true, akk: [['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]], ['iv', [3, 5], 'm', [[-4,-7],[-2,-4],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]], ['VI', [5, 8], '', [[-9,-16],[-5,-9],[0,0],[7,12]]]] },
    { id: 'm4', moll: true, akk: [['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]], ['VI', [5, 8], '', [[-9,-16],[-2,-4],[2,3],[7,12]]], ['iv', [3, 5], 'm', [[-11,-19],[-2,-4],[3,5],[7,12]]], ['V', [4, 7], '', [[-10,-17],[-3,-5],[1,2],[6,11]]], ['i', [0, 0], 'm', [[-7,-12],[-3,-5],[2,3],[7,12]]]] }
  ];
  /* Navnet på hvert trinn i fire systemer.
     side: romertall med små bokstaver for moll og forminsket (engelskspråklige bøker og resten av nettstedet)
     prove: romertall slik opptaksprøven skriver dem, med store bokstaver (tonearten avgjør typen)
     fun: funksjon i opptaksprøven (Tveit), funAlt: andre navn i norske lærebøker
     Đ⁷ = dominantseptimakkord uten grunntone (D med strek), slik de fleste lærebøker og opptaksprøven tolker vii°
     par: parallellnavn (tysk og svensk tradisjon, brukt i Harmonilære på nettstedet) */
  var NAVN = {
    dur: [
      { side: 'I', prove: 'I', fun: 'T', funAlt: '', par: 'T' },
      { side: 'ii', prove: 'II', fun: 'Ss', funAlt: '', par: 'Sp' },
      { side: 'iii', prove: 'III', fun: 'Tm', funAlt: 'Ds', par: 'Dp' },
      { side: 'IV', prove: 'IV', fun: 'S', funAlt: '', par: 'S' },
      { side: 'V', prove: 'V', fun: 'D', funAlt: '', par: 'D' },
      { side: 'vi', prove: 'VI', fun: 'Ts', funAlt: 'Sm', par: 'Tp' },
      { side: 'vii°', prove: 'VII', fun: 'Đ⁷', funAlt: 'Dm', par: 'Đ⁷' }
    ],
    moll: [
      { side: 'i', prove: 'I', fun: 'T', funAlt: '', par: 't' },
      { side: 'ii°', prove: 'II', fun: 'Ss', funAlt: '', par: 's⁶' },
      { side: 'III', prove: 'III', fun: 'Tm', funAlt: 'Ds', par: 'tP' },
      { side: 'iv', prove: 'IV', fun: 'S', funAlt: '', par: 's' },
      { side: 'V', prove: 'V', fun: 'D', funAlt: '', par: 'D' },
      { side: 'VI', prove: 'VI', fun: 'Ts', funAlt: 'Sm', par: 'sP / tG' },
      { side: 'vii°', prove: 'VII', fun: 'Đ⁷', funAlt: 'Dm', par: 'Đ⁷' }
    ]
  };
  var TRINN = { I: 0, i: 0, ii: 1, 'ii°': 1, iii: 2, III: 2, IV: 3, iv: 3, V: 4, vi: 5, VI: 5, vii: 6, 'vii°': 6 };
  function navn(moll, rom){ return NAVN[moll ? 'moll' : 'dur'][TRINN[rom]]; }
  /* Teksten under en akkord: romertall (nettstedets skrivemåte) eller funksjon (opptaksprøven) */
  function merke(moll, rom, system){ var x = navn(moll, rom); return system === 'fun' ? T(x.fun) : x.side; }

  /* Bygg et forløp i toneart nr (0 = C ... 11 = H): { rot, fortegn, akkorder: [{ noter, tall, midi, sym }], midi } */
  function bygg(f, nr, system, medBegge){
    var objekter = f.akk.map(function(a){ return { rom: a[0], fun: '', rot: a[1], kval: a[2] === 'dim' ? '' : a[2], stemmer: a[3], dim: a[2] === 'dim' }; });
    var x = H.rekke(nr, f.moll, objekter, null, 'sym');
    x.akkorder.forEach(function(a, i){
      var o = objekter[i], grunn = S.toner(x.rot, [o.rot])[0];
      if (o.dim) a.sym = K.akkordTone(grunn) + 'dim';
      a.tall = medBegge ? [a.sym, merke(f.moll, o.rom, system)] : [merke(f.moll, o.rom, system)];
      a.rom = o.rom;
    });
    x.moll = f.moll;
    return x;
  }
  function analyse(f, system){ return f.akk.map(function(a){ return merke(f.moll, a[0], system); }).join(', '); }
  function lyd(x, steg){ var ut = []; x.akkorder.forEach(function(a){ ut.push(a.midi); for (var i = 1; i < (steg || 2); i++) ut.push([]); }); return ut; }

  /* ---------- Omvendinger i forløp (stemmeføringen fra harmoni.js, som Harmonilære bruker) ----------
     tall: [romertall, funksjon] for hver akkord */
  var OMVENDING = [
    { id: 'sekst', navn: ['I', 'I6', 'IV', 'V', 'I_hel'], rom: ['I', 'I⁶', 'IV', 'V', 'I'], fun: ['T', 'T₃', 'S', 'D', 'T'] },
    { id: 'gjennom', navn: ['I', 'V64g', 'I6'], rom: ['I', 'V⁶₄', 'I⁶'], fun: ['T', 'D₅', 'T₃'] },
    { id: 'kadens', navn: ['I', 'IV', 'I64', 'V', 'I_hel'], rom: ['I', 'IV', 'V⁶₄', 'V', 'I'], fun: ['T', 'S', 'D⁶₄', 'D', 'T'] }
  ];
  function byggOmvending(o, nr, system){
    var x = H.rekke(nr, false, o.navn, null, 'sym');
    x.akkorder.forEach(function(a, i){ a.tall = [a.sym, system === 'fun' ? o.fun[i] : o.rom[i]]; });
    return x;
  }

  /* ---------- Forholdninger i C, som trinn fra grunntonen [bokstavsteg, halvtoner] ----------
     tre akkorder: forberedelse, dissonans (forholdningen) og oppløsning */
  var FORHOLDNING = [
    { id: '43', navn: '4–3', tall: [['I'], ['V', '4'], ['V', '3']],
      st: [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-10,-17],[-3,-5],[1,2],[7,12]], [[-10,-17],[-3,-5],[1,2],[6,11]]] },
    { id: '98', navn: '9–8', tall: [['V'], ['I', '9'], ['I', '8']],
      st: [[[-10,-17],[-1,-1],[4,7],[8,14]], [[-7,-12],[-3,-5],[2,4],[8,14]], [[-7,-12],[-3,-5],[2,4],[7,12]]] },
    { id: '76', navn: '7–6', tall: [['V'], ['I⁶', '7'], ['I⁶', '6']],
      st: [[[-10,-17],[-3,-5],[-1,-1],[8,14]], [[-5,-8],[-3,-5],[0,0],[8,14]], [[-5,-8],[-3,-5],[0,0],[7,12]]] },
    { id: '23', navn: '2–3', tall: [['I'], ['2'], ['V⁶', '3']],
      st: [[[-7,-12],[-3,-5],[2,4],[4,7]], [[-7,-12],[-3,-5],[1,2],[4,7]], [[-8,-13],[-3,-5],[1,2],[4,7]]] }
  ];
  function byggForholdning(fh, nr){
    var rot = H.tonikk(nr, false), fortegn = null, akk = fh.st.map(function(st, i){
      var noter = S.toner({ b: rot.b, f: rot.f, oktav: 4 }, st);
      return { noter: noter, tall: fh.tall[i], midi: noter.map(S.midi) };
    });
    return { rot: rot, akkorder: akk };
  }

  return { FORLOP: FORLOP, NAVN: NAVN, navn: navn, merke: merke, bygg: bygg, analyse: analyse, lyd: lyd,
           OMVENDING: OMVENDING, byggOmvending: byggOmvending, FORHOLDNING: FORHOLDNING, byggForholdning: byggForholdning, T: T };
})();
