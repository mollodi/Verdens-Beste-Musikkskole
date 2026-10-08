/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-SKLR. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – SKALAER OG MODI
   ---------------------------------------------------------------------
   Alle skalaene i leksjonen «Skalaer og modi», og noter for dem på en ekte
   notelinje. Bruker tonearter.js (tonenavn, fortegn), så den må lastes først:
     <script src="tonearter.js"></script>
     <script src="skalaer.js"></script>

   En skala er en liste med trinn [bokstavsteg, halvtoner] fra grunntonen.
   Bokstavsteget gir riktig stavemåte (Ess, ikke Diss, i c-moll).
   ===================================================================== */
window.VBM_SKALAER = (function(){
  'use strict';
  var K = window.VBM_TONEARTER, T = K.T;
  var BH = [0, 2, 4, 5, 7, 9, 11];

  /* ---------- Skalaene ----------
     kjenne = hvilke trinn (indekser) som er kjennetegnet og farges.
     modus  = hvilket trinn i durskalaen modusen starter på (1 = jonisk ... 7 = lokrisk).
     ned    = trinn for veien ned, når den er en annen (melodisk moll). */
  var DUR = [[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,11],[7,12]];
  var MOLL = [[0,0],[1,2],[2,3],[3,5],[4,7],[5,8],[6,10],[7,12]];
  function sang(tittel, info, sok){ return { tittel: tittel, info: info, sok: sok || tittel }; }
  var GRUPPER = [
    { id: 'durmoll', tittel: 'Dur og moll' },
    { id: 'modi', tittel: 'De sju modiene' },
    { id: 'penta', tittel: 'Pentatonikk og blues' },
    { id: 'symm', tittel: 'Heltone og kromatisk' },
    { id: 'jazz', tittel: 'Jazzskalaer' }
  ];
  var ALLE = [
    { id: 'dur', gruppe: 'durmoll', navn: 'Durskala', eng: 'major scale', trinn: DUR, kjenne: [],
      tekst: 'Grunnlaget for det meste av vestlig musikk. Mønsteret gir to halvtoner: mellom 3. og 4. trinn og mellom 7. og 8. trinn. Synger du do-re-mi, synger du durskalaen.',
      sanger: [sang('Do-Re-Mi', 'Richard Rodgers, 1959')] },
    { id: 'naturlig-moll', gruppe: 'durmoll', navn: 'Naturlig moll', eng: 'natural minor', trinn: MOLL, kjenne: [2, 5, 6],
      tekst: 'Sammenlignet med dur er 3., 6. og 7. trinn senket. Har de samme tonene som durskalaen en liten ters over: a-moll har tonene til C-dur. Kalles også eolisk.',
      sanger: [] },
    { id: 'harmonisk-moll', gruppe: 'durmoll', navn: 'Harmonisk moll', eng: 'harmonic minor', trinn: [[0,0],[1,2],[2,3],[3,5],[4,7],[5,8],[6,11],[7,12]], kjenne: [6],
      tekst: 'Naturlig moll med hevet 7. trinn. Det gir en ledetone en halvtone under grunntonen, og et sprang på halvannen tone (forstørret sekund) mellom 6. og 7. trinn.',
      sanger: [] },
    { id: 'melodisk-moll', gruppe: 'durmoll', navn: 'Melodisk moll', eng: 'melodic minor', trinn: [[0,0],[1,2],[2,3],[3,5],[4,7],[5,9],[6,11],[7,12]], kjenne: [5, 6], ned: MOLL,
      tekst: 'Naturlig moll med hevet 6. og 7. trinn, så det store spranget i harmonisk moll forsvinner. I klassisk musikk brukes den slik bare oppover, og nedover spilles naturlig moll, slik du hører her. I jazz brukes den likt begge veier.',
      sanger: [] },

    { id: 'jonisk', gruppe: 'modi', modus: 1, navn: 'Jonisk', eng: 'Ionian', trinn: DUR, kjenne: [],
      tekst: 'Første trinn i durskalaen, altså selve durskalaen. Utgangspunktet de andre modiene sammenlignes med.',
      sanger: [sang('Let It Be', 'The Beatles, 1970')] },
    { id: 'dorisk', gruppe: 'modi', modus: 2, navn: 'Dorisk', eng: 'Dorian', trinn: [[0,0],[1,2],[2,3],[3,5],[4,7],[5,9],[6,10],[7,12]], kjenne: [5],
      tekst: 'Moll med stor sekst. Den store seksten gjør klangen lysere og mykere enn vanlig moll. Mye brukt i jazz, funk og folkemusikk.',
      sanger: [sang('Scarborough Fair', 'Simon & Garfunkel, 1966'), sang('Oye Como Va', 'Santana, 1970'), sang('So What', 'Miles Davis, 1959')] },
    { id: 'frygisk', gruppe: 'modi', modus: 3, navn: 'Frygisk', eng: 'Phrygian', trinn: [[0,0],[1,1],[2,3],[3,5],[4,7],[5,8],[6,10],[7,12]], kjenne: [1],
      tekst: 'Moll med liten sekund. Halvtonen rett over grunntonen gir en mørk, spansk klang, kjent fra flamenco og metal.',
      sanger: [sang('Wherever I May Roam', 'Metallica, 1991'), sang('Symphony of Destruction', 'Megadeth, 1992')] },
    { id: 'lydisk', gruppe: 'modi', modus: 4, navn: 'Lydisk', eng: 'Lydian', trinn: [[0,0],[1,2],[2,4],[3,6],[4,7],[5,9],[6,11],[7,12]], kjenne: [3],
      tekst: 'Dur med forstørret kvart. Den hevede kvarten gir en svevende, drømmende klang, mye brukt i filmmusikk.',
      sanger: [sang('The Simpsons Theme', 'Danny Elfman, 1989'), sang('Flying in a Blue Dream', 'Joe Satriani, 1989')] },
    { id: 'miksolydisk', gruppe: 'modi', modus: 5, navn: 'Miksolydisk', eng: 'Mixolydian', trinn: [[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,10],[7,12]], kjenne: [6],
      tekst: 'Dur med liten septim. Klinger som dur, men uten ledetonen, og det gir en avslappet rock- og bluesklang.',
      sanger: [sang('Norwegian Wood', 'The Beatles, 1965'), sang('Sweet Child O’ Mine', 'Guns N’ Roses, 1987', 'Sweet Child O Mine')] },
    { id: 'eolisk', gruppe: 'modi', modus: 6, navn: 'Eolisk', eng: 'Aeolian', trinn: MOLL, kjenne: [5],
      tekst: 'Det samme som naturlig moll. Den lille seksten gir den typiske, triste mollklangen.',
      sanger: [sang('All Along the Watchtower', 'Bob Dylan, 1967'), sang('Rolling in the Deep', 'Adele, 2010')] },
    { id: 'lokrisk', gruppe: 'modi', modus: 7, navn: 'Lokrisk', eng: 'Locrian', trinn: [[0,0],[1,1],[2,3],[3,5],[4,6],[5,8],[6,10],[7,12]], kjenne: [1, 4],
      tekst: 'Både liten sekund og forminsket kvint, så treklangen på grunntonen blir forminsket. Den mest ustabile modusen, og den som brukes minst.',
      sanger: [sang('Army of Me', 'Björk, 1995')] },

    { id: 'dur-pentaton', gruppe: 'penta', navn: 'Durpentatonisk', eng: 'major pentatonic', trinn: [[0,0],[1,2],[2,4],[4,7],[5,9],[7,12]], kjenne: [],
      tekst: 'Durskalaen uten 4. og 7. trinn, altså uten halvtoner. Fem toner som nesten aldri skurrer, kjent fra folkemusikk over hele verden.',
      sanger: [sang('Amazing Grace', 'tradisjonell'), sang('My Girl', 'The Temptations, 1964')] },
    { id: 'moll-pentaton', gruppe: 'penta', navn: 'Mollpentatonisk', eng: 'minor pentatonic', trinn: [[0,0],[2,3],[3,5],[4,7],[6,10],[7,12]], kjenne: [],
      tekst: 'Naturlig moll uten 2. og 6. trinn. Rockens og bluesens viktigste skala for gitarsoloer.',
      sanger: [sang('Another One Bites the Dust', 'Queen, 1980'), sang('Stairway to Heaven (gitarsoloen)', 'Led Zeppelin, 1971', 'Stairway to Heaven')] },
    { id: 'blues', gruppe: 'penta', navn: 'Bluesskala', eng: 'blues scale', trinn: [[0,0],[2,3],[3,5],[4,6],[4,7],[6,10],[7,12]], kjenne: [3],
      tekst: 'Mollpentatonisk med forminsket kvint lagt til. Den ekstra tonen kalles blue note og gir den typiske, skitne bluesklangen.',
      sanger: [sang('Smoke on the Water', 'Deep Purple, 1972')] },

    { id: 'heltone', gruppe: 'symm', navn: 'Heltoneskala', eng: 'whole-tone scale', trinn: [[0,0],[1,2],[2,4],[3,6],[4,8],[5,10],[7,12]], kjenne: [],
      tekst: 'Bare heltoner, seks toner per oktav. Ingen tone skiller seg ut som grunntone, så klangen blir svevende og uavklart. Det finnes bare to ulike heltoneskalaer.',
      sanger: [sang('Voiles', 'Claude Debussy, 1910', 'Debussy Voiles')] },
    { id: 'kromatisk', gruppe: 'symm', navn: 'Kromatisk skala', eng: 'chromatic scale', trinn: [[0,0],[0,1],[1,2],[1,3],[2,4],[3,5],[3,6],[4,7],[4,8],[5,9],[5,10],[6,11],[7,12]], kjenne: [],
      tekst: 'Alle tolv halvtonene. Brukes mer som pynt og overgang enn som toneart. Oppover skrives den vanligvis med kryss.',
      sanger: [sang('Humlens flukt', 'Nikolaj Rimskij-Korsakov, 1900', 'Flight of the Bumblebee')] },

    { id: 'alterert', gruppe: 'jazz', navn: 'Alterert skala', eng: 'altered scale', trinn: [[0,0],[1,1],[1,3],[2,4],[4,6],[4,8],[6,10],[7,12]], kjenne: [1, 2, 4, 5],
      tekst: 'Sjuende modus av melodisk moll. Brukes over dominantakkorder i jazz: den har grunntonen, tersen og septimen fra akkorden, og alle fire endringene av kvint og none (♭9, ♯9, ♭5, ♯5). Her skrevet slik jazzmusikere tenker den.',
      sanger: [] },
    { id: 'forminsket-hh', gruppe: 'jazz', navn: 'Forminsket skala, halv-hel', eng: 'half-whole diminished', trinn: [[0,0],[1,1],[1,3],[2,4],[3,6],[4,7],[5,9],[6,10],[7,12]], kjenne: [],
      tekst: 'Veksler mellom halvtone og heltone, åtte toner. Brukes over dominantakkorder med ♭9. Symmetrisk: mønsteret gjentar seg for hver liten ters.',
      sanger: [] },
    { id: 'forminsket-hh2', gruppe: 'jazz', navn: 'Forminsket skala, hel-halv', eng: 'whole-half diminished', trinn: [[0,0],[1,2],[2,3],[3,5],[4,6],[5,8],[5,9],[6,11],[7,12]], kjenne: [],
      tekst: 'Starter med en heltone i stedet for en halvtone. Brukes over forminskede septimakkorder.',
      sanger: [] },
    { id: 'bebop-dominant', gruppe: 'jazz', navn: 'Bebop dominant', eng: 'bebop dominant', trinn: [[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,10],[6,11],[7,12]], kjenne: [7],
      tekst: 'Miksolydisk med stor septim lagt til som gjennomgangstone. Med åtte toner lander akkordtonene på slagene når skalaen spilles i åttendeler.',
      sanger: [] },
    { id: 'bebop-dur', gruppe: 'jazz', navn: 'Bebop dur', eng: 'bebop major', trinn: [[0,0],[1,2],[2,4],[3,5],[4,7],[4,8],[5,9],[6,11],[7,12]], kjenne: [5],
      tekst: 'Durskalaen med hevet kvint lagt til som gjennomgangstone, av samme grunn som i bebop dominant.',
      sanger: [] }
  ];
  ALLE.forEach(function(s){
    s.fri = s.gruppe === 'symm' || s.gruppe === 'jazz';
    s.kromatisk = s.id === 'kromatisk';
    if (s.id === 'harmonisk-moll' || s.id === 'melodisk-moll') s.familie = 'naturlig-moll';
    var g = s.trinn.map(function(t){ return t[1]; });
    s.monster = g.slice(1).map(function(h, i){ return h - g[i]; });   // halvtoner mellom trinnene
  });

  /* ---------- Grunntoner ----------
     De 12 tonehøydene. Svarte tangenter har to navn, og hver skala velger
     stavemåten med færrest fortegn (ciss-moll, ikke dess-moll). Står det likt, vinner navnet
     som står først (Ess foran Diss, Fiss foran Gess). */
  var GRUNN = [[{b:0,f:0}], [{b:0,f:1},{b:1,f:-1}], [{b:1,f:0}], [{b:2,f:-1},{b:1,f:1}], [{b:2,f:0}], [{b:3,f:0}],
               [{b:3,f:1},{b:4,f:-1}], [{b:4,f:0}], [{b:4,f:1},{b:5,f:-1}], [{b:5,f:0}], [{b:5,f:1},{b:6,f:-1}], [{b:6,f:0}]];
  function rotMedOktav(r){ var pc = BH[r.b] + r.f; return { b: r.b, f: r.f, oktav: pc <= 7 ? 4 : 3 }; }
  function midi(n){ return (n.oktav + 1) * 12 + BH[n.b] + n.f; }
  /* Toner for en skala fra en grunntone, med riktig stavemåte. */
  var SKARP = [[0,0],[0,1],[1,0],[1,1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[5,1],[6,0]];   // kromatisk oppover: kryss
  function toner(rot, trinn, s){
    var r = rot.oktav != null ? rot : rotMedOktav(rot), m0 = midi(r);
    return trinn.map(function(t){
      var m = m0 + t[1];
      if (s && s.kromatisk) { var p = SKARP[((m % 12) + 12) % 12]; return { b: p[0], f: p[1], oktav: Math.floor(m / 12) - 1 }; }
      var d = r.oktav * 7 + r.b + t[0], n = { b: ((d % 7) + 7) % 7, oktav: Math.floor(d / 7), f: 0 };
      n.f = m - midi(n);
      /* Symmetriske skalaer og jazzskalaer: dobbeltfortegn skrives om til nærmeste tone (Ciss-ciss blir D). */
      if (s && s.fri && Math.abs(n.f) === 2) { var q = SKARP[((m % 12) + 12) % 12]; n = { b: q[0], f: q[1], oktav: Math.floor(m / 12) - 1 }; }
      return n;
    });
  }
  function poeng(liste){ return liste.reduce(function(sum, n){ return sum + Math.abs(n.f) + (Math.abs(n.f) === 2 ? 10 : 0); }, 0); }
  /* Velger stavemåten av grunntonen som gir færrest fortegn for denne skalaen. */
  function rotFor(nr, s){
    /* Harmonisk og melodisk moll følger naturlig moll (samme toneart), selv om det gir
       et dobbeltkryss, slik det skrives i notene (giss-moll har Fisis). */
    if (s.familie) s = ALLE.filter(function(x){ return x.id === s.familie; })[0];
    var valg = GRUNN[nr], beste = valg[0], bp = Infinity;
    valg.forEach(function(r){ var p = poeng(toner(r, s.trinn, s)); if (p < bp) { bp = p; beste = r; } });
    return beste;
  }
  /* Modusen som trinn i en durskala: f.eks. dorisk i C-dur = D dorisk. */
  function modusIDur(rot, nr){
    var dur = toner(rot, DUR.concat(DUR.slice(1).map(function(t){ return [t[0] + 7, t[1] + 12]; })));
    var liste = dur.slice(nr - 1, nr + 7);
    if (midi(liste[0]) > 69) liste = liste.map(function(n){ return { b: n.b, f: n.f, oktav: n.oktav - 1 }; });
    return liste;
  }
  function fortegnFor(rot){
    for (var i = 0; i < K.ALLE.length; i++) { var a = K.ALLE[i]; if (a.dur.b === rot.b && a.dur.f === rot.f) return a.fortegn; }
    return 0;
  }

  /* ---------- Noter ---------- */
  var EKSTRA = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
    + '<g id="acc-dflat"><use href="#acc-flat" x="-4.4"/><use href="#acc-flat" x="4.4"/></g>'
    + '<g id="acc-dsharp"><rect x="-0.85" y="-5.2" width="1.7" height="10.4" transform="rotate(45)"/><rect x="-0.85" y="-5.2" width="1.7" height="10.4" transform="rotate(-45)"/><rect x="-4.9" y="-4.9" width="3" height="3"/><rect x="1.9" y="-4.9" width="3" height="3"/><rect x="-4.9" y="1.9" width="3" height="3"/><rect x="1.9" y="1.9" width="3" height="3"/></g>'
    + '<g id="fclef"><path d="M10.5,183.5 C9.8,175.5 15.5,169.2 23.2,169.2 C31.6,169.2 37.4,175.4 37.4,184.6 C37.4,199.2 26.4,211.8 9.4,219.6 L8.6,217.9 C21.6,210.6 30.3,199.4 30.3,185.2 C30.3,176.6 27.4,171.4 22.6,171.4 C18.4,171.4 15.6,174.2 15.2,177.6 Z"/><circle cx="14.2" cy="181.6" r="4.6"/><circle cx="43.4" cy="176.5" r="2.3"/><circle cx="43.4" cy="189.5" r="2.3"/></g>'
    + '<g id="cclef"><rect x="0" y="86.5" width="5.2" height="55"/><rect x="7.6" y="86.5" width="1.8" height="55"/><path d="M9.4,114 L13.2,104.5 C14.6,108.6 16.4,110.6 18.6,110.6 C21.2,110.6 22.2,107.4 22.2,101.6 C22.2,94.6 20.6,90.6 17.6,90.6 C15.6,90.6 14.6,91.8 14.6,93 C14.6,94.4 16.6,94.8 16.6,97 C16.6,99 15,100.4 13,100.4 C10.6,100.4 9.6,98.4 9.6,96.2 C9.6,91.4 13.8,88.2 18.4,88.2 C24.8,88.2 29,93.6 29,100.6 C29,107.6 24.4,112.2 19.2,112.2 C17.2,112.2 15.4,111.4 14.2,110 L12.6,114 L14.2,118 C15.4,116.6 17.2,115.8 19.2,115.8 C24.4,115.8 29,120.4 29,127.4 C29,134.4 24.8,139.8 18.4,139.8 C13.8,139.8 9.6,136.6 9.6,131.8 C9.6,129.6 10.6,127.6 13,127.6 C15,127.6 16.6,129 16.6,131 C16.6,133.2 14.6,133.6 14.6,135 C14.6,136.2 15.6,137.4 17.6,137.4 C20.6,137.4 22.2,133.4 22.2,126.4 C22.2,120.6 21.2,117.4 18.6,117.4 C16.4,117.4 14.6,119.4 13.2,123.5 Z"/></g>'
    + '<g id="acc-natural"><rect x="-3.1" y="-10.5" width="1.2" height="15.6"/><rect x="1.9" y="-5.1" width="1.2" height="15.6"/><path d="M-3.1,-2.4L3.1,-4.2L3.1,-1.7L-3.1,0.1Z"/><path d="M-3.1,3.3L3.1,1.5L3.1,4L-3.1,5.8Z"/></g>'
    + '</defs></svg>';
  function sikreDefs(){
    K.fortegnSvg(0);   // legger inn g-nøkkel, kryss og b fra tonearter.js
    if (!document.getElementById('acc-natural')) document.body.insertAdjacentHTML('afterbegin', EKSTRA);
  }
  var KRYSS = [[3,5],[0,5],[4,5],[1,5],[5,4],[2,5],[6,4]], BER = [[6,4],[2,5],[5,4],[1,5],[4,4],[0,5],[3,4]];
  function yAv(b, okt){ return 140 - (okt * 7 + b - 30) * 6.5; }
  /* Tegner tonene etter hverandre. fortegn = toneartens kryss/b-er foran (0 = ingen).
     Fortegn foran tonene vises bare når det trengs, og oppløsningstegn når en tone går tilbake. */
  function noter(liste, fortegn, kjenne, etikett){
    sikreDefs();
    var antall = Math.abs(fortegn || 0), sig = fortegn > 0 ? KRYSS.slice(0, antall) : BER.slice(0, antall);
    var gjeldende = {}, s = '';
    sig.forEach(function(p){ gjeldende[p[0]] = fortegn > 0 ? 1 : -1; });   // gjelder alle oktaver
    var sp = 31, x0 = 66 + antall * 12 + 16, bredde = x0 + (liste.length - 1) * sp + 26;
    var ys = liste.map(function(n){ return yAv(n.b, n.oktav); });
    var topp = Math.min(64, Math.min.apply(null, ys) - 22), bunn = Math.max(168, Math.max.apply(null, ys) + 14);
    for (var i = 0; i < 5; i++) s += '<line x1="6" y1="' + (88 + i * 13) + '" x2="' + (bredde - 6) + '" y2="' + (88 + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
    s += '<use href="#gclef" transform="translate(6 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>';
    sig.forEach(function(p, i){ s += '<use href="#' + (fortegn > 0 ? 'acc-sharp' : 'acc-flat') + '" transform="translate(' + (64 + i * 12) + ' ' + yAv(p[0], p[1]) + ')" fill="currentColor"/>'; });
    var iTakt = {};   // fortegn som er satt i takten: «bokstav-oktav» -> fortegn
    liste.forEach(function(n, i){
      var x = x0 + i * sp, y = ys[i], l, nokkel = n.b + '-' + n.oktav;
      for (l = 153; l <= y + 0.1; l += 13) s += '<line x1="' + (x - 12) + '" y1="' + l + '" x2="' + (x + 12) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
      for (l = 75; l >= y - 0.1; l -= 13) s += '<line x1="' + (x - 12) + '" y1="' + l + '" x2="' + (x + 12) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
      var forrige = nokkel in iTakt ? iTakt[nokkel] : (gjeldende[n.b] || 0);
      if (n.f !== forrige) {
        var id = { '-2': 'acc-dflat', '-1': 'acc-flat', '0': 'acc-natural', '1': 'acc-sharp', '2': 'acc-dsharp' }[n.f];
        s += '<use href="#' + id + '" transform="translate(' + (x - (n.f === -2 ? 18 : 14)) + ' ' + y + ')" fill="currentColor"/>';
        iTakt[nokkel] = n.f;
      }
      var klasse = kjenne && kjenne.indexOf(i) >= 0 ? ' class="kjenne"' : '';
      s += '<ellipse' + klasse + fargeData(n) + ' data-i="' + i + '" cx="' + x + '" cy="' + y + '" rx="7.2" ry="5.6" fill="currentColor" transform="rotate(-18 ' + x + ' ' + y + ')"/>';
    });
    /* Skjermlesere får tonenavnene, ikke bare navnet på skalaen */
    var tonene = liste.map(function(n){ return K.tone(n); }).join(', ');
    etikett = (etikett ? etikett + ': ' : '') + tonene;
    return '<svg viewBox="0 ' + topp + ' ' + bredde + ' ' + (bunn - topp) + '" role="img" aria-label="' + (etikett || '') + '">' + s + '</svg>';
  }
  /* ---------- Akkorder side om side ----------
     akkorder: liste med { noter: [...], tall: ['6','4'], navn: 'tekst under' }.
     Hver akkord står i sin egen takt, med sekunder forskjøvet til høyre og fortegn i kolonner,
     slik som i juksebøkene. Noteknappene får data-a (akkord) og data-i (tone). */
  function akkordrekke(akkorder, etikett){
    sikreDefs();
    var X0 = 92, SP = 100, bredde = X0 + (akkorder.length - 1) * SP + 70, s = '';
    var alleY = [];
    akkorder.forEach(function(a){ a.noter.forEach(function(n){ alleY.push(yAv(n.b, n.oktav)); }); });
    var topp = Math.min(60, Math.min.apply(null, alleY) - 22), bunn = Math.max(172, Math.max.apply(null, alleY) + 14) + 44;
    for (var i = 0; i < 5; i++) s += '<line x1="6" y1="' + (88 + i * 13) + '" x2="' + (bredde - 6) + '" y2="' + (88 + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
    s += '<use href="#gclef" transform="translate(6 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>';
    akkorder.forEach(function(a, ai){
      var X = X0 + ai * SP;
      if (ai) s += '<line x1="' + (X - SP / 2 + 6) + '" y1="88" x2="' + (X - SP / 2 + 6) + '" y2="140" stroke="currentColor" stroke-width="1"/>';
      var noter = a.noter.map(function(n, i){ return { n: n, i: i, y: yAv(n.b, n.oktav), d: n.oktav * 7 + n.b, hoyre: false }; })
        .sort(function(p, q){ return p.d - q.d; });
      for (var k = 1; k < noter.length; k++) if (noter[k].d - noter[k - 1].d === 1 && !noter[k - 1].hoyre) noter[k].hoyre = true;
      var lav = Math.max.apply(null, noter.map(function(p){ return p.y; })), hoy = Math.min.apply(null, noter.map(function(p){ return p.y; }));
      function hj(y){
        var bred = noter.some(function(p){ return p.hoyre && (y >= 153 ? p.y >= y - 0.1 : p.y <= y + 0.1); });
        s += '<line x1="' + (X - 14) + '" y1="' + y + '" x2="' + (X + (bred ? 30 : 14)) + '" y2="' + y + '" stroke="currentColor" stroke-width="1.3"/>';
      }
      for (var l = 153; l <= lav + 0.1; l += 13) hj(l);
      for (var l2 = 75; l2 >= hoy - 0.1; l2 -= 13) hj(l2);
      noter.forEach(function(p){
        var x = X + (p.hoyre ? 16 : 0);
        s += '<ellipse data-a="' + ai + '" data-i="' + p.i + '"' + fargeData(p.n) + ' cx="' + x + '" cy="' + p.y + '" rx="7.2" ry="5.6" fill="currentColor" transform="rotate(-18 ' + x + ' ' + p.y + ')"/>';
      });
      var kol = [];
      noter.slice().reverse().forEach(function(p){
        if (!p.n.f) return;
        var o = p.n.f > 0 ? [p.y - 10.5, p.y + 10.5] : [p.y - 15.5, p.y + 5.3], k2 = 0;
        while (kol[k2] && kol[k2].some(function(q){ return o[0] < q[1] + 1 && q[0] < o[1] + 1; })) k2++;
        (kol[k2] = kol[k2] || []).push(o.concat([p]));
      });
      kol.forEach(function(k3, ki){
        k3.forEach(function(q){
          var id = { '-2': 'acc-dflat', '-1': 'acc-flat', '1': 'acc-sharp', '2': 'acc-dsharp' }[q[2].n.f];
          s += '<use href="#' + id + '" transform="translate(' + (X - 22 - ki * 13) + ' ' + q[2].y + ')" fill="currentColor"/>';
        });
      });
      /* Besifring (generalbasstall) og navn under notelinjen */
      var ty = Math.max(184, lav + 26);
      (a.tall || []).forEach(function(t, ti){
        s += '<text x="' + (X + 4) + '" y="' + (ty + 4 + ti * 19) + '" class="besifring" text-anchor="middle">' + t + '</text>';
      });
    });
    return '<svg viewBox="0 ' + topp + ' ' + bredde + ' ' + (bunn - topp + 10) + '" role="img" aria-label="' + (etikett || '') + '">' + s + '</svg>';
  }

  /* ---------- Firstemmig sats på to notelinjer ----------
     akkorder: liste med { noter: [bass, tenor, alt, sopran], tall: ['I', 'T'] }.
     Sopran og alt står i G-nøkkel, tenor og bass i F-nøkkel. Hver akkord står i sin egen takt,
     med toneartens fortegn foran og bare de fortegnene som trengs i tillegg. */
  var BASS_TOPP = 186, BASS_BUNN = 238;
  function yBass(b, okt){ return BASS_BUNN - (okt * 7 + b - 18) * 6.5; }
  function storSats(akkorder, fortegn, etikett){
    sikreDefs();
    var antall = Math.abs(fortegn || 0), sig = fortegn > 0 ? KRYSS.slice(0, antall) : BER.slice(0, antall);
    var X0 = 92 + antall * 12, SP = 92, bredde = X0 + (akkorder.length - 1) * SP + 60, s = '';
    var yT = [], yB = [];
    akkorder.forEach(function(a){ a.noter.forEach(function(n, v){ (v < 2 ? yB : yT).push(v < 2 ? yBass(n.b, n.oktav) : yAv(n.b, n.oktav)); }); });
    var topp = Math.min(62, Math.min.apply(null, yT) - 22), bassLav = Math.max(BASS_BUNN, Math.max.apply(null, yB));
    var maxTall = Math.max.apply(null, akkorder.map(function(a){ return (a.tall || []).length; }));
    var bunn = bassLav + 30 + maxTall * 19;
    var i;
    for (i = 0; i < 5; i++) {
      s += '<line x1="6" y1="' + (88 + i * 13) + '" x2="' + (bredde - 6) + '" y2="' + (88 + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
      s += '<line x1="6" y1="' + (BASS_TOPP + i * 13) + '" x2="' + (bredde - 6) + '" y2="' + (BASS_TOPP + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
    }
    s += '<line x1="6" y1="88" x2="6" y2="' + BASS_BUNN + '" stroke="currentColor" stroke-width="1.6"/>';
    s += '<use href="#gclef" transform="translate(10 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>';
    s += '<use href="#fclef" transform="translate(4 16)" fill="currentColor"/>';
    sig.forEach(function(p, k){
      var id = fortegn > 0 ? 'acc-sharp' : 'acc-flat';
      s += '<use href="#' + id + '" transform="translate(' + (66 + k * 12) + ' ' + yAv(p[0], p[1]) + ')" fill="currentColor"/>';
      s += '<use href="#' + id + '" transform="translate(' + (66 + k * 12) + ' ' + yBass(p[0], p[1] - 2) + ')" fill="currentColor"/>';
    });
    var gjeldende = {}; sig.forEach(function(p){ gjeldende[p[0]] = fortegn > 0 ? 1 : -1; });
    akkorder.forEach(function(a, ai){
      var X = X0 + ai * SP;
      if (ai) {
        var xs = X - SP / 2 + 4;
        s += '<line x1="' + xs + '" y1="88" x2="' + xs + '" y2="140" stroke="currentColor" stroke-width="1"/>';
        s += '<line x1="' + xs + '" y1="' + BASS_TOPP + '" x2="' + xs + '" y2="' + BASS_BUNN + '" stroke="currentColor" stroke-width="1"/>';
      }
      [[a.noter[2], a.noter[3], 2], [a.noter[0], a.noter[1], 0]].forEach(function(par){
        var diskant = par[2] === 2;
        var noter = [par[0], par[1]].map(function(n, k){ return { n: n, v: par[2] + k, y: diskant ? yAv(n.b, n.oktav) : yBass(n.b, n.oktav), d: n.oktav * 7 + n.b, hoyre: false }; })
          .sort(function(p, q){ return p.d - q.d; });
        if (noter[1].d - noter[0].d === 1) noter[1].hoyre = true;
        var lav = Math.max(noter[0].y, noter[1].y), hoy = Math.min(noter[0].y, noter[1].y), l;
        var under = diskant ? 153 : BASS_BUNN + 13, over = diskant ? 75 : BASS_TOPP - 13;
        for (l = under; l <= lav + 0.1; l += 13) s += '<line x1="' + (X - 14) + '" y1="' + l + '" x2="' + (X + 14) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
        for (l = over; l >= hoy - 0.1; l -= 13) s += '<line x1="' + (X - 14) + '" y1="' + l + '" x2="' + (X + 14) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
        var takt = {}, kol = 0;
        noter.slice().reverse().forEach(function(p){
          var nokkel = p.n.b + '-' + p.n.oktav, forrige = nokkel in takt ? takt[nokkel] : (gjeldende[p.n.b] || 0);
          if (p.n.f !== forrige) {
            var id = { '-2': 'acc-dflat', '-1': 'acc-flat', '0': 'acc-natural', '1': 'acc-sharp', '2': 'acc-dsharp' }[p.n.f];
            s += '<use href="#' + id + '" transform="translate(' + (X - 22 - kol * 13) + ' ' + p.y + ')" fill="currentColor"/>';
            takt[nokkel] = p.n.f; kol++;
          }
        });
        noter.forEach(function(p){
          var x = X + (p.hoyre ? 16 : 0);
          s += '<ellipse data-a="' + ai + '" data-i="' + p.v + '"' + fargeData(p.n) + ' cx="' + x + '" cy="' + p.y + '" rx="7.2" ry="5.6" fill="currentColor" transform="rotate(-18 ' + x + ' ' + p.y + ')"/>';
        });
      });
      (a.tall || []).forEach(function(t, ti){
        s += '<text x="' + (X + 4) + '" y="' + (bassLav + 30 + ti * 19) + '" class="besifring" text-anchor="middle">' + t + '</text>';
      });
    });
    return '<svg viewBox="0 ' + topp + ' ' + bredde + ' ' + (bunn - topp) + '" role="img" aria-label="' + (etikett || '') + '">' + s + '</svg>';
  }

  /* ---------- Tonefarger ----------
     Newtons regnbue, slik juksebøkene bruker den: C rød, D oransje, E gul, F grønn, G blå, A indigo, H fiolett.
     ♯ gir en lysere og ♭ en mørkere utgave. Notehodene får fargen og navnet som data-f og data-navn,
     så felles.js kan farge dem mens de spilles og vise navnene i en boks. */
  var REGNBUE = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  function fargeFor(n){ return REGNBUE[n.b] + (n.f > 0 ? '-lt' : n.f < 0 ? '-dk' : ''); }
  function fargeData(n){ return ' data-f="' + fargeFor(n) + '" data-navn="' + K.tone(n) + '" data-m="' + midi(n) + '"'; }

  /* ---------- Én notelinje med valgfri nøkkel ----------
     G-nøkkel (diskant), F-nøkkel (bass), altnøkkel og tenornøkkel (C-nøkler).
     ref = diatonisk tonetrinn (oktav * 7 + bokstav) og y-posisjonen til nøkkelens referanselinje. */
  var NOKLER = {
    G:     { ref: 32, y: 127 },   // G-nøkkelen omslutter 2. linje: g¹ (G4)
    F:     { ref: 24, y: 101 },   // F-nøkkelens prikker står rundt 4. linje: f (F3)
    alt:   { ref: 28, y: 114 },   // C-nøkkel på 3. linje: c¹ (C4)
    tenor: { ref: 28, y: 101 }    // C-nøkkel på 4. linje: c¹ (C4)
  };
  function yNokkel(nk, d){ var k = NOKLER[nk]; return k.y - (d - k.ref) * 6.5; }
  /* Tonetrinnet som står på nederste og øverste linje i nøkkelen */
  function linjeområde(nk){ var k = NOKLER[nk]; return { bunn: k.ref - Math.round((140 - k.y) / 6.5), topp: k.ref + Math.round((k.y - 88) / 6.5) }; }
  function nokkelTegn(nk){
    if (nk === 'G') return '<use href="#gclef" transform="translate(6 139.04) scale(0.0767 -0.0767)" fill="currentColor"/>';
    if (nk === 'F') return '<use href="#fclef" transform="translate(4 ' + (101 - 183) + ')" fill="currentColor"/>';
    return '<use href="#cclef" transform="translate(8 ' + (NOKLER[nk].y - 114) + ')" fill="currentColor"/>';
  }
  /* noter: liste med {b, f, oktav}. valg.klikk = { fra, til } gir trykkflater (data-d) for hvert tonetrinn,
     valg.bredde gir fast bredde, valg.ekstra er ekstra svg (for eksempel en forhåndsvisningsnote). */
  function enStav(nk, noter, valg){
    sikreDefs();
    valg = valg || {};
    var bredde = valg.bredde || 220, x0 = valg.x0 || 140, sp = 44, s = '', l;
    for (var i = 0; i < 5; i++) s += '<line x1="4" y1="' + (88 + i * 13) + '" x2="' + (bredde - 4) + '" y2="' + (88 + i * 13) + '" stroke="currentColor" stroke-width="1.3"/>';
    s += nokkelTegn(nk);
    var ys = [];
    noter.forEach(function(n, i){
      var d = n.oktav * 7 + n.b, y = yNokkel(nk, d), x = x0 + (i - (noter.length - 1) / 2) * sp;
      ys.push(y);
      for (l = 153; l <= y + 0.1; l += 13) s += '<line x1="' + (x - 13) + '" y1="' + l + '" x2="' + (x + 13) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
      for (l = 75; l >= y - 0.1; l -= 13) s += '<line x1="' + (x - 13) + '" y1="' + l + '" x2="' + (x + 13) + '" y2="' + l + '" stroke="currentColor" stroke-width="1.3"/>';
      if (n.f) {
        var id = { '-2': 'acc-dflat', '-1': 'acc-flat', '1': 'acc-sharp', '2': 'acc-dsharp' }[n.f];
        s += '<use href="#' + id + '" transform="translate(' + (x - (n.f === -2 ? 18 : 14)) + ' ' + y + ')" fill="currentColor"/>';
      }
      s += '<ellipse class="' + (n.klasse || '') + '"' + fargeData(n) + ' data-i="' + i + '" cx="' + x + '" cy="' + y + '" rx="7.2" ry="5.6" fill="currentColor" transform="rotate(-18 ' + x + ' ' + y + ')"/>';
    });
    var topp = 46, hoyde = 136;
    if (ys.length) { topp = Math.min(46, Math.min.apply(null, ys) - 16); hoyde = Math.max(46 + 136, Math.max.apply(null, ys) + 16) - topp; }
    if (valg.klikk) {
      for (var d = valg.klikk.fra; d <= valg.klikk.til; d++) {
        var y2 = yNokkel(nk, d);
        s += '<rect class="trykkflate" data-d="' + d + '" x="44" y="' + (y2 - 3.25) + '" width="' + (bredde - 48) + '" height="6.5" fill="transparent"/>';
      }
    }
    if (valg.ekstra) s += valg.ekstra;
    return '<svg viewBox="0 ' + topp + ' ' + bredde + ' ' + hoyde + '" role="img" aria-label="' + (valg.etikett || '') + '">' + s + '</svg>';
  }

  /* ---------- Oktavnavn ----------
     Helmholtz-navn slik de brukes i Norge og Polen (c¹ = enstrøken c = midtre C på pianoet),
     og vitenskapelig navn (C4) slik det brukes på engelsk. */
  var OKTAVNAVN = ['subkontraoktav', 'kontraoktav', 'store oktav', 'lille oktav', 'enstrøken oktav', 'tostrøken oktav', 'trestrøken oktav', 'firestrøken oktav', 'femstrøken oktav'];
  function oktavInfo(n){
    var navn = K.tone(n), o = n.oktav;
    var helm = (o >= 3 ? navn.charAt(0).toLowerCase() + navn.slice(1) : navn) + (o >= 4 ? '¹²³⁴⁵'.charAt(o - 4) : o === 1 ? '₁' : o === 0 ? '₂' : '');
    var sci = 'CDEFGAB'.charAt(n.b) + ({ '1': '♯', '-1': '♭', '2': '𝄪', '-2': '𝄫' }[n.f] || '') + o;
    return { helm: helm, sci: sci, oktav: OKTAVNAVN[o] || '' };
  }

  /* ---------- Notebilder fra data ----------
     <div class="vbm-notebilde" data-noter='[[b, f, oktav], ...]' data-form="melodi|akkord"> tegnes med den
     felles notekoden: «melodi» side om side (som skalaer og intervaller), «akkord» over hverandre.
     Samme målestokk som notelinjene ellers, og bare mindre på smale skjermer. */
  function maalestokk(svg, kutt){
    return svg.replace(/viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/, function(m, x, y, w, h){
      return 'style="width:' + Math.round(+w * 1.15) + 'px;max-width:100%;height:auto" viewBox="' + x + ' ' + y + ' ' + w + ' ' + (+h - (kutt || 0)) + '"';
    });
  }
  function tegnNotebilder(rot){
    [].forEach.call((rot || document).querySelectorAll('.vbm-notebilde[data-noter]:not([data-tegnet])'), function(el){
      var liste = JSON.parse(el.getAttribute('data-noter')).map(function(x){ return { b: x[0], f: x[1], oktav: x[2] }; });
      var navn = liste.map(function(n){ return K.tone(n); }).join(', ');
      /* To like toner (ren prim) kan ikke stå over hverandre, så de tegnes side om side */
      var lik = liste.some(function(n, i){ return liste.some(function(m, j){ return j > i && m.b === n.b && m.oktav === n.oktav; }); });
      el.innerHTML = el.getAttribute('data-form') === 'akkord' && !lik
        ? maalestokk(akkordrekke([{ noter: liste, tall: [] }], navn), 40)
        : maalestokk(noter(liste, 0, [], ''), 0);
      el.setAttribute('data-tegnet', '1');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ tegnNotebilder(); });
  else tegnNotebilder();

  /* Lyd: opp og ned, hver tone for seg. */
  function lyd(liste, ned){
    var opp = liste.map(midi), vei = ned ? ned.map(midi) : opp;
    return opp.concat(vei.slice(0, -1).reverse()).map(function(m){ return [m]; });
  }

  var DUR_SKALA = { trinn: DUR };
  return { GRUPPER: GRUPPER, ALLE: ALLE, GRUNN: GRUNN, DUR: DUR, toner: toner, modusIDur: modusIDur, rotFor: rotFor, fargeFor: fargeFor, tegnNotebilder: tegnNotebilder, REGNBUE: REGNBUE, akkordrekke: akkordrekke, storSats: storSats, enStav: enStav, NOKLER: NOKLER, yNokkel: yNokkel, linjeomrade: linjeområde, oktavInfo: oktavInfo, OKTAVNAVN: OKTAVNAVN,
           durRot: function(nr){ return rotFor(nr, DUR_SKALA); },
           fortegnFor: fortegnFor, noter: noter, lyd: lyd, midi: midi, T: T };
})();
