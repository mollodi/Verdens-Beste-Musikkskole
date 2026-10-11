/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-NOTJ. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – NOTASJONSTEGN OG FORM
   ---------------------------------------------------------------------
   Felles for leksjonen (notasjonstegn.html) og quizen (quiz-notasjonstegn.html):
   tegnene tegnet som ekte notasjon (reprisetegn, volta, segno, coda, fermat, artikulasjon,
   dynamikk), veikart for gjentakelser og hopp, og tempo- og foredragsbetegnelsene.
   Navn og forklaringer står på norsk, engelsk og polsk her, så de bare står ett sted.
   Må lastes etter skalaer.js (som legger inn G-nøkkelen #gclef).
   ===================================================================== */
window.VBM_NOTASJON = (function(){
  'use strict';
  function sprak(){ var s = window.VBM_SPRAK || 'no'; return s === 'en' || s === 'pl' ? s : 'no'; }
  function tr(o){ return o[sprak()] || o.no; }

  /* ---------- Notelinjen: samme mål som resten av nettstedet ---------- */
  var L = [88, 101, 114, 127, 140];          // linjene, nederst E4 (y = 140)
  function y(d){ return 140 - (d - 30) * 6.5; }   // d = oktav * 7 + bokstav (E4 = 30)
  function linjer(x1, x2){ return L.map(function(l){ return '<line x1="' + x1 + '" y1="' + l + '" x2="' + x2 + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>'; }).join(''); }
  /* G-nøkkelen og fortegnene ligger som symboler i siden; skalaer.js legger dem inn første gang en notelinje tegnes */
  var defsKlar = false;
  function sikreDefs(){ if (defsKlar) return; defsKlar = true; try { if (window.VBM_SKALAER && !document.getElementById('gclef')) window.VBM_SKALAER.enStav('G', [{ b: 0, f: 0, oktav: 5 }], {}); } catch(e){} }
  function gnokkel(x){ sikreDefs(); return '<use href="#gclef" transform="translate(' + x + ' 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>'; }
  function strek(x, tykk){ return '<rect x="' + (tykk ? x - 2.5 : x - 0.7) + '" y="88" width="' + (tykk ? 5 : 1.4) + '" height="52" fill="currentColor"/>'; }
  function prikker(x){ return '<circle cx="' + x + '" cy="107.5" r="2.4" fill="currentColor"/><circle cx="' + x + '" cy="120.5" r="2.4" fill="currentColor"/>'; }
  /* Firedelsnote med hals (opp når noten står lavt, ned når den står høyt) */
  function firedel(x, d, attr){
    var yy = y(d), opp = d < 34, s = '<ellipse ' + (attr || '') + ' cx="' + x + '" cy="' + yy + '" rx="7.2" ry="5.6" fill="currentColor" transform="rotate(-18 ' + x + ' ' + yy + ')"/>';
    s += opp ? '<line x1="' + (x + 6.6) + '" y1="' + (yy - 1) + '" x2="' + (x + 6.6) + '" y2="' + (yy - 40) + '" stroke="currentColor" stroke-width="1.4"/>'
             : '<line x1="' + (x - 6.6) + '" y1="' + (yy + 1) + '" x2="' + (x - 6.6) + '" y2="' + (yy + 40) + '" stroke="currentColor" stroke-width="1.4"/>';
    return s;
  }
  function helnote(x, d, attr){ var yy = y(d); return '<ellipse ' + (attr || '') + ' cx="' + x + '" cy="' + yy + '" rx="7.6" ry="5.6" fill="none" stroke="currentColor" stroke-width="2.4" transform="rotate(-25 ' + x + ' ' + yy + ')"/>'; }
  function tekst(x, yy, t, kursiv, str){ return '<text x="' + x + '" y="' + yy + '" text-anchor="middle" font-family="Charter, Georgia, serif" font-size="' + (str || 15) + '"' + (kursiv ? ' font-style="italic"' : '') + ' font-weight="700" fill="currentColor">' + t + '</text>'; }

  /* ---------- Tegnene ---------- */
  function segno(x, yy){
    return '<path d="M' + (x + 6) + ' ' + (yy - 9) + ' C' + (x + 1) + ' ' + (yy - 14) + ' ' + (x - 9) + ' ' + (yy - 10) + ' ' + (x - 5) + ' ' + (yy - 3)
      + ' C' + (x - 2) + ' ' + (yy + 2) + ' ' + (x + 8) + ' ' + (yy + 2) + ' ' + (x + 5) + ' ' + (yy + 9) + ' C' + (x + 2) + ' ' + (yy + 14) + ' ' + (x - 7) + ' ' + (yy + 12) + ' ' + (x - 7) + ' ' + (yy + 8)
      + '" fill="none" stroke="currentColor" stroke-width="2.6"/><line x1="' + (x - 10) + '" y1="' + (yy + 12) + '" x2="' + (x + 10) + '" y2="' + (yy - 12) + '" stroke="currentColor" stroke-width="1.8"/>'
      + '<circle cx="' + (x - 9) + '" cy="' + (yy - 2) + '" r="2" fill="currentColor"/><circle cx="' + (x + 9) + '" cy="' + (yy + 2) + '" r="2" fill="currentColor"/>';
  }
  function coda(x, yy){
    return '<ellipse cx="' + x + '" cy="' + yy + '" rx="7" ry="9" fill="none" stroke="currentColor" stroke-width="2.2"/>'
      + '<line x1="' + x + '" y1="' + (yy - 14) + '" x2="' + x + '" y2="' + (yy + 14) + '" stroke="currentColor" stroke-width="1.8"/>'
      + '<line x1="' + (x - 12) + '" y1="' + yy + '" x2="' + (x + 12) + '" y2="' + yy + '" stroke="currentColor" stroke-width="1.8"/>';
  }
  function fermat(x, yy){ return '<path d="M' + (x - 11) + ' ' + yy + ' A11 11 0 0 1 ' + (x + 11) + ' ' + yy + '" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="' + x + '" cy="' + (yy - 3) + '" r="2.2" fill="currentColor"/>'; }
  function hairpin(x1, x2, yy, opp){ var a = opp ? x1 : x2, b = opp ? x2 : x1; return '<line x1="' + a + '" y1="' + yy + '" x2="' + b + '" y2="' + (yy - 7) + '" stroke="currentColor" stroke-width="1.6"/><line x1="' + a + '" y1="' + yy + '" x2="' + b + '" y2="' + (yy + 7) + '" stroke="currentColor" stroke-width="1.6"/>'; }
  function svg(b, h, innhold, merke, y0, fast){ return '<svg viewBox="0 ' + (y0 == null ? 40 : y0) + ' ' + b + ' ' + h + '" role="img" aria-label="' + merke + '"'
    + (fast ? ' class="vbm-fast-stav" style="width: ' + Math.round(b * 1.15) + 'px; max-width: 100%;"' : '') + '>' + innhold + '</svg>'; }

  /* Et lite notebilde for hvert tegn: notelinje, en eller to noter og tegnet */
  var TEGN = {
    reprise:  function(m){ return svg(150, 120, linjer(4, 146) + strek(10, true) + strek(16) + prikker(23) + firedel(52, 32) + firedel(84, 34) + prikker(108) + strek(115) + strek(121, true), m); },
    volta:    function(m){ return svg(200, 120, linjer(4, 196) + '<path d="M10 72 V62 H92" fill="none" stroke="currentColor" stroke-width="1.6"/>' + tekst(22, 77, '1.', false, 13) + firedel(40, 32) + firedel(70, 30) + prikker(88) + strek(94) + strek(100, true)
                                   + '<path d="M108 72 V62 H190" fill="none" stroke="currentColor" stroke-width="1.6"/>' + tekst(120, 77, '2.', false, 13) + helnote(150, 28) + strek(188) + strek(194, true), m); },
    segno:    function(m){ return svg(90, 90, segno(45, 85), m, 60); },
    coda:     function(m){ return svg(90, 90, coda(45, 85), m, 60); },
    fermat:   function(m){ return svg(100, 120, linjer(4, 96) + fermat(50, 70) + firedel(50, 32), m); },
    staccato: function(m){ return svg(100, 120, linjer(4, 96) + firedel(50, 32) + '<circle cx="50" cy="' + (y(32) + 14) + '" r="2.4" fill="currentColor"/>', m); },
    tenuto:   function(m){ return svg(100, 120, linjer(4, 96) + firedel(50, 32) + '<line x1="42" y1="' + (y(32) + 14) + '" x2="58" y2="' + (y(32) + 14) + '" stroke="currentColor" stroke-width="2.2"/>', m); },
    aksent:   function(m){ return svg(100, 120, linjer(4, 96) + firedel(50, 32) + '<polyline points="42,' + (y(32) + 10) + ' 58,' + (y(32) + 15) + ' 42,' + (y(32) + 20) + '" fill="none" stroke="currentColor" stroke-width="2"/>', m); },
    marcato:  function(m){ return svg(100, 120, linjer(4, 96) + firedel(50, 36) + '<polygon points="43,78 50,62 57,78 53,78 50,70 47,78" fill="currentColor"/>', m); },
    legato:   function(m){ return svg(150, 120, linjer(4, 146) + firedel(40, 30) + firedel(75, 32) + firedel(110, 34) + '<path d="M38 ' + (y(30) + 10) + ' Q75 ' + (y(30) + 32) + ' 112 ' + (y(34) + 10) + '" fill="none" stroke="currentColor" stroke-width="2"/>', m); },
    cresc:    function(m){ return svg(150, 60, hairpin(15, 135, 90, true), m, 60); },
    dim:      function(m){ return svg(150, 60, hairpin(15, 135, 90, false), m, 60); },
    dyn:      function(m, t){ return svg(90, 60, tekst(45, 98, t, true, 30), m, 60); }
  };

  /* ---------- Data: tegn, dynamikk og betegnelser (nivå 1 = grunnleggende, 2 = avansert) ---------- */
  var SYMBOLER = [
    { id: 'reprise', niva: 1, navn: { no: 'Reprisetegn', en: 'Repeat signs', pl: 'Znaki repetycji' }, betyr: { no: 'Spill det som står mellom tegnene to ganger.', en: 'Play what is between the signs twice.', pl: 'Zagraj to, co jest między znakami, dwa razy.' } },
    { id: 'volta', niva: 1, navn: { no: 'Volta (1. og 2. gang)', en: 'First and second endings', pl: 'Volta (1. i 2. raz)' }, betyr: { no: 'Første gang spilles takten under «1.», andre gang hopper du til «2.».', en: 'The first time you play the bar under “1.”, the second time you skip to “2.”.', pl: 'Za pierwszym razem grasz takt pod „1.”, za drugim przeskakujesz do „2.”.' } },
    { id: 'segno', niva: 2, navn: { no: 'Segno', en: 'Segno', pl: 'Segno' }, betyr: { no: 'Tegnet D.S. (dal segno) sender deg tilbake hit.', en: 'D.S. (dal segno) sends you back here.', pl: 'D.S. (dal segno) odsyła cię tutaj.' } },
    { id: 'coda', niva: 2, navn: { no: 'Coda', en: 'Coda', pl: 'Coda' }, betyr: { no: 'Avslutningen. Ved «To Coda» hopper du hit.', en: 'The ending. At “To Coda” you jump here.', pl: 'Zakończenie. Przy „To Coda” przeskakujesz tutaj.' } },
    { id: 'fermat', niva: 1, navn: { no: 'Fermat', en: 'Fermata', pl: 'Fermata (korona)' }, betyr: { no: 'Hold tonen lenger enn notverdien sier.', en: 'Hold the note longer than its value.', pl: 'Przetrzymaj dźwięk dłużej, niż wynika z wartości.' } },
    { id: 'staccato', niva: 1, navn: { no: 'Staccato', en: 'Staccato', pl: 'Staccato' }, betyr: { no: 'Kort, avstøtt.', en: 'Short, detached.', pl: 'Krótko, oddzielnie.' } },
    { id: 'tenuto', niva: 2, navn: { no: 'Tenuto', en: 'Tenuto', pl: 'Tenuto' }, betyr: { no: 'Hold tonen i full lengde, gjerne med litt vekt.', en: 'Hold the note for its full length, often with a little weight.', pl: 'Przetrzymaj dźwięk przez pełną wartość, często z lekkim naciskiem.' } },
    { id: 'aksent', niva: 1, navn: { no: 'Aksent', en: 'Accent', pl: 'Akcent' }, betyr: { no: 'Spill tonen sterkere enn de andre.', en: 'Play the note louder than the others.', pl: 'Zagraj dźwięk mocniej niż pozostałe.' } },
    { id: 'marcato', niva: 2, navn: { no: 'Marcato', en: 'Marcato', pl: 'Marcato' }, betyr: { no: 'Sterk og kort aksent.', en: 'A strong, short accent.', pl: 'Mocny, krótki akcent.' } },
    { id: 'legato', niva: 1, navn: { no: 'Legatobue', en: 'Slur (legato)', pl: 'Łuk legato' }, betyr: { no: 'Bind tonene sammen uten opphold.', en: 'Join the notes smoothly without gaps.', pl: 'Połącz dźwięki płynnie, bez przerw.' } },
    { id: 'cresc', niva: 1, navn: { no: 'Crescendo', en: 'Crescendo', pl: 'Crescendo' }, betyr: { no: 'Gradvis sterkere.', en: 'Gradually louder.', pl: 'Stopniowo głośniej.' } },
    { id: 'dim', niva: 1, navn: { no: 'Diminuendo (decrescendo)', en: 'Diminuendo (decrescendo)', pl: 'Diminuendo (decrescendo)' }, betyr: { no: 'Gradvis svakere.', en: 'Gradually softer.', pl: 'Stopniowo ciszej.' } }
  ];
  var DYNAMIKK = [
    { t: 'pp', niva: 1, navn: 'pianissimo', betyr: { no: 'Svært svakt', en: 'Very soft', pl: 'Bardzo cicho' } },
    { t: 'p', niva: 1, navn: 'piano', betyr: { no: 'Svakt', en: 'Soft', pl: 'Cicho' } },
    { t: 'mp', niva: 1, navn: 'mezzo piano', betyr: { no: 'Middels svakt', en: 'Moderately soft', pl: 'Średnio cicho' } },
    { t: 'mf', niva: 1, navn: 'mezzo forte', betyr: { no: 'Middels sterkt', en: 'Moderately loud', pl: 'Średnio głośno' } },
    { t: 'f', niva: 1, navn: 'forte', betyr: { no: 'Sterkt', en: 'Loud', pl: 'Głośno' } },
    { t: 'ff', niva: 1, navn: 'fortissimo', betyr: { no: 'Svært sterkt', en: 'Very loud', pl: 'Bardzo głośno' } },
    { t: 'sfz', niva: 2, navn: 'sforzando', betyr: { no: 'Plutselig sterk aksent på én tone', en: 'A sudden strong accent on one note', pl: 'Nagły mocny akcent na jednym dźwięku' } },
    { t: 'fp', niva: 2, navn: 'fortepiano', betyr: { no: 'Sterkt, og straks svakt', en: 'Loud, then immediately soft', pl: 'Głośno, a zaraz potem cicho' } }
  ];
  /* Tempo: omtrentlige slag i minuttet. Kildene oppgir ulike verdier (se «Ulike navn og systemer»). */
  var TERMER = [
    { term: 'Largo', niva: 1, bpm: '40–60', betyr: { no: 'Svært langsomt, bredt', en: 'Very slow, broad', pl: 'Bardzo wolno, szeroko' } },
    { term: 'Adagio', niva: 2, bpm: '66–76', betyr: { no: 'Langsomt', en: 'Slow', pl: 'Wolno' } },
    { term: 'Andante', niva: 1, bpm: '76–108', betyr: { no: 'Gående tempo', en: 'At a walking pace', pl: 'W tempie kroku' } },
    { term: 'Moderato', niva: 2, bpm: '108–120', betyr: { no: 'Moderat tempo', en: 'Moderate tempo', pl: 'Umiarkowanie' } },
    { term: 'Allegro', niva: 1, bpm: '120–156', betyr: { no: 'Raskt og livlig', en: 'Fast and lively', pl: 'Szybko i żywo' } },
    { term: 'Presto', niva: 1, bpm: '168–200', betyr: { no: 'Svært raskt', en: 'Very fast', pl: 'Bardzo szybko' } },
    { term: 'ritardando (rit.)', niva: 2, betyr: { no: 'Gradvis langsommere', en: 'Gradually slower', pl: 'Stopniowo wolniej' } },
    { term: 'accelerando (accel.)', niva: 2, betyr: { no: 'Gradvis raskere', en: 'Gradually faster', pl: 'Stopniowo szybciej' } },
    { term: 'a tempo', niva: 2, betyr: { no: 'Tilbake til tempoet', en: 'Back to the tempo', pl: 'Powrót do tempa' } },
    { term: 'Fine', niva: 1, betyr: { no: 'Slutt', en: 'The end', pl: 'Koniec' } },
    { term: 'Da capo (D.C.)', niva: 2, betyr: { no: 'Fra begynnelsen', en: 'From the beginning', pl: 'Od początku' } },
    { term: 'Dal segno (D.S.)', niva: 2, betyr: { no: 'Fra segno-tegnet', en: 'From the segno sign', pl: 'Od znaku segno' } },
    { term: 'dolce', niva: 2, betyr: { no: 'Søtt, mykt', en: 'Sweetly, softly', pl: 'Słodko, łagodnie' } },
    { term: 'cantabile', niva: 2, betyr: { no: 'Syngende', en: 'In a singing style', pl: 'Śpiewnie' } }
  ];

  /* ---------- Veikart: gjentakelser og hopp, med én helnote i hver takt ---------- */
  var TONER = [[28, 60], [29, 62], [30, 64], [31, 65], [32, 67], [33, 69], [34, 71], [35, 72]];   // C4 til C5
  var VEIKART = [
    { id: 'reprise', niva: 1, takter: 4, start: 1, slutt: 4, rekke: [1, 2, 3, 4, 1, 2, 3, 4], navn: { no: 'Reprise', en: 'Repeat', pl: 'Repetycja' } },
    { id: 'volta', niva: 1, takter: 5, start: 1, slutt: 4, volta1: 4, volta2: 5, rekke: [1, 2, 3, 4, 1, 2, 3, 5], navn: { no: 'Volta', en: 'Endings', pl: 'Volta' } },
    { id: 'dcfine', niva: 2, takter: 6, fine: 3, dc: 6, rekke: [1, 2, 3, 4, 5, 6, 1, 2, 3], navn: { no: 'D.C. al Fine', en: 'D.C. al Fine', pl: 'D.C. al Fine' } },
    { id: 'dscoda', niva: 2, takter: 8, segno: 2, tilCoda: 4, ds: 6, coda: 7, rekke: [1, 2, 3, 4, 5, 6, 2, 3, 4, 7, 8], navn: { no: 'D.S. al Coda', en: 'D.S. al Coda', pl: 'D.S. al Coda' } }
  ];
  var BT = 54, X0 = 44;
  function takX(i){ return X0 + (i - 1) * BT; }   // venstre kant av takt i (1, 2, ...)
  /* Veikartet tegnes i samme målestokk som de andre notelinjene på nettstedet (1,15), ikke strukket til full bredde.
     Taktnummeret står øverst til venstre i takten, tegnene (segno, coda) midt over takten, og tekstene slutter
     ved taktstreken de hører til, så ingenting går utenfor bildet. */
  function veikart(v, merke){
    var bredde = X0 + v.takter * BT + 8 + (v.coda ? 14 : 0), s = '', gap = function(i){ return v.coda && i >= v.coda ? 14 : 0; };
    s += linjer(4, v.coda ? takX(v.coda) - 4 : bredde - 4);
    if (v.coda) s += linjer(takX(v.coda) + 10, bredde - 4);
    s += gnokkel(6) + strek(4);
    for (var i = 1; i <= v.takter; i++) {
      var x = takX(i) + gap(i), t = TONER[(i - 1) % TONER.length];
      s += '<text x="' + (x + 5) + '" y="84" font-family="Charter, Georgia, serif" font-size="11" fill="currentColor">' + i + '</text>';
      s += helnote(x + BT / 2, t[0], 'data-i="' + (i - 1) + '"');
      var hoyre = x + BT, siste = i === v.takter;
      if (v.slutt === i) s += prikker(hoyre - 13) + strek(hoyre - 8) + strek(hoyre - 2.5, true);
      else if (siste || (v.coda && i === v.coda - 1)) s += strek(hoyre - 8) + strek(hoyre - 2.5, true);
      else s += strek(hoyre);
      if (v.start === i && i > 1) s += strek(x + 2.5, true) + strek(x + 8) + prikker(x + 13);
    }
    if (v.start === 1) s += strek(X0 + 2.5, true) + strek(X0 + 8) + prikker(X0 + 14);
    var slutt = function(i){ return takX(i) + gap(i) + BT - 4; }, midt = function(i){ return takX(i) + gap(i) + BT / 2; };
    var tekstH = function(x, yy, t, str){ return '<text x="' + x + '" y="' + yy + '" text-anchor="end" font-family="Charter, Georgia, serif" font-size="' + str + '" font-style="italic" font-weight="700" fill="currentColor">' + t + '</text>'; };
    if (v.volta1) { var a = takX(v.volta1); s += '<path d="M' + (a + 3) + ' 74 V64 H' + (a + BT - 4) + ' V74" fill="none" stroke="currentColor" stroke-width="1.6"/>' + tekst(a + 14, 75, '1.', false, 11); }
    if (v.volta2) { var b = takX(v.volta2); s += '<path d="M' + (b + 3) + ' 74 V64 H' + (b + BT - 4) + '" fill="none" stroke="currentColor" stroke-width="1.6"/>' + tekst(b + 14, 75, '2.', false, 11); }
    if (v.fine) s += tekstH(slutt(v.fine), 162, 'Fine', 14);
    if (v.dc) s += tekstH(slutt(v.dc), 162, 'D.C. al Fine', 13);
    if (v.segno) s += segno(midt(v.segno), 66);
    if (v.tilCoda) s += coda(slutt(v.tilCoda) - 8, 66) + tekstH(slutt(v.tilCoda) - 24, 70, 'To Coda', 12);
    if (v.ds) s += tekstH(slutt(v.ds), 162, 'D.S. al Coda', 13);
    if (v.coda) s += coda(midt(v.coda), 66);
    return { svg: svg(bredde, 132, s, merke, 46, true), lyd: v.rekke.map(function(i){ return TONER[(i - 1) % TONER.length][1]; }) };
  }

  return { tr: tr, sprak: sprak, TEGN: TEGN, SYMBOLER: SYMBOLER, DYNAMIKK: DYNAMIKK, TERMER: TERMER, VEIKART: VEIKART, veikart: veikart };
})();
