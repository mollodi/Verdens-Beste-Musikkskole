/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-KCX8. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* Verdens Beste Musikkskole – felles lydmotor for juksebøkene.
   Ekte opptak av piano, akustisk gitar og strykere (fiolin + cello).
   Bare én lyd spiller om gangen: et nytt trykk stopper den forrige,
   og et nytt trykk på samme knapp stopper lyden.
   Hvis lydfilene ikke kan lastes, brukes den innebygde synthen. */
(function(){
  'use strict';
  var cfg = window.VBM_LYD || {};
  var STEP = cfg.step || 0.66, NOTE = cfg.noteDur || 1.4, CHORD = cfg.chordDur || 3.2;
  var GAP1 = cfg.gap1 || 0.33, GAP2 = cfg.gap2 || 0.52;
  /* Tempo fra Innstillinger (vbm-tempo): «raskt» er standard og dagens fart. «middels» og «sakte» gir
     mer tid mellom tonene, i samme forhold som rytmesidens tempo 100, 80 og 60. Tonelengdene endres ikke. */
  var STEP0 = STEP, GAP10 = GAP1, GAP20 = GAP2, S_STEG0 = 0.5;
  function tempoFaktor(){ var v = ''; try { v = localStorage.getItem('vbm-tempo') || ''; } catch(e){} return v === 'sakte' ? 100 / 60 : v === 'middels' ? 100 / 80 : 1; }
  function oppdaterTempo(){ var k = tempoFaktor(); STEP = STEP0 * k; GAP1 = GAP10 * k; GAP2 = GAP20 * k; S_STEG = S_STEG0 * k; }

  /* ---------- tonenavn <-> MIDI (filnavn bruker s for #, f.eks. Cs4) ---------- */
  var PC = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'];
  function nameOf(m){ return PC[m % 12] + (Math.floor(m / 12) - 1); }
  function midiOf(n){ var o = parseInt(n.slice(-1), 10); return (o + 1) * 12 + PC.indexOf(n.slice(0, -1)); }
  function names(list){ return list.split(' ').map(midiOf); }

  /* ---------- instrumenter ----------
     Hvert instrument består av ett eller flere lag (layers). Et lag er én samling
     opptak: shift = transponering i halvtoner, level = volum, cents = stemming,
     delay = forsinkelse i sekunder, range = hvor langt et opptak kan strekkes. */
  var B = window.VBM_LYD_BASE || {};
  var CDN = 'https://cdn.jsdelivr.net/npm/';
  var pianoNotes = []; for (var m = 21; m <= 108; m += 3) pianoNotes.push(m);
  var GUITAR = names('D2 Ds2 E2 F2 Fs2 G2 Gs2 A2 As2 B2 C3 Cs3 D3 Ds3 E3 F3 Fs3 G3 Gs3 A3 As3 B3 ' +
                     'C4 Cs4 D4 Ds4 E4 F4 Fs4 G4 Gs4 A4 As4 B4 C5 Cs5 D5');
  var VIOLIN = names('G3 A3 C4 E4 G4 A4 C5 E5 G5 A5 C6 E6 G6 A6 C7');
  var CELLO  = names('C2 D2 Ds2 E2 F2 G2 Gs2 A2 As2 B2 C3 Cs3 D3 Ds3 E3 F3 Fs3 G3 Gs3 A3 As3 B3 ' +
                     'C4 Cs4 D4 Ds4 E4 F4 Fs4 G4 Gs4 A4 As4 B4 C5');

  var INSTR = {
    piano: { label: 'Piano', attack: 0.005, release: 0.35, layers: [
      { base: B.piano || 'https://tonejs.github.io/audio/salamander/', notes: pianoNotes, level: 0.9 }
    ]},
    /* Gitar klinger en oktav lavere enn den er notert – slik som en ekte gitar. */
    gitar: { label: 'Gitar', attack: 0.005, release: 0.35, layers: [
      { base: B.gitar || CDN + 'tonejs-instrument-guitar-acoustic-mp3@1.1.2/', notes: GUITAR, shift: -12, level: 1.0 }
    ]},
    /* Strykere: fiolin på tonen, en svakt forstemt fiolin for et fyldigere «ensemble»,
       og cello en oktav under som gir varme i bunnen. Myk start og lang utklinging. */
    strykere: { label: 'Strykere', attack: 0.09, release: 0.6, sustain: true, layers: [
      { base: B.fiolin || CDN + 'tonejs-instrument-violin-mp3@1.1.1/', notes: VIOLIN, level: 0.55 },
      { base: B.fiolin || CDN + 'tonejs-instrument-violin-mp3@1.1.1/', notes: VIOLIN, level: 0.32, cents: 8, delay: 0.018 },
      { base: B.cello  || CDN + 'tonejs-instrument-cello-mp3@1.1.1/',  notes: CELLO,  level: 0.38, shift: -12, range: 2 }
    ]}
  };
  INSTR.piano.layers.concat(INSTR.gitar.layers, INSTR.strykere.layers)
    .forEach(function(L){ L.shift = L.shift || 0; L.cents = L.cents || 0; L.delay = L.delay || 0; L.range = L.range || 12; });

  /* Rytmesidene (window.VBM_LYD_RYTME_SIDE = true) får også trommer, og trommer er valgt som standard der.
     Trommelydene er ekte opptak fra Versilian Community Sample Library (CC0) og ligger på nettstedet selv. */
  var RYTME = !!window.VBM_LYD_RYTME_SIDE, LAGRE = RYTME ? 'vbm-instrument-rytme' : 'vbm-instrument';
  /* window.VBM_LYD_TROMMEFILER kan erstatte filene (brukes i forhåndsvisninger der lydene ligger inne i siden). */
  var TROMMER = window.VBM_LYD_TROMMEFILER || { skarp: 'rytme-skarptromme.mp3', bass: 'rytme-basstromme.mp3', hihat: 'rytme-hihat.mp3', klikk: 'rytme-treblokk.mp3' };
  var TROMME_NIVA = { skarp: 0.75, bass: 0.95, hihat: 0.55, klikk: 0.7 };
  if (RYTME) {
    var med = { trommer: { label: 'Trommer', layers: [] } };
    Object.keys(INSTR).forEach(function(k){ med[k] = INSTR[k]; });
    INSTR = med;
  }
  var current = RYTME ? 'trommer' : 'piano';
  try { var saved = localStorage.getItem(LAGRE); if (INSTR[saved]) current = saved; } catch(e){}

  /* ---------- lydkontekst ---------- */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, out = null, wave = null;
  function ensureCtx(){
    if (!ctx) {
      ctx = new AC();
      out = ctx.createDynamicsCompressor();
      out.threshold.value = -14; out.knee.value = 12; out.ratio.value = 4;
      out.attack.value = 0.003; out.release.value = 0.25;
      out.connect(ctx.destination);
      wave = ctx.createPeriodicWave(new Float32Array(8),
        new Float32Array([0, 1, 0.42, 0.20, 0.10, 0.05, 0.025, 0.012]), {disableNormalization:false});
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---------- lasting av lydfiler (bare de tonene som trengs, én gang) ---------- */
  var cache = {};
  function nearest(L, p){
    var best = L.notes[0];
    L.notes.forEach(function(s){ if (Math.abs(s - p) < Math.abs(best - p)) best = s; });
    return Math.abs(best - p) <= L.range ? best : null;   // null = laget spiller ikke denne tonen
  }
  function decode(data){
    return new Promise(function(res, rej){
      var p = ctx.decodeAudioData(data, res, rej);
      if (p && p.then) p.then(res, rej);
    });
  }
  /* Lyd som ligger inne i siden (data:-adresser, brukt i forhåndsvisninger) pakkes ut direkte.
     fetch() ville blitt stoppet av sikkerhetsreglene på sider som bare tillater kjente adresser. */
  function fraData(url){
    var b64 = url.slice(url.indexOf(',') + 1), bin = atob(b64), buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return Promise.resolve(buf.buffer);
  }
  function load(url){
    if (!cache[url]) {
      cache[url] = (url.indexOf('data:') === 0 ? fraData(url) : fetch(url)
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }))
        .then(decode);
      cache[url].catch(function(){ delete cache[url]; });
    }
    return cache[url];
  }
  function urlFor(L, s){ return L.base + nameOf(s) + '.mp3'; }

  /* ---------- fargelegging i takt med lyden ----------
     Fargene styres av lydklokken (ctx.currentTime), som sjekkes hvert 15. millisekund. Hver sjekk leser
     klokken på nytt, så en sjekk som kommer litt sent, gir ikke feil som hoper seg opp.
     (requestAnimationFrame brukes ikke: den stoppes eller bremses i innebygde rammer, som forhåndsvisninger.)
     Forsinkelsen fra lydkortet til høyttaleren eller hodetelefonene (ctx.outputLatency, ofte stor med
     Bluetooth) trekkes fra, slik at fargen kommer når tonen høres. */
  var planlagt = [], rafId = null;
  /* Forsinkelsen begrenses til 0,5 s, i tilfelle en nettleser rapporterer en urimelig verdi */
  function forsinkelse(){ var f = ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0; return Math.min(Math.max(f, 0), 0.5); }
  function tikk(){
    rafId = null;
    if (!ctx) return;
    var na = ctx.currentTime - forsinkelse(), klare = [], rest = [];
    planlagt.forEach(function(p){ (p.t <= na ? klare : rest).push(p); });
    planlagt = rest;
    klare.sort(function(a, b){ return a.t - b.t; }).forEach(function(p){ try { p.fn(); } catch(e){} });
    if (planlagt.length) rafId = setTimeout(tikk, 15);
  }
  function planlegg(tCtx, fn){
    planlagt.push({ t: tCtx, fn: fn });
    if (!rafId) rafId = setTimeout(tikk, 15);
  }

  /* ---------- aktive stemmer, slik at alt kan stoppes ---------- */
  var voices = [], activeBtn = null, timer = null, token = 0, aktivVedToner = null;
  function stopAll(){
    token++;
    if (ctx) {
      var now = ctx.currentTime;
      voices.forEach(function(v){
        try {
          v.gain.gain.cancelScheduledValues(now);
          v.gain.gain.setValueAtTime(v.gain.gain.value, now);
          v.gain.gain.linearRampToValueAtTime(0, now + 0.06);
          v.src.stop(now + 0.08);
        } catch(e){}
      });
    }
    voices = [];
    if (timer) { clearTimeout(timer); timer = null; }
    stegTimere.forEach(clearTimeout); stegTimere = [];
    planlagt = []; if (rafId) { clearTimeout(rafId); rafId = null; }
    /* Fargene og navnelappen fra forrige avspilling fjernes når noe nytt starter eller alt stoppes */
    if (aktivVedToner) { var gml = aktivVedToner; aktivVedToner = null; try { gml(null); } catch(e){} }
    if (aktivVedSteg) { var v = aktivVedSteg; aktivVedSteg = null; try { v(-1); } catch(e){} }
    if (activeBtn) { activeBtn.classList.remove('playing', 'loading'); activeBtn = null; }
  }
  function track(src, gain){
    var v = {src: src, gain: gain}; voices.push(v);
    src.onended = function(){ var i = voices.indexOf(v); if (i > -1) voices.splice(i, 1); };
  }

  function sampleVoice(inst, buf, rate, t0, dur, level){
    var src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; src.playbackRate.value = rate;
    // Strykere holder tonen: er opptaket for kort, gjentas midtpartiet.
    if (inst.sustain && buf.duration / rate < dur + inst.release) {
      src.loop = true; src.loopStart = buf.duration * 0.35; src.loopEnd = buf.duration * 0.85;
    }
    src.connect(g); g.connect(out);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(level, t0 + inst.attack);
    g.gain.setValueAtTime(level, t0 + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + inst.release);
    src.start(t0); src.stop(t0 + dur + inst.release + 0.05);
    track(src, g);
  }
  function synthVoice(m, t0, dur, peak){
    var osc = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    osc.setPeriodicWave(wave); osc.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
    f.type = 'highpass'; f.frequency.value = 180; f.Q.value = 0.6;
    osc.connect(f); f.connect(g); g.connect(out);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(Math.max(peak * 0.16, 0.0005), t0 + dur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
    track(osc, g);
  }

  /* Opp, ned, og til slutt alle tonene samtidig – som før.
     ganger = hvor mange ganger det hele spilles (vanligvis 1, 3 i prøvemodus i gehørquizen). */
  var MELLOM = 1.2;   // sekunder mellom hver gang
  /* kadens = en liste med akkorder som spilles etterpå, én etter én (gehørquizen bruker
     dette for akkorder som bare kan høres i sammenheng, f.eks. tysk sekst). */
  var K_STEG = 1.25, K_AKK = 1.1, K_SISTE = 2.6;
  /* samlet = true: bare alle tonene samtidig, uten opp og ned (superavansert i gehørquizene). */
  /* merk(t, indekser): kalles med hvilke av tonene (indekser i notes) som klinger fra tidspunkt t,
     én om gangen når de spilles brutt, alle når de spilles samlet, og [] etterpå (f.eks. under kadensen). */
  function schedule(notes, voiceFn, ganger, kadens, samlet, merk){
    merk = merk || function(){};
    var t = ctx.currentTime + 0.05, n = notes.length, slutt = t, alle = notes.map(function(m, i){ return i; });
    for (var k = 0; k < (ganger || 1); k++) {
      if (k) t = slutt + MELLOM;
      var t3 = t;
      if (!samlet) {
        notes.forEach(function(m, i){ voiceFn(m, t + i * STEP, NOTE, false, n); merk(t + i * STEP, [i]); });
        var t2 = t + n * STEP + GAP1, rev = notes.slice().reverse();
        rev.forEach(function(m, i){ voiceFn(m, t2 + i * STEP, NOTE, false, n); merk(t2 + i * STEP, [n - 1 - i]); });
        t3 = t2 + n * STEP + GAP2;
      }
      notes.forEach(function(m){ voiceFn(m, t3, CHORD, true, n); });
      merk(t3, alle);
      slutt = t3 + CHORD;
      merk(slutt, []);
      if (kadens && kadens.length) {
        var tk = slutt + 0.6;
        kadens.forEach(function(akk, i){
          var siste = i === kadens.length - 1;
          akk.forEach(function(m){ voiceFn(m, tk + i * K_STEG, siste ? K_SISTE : K_AKK, true, akk.length); });
        });
        slutt = tk + (kadens.length - 1) * K_STEG + K_SISTE;
      }
    }
    return (slutt + 0.7) - ctx.currentTime;
  }

  /* sekvens = en liste med steg som spilles etter hverandre, hvert steg én eller flere toner
     (kvintsirkelen bruker dette til skalaer). Siste steg klinger lenger. */
  var S_STEG = 0.5, S_TONE = 0.9, S_SISTE = 2.2;   // S_STEG justeres av oppdaterTempo()
  /* vedSteg(i) kalles når steg i begynner å klinge, og vedSteg(-1) når alt er ferdig eller stoppet,
     slik at siden kan farge tonen som spilles. */
  var stegTimere = [], aktivVedSteg = null;
  function planSekvens(sekvens, voiceFn, vedSteg, my){
    var t = ctx.currentTime + 0.05;
    sekvens.forEach(function(steg, i){
      var siste = i === sekvens.length - 1;
      steg.forEach(function(m){ voiceFn(m, t + i * S_STEG, siste ? S_SISTE : S_TONE, steg.length > 1, steg.length); });
    });
    if (vedSteg) {
      aktivVedSteg = vedSteg;
      sekvens.forEach(function(steg, i){
        planlegg(t + i * S_STEG, function(){ if (my === token) vedSteg(i); });
      });
      planlegg(t + (sekvens.length - 1) * S_STEG + S_SISTE, function(){ if (my === token) { aktivVedSteg = null; vedSteg(-1); } });
    }
    return (t + (sekvens.length - 1) * S_STEG + S_SISTE + 0.7) - ctx.currentTime;
  }

  function play(notes, btn, ganger, kadens, samlet, sekvens, vedSteg, vedToner){
    oppdaterTempo();
    /* vedToner(indekser) brukes til fargelegging når tonene spilles med VBM_LYD_SPILL; vedToner(null) til slutt */
    var merk = vedToner ? function(tt, idx){ var my = token; planlegg(tt, function(){ if (my === token) vedToner(idx); }); } : null;
    function plan(voiceFn){
      aktivVedToner = vedToner || null;   // etter stopAll(), så den gjelder denne avspillingen
      if (sekvens) return planSekvens(sekvens, voiceFn, vedSteg, token);
      var lengde = schedule(notes, voiceFn, ganger, kadens, samlet, merk);
      if (vedToner) { var my2 = token; planlegg(ctx.currentTime + lengde - 0.6, function(){ if (my2 === token) vedToner(null); }); }
      return lengde;
    }
    stopAll();
    var my = token, inst = INSTR[current];
    activeBtn = btn; btn.classList.add('playing', 'loading');
    var urls = {};
    var alle = notes.concat.apply(notes, (kadens || []).concat(sekvens || []));
    /* Gitar og strykere har ikke hele pianoets område (A0 til C8). Toner utenfor spilles på piano,
       og siden får beskjed (felles.js viser en kort melding). */
    var OMRADE = { gitar: [40, 88], strykere: [36, 100] }, omr = OMRADE[current];
    if (omr && alle.some(function(m){ return m < omr[0] || m > omr[1]; })) {
      inst = INSTR.piano;
      try { window.dispatchEvent(new CustomEvent('vbm-utenfor', { detail: { instrument: INSTR[current].label } })); } catch(e){}
    }
    inst.layers.forEach(function(L){
      alle.forEach(function(m){ var s = nearest(L, m + L.shift); if (s !== null) urls[urlFor(L, s)] = true; });
    });
    var list = Object.keys(urls);
    Promise.all(list.map(load)).then(function(bufs){
      if (my !== token) return;
      var got = {}; list.forEach(function(u, i){ got[u] = bufs[i]; });
      btn.classList.remove('loading');
      finish(plan(function(m, t0, dur, chord, n){
        var mix = chord ? Math.min(1, 3 / n) : 1;
        inst.layers.forEach(function(L){
          var p = m + L.shift, s = nearest(L, p);
          if (s === null) return;
          var rate = Math.pow(2, (p - s) / 12 + L.cents / 1200);
          sampleVoice(inst, got[urlFor(L, s)], rate, t0 + L.delay, dur, L.level * 0.62 * mix);
        });
      }), my);
    }).catch(function(){
      if (my !== token) return;
      btn.classList.remove('loading');
      var peak = Math.min(0.20, 0.85 / Math.max(1, sekvens ? 3 : notes.length));
      finish(plan(function(m, t0, dur, chord){ synthVoice(m, t0, dur, chord ? peak * 0.9 : peak); }), my);
    });
  }
  function finish(total, my){
    timer = setTimeout(function(){
      if (my === token && activeBtn) { activeBtn.classList.remove('playing'); activeBtn = null; }
    }, total * 1000);
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('.play-btn');
    if (!btn) return;
    ensureCtx();                                  // må skje direkte i trykket (iOS)
    if (btn === activeBtn) { stopAll(); return; } // trykk igjen = stopp
    /* Har knappen et notebilde i nærheten, farges notene mens de spilles (felles.js viser navnet i lappen) */
    var holder = null, el = btn;
    for (var k = 0; k < 6 && el && !holder; k++) { el = el.parentElement; if (el && el.querySelector('.vbm-notebilde svg, svg [data-f]')) holder = el.querySelector('.vbm-notebilde, svg [data-f]').closest('.vbm-notebilde') || el; }
    var farg = holder && window.VBM_FARG ? window.VBM_FARG(holder.querySelector('svg') || holder) : null;
    play(btn.getAttribute('data-notes').split(',').map(Number), btn, null, null, null, null, null, farg);
  });
  document.addEventListener('touchstart', function(){ ensureCtx(); }, {once: true, passive: true});

  /* ---------- velger for instrument (nederst til høyre) ---------- */
  /* Utseendet ligger i stil.css (.vbm-pille og .vbm-instr-float). */

  function buildPicker(){
    var wrap = document.createElement('div'), bs = getComputedStyle(document.body);
    wrap.className = 'vbm-pille vbm-instr vbm-instr-float';
    wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Velg instrument');
    /* Samme utseende på alle sider, som menylinjen: mørk med lys tekst */
    wrap.style.background = '#12151A';
    wrap.style.color = '#F6F1E7';
    Object.keys(INSTR).forEach(function(k){
      var b = document.createElement('button'); b.type = 'button';
      b.innerHTML = '<span>' + INSTR[k].label + '</span>';
      b.setAttribute('aria-pressed', k === current ? 'true' : 'false');
      b.addEventListener('click', function(){
        if (k === current) return;
        stopAll(); current = k;
        try { localStorage.setItem(LAGRE, k); } catch(e){}
        wrap.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
      wrap.appendChild(b);
    });
    document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPicker); else buildPicker();

  /* For sider som styrer lyden selv (gehørquizen):
     VBM_LYD_SPILL(toner, knapp, ganger, kadens, samlet) spiller, eller stopper hvis knappen allerede spiller.
     VBM_LYD_STOPP() stopper all lyd. Begge må kalles direkte fra et trykk (iOS). */
  window.VBM_LYD_SPILL = function(notes, btn, ganger, kadens, samlet, vedToner){
    ensureCtx();
    if (btn === activeBtn) { stopAll(); return; }
    play(notes, btn, ganger, kadens, samlet, null, null, vedToner);
  };
  /* VBM_LYD_SEKVENS(steg, knapp, vedSteg): spiller stegene etter hverandre, f.eks. en skala [[60],[62],[64]...].
     vedSteg (valgfri) får vite hvilket steg som klinger, se planSekvens. */
  window.VBM_LYD_SEKVENS = function(sekvens, btn, vedSteg){
    ensureCtx();
    if (btn === activeBtn) { stopAll(); return; }
    play([], btn, 1, null, false, sekvens, vedSteg);
  };
  /* VBM_LYD_RYTME(hendelser, knapp, vedSteg): spiller en rytme.
     hendelser: [{ t: sekunder fra start, lyd: 'skarp' | 'bass' | 'hihat' | 'klikk', v: styrke 0–1,
                   m: tonehøyde for piano, gitar og strykere, d: lengde i sekunder, i: nummer for fargelegging }].
     Med trommer spilles lyd-feltet. Med de andre instrumentene spilles tonen m, mens 'klikk'
     (metronomen) alltid er treblokken. vedSteg(i) kalles når en hendelse med i klinger, og vedSteg(-1) til slutt. */
  function spillRytme(hendelser, btn, vedSteg){
    stopAll();
    var my = token, inst = INSTR[current], tromme = current === 'trommer';
    activeBtn = btn; btn.classList.add('playing', 'loading');
    var tromUrl = function(lyd){ return (B.trommer || '') + TROMMER[lyd]; };
    var trommeLyder = {}, urls = {};
    hendelser.forEach(function(h){ if (tromme || h.lyd === 'klikk') trommeLyder[h.lyd] = true; });
    Object.keys(trommeLyder).forEach(function(l){ urls[tromUrl(l)] = true; });
    if (!tromme) inst.layers.forEach(function(L){
      hendelser.forEach(function(h){ if (h.lyd !== 'klikk') { var s2 = nearest(L, (h.m || 72) + L.shift); if (s2 !== null) urls[urlFor(L, s2)] = true; } });
    });
    var list = Object.keys(urls);
    Promise.all(list.map(load)).then(function(bufs){
      if (my !== token) return;
      var got = {}; list.forEach(function(u, i){ got[u] = bufs[i]; });
      btn.classList.remove('loading');
      var t = ctx.currentTime + 0.08, slutt = 0;
      hendelser.forEach(function(h){
        var t0 = t + h.t, v = h.v == null ? 1 : h.v;
        if (tromme || h.lyd === 'klikk') {
          var src = ctx.createBufferSource(), g = ctx.createGain();
          src.buffer = got[tromUrl(h.lyd)]; src.connect(g); g.connect(out);
          g.gain.value = TROMME_NIVA[h.lyd] * v;
          src.start(t0); track(src, g);
          slutt = Math.max(slutt, h.t + src.buffer.duration);
        } else {
          var d = Math.max(0.12, (h.d || 0.4) * 0.92);
          inst.layers.forEach(function(L){
            var p = (h.m || 72) + L.shift, s3 = nearest(L, p);
            if (s3 === null) return;
            sampleVoice(inst, got[urlFor(L, s3)], Math.pow(2, (p - s3) / 12 + L.cents / 1200), t0 + L.delay, d, L.level * 0.62 * v);
          });
          slutt = Math.max(slutt, h.t + d + inst.release);
        }
      });
      if (vedSteg) {
        aktivVedSteg = vedSteg;
        hendelser.forEach(function(h){
          if (h.i == null) return;
          planlegg(t + h.t, function(){ if (my === token) vedSteg(h.i); });
        });
        planlegg(t + slutt, function(){ if (my === token) { aktivVedSteg = null; vedSteg(-1); } });
      }
      finish((t - ctx.currentTime) + slutt + 0.3, my);
    }).catch(function(){
      if (my !== token) return;
      /* Kan ikke lydfilene lastes, brukes den innebygde synthen på én tone. */
      btn.classList.remove('loading');
      var t = ctx.currentTime + 0.08, slutt = 0;
      hendelser.forEach(function(h){
        var m = h.lyd === 'klikk' ? 96 : h.lyd === 'bass' ? 48 : 72;
        synthVoice(m, t + h.t, 0.18, 0.18 * (h.v == null ? 1 : h.v));
        slutt = Math.max(slutt, h.t + 0.2);
      });
      /* Notene farges også når reservelyden brukes */
      if (vedSteg) {
        aktivVedSteg = vedSteg;
        hendelser.forEach(function(h){
          if (h.i == null) return;
          planlegg(t + h.t, function(){ if (my === token) vedSteg(h.i); });
        });
        planlegg(t + slutt, function(){ if (my === token) { aktivVedSteg = null; vedSteg(-1); } });
      }
      finish((t - ctx.currentTime) + slutt + 0.3, my);
    });
  }
  window.VBM_LYD_RYTME = function(hendelser, btn, vedSteg){
    ensureCtx();
    if (btn === activeBtn) { stopAll(); return; }
    spillRytme(hendelser, btn, vedSteg);
  };
  window.VBM_LYD_STOPP = stopAll;
  window.__vbmLyd = { voices: function(){ return voices.length; }, instrument: function(){ return current; } };
})();
