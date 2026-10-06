/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-RTME. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – RYTME
   ---------------------------------------------------------------------
   Rytmer, taktarter, noter for rytme på én notelinje, avspilling og trommegrooves.
   Brukes av leksjonen Rytme og taktarter og rytmequizen.

   Lengder måles i «tikk»: en firedelsnote er 12 tikk. Da går alle verdiene opp:
   helnote 48, halvnote 24, firedel 12, åttendel 6, sekstendel 3,
   punktert halv 36, punktert firedel 18, punktert åttendel 9,
   firedelstriol 8 og åttendelstriol 4 (tre på plassen til to).
   Et element er { d: tikk, p: true for pause, t: true for triol }.
   ===================================================================== */
window.VBM_RYTME = (function(){
  'use strict';

  /* ---------- Taktartene ----------
     grupper: hvordan takten deles i slag (bjelker følger disse), i tikk.
     puls: tikk per slag når tempoet telles. sammensatt: slagene deles i tre. */
  var TAKTER = {
    '2/4':  { topp: 2,  bunn: 4, tikk: 24, grupper: [12, 12], puls: 12, aksent: [1, 0] },
    '3/4':  { topp: 3,  bunn: 4, tikk: 36, grupper: [12, 12, 12], puls: 12, aksent: [1, 0, 0] },
    '4/4':  { topp: 4,  bunn: 4, tikk: 48, grupper: [12, 12, 12, 12], puls: 12, aksent: [1, 0, 0.5, 0] },
    '5/4':  { topp: 5,  bunn: 4, tikk: 60, grupper: [12, 12, 12, 12, 12], puls: 12, aksent: [1, 0, 0, 0.5, 0] },
    '6/8':  { topp: 6,  bunn: 8, tikk: 36, grupper: [18, 18], puls: 18, sammensatt: true, aksent: [1, 0.5] },
    '9/8':  { topp: 9,  bunn: 8, tikk: 54, grupper: [18, 18, 18], puls: 18, sammensatt: true, aksent: [1, 0.4, 0.4] },
    '12/8': { topp: 12, bunn: 8, tikk: 72, grupper: [18, 18, 18, 18], puls: 18, sammensatt: true, aksent: [1, 0.3, 0.6, 0.3] },
    '7/8':  { topp: 7,  bunn: 8, tikk: 42, grupper: [12, 12, 18], puls: 6, ujevn: true, aksent: [1, 0.5, 0.5] }
  };

  /* ---------- Kapitlene og mønstrene ----------
     Et mønster fyller ett eller flere slag. lengde = tikk. Mønstrene i et kapittel
     kommer i tillegg til mønstrene i kapitlene før (unntatt sammensatt takt, som har sine egne). */
  function n(d){ return { d: d }; }
  function p(d){ return { d: d, p: true }; }
  function tr(d){ return { d: d, t: true }; }
  var M = {
    k1: [[n(12)], [p(12)], [n(24)], [p(24)], [n(36)], [n(48)]],
    k2: [[n(6), n(6)], [n(3), n(3), n(3), n(3)], [n(6), n(3), n(3)], [n(3), n(3), n(6)], [p(6), n(6)], [n(6), p(6)]],
    k3: [[n(9), n(3)], [n(18), n(6)], [n(36)]],
    k4: [[tr(4), tr(4), tr(4)], [tr(8), tr(8), tr(8)], [n(6), n(12), n(6)], [n(3), n(6), n(3)]],
    sammensatt: [[n(18)], [n(6), n(6), n(6)], [n(12), n(6)], [n(6), n(12)], [n(9), n(3), n(6)], [p(18)], [p(6), n(6), n(6)], [n(36)], [n(3), n(3), n(6), n(6)]],
    ujevn7: { 12: [[n(12)], [n(6), n(6)], [p(6), n(6)]], 18: [[n(18)], [n(6), n(6), n(6)], [n(12), n(6)]] }
  };
  var KAPITLER = [
    { id: 'k1', navn: 'Puls, takt og notelengder', niva: 1, takter: ['2/4', '3/4', '4/4'], monstre: ['k1'] },
    { id: 'k2', navn: 'Åttendeler og sekstendeler', niva: 2, takter: ['2/4', '3/4', '4/4'], monstre: ['k1', 'k2'] },
    { id: 'k3', navn: 'Punktering', niva: 2, takter: ['2/4', '3/4', '4/4'], monstre: ['k1', 'k2', 'k3'] },
    { id: 'k4', navn: 'Trioler og synkoper', niva: 3, takter: ['2/4', '3/4', '4/4'], monstre: ['k1', 'k2', 'k4'] },
    { id: 'k5', navn: 'Sammensatt takt', niva: 4, takter: ['6/8', '9/8', '12/8'], monstre: ['sammensatt'] },
    { id: 'k6', navn: 'Ujevn takt', niva: 5, takter: ['5/4', '7/8'], monstre: ['k1', 'k2'] }
  ];
  function lengde(m){ return m.reduce(function(s, e){ return s + e.d; }, 0); }
  function tilfeldig(a){ return a[Math.floor(Math.random() * a.length)]; }
  function kopi(x){ return JSON.parse(JSON.stringify(x)); }

  /* Lager én takt: fyller slagene med mønstre som passer. Mønstre over flere slag starter bare
     der de ikke krysser midten av en 4/4-takt (slik noter vanligvis skrives). */
  function lagTakt(kap, takt, krav){
    var T = TAKTER[takt], resultat = [], pos = 0, bruktNy = false;
    var nye = kap.monstre[kap.monstre.length - 1];
    if (takt === '7/8') {
      T.grupper.forEach(function(g){ var m = kopi(tilfeldig(M.ujevn7[g])); resultat = resultat.concat(m); });
      return resultat;
    }
    var alle = [];
    kap.monstre.forEach(function(k){ M[k].forEach(function(m){ alle.push({ m: m, ny: k === nye }); }); });
    for (var forsok = 0; forsok < 200 && pos < T.tikk; forsok++) {
      var rest = T.tikk - pos;
      var mulige = alle.filter(function(x){
        var L = lengde(x.m);
        if (L > rest || pos % T.puls) return false;
        if (T.sammensatt) return L % 18 === 0;
        if (L > 12 && takt === '4/4' && pos < 24 && pos + L > 24 && L !== 48 && L !== 36) return false;
        if (L === 48 && pos) return false;
        if (L === 36 && takt !== '3/4' && takt !== '4/4') return false;
        if (x.m.some(function(e){ return e.d === 8; }) && pos % 24) return false;
        return true;
      });
      if (!mulige.length) break;
      /* Nye ting fra kapitlet skal være med, så de vektes opp */
      var nyeMulige = mulige.filter(function(x){ return x.ny; });
      var valgt = (krav !== false && !bruktNy && nyeMulige.length && Math.random() < 0.7) ? tilfeldig(nyeMulige) : tilfeldig(mulige);
      if (valgt.ny) bruktNy = true;
      resultat = resultat.concat(kopi(valgt.m));
      pos += lengde(valgt.m);
    }
    if (pos !== T.tikk) return lagTakt(kap, takt, krav);
    /* En takt med bare pauser gir ingen oppgave */
    if (resultat.every(function(e){ return e.p; })) return lagTakt(kap, takt, krav);
    return resultat;
  }

  /* ---------- Noter ---------- */
  var Y = 100;           // notelinjen
  var STILK = 34;        // stilklengde
  function bredde(e){ return 16 + Math.min(e.d, 24) * 2.3 + (e.d >= 36 ? 18 : 0); }
  function verdiType(e){
    if (e.t) return e.d === 8 ? 4 : 8;   // firedelstriol ser ut som firedel, åttendelstriol som åttendel
    return { 48: 1, 36: 2, 24: 2, 18: 4, 12: 4, 9: 8, 6: 8, 3: 16 }[e.d];
  }
  function punktert(e){ return !e.t && (e.d === 36 || e.d === 18 || e.d === 9); }
  var PAUSE = {
    /* Pauser tegnet som figurer, sentrert på notelinjen */
    1: function(x){ return '<rect x="' + (x - 7) + '" y="' + Y + '" width="14" height="6" fill="currentColor"/>'; },
    2: function(x){ return '<rect x="' + (x - 7) + '" y="' + (Y - 6) + '" width="14" height="6" fill="currentColor"/>'; },
    4: function(x){ return '<path transform="translate(' + x + ' ' + Y + ')" fill="currentColor" d="M-2.6,-15 L4.2,-6.6 C1.4,-4 1,-1.6 3.6,2.4 L4.6,3.8 C1.2,2.6 -2,3.6 -0.6,7.4 C0,9 1,10.4 1.8,11.6 C-2.8,9.4 -4.8,4.6 -1,2.6 C0.2,2 1.4,2 2,2.2 L-3.4,-4.4 C-0.6,-6.8 -0.4,-9.4 -2.6,-13 Z"/>'; },
    8: function(x){ return '<g transform="translate(' + x + ' ' + Y + ')" fill="currentColor"><circle cx="-2.4" cy="-6" r="2.6"/><path d="M-4.4,-5.2 C-2.6,-3 0.6,-3.2 3.4,-6.6 L4.4,-6 L-0.2,9 L-1.8,8.6 L2,-2.6 C-0.2,-1.4 -3.2,-1.6 -4.4,-3.4 Z"/></g>'; },
    16: function(x){ return '<g transform="translate(' + x + ' ' + Y + ')" fill="currentColor"><circle cx="-1.4" cy="-8.6" r="2.5"/><circle cx="-3.6" cy="-1.6" r="2.5"/><path d="M-3.4,-7.8 C-1.6,-5.8 1.4,-6 4.2,-9.2 L5.2,-8.6 L-1.4,13 L-3,12.6 L-0.4,4.2 C-2.4,5.4 -5,5.2 -5.6,3.4 L-5.4,3 C-3.8,4.6 -0.6,4 0,3 L2.2,-4.8 C0.2,-3.8 -2.4,-4 -3.4,-5.6 Z"/></g>'; }
  };
  function hode(x, type, i){
    var fyll = type <= 2 ? 'none' : 'currentColor', rx = type === 1 ? 7.6 : 6.6;
    return '<ellipse data-i="' + i + '" cx="' + x + '" cy="' + Y + '" rx="' + rx + '" ry="5.2" fill="' + fyll + '" stroke="currentColor" stroke-width="' + (type <= 2 ? 1.8 : 1) + '" transform="rotate(-20 ' + x + ' ' + Y + ')"/>';
  }
  function flagg(x, antall){
    var s = '';
    for (var k = 0; k < antall; k++) {
      var y0 = Y - STILK + k * 7;
      s += '<path fill="currentColor" d="M' + x + ',' + y0 + ' C' + (x + 1) + ',' + (y0 + 6) + ' ' + (x + 10) + ',' + (y0 + 9) + ' ' + (x + 9) + ',' + (y0 + 20)
        + ' C' + (x + 12) + ',' + (y0 + 10) + ' ' + (x + 3) + ',' + (y0 + 8) + ' ' + x + ',' + (y0 + 3) + ' Z"/>';
    }
    return s;
  }
  /* Tegner en rytme. takter: liste med takter (lister med elementer).
     valg: { takt: '4/4', visTakt: true, telling: true, mangler: indeks som vises som «?», etikett } */
  function noter(takter, valg){
    valg = valg || {};
    var T = TAKTER[valg.takt] || TAKTER['4/4'];
    var x = 26, s = '', i = 0, beams = '', tall = '', telle = '';
    /* Slagverksnøkkel og taktart */
    if (!valg.enkel) s += '<rect x="8" y="' + (Y - 12) + '" width="3.4" height="24" fill="currentColor"/><rect x="14" y="' + (Y - 12) + '" width="3.4" height="24" fill="currentColor"/>';
    if (valg.enkel) x = 8;
    else if (valg.visTakt !== false) {
      s += '<text class="taktart" x="36" y="' + (Y - 3) + '" text-anchor="middle">' + T.topp + '</text><text class="taktart" x="36" y="' + (Y + 19) + '" text-anchor="middle">' + T.bunn + '</text>';
      x = 56;
    } else x = 34;
    takter.forEach(function(takt, ti){
      var pos = 0, grStart = 0, gi = 0, gruppe = [];
      var grenser = []; var acc = 0; T.grupper.forEach(function(g){ acc += g; grenser.push(acc); });
      function lukkGruppe(){
        /* Bjelker over åttendeler og kortere innenfor samme slag */
        var noteliste = gruppe.filter(function(g){ return !g.e.p && verdiType(g.e) >= 8; });
        if (gruppe.length > 1 && noteliste.length === gruppe.length) {
          var x1 = gruppe[0].x + 6, x2 = gruppe[gruppe.length - 1].x + 6, yb = Y - STILK;
          beams += '<rect x="' + x1 + '" y="' + yb + '" width="' + (x2 - x1 + 1.3) + '" height="4.4" fill="currentColor"/>';
          /* Andre bjelke for sekstendeler */
          gruppe.forEach(function(g, k){
            if (verdiType(g.e) < 16) return;
            var forrige = gruppe[k - 1], neste = gruppe[k + 1];
            if (neste && verdiType(neste.e) >= 16) beams += '<rect x="' + (g.x + 6) + '" y="' + (yb + 7) + '" width="' + (neste.x - g.x + 1.3) + '" height="4.4" fill="currentColor"/>';
            else if (!(forrige && verdiType(forrige.e) >= 16)) {
              var mot = neste ? 1 : -1;
              beams += '<rect x="' + (mot > 0 ? g.x + 6 : g.x + 6 - 9) + '" y="' + (yb + 7) + '" width="10.3" height="4.4" fill="currentColor"/>';
            }
          });
          gruppe.forEach(function(g){ g.bjelke = true; });
          if (gruppe[0].e.t) tall += '<text class="triol" x="' + ((x1 + x2) / 2) + '" y="' + (yb - 6) + '" text-anchor="middle">3</text>';
        }
        gruppe.forEach(function(g){
          if (g.e.p || g.mangler) return;
          var type = verdiType(g.e);
          if (type >= 2) s += '<line x1="' + (g.x + 6) + '" y1="' + (Y - 1) + '" x2="' + (g.x + 6) + '" y2="' + (Y - STILK) + '" stroke="currentColor" stroke-width="1.5"/>';
          if (!g.bjelke && type >= 8) s += flagg(g.x + 6.7, type === 8 ? 1 : 2);
        });
        gruppe = [];
      }
      var triolStart = null;
      takt.forEach(function(e){
        var w = bredde(e), cx = valg.enkel ? 26 : x + w / 2 - 6;
        var mangler = valg.mangler === i;
        if (mangler) s += '<rect class="mangler" x="' + (cx - 11) + '" y="' + (Y - 26) + '" width="22" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/><text class="mangler-tekst" x="' + cx + '" y="' + (Y + 3) + '" text-anchor="middle">?</text>';
        else if (e.p) s += '<g data-i="' + i + '" class="pause">' + PAUSE[verdiType(e)](cx) + '</g>';
        else s += hode(cx, verdiType(e), i);
        if (punktert(e) && !mangler) s += '<circle cx="' + (cx + 13) + '" cy="' + (Y - 4) + '" r="2.1" fill="currentColor"/>';
        /* Firedelstrioler får klamme med 3 */
        if (e.t && e.d === 8) { if (triolStart === null) triolStart = cx; if ((pos + e.d) % 24 === 0) { tall += '<path d="M' + (triolStart - 4) + ',' + (Y - STILK - 4) + ' v-6 H' + (cx + 10) + ' v6" fill="none" stroke="currentColor" stroke-width="1.2"/><text class="triol" x="' + ((triolStart + cx + 6) / 2) + '" y="' + (Y - STILK - 13) + '" text-anchor="middle">3</text>'; triolStart = null; } }
        /* Telling under notelinjen: slagnummer der et slag begynner */
        if (valg.telling && pos % T.puls === 0) telle += '<text class="telling" x="' + cx + '" y="' + (Y + 30) + '" text-anchor="middle">' + (pos / T.puls + 1) + '</text>';
        else if (valg.telling && !T.sammensatt && T.puls === 12 && pos % 6 === 0) telle += '<text class="telling" x="' + cx + '" y="' + (Y + 30) + '" text-anchor="middle">og</text>';
        gruppe.push({ e: e, x: cx, mangler: mangler });
        pos += e.d; x += w; i++;
        while (gi < grenser.length && pos >= grenser[gi]) { if (pos === grenser[gi] || gruppe.length) lukkGruppe(); gi++; }
      });
      if (gruppe.length) lukkGruppe();
      var siste = ti === takter.length - 1;
      x += 4;
      if (valg.enkel) { x -= 4; return; }
      if (siste) s += '<rect x="' + (x - 1) + '" y="' + (Y - 16) + '" width="1.4" height="32" fill="currentColor"/><rect x="' + (x + 3) + '" y="' + (Y - 16) + '" width="4" height="32" fill="currentColor"/>';
      else s += '<rect x="' + x + '" y="' + (Y - 16) + '" width="1.4" height="32" fill="currentColor"/>';
      x += 12;
    });
    var w2 = valg.enkel ? 50 : x + 6;
    var linje = '<line x1="4" y1="' + Y + '" x2="' + (w2 - 12) + '" y2="' + Y + '" stroke="currentColor" stroke-width="1.3"/>';
    var topp = Y - STILK - 30, hoyde = (valg.telling ? 76 : 58) + STILK;
    /* Fast målestokk: alle rytmer tegnes like store, og bare lange rytmer krymper på smale skjermer. */
    var skala = valg.skala || 1.25;
    return '<svg width="' + Math.round(w2 * skala) + '" viewBox="0 ' + topp + ' ' + w2 + ' ' + hoyde + '" role="img" aria-label="' + (valg.etikett || '') + '">' + linje + s + beams + tall + telle + '</svg>';
  }

  /* ---------- Avspilling ----------
     tempo = slag per minutt (firedel i enkel takt, punktert firedel i sammensatt, åttendel i 7/8).
     inntelling: én takt med metronom først. metronom: klikk på hvert slag under rytmen.
     ganger: hvor mange ganger rytmen spilles etter hverandre (i en løkke, uten pause). */
  function hendelser(takter, takt, tempo, valg){
    valg = valg || {};
    var T = TAKTER[takt], sekPerTikk = 60 / (tempo * T.puls), liste = [], t = 0, i = 0, m = valg.tone || 72;
    function klikk(t0, sterk){ liste.push({ t: t0, lyd: 'klikk', v: sterk ? 1 : 0.55 }); }
    function slagStart(posisjon){
      var acc = 0, g;
      for (g = 0; g < T.grupper.length; g++) { if (posisjon === acc) return g; acc += T.grupper[g]; }
      return -1;
    }
    if (valg.inntelling !== false) {
      var acc0 = 0;
      T.grupper.forEach(function(g, k){ klikk(acc0 * sekPerTikk, k === 0); acc0 += g; });
      t = T.tikk * sekPerTikk;
    }
    var runder = []; for (var r = 0; r < (valg.ganger || 1); r++) runder = runder.concat(takter);
    runder.forEach(function(takt2, ti){
      if (ti % takter.length === 0) i = 0;   // samme noter lyser opp hver gang rytmen gjentas
      var pos = 0;
      if (valg.metronom) { var acc = 0; T.grupper.forEach(function(g, k){ liste.push({ t: t + acc * sekPerTikk, lyd: 'klikk', v: k === 0 ? 0.6 : 0.35 }); acc += g; }); }
      takt2.forEach(function(e){
        if (!e.p) {
          var g = slagStart(pos), sterk = g >= 0 ? (T.aksent[g] || 0) : 0;
          liste.push({ t: t + pos * sekPerTikk, lyd: 'skarp', v: 0.7 + 0.3 * sterk, m: m, d: e.d * sekPerTikk, i: i });
        } else liste.push({ t: t + pos * sekPerTikk, lyd: 'klikk', v: 0, i: i });
        pos += e.d; i++;
      });
      t += T.tikk * sekPerTikk;
    });
    return liste.filter(function(h){ return h.v > 0 || h.i != null; }).map(function(h){ if (h.v === 0) { h.v = 0.0001; } return h; });
  }

  /* ---------- Grooves for å høre taktarten ----------
     Basstromme på taktens første slag (sterkest), skarptromme på de andre hovedslagene,
     og hi-hat på hver underdeling: to per slag i enkel takt, tre i sammensatt. */
  function groove(takt, tempo, antallTakter, tone){
    var T = TAKTER[takt], sek = 60 / (tempo * T.puls), liste = [], t = 0, m = tone || 60;
    var under = T.sammensatt || takt === '7/8' ? 6 : 6;
    for (var k = 0; k < antallTakter; k++) {
      var acc = 0;
      T.grupper.forEach(function(g, gi){
        var a = T.aksent[gi] || 0;
        if (gi === 0) liste.push({ t: t + acc * sek, lyd: 'bass', v: 1, m: m - 12, d: 0.3 });
        else liste.push({ t: t + acc * sek, lyd: 'skarp', v: 0.45 + 0.4 * a, m: m + 7, d: 0.2 });
        for (var u = 0; u < g; u += under) liste.push({ t: t + (acc + u) * sek, lyd: 'hihat', v: u === 0 ? 0.8 : 0.45, m: m + 12, d: 0.12 });
        acc += g;
      });
      t += T.tikk * sek;
    }
    return liste;
  }

  /* Navn på verdiene (for svarknapper og forklaringer) */
  var VERDINAVN = { 48: 'Helnote', 36: 'Punktert halvnote', 24: 'Halvnote', 18: 'Punktert firedelsnote', 12: 'Firedelsnote', 9: 'Punktert åttendelsnote', 6: 'Åttendelsnote', 3: 'Sekstendelsnote' };
  var PAUSENAVN = { 48: 'Helpause', 24: 'Halvpause', 12: 'Firedelspause', 6: 'Åttendelspause', 3: 'Sekstendelspause' };

  return { TAKTER: TAKTER, KAPITLER: KAPITLER, M: M, lagTakt: lagTakt, noter: noter, hendelser: hendelser, groove: groove,
           lengde: lengde, VERDINAVN: VERDINAVN, PAUSENAVN: PAUSENAVN, tilfeldig: tilfeldig, kopi: kopi };
})();
