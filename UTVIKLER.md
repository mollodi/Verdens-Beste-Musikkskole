# Utviklerguide for Verdens Beste Musikkskole

Ren HTML, CSS og JavaScript. Ingen byggesteg, ingen rammeverk. Alle filer ligger i samme mappe, så alt kan lastes opp fra telefonen.

## Filene

| Fil | Hva den gjør | Endrer du ofte? |
|---|---|---|
| `stil.css` | **All** stil for hele nettsiden | Ja |
| `felles.js` | Språk, oversettelse, Farger/Svart-hvitt, knapperaden, bunnteksten | Sjelden |
| `materialer.js` | Kortene på startsiden | Ja |
| `sprak-en.js`, `sprak-pl.js` | Oversettelser fra norsk | Ja |
| `sprak-no.js` | Oversettelse til norsk for sider skrevet på engelsk (lytteguiden) | Sjelden |
| `lyd.js` | Lydmotor for spill-knappene (piano, gitar, strykere) | Nesten aldri |
| `tonearter.js` | Tonearter, fortegn og tonenavn på tre språk, brukt av kvintsirkelen, skalaene og quizene deres | Sjelden |
| `skalaer.js` | Alle skalaene (trinn, tekster, sangeksempler), noter for skalaer, akkorder side om side, firstemmig sats på to notelinjer og enkeltnoter i fire nøkler, brukt av skalaleksjonen, skalaquizen, kvintsirkelen, omvendingene, harmonilæren og notelesingen | Sjelden |
| `harmoni.js` | Firstemmige akkorder for funksjoner, kadenser, kvartsekstakkorder, beliggenhet og skråstrekakkorder, brukt av harmonilæren og quizen | Sjelden |
| `rytme.js` | Rytmer, taktarter, rytmenoter på én linje, avspilling med inntelling og metronom, og trommegrooves, brukt av rytmeleksjonen og rytmequizen | Sjelden |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Favikonet (G-nøkkel i messing på mørk bakgrunn): SVG for nye nettlesere, 32 px PNG for eldre, og 180 px for telefonens hjemskjerm. Lenkes i `<head>` på alle sider | Aldri |
| `rytme-skarptromme.mp3`, `rytme-basstromme.mp3`, `rytme-hihat.mp3`, `rytme-treblokk.mp3` | Ekte trommeopptak fra Versilian Community Sample Library (CC0), brukt av rytmesidene. Treblokken er metronomen | Aldri |
| `Fraunces-Variable.ttf`, `Fraunces-OFL.txt`, `Lora-Variable.ttf`, `Lora-Italic-Variable.ttf`, `Lora-OFL.txt` | Skriftene til Akkordhefte, med lisensene som skal følge med. Filene må ikke endres | Aldri |
| `index.html` og innholdssidene | Bare innhold. Ingen `<style>` i sidene | Ja |

## Oppsett i hver side

```html
<html lang="no" data-side="min-side.html" data-stil="bok">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tittel</title>
<script src="felles.js"></script>
<link rel="stylesheet" href="stil.css">
</head>
```

- `lang`: språket siden er skrevet på (`no` eller `en`).
- `data-side`: filnavnet. Brukes både av stil.css og av ordbøkene.
- `data-stil` (valgfri): `bok` gir utseendet til juksebøkene, `mork` utseendet til de mørke lyttesidene, `ovelse` utseendet til øvingssidene (gehørlekser og gehørquizene).
- `data-quiz` (valgfri): gir en øvingsside quiz-utseendet (svarknapper, noter, prøveresultat). Brukes av alle gehørquizene.
- `data-svart-hvitt` (valgfri): gir knappene Farger | Svart-hvitt.

## Oppskrifter

### Nytt kort på startsiden
Kopier en blokk i `materialer.js` og endre teksten. Legg så tittel, merke og beskrivelse inn i `sprak-en.js` og `sprak-pl.js` under `'index.html'`.

### Endre stil
Åpne `stil.css`. Den har en innholdsliste øverst, og hver side har sin egen seksjon. En regel for én side skrives slik:
```css
:where(html[data-side="intervaller.html"]) .caption { font-size: 15px; }
```
En regel for begge juksebøkene:
```css
:where(html[data-stil="bok"]) .caption { font-size: 15px; }
```
En regel uten `:where(...)` gjelder alle sider.

### Endre en tekst
1. Endre den norske teksten i siden.
2. Søk etter den gamle teksten i `sprak-en.js` og `sprak-pl.js`, og endre nøkkelen (venstre side) til den nye norske teksten. Oversett høyre side.

Glemmer du steg 2, vises teksten på norsk i alle språk. Ingenting går i stykker.

### Tekst som ikke skal oversettes
```html
<span translate="no">Verdens Beste Musikkskole</span>
```

### Tekst som bare skal vises i farger eller i svart-hvitt
```html
<span class="kun-farge">...</span>   <span class="kun-sh">...</span>
```

