/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-TRNS. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – TRANSPONERING
   ---------------------------------------------------------------------
   Felles for leksjonen (transponering.html) og quizen (quiz-transponering.html):
   intervallene, melodiene, akkordrekkene og de transponerende instrumentene.
   Bruker tonearter.js, intervall.js, skalaer.js og harmoni.js, så de må lastes først:
     <script src="tonearter.js"></script>
     <script src="intervall.js"></script>
     <script src="skalaer.js"></script>
     <script src="harmoni.js"></script>
     <script src="transponering.js"></script>

   En tone er { b: bokstav (0 = C ... 6 = H), f: fortegn (-1 b, 0, 1 kryss), oktav }.
   Et intervall er { b: bokstavsteg, h: halvtoner }, så stavemåten alltid blir riktig:
   en stor ters over D er Fiss, ikke Gess.
   ===================================================================== */
window.VBM_TRANSPONERING = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, S = window.VBM_SKALAER, H = window.VBM_HARMONI, T = K.T;

  /* ---------- Intervallene ----------
     navn er nøkkelen i ordbøkene. «opp» og «ned» står som egne nøkler («en stor ters opp»),
     fordi polsk bøyer intervallnavnet («o tercję wielką w górę»). */
  var INTERVALLER = [
    { id: 'l2', navn: 'liten sekund', b: 1, h: 1 },
    { id: 's2', navn: 'stor sekund', b: 1, h: 2 },
    { id: 'l3', navn: 'liten ters', b: 2, h: 3 },
    { id: 's3', navn: 'stor ters', b: 2, h: 4 },
    { id: 'r4', navn: 'ren kvart', b: 3, h: 5 },
    { id: 'f4', navn: 'forstørret kvart', b: 3, h: 6 },
    { id: 'm5', navn: 'forminsket kvint', b: 4, h: 6 },
    { id: 'r5', navn: 'ren kvint', b: 4, h: 7 },
    { id: 'l6', navn: 'liten sekst', b: 5, h: 8 },
    { id: 's6', navn: 'stor sekst', b: 5, h: 9 },
    { id: 'l7', navn: 'liten septim', b: 6, h: 10 },
    { id: 's7', navn: 'stor septim', b: 6, h: 11 },
    { id: 'r8', navn: 'ren oktav', b: 7, h: 12 }
  ];
  function intervall(id){ for (var i = 0; i < INTERVALLER.length; i++) if (INTERVALLER[i].id === id) return INTERVALLER[i]; return null; }
  /* «en stor ters opp», «en ren kvint ned» (oktaven: «en oktav opp») */
  function frase(iv, opp){ return T((iv.id === 'r8' ? 'en oktav' : 'en ' + iv.navn) + (opp ? ' opp' : ' ned')); }

  /* ---------- Flytt en tone ----------
     Bokstaven flyttes iv.b steg, og fortegnet blir det som gir iv.h halvtoner (felles regel i intervall.js). */
  var I = window.VBM_INTERVALL;
  function flytt(n, iv, opp){ return I.flytt(n, iv, opp); }
  function flyttListe(liste, iv, opp){ return liste.map(function(n){ return flytt(n, iv, opp); }); }
  /* Halvtoner og bokstavsteg mellom to toner (b over a), som et intervall */
  function mellom(a, b){ return I.mellom(a, b); }
  function likeToner(a, b){ return a.b === b.b && a.f === b.f && a.oktav === b.oktav; }

  /* ---------- Melodiene ----------
     Trinn fra grunntonen [bokstavsteg, halvtoner], som skalaene i skalaer.js. */
  var MELODIER = {
    /* «Lisa gikk til skolen», tradisjonell barnesang (samme melodi som «Hänschen klein» og «Lightly Row») */
    lisa: [[4,7],[2,4],[2,4],[3,5],[1,2],[1,2],[0,0],[1,2],[2,4],[3,5],[4,7],[4,7],[4,7]],
    /* Første frase, brukt i quizen */
    motiv: [[4,7],[2,4],[2,4],[3,5],[1,2],[1,2],[0,0]],
    /* En liten øvelsesmelodi med to tilfeldige fortegn: en hevet 4. (Fiss i C) og en senket 7. (B i C) */
    ovelse: [[2,4],[4,7],[3,6],[4,7],[5,9],[6,10],[5,9],[4,7],[2,4],[1,2],[0,0]]
  };
  /* Hjelpelinjer i G-nøkkel: noter under E4 (d = 30) eller over F5 (d = 38) */
  function hjelpelinjer(liste){
    return liste.reduce(function(sum, n){ var d = n.oktav * 7 + n.b; return sum + (d < 30 ? Math.ceil((30 - d) / 2) : d > 38 ? Math.ceil((d - 38) / 2) : 0); }, 0);
  }
  /* Melodien i en toneart, i oktaven som gir færrest hjelpelinjer */
  function melodi(rot, trinn){
    var beste = null, bp = Infinity;
    [3, 4, 5].forEach(function(o){
      var liste = S.toner({ b: rot.b, f: rot.f, oktav: o }, trinn), p = hjelpelinjer(liste);
      if (p < bp) { bp = p; beste = liste; }
    });
    return beste;
  }
  /* Grunntonen for hver av de 12 tonehøydene, med færrest fortegn (C, Dess, D, Ess, E, F, Fiss, G, Ass, A, B, H) */
  function durRot(nr){ return S.durRot(nr); }
  function durNr(rot){ return ((S.midi({ b: rot.b, f: rot.f, oktav: 4 }) % 12) + 12) % 12; }

  /* ---------- Akkordrekkene ----------
     Firstemmig sats i C [bass, tenor, alt, sopran], kontrollert maskinelt: ingen parallelle
     kvinter eller oktaver, ingen skjulte oktaver eller kvinter i ytterstemmene, ingen stemmer som krysser,
     aldri doblet ters i durakkordene (aldri doblet ledetone), og ledetonen i sopranen går opp til grunntonen.
     Stemmene ligger slik at det blir færrest mulig hjelpelinjer i alle tolv tonearter. */
  var GRUNN_AKK = { I: [[0,0], ''], ii: [[1,2], 'm'], iii: [[2,4], 'm'], IV: [[3,5], ''], V: [[4,7], ''], vi: [[5,9], 'm'] };
  function rekkeData(id, rom, stemmer){
    return { id: id, rom: rom, akkorder: rom.map(function(r, i){ return { rom: r, fun: '', rot: GRUNN_AKK[r][0], kval: GRUNN_AKK[r][1], stemmer: stemmer[i] }; }) };
  }
  var REKKER = [
    rekkeData('p1', ['I', 'vi', 'IV', 'V'], [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-9,-15],[-2,-3],[2,4],[7,12]], [[-4,-7],[-2,-3],[3,5],[7,12]], [[-10,-17],[-3,-5],[1,2],[6,11]]]),
    rekkeData('p2', ['I', 'IV', 'V', 'I'], [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-4,-7],[-2,-3],[3,5],[7,12]], [[-10,-17],[-3,-5],[1,2],[6,11]], [[-7,-12],[-3,-5],[2,4],[7,12]]]),
    rekkeData('p3', ['I', 'V', 'vi', 'IV'], [[[-7,-12],[-5,-8],[0,0],[4,7]], [[-10,-17],[-6,-10],[-1,-1],[4,7]], [[-9,-15],[-7,-12],[0,0],[2,4]], [[-11,-19],[-7,-12],[-2,-3],[3,5]]]),
    rekkeData('p4', ['ii', 'V', 'I'], [[[-6,-10],[-4,-7],[1,2],[5,9]], [[-10,-17],[-3,-5],[1,2],[6,11]], [[-7,-12],[-3,-5],[2,4],[7,12]]]),
    rekkeData('p5', ['I', 'vi', 'ii', 'V'], [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-9,-15],[-2,-3],[2,4],[7,12]], [[-6,-10],[-2,-3],[3,5],[8,14]], [[-3,-5],[-1,-1],[4,7],[8,14]]]),
    rekkeData('p6', ['vi', 'IV', 'I', 'V'], [[[-9,-15],[-2,-3],[2,4],[7,12]], [[-4,-7],[-2,-3],[3,5],[7,12]], [[-7,-12],[-3,-5],[2,4],[7,12]], [[-10,-17],[-3,-5],[1,2],[6,11]]]),
    rekkeData('p7', ['I', 'iii', 'IV', 'V'], [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-5,-8],[-3,-5],[2,4],[6,11]], [[-11,-19],[-4,-7],[0,0],[5,9]], [[-10,-17],[-6,-10],[-1,-1],[4,7]]]),
    rekkeData('p8', ['I', 'IV', 'vi', 'V'], [[[-7,-12],[-3,-5],[2,4],[7,12]], [[-4,-7],[-2,-3],[3,5],[7,12]], [[-9,-15],[-2,-3],[2,4],[7,12]], [[-10,-17],[-1,-1],[4,7],[8,14]]])
  ];
  /* Rekken i toneart nr (0 = C ... 11 = H): akkordsymbol og romertall under hver akkord. */
  function rekke(r, nr, medRom){
    var x = H.rekke(nr, false, r.akkorder, null, 'sym');
    x.akkorder.forEach(function(a, i){ a.tall = medRom ? [a.sym, r.rom[i]] : [a.sym]; });
    x.symboler = x.akkorder.map(function(a){ return a.sym; });
    return x;
  }
  /* Lyd: hver akkord klinger to steg (som i Harmonilære) */
  function rekkeLyd(x){ var steg = []; x.akkorder.forEach(function(a){ steg.push(a.midi); steg.push([]); }); return steg; }

  /* ---------- Kapo ----------
     Hvert bånd hever en halvtone. Tonearter opp til G spilles med C-grep, de andre med G-grep
     (kapo høyere enn 7. bånd er lite brukt). */
  function kapo(nr){ return nr <= 7 ? { grep: 0, baand: nr } : { grep: 7, baand: nr - 7 }; }

  /* ---------- Transponerende instrumenter ----------
     iv = hvor mye lavere instrumentet klinger enn det som står skrevet. */
  var INSTRUMENTER = [
    { id: 'klarinett', navn: 'Klarinett i B', best: 'klarinetten i B', iv: { b: 1, h: 2 }, forskjell: 'en stor sekund lavere' },
    { id: 'trompet', navn: 'Trompet i B', best: 'trompeten i B', iv: { b: 1, h: 2 }, forskjell: 'en stor sekund lavere' },
    { id: 'altsax', navn: 'Altsaksofon i Ess', best: 'altsaksofonen i Ess', iv: { b: 5, h: 9 }, forskjell: 'en stor sekst lavere' },
    { id: 'horn', navn: 'Valthorn i F', best: 'valthornet i F', iv: { b: 4, h: 7 }, forskjell: 'en ren kvint lavere' },
    { id: 'gitar', navn: 'Gitar', best: 'gitaren', iv: { b: 7, h: 12 }, forskjell: 'en oktav lavere' }
  ];
  function instrument(id){ for (var i = 0; i < INSTRUMENTER.length; i++) if (INSTRUMENTER[i].id === id) return INSTRUMENTER[i]; return null; }
  function klinger(skrevet, ins){ return flytt(skrevet, ins.iv, false); }
  function skrevet(klingende, ins){ return flytt(klingende, ins.iv, true); }
  /* Stor forbokstav først i en setning («Klarinetten i B leser ...») */
  function stor(t){ return String(t).replace(/^./, function(c){ return c.toUpperCase(); }); }

  return { INTERVALLER: INTERVALLER, intervall: intervall, frase: frase, flytt: flytt, flyttListe: flyttListe, mellom: mellom, likeToner: likeToner,
           MELODIER: MELODIER, melodi: melodi, hjelpelinjer: hjelpelinjer, durRot: durRot, durNr: durNr,
           REKKER: REKKER, rekke: rekke, rekkeLyd: rekkeLyd, kapo: kapo,
           INSTRUMENTER: INSTRUMENTER, instrument: instrument, klinger: klinger, skrevet: skrevet, stor: stor, T: T };
})();
