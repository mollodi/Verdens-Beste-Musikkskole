/* Verdens Beste Musikkskole – felles lydmotor for juksebøkene.
   Ekte opptak av piano (Salamander Grand Piano) og akustisk gitar.
   Bare én lyd spiller om gangen: et nytt trykk stopper den forrige.
   Hvis lydfilene ikke kan lastes, brukes den innebygde synthen. */
(function(){
  'use strict';
  var cfg = window.VBM_LYD || {};
  var STEP = cfg.step || 0.66, NOTE = cfg.noteDur || 1.4, CHORD = cfg.chordDur || 3.2;
  var GAP1 = cfg.gap1 || 0.33, GAP2 = cfg.gap2 || 0.52;
  var PC = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'];
  function nameOf(m){ return PC[m % 12] + (Math.floor(m / 12) - 1); }
  function midiOf(n){ var o = parseInt(n.slice(-1), 10); return (o + 1) * 12 + PC.indexOf(n.slice(0, -1)); }

  var pianoNotes = []; for (var m = 21; m <= 108; m += 3) pianoNotes.push(m);
  var guitarNames = ['D2','Ds2','E2','F2','Fs2','G2','Gs2','A2','As2','B2','C3','Cs3','D3','Ds3','E3','F3','Fs3','G3','Gs3','A3','As3','B3','C4','Cs4','D4','Ds4','E4','F4','Fs4','G4','Gs4','A4','As4','B4','C5','Cs5','D5'];

  var BASES = window.VBM_LYD_BASE || {};
  var INSTR = {
    piano: { label:'Piano', base: BASES.piano || 'https://tonejs.github.io/audio/salamander/',
             notes: pianoNotes, shift: 0, level: 0.9 },
    /* Gitar klinger en oktav lavere enn den er notert – slik som en ekte gitar. */
    gitar: { label:'Gitar', base: BASES.gitar || 'https://cdn.jsdelivr.net/npm/tonejs-instrument-guitar-acoustic-mp3@1.1.2/',
             notes: guitarNames.map(midiOf), shift: -12, level: 1.0 }
  };

  var current = 'piano';
  try { var saved = localStorage.getItem('vbm-instrument'); if (INSTR[saved]) current = saved; } catch(e){}

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

  /* ---------- lasting av lydfiler (bare de tonene som trengs) ---------- */
  var cache = {};   // key -> Promise<AudioBuffer>
  function nearest(inst, m){
    var best = inst.notes[0];
    inst.notes.forEach(function(s){ if (Math.abs(s - m) < Math.abs(best - m)) best = s; });
    return best;
  }
  function decode(c, data){
    return new Promise(function(res, rej){
      var p = c.decodeAudioData(data, res, rej);
      if (p && p.then) p.then(res, rej);
    });
  }
  function load(key, sample){
    var inst = INSTR[key], id = key + ':' + sample;
    if (!cache[id]) {
      cache[id] = fetch(inst.base + nameOf(sample) + '.mp3')
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(function(buf){ return decode(ctx, buf); });
      cache[id].catch(function(){ delete cache[id]; });
    }
    return cache[id];
  }

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
    var v = {src:src, gain:gain}; voices.push(v);
    src.onended = function(){ var i = voices.indexOf(v); if (i > -1) voices.splice(i, 1); };
  }

  function sampleVoice(buf, ratio, t0, dur, level){
    var src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; src.playbackRate.value = ratio;
    src.connect(g); g.connect(out);
    g.gain.setValueAtTime(level, t0);
    g.gain.setValueAtTime(level, t0 + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.35);
    src.start(t0); src.stop(t0 + dur + 0.4);
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
    return (t3 + CHORD + 0.4) - ctx.currentTime;
  }

  function play(notes, btn){
    stopAll();
    var my = token, key = current, inst = INSTR[key];
    activeBtn = btn; btn.classList.add('playing', 'loading');
    var needed = {};
    notes.forEach(function(m){ needed[nearest(inst, m + inst.shift)] = true; });
    var list = Object.keys(needed).map(Number);
    Promise.all(list.map(function(s){ return load(key, s); })).then(function(bufs){
      if (my !== token) return;
      var map = {}; list.forEach(function(s, i){ map[s] = bufs[i]; });
      btn.classList.remove('loading');
      var total = schedule(notes, function(m, t0, dur, chord, n){
        var p = m + inst.shift, s = nearest(inst, p);
        var level = inst.level * (chord ? Math.min(0.62, 1.9 / n) : 0.62);
        sampleVoice(map[s], Math.pow(2, (p - s) / 12), t0, dur, level);
      });
      finish(total, my);
    }).catch(function(){
      if (my !== token) return;
      btn.classList.remove('loading');
      var peak = Math.min(0.20, 0.85 / notes.length);
      var total = schedule(notes, function(m, t0, dur, chord){ synthVoice(m, t0, dur, chord ? peak * 0.9 : peak); });
      finish(total, my);
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
  document.addEventListener('touchstart', function(){ ensureCtx(); }, {once:true, passive:true});

  /* ---------- velger for instrument ---------- */
  var css = '.vbm-instr{display:inline-flex;gap:0;border:1px solid currentColor;border-radius:999px;overflow:hidden;font:13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;opacity:.9}'
    + '.vbm-instr button{appearance:none;-webkit-appearance:none;background:transparent;color:inherit;border:0;padding:7px 14px;font:inherit;cursor:pointer}'
    + '.vbm-instr button[aria-pressed="true"]{background:currentColor}'
    + '.vbm-instr button[aria-pressed="true"] span{filter:invert(1);mix-blend-mode:normal}'
    + '.vbm-instr button:focus-visible{outline:2px solid currentColor;outline-offset:-4px}'
    + '.vbm-instr-float{position:fixed;z-index:50;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));box-shadow:0 4px 18px rgba(0,0,0,.18)}'
    + '.play-btn.loading{opacity:.65}'
    + '@media print{.vbm-instr{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function buildPicker(){
    var wrap = document.createElement('div');
    wrap.className = 'vbm-instr'; wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Velg instrument');
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
    var bs = getComputedStyle(document.body);
    wrap.classList.add('vbm-instr-float');
    wrap.style.background = bs.backgroundColor && bs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bs.backgroundColor : '#fff';
    wrap.style.color = bs.color;
    document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPicker); else buildPicker();

  window.__vbmLyd = { voices: function(){ return voices.length; }, instrument: function(){ return current; } };
})();
