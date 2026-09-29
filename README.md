# Verdens Beste Musikkskole

**Juksebøker og lytteguider for musikkteori og øretrening**

👉 **Åpne nettsiden:** https://mollodi.github.io/Verdens-Beste-Musikkskole/

Gratis undervisningsmateriell i musikkteori for elever og lærere. Alt har ekte notasjon, og mye kan spilles av direkte i nettleseren eller høres på Spotify.

## Innhold

### Juksebøker
- **Intervall-jukseboka**: alle 25 intervaller fra ren prim til dobbel oktav, i farger og i svart-hvitt.
- **Den ultimate jukseboka for akkorder og intervaller**: 34 akkorder i fire kapitler, fra treklanger til 13-akkorder og kvartalakkorder, i farger og i svart-hvitt.

### Øretrening og lytting
- **Intervaller & sanger**: hvert intervall oppover og nedover, med kjente sanger og Spotify-lenker.
- **Dominant & Major 7th/9th Chords** (på engelsk): lytteguide til septim- og nonakkorder hos Chopin, Debussy, Hendrix, James Brown og flere.

### Elevhefter
- **Akkordhefte**: treklanger, trinnakkorder og diatonisk harmoni, med harmonisk moll.

## Lyd
I juksebøkene kan du velge mellom **piano**, **gitar** og **strykere** med knappen nederst til høyre. Når du trykker på en ny spill-knapp, stopper lyden som spiller. Trykk på samme knapp igjen for å stoppe.

- Piano: Salamander Grand Piano av Alexander Holm, CC BY 3.0
- Gitar og strykere: akustisk gitar, fiolin og cello fra [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) av Nicholas Brosowsky, CC BY 3.0

## Farger og svart-hvitt
Juksebøkene har en bryter øverst: **Farger | Svart-hvitt**. Svart-hvitt passer godt til utskrift. Lenke rett til svart-hvitt: legg til `?svart-hvitt` bak filnavnet, for eksempel `intervaller.html?svart-hvitt`.

## Om navnene på tonene
Materiellet bruker norsk tonenavn: **H** er engelsk B, og **B** er engelsk B♭.

## Slik er nettsiden bygget (for vedlikehold)

| Fil | Hva den gjør | Endres |
|---|---|---|
| `materialer.js` | Listen over alt materiell. Startsiden lages ut fra denne. | Hver gang noe nytt legges til |
| `index.html` | Startsiden (forsiden med notelinjen). | Sjelden |
| `lyd.js` | Felles lyd: piano, gitar og strykere. | Sjelden |
| `side.js` | Felles bryter for farger og svart-hvitt. | Sjelden |
| `*.html` | Ett materiell per fil. | Når materiellet endres |
| `*-svart-hvitt.html` | Små filer som sender gamle lenker videre. Ikke slett dem. | Aldri |

**Legge til nytt materiell:** last opp den nye `.html`-filen, og last opp den nye `materialer.js`. Ingen andre filer trenger å endres.

---

Levert av **Verdens Beste Musikklærer**
© 2026 Verdens Beste Musikkskole
