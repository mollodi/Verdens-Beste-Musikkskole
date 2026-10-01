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

  var current = 'piano';
  try { var saved = localStorage.getItem('vbm-instrument'); if (INSTR[saved]) current = saved; } catch(e){}

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
  function load(url){
    if (!cache[url]) {
      cache[url] = fetch(url)
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(decode);
      cache[url].catch(function(){ delete cache[url]; });
    }
    return cache[url];
  }
  function urlFor(L, s){ return L.base + nameOf(s) + '.mp3'; }

  /* ---------- aktive stemmer, slik at alt kan stoppes ---------- */
  var voices = [], activeBtn = null, timer = null, token = 0;
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

  /* Opp, ned, og til slutt alle tonene samtidig – som før. */
  function schedule(notes, voiceFn){
    var t = ctx.currentTime + 0.05, n = notes.length;
    notes.forEach(function(m, i){ voiceFn(m, t + i * STEP, NOTE, false, n); });
    var t2 = t + n * STEP + GAP1, rev = notes.slice().reverse();
    rev.forEach(function(m, i){ voiceFn(m, t2 + i * STEP, NOTE, false, n); });
    var t3 = t2 + n * STEP + GAP2;
    notes.forEach(function(m){ voiceFn(m, t3, CHORD, true, n); });
    return (t3 + CHORD + 0.7) - ctx.currentTime;
  }

  function play(notes, btn){
    stopAll();
    var my = token, inst = INSTR[current];
    activeBtn = btn; btn.classList.add('playing', 'loading');
    var urls = {};
    inst.layers.forEach(function(L){
      notes.forEach(function(m){ var s = nearest(L, m + L.shift); if (s !== null) urls[urlFor(L, s)] = true; });
    });
    var list = Object.keys(urls);
    Promise.all(list.map(load)).then(function(bufs){
      if (my !== token) return;
      var got = {}; list.forEach(function(u, i){ got[u] = bufs[i]; });
      btn.classList.remove('loading');
      finish(schedule(notes, function(m, t0, dur, chord, n){
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
      var peak = Math.min(0.20, 0.85 / notes.length);
      finish(schedule(notes, function(m, t0, dur, chord){ synthVoice(m, t0, dur, chord ? peak * 0.9 : peak); }), my);
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
    play(btn.getAttribute('data-notes').split(',').map(Number), btn);
  });
  document.addEventListener('touchstart', function(){ ensureCtx(); }, {once: true, passive: true});

  /* ---------- velger for instrument (nederst til høyre) ---------- */
  /* Utseendet ligger i stil.css (.vbm-pille og .vbm-instr-float). */

  function buildPicker(){
    var wrap = document.createElement('div'), bs = getComputedStyle(document.body);
    wrap.className = 'vbm-pille vbm-instr vbm-instr-float';
    wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Velg instrument');
    wrap.style.background = bs.backgroundColor && bs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bs.backgroundColor : '#fff';
    wrap.style.color = bs.color;
    Object.keys(INSTR).forEach(function(k){
      var b = document.createElement('button'); b.type = 'button';
      b.innerHTML = '<span>' + INSTR[k].label + '</span>';
      b.setAttribute('aria-pressed', k === current ? 'true' : 'false');
      b.addEventListener('click', function(){
        if (k === current) return;
        stopAll(); current = k;
        try { localStorage.setItem('vbm-instrument', k); } catch(e){}
        wrap.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
      wrap.appendChild(b);
    });
    document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPicker); else buildPicker();

  window.__vbmLyd = { voices: function(){ return voices.length; }, instrument: function(){ return current; } };
})();