### Spill-knapp
```html
<button class="play-btn" data-notes="60,64,67" aria-label="Spill av C-dur">&#9658;&#xFE0E; <span>spill</span></button>
```
Tallene er MIDI-toner (60 = midtre C). Siden må ha `<script src="lyd.js"></script>` nederst i `<body>`.

### Bunnteksten
Skriv bare dette nederst i siden. Resten fylles inn av `felles.js`:
```html
<footer data-lyd="alle"></footer>
```
`data-lyd="alle"` gir kreditt for piano, gitar og strykere, `data-lyd="piano"` bare for piano, og `data-lyd=""` ingen lydkreditt. Tekst du skriver inne i `<footer>` (for eksempel en merknad) står over signaturen. Dato og tekst endres ett sted: øverst i `felles.js`, under «Innstillinger». Husk å endre de samme ordene i `sprak-en.js` og `sprak-pl.js`.

### Tekst som lages i JavaScript
```js
var T = window.VBM_T || function(s){ return s; };
el.textContent = T('Totalt: {r} av {t} riktige.', { r: 3, t: 5 });
```
Legg den norske malen inn i ordbøkene med samme `{plasser}`.

### Nytt språk
1. Legg koden til i `SPRAK` og `NAVN` øverst i `felles.js`.
2. Kopier `sprak-en.js` til `sprak-XX.js`, endre `'en'` øverst til den nye koden, og oversett høyre side.

## Testing
- `side.html?sprak=en` viser siden på engelsk uten å lagre valget. Fungerer med `no`, `en` og `pl`.
- `side.html?svart-hvitt` viser svart-hvitt-versjonen.
- Test alltid i kontrastmodus også (Windows: Innstillinger > Tilgjengelighet > Kontrastmotiver).

## Skjult for søkemotorer
Alle sider har denne linjen i `<head>`, så Google og andre søkemotorer ikke tar dem med i søkeresultatene:
```html
<meta name="robots" content="noindex, nofollow">
```
Når nettsiden er ferdig og skal bli synlig i søk, fjernes linjen fra alle sidene. Nye sider bør få den samme linjen så lenge den står på de andre.

## Før opplasting
Ta sikkerhetskopi: på GitHub, Code > Download ZIP.

## Domene og beskyttelse

Nettsiden ligger på https://verdensbestemusikkskole.no/ (GitHub Pages med eget domene).

- Filen `CNAME` i repoet forteller GitHub hvilket domene siden har. Den må ikke slettes. Den er ikke med i zip-filene, og opplasting av nye filer rører den ikke.
- `felles.js` sjekker adressen siden kjører på. På `verdensbestemusikkskole.no`, `www.verdensbestemusikkskole.no` og `mollodi.github.io` (eierens egen GitHub, også testsiden VBM-test) vises siden som vanlig. Alle andre steder viser den et banner øverst: «Originalen av denne siden finnes på Verdens Beste Musikkskole», med lenke til samme side på domenet.
- Bytter domenet igjen, endres `ORIGINAL` og `EGNE` øverst i `felles.js`.
- Alle sider har `noindex, nofollow` og signatur, og hvert verk har sin egen Verk-ID.

## Tonefarger, tonenavn og innstillinger

- Notene har tonens farge fra Newtons regnbue mens de spilles (C rød, D oransje, E gul, F grønn, G blå, A indigo, H fiolett; ♯ lysere, ♭ mørkere), de samme fargene som juksebøkene.
- Notehodene tegnet av `skalaer.js` får `data-f` (farge) og `data-navn` (tonenavn). `felles.js` farger dem når siden setter klassen `spilles`, og viser navnet i en lapp over notelinjen, øverst til høyre, bare når én tone klinger.
- Quizene (`data-quiz`) farger notene, men viser ingen navn. Sider som viser navnet selv bruker `data-uten-navn` (Notelesing).
- Tannhjulet i menylinjen åpner Innstillinger. «Svart-hvitt» (for fargeblinde og kromestesi) lagres i `localStorage` (`vbm-visning`) og gjelder hele nettstedet: notene følger sidens blekk, og tonen som spilles blir en hul note med kant.
- Alle notelinjer tegnes med den felles notekoden i `skalaer.js`. Sider med faste eksempler (juksebøkene, sangsiden, lytteguiden) lagrer bare notene som data: `<div class="vbm-notebilde" data-noter='[[b, f, oktav], ...]' data-form="melodi|akkord">`, og `skalaer.js` tegner dem. `data-fast` gir juksebøkenes faste farger (notene har alltid tonens farge, og får kraftig kant mens de spilles).
- Spill-knapper med `data-notes` farger notebildet i samme kort automatisk (`lyd.js`).
- Juksebøkene har ikke lenger egne knapper for farger og svart-hvitt. Gamle lenker med `?svart-hvitt` slår på svart-hvitt under Innstillinger.

