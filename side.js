/* Verdens Beste Musikkskole – felles hjelpefil for sidene.
   Legges i <head> med <script src="side.js"></script>.

   Farger / svart-hvitt:
   En side som har svart-hvitt-regler (html.sh ...) i CSS-en sin, får en
   bryter «Farger | Svart-hvitt» øverst ved lenken tilbake.
   - side.html              åpner i farger
   - side.html?svart-hvitt  åpner i svart-hvitt
   Tekst som bare skal vises i én av versjonene merkes med
   class="kun-farge" eller class="kun-sh". */
(function(){
  'use strict';
  var root = document.documentElement;
  var SH = 'svart-hvitt';

  function wantsSH(){ return new RegExp('(^|[?&])' + SH + '(=|&|$)').test(location.search.slice(1)); }
  var baseTitle = document.title.replace(/^\(Svart-hvitt\)\s*/, '');

  function apply(sh){
    root.classList.toggle('sh', sh);
    document.title = sh ? '(Svart-hvitt) ' + baseTitle : baseTitle;
    var btns = document.querySelectorAll('.vbm-modus button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', (btns[i].getAttribute('data-sh') === '1') === sh ? 'true' : 'false');
    }
  }
  apply(wantsSH());   // før siden tegnes, så den ikke blinker i farger

  var css = '.kun-sh{display:none!important}html.sh .kun-sh{display:revert!important}html.sh .kun-farge{display:none!important}'
    + '.vbm-back{display:flex;justify-content:space-between;align-items:center;gap:10px 16px;flex-wrap:wrap}'
    + '.vbm-modus{display:inline-flex;border:1px solid currentColor;border-radius:999px;overflow:hidden;'
    + 'font:13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}'
    + '.vbm-modus button{appearance:none;-webkit-appearance:none;background:transparent;color:inherit;border:0;'
    + 'padding:7px 13px;font:inherit;cursor:pointer}'
    + '.vbm-modus button[aria-pressed="true"]{background:currentColor}'
    + '.vbm-modus button[aria-pressed="true"] span{filter:invert(1)}'
    + '.vbm-modus button:focus-visible{outline:2px solid currentColor;outline-offset:-4px}'
    + '@media (forced-colors: active){.vbm-modus button[aria-pressed="true"]{forced-color-adjust:none;background:Highlight;color:HighlightText}.vbm-modus button[aria-pressed="true"] span{filter:none}.swatch{forced-color-adjust:none}}'
    + '@media print{.vbm-modus{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css;
  (document.head || root).appendChild(st);

  function build(){
    var nav = document.querySelector('.vbm-back');
    if (!nav || !root.hasAttribute('data-svart-hvitt')) return;
    var wrap = document.createElement('div');
    wrap.className = 'vbm-modus'; wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Farger eller svart-hvitt');
    [['0', 'Farger'], ['1', 'Svart-hvitt']].forEach(function(o){
      var b = document.createElement('button'); b.type = 'button';
      b.setAttribute('data-sh', o[0]); b.innerHTML = '<span>' + o[1] + '</span>';
      b.addEventListener('click', function(){
        var sh = o[0] === '1'; apply(sh);
        try { history.replaceState(null, '', location.pathname + (sh ? '?' + SH : '') + location.hash); } catch(e){}
      });
      wrap.appendChild(b);
    });
    nav.appendChild(wrap);
    apply(root.classList.contains('sh'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
