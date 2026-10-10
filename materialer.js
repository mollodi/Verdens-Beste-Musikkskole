/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-QU4H. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – LISTEN OVER ALT MATERIELL
   ---------------------------------------------------------------------
   Dette er den eneste filen du trenger å endre for å legge til,
   flytte eller skjule noe på startsiden.

   NYTT MATERIELL: kopier en blokk { ... }, lim den inn der den skal
   stå, og endre teksten. Husk komma mellom blokkene.

     seksjon     hvilken del av startsiden (se «seksjoner» øverst)
     niva        grunnleggende, avansert eller ekspert (merket på kortet, og valgfritt filter i Innstillinger)
     relatert    sider som vises under «Se også» nederst på siden (filnavn)
     merke       den lille teksten øverst på kortet
     tittel      navnet på materiellet
     beskrivelse én kort setning
     fil         filnavnet på GitHub, f.eks. "min-nye-bok.html"
     svartHvitt  true = kortet får «Åpne i farger» og «Åpne i svart-hvitt»
     lagtTil     datoen det ble lagt ut ("2026-10-05"). Da vises
                 «Nytt» på kortet i 30 dager. Kan stå tom: ""
     skjult      true = ligger på GitHub, men vises ikke på startsiden

   NY SEKSJON: legg til en blokk under «seksjoner». Den vises bare når
   minst ett materiell bruker den.

   SPRÅK: skriv teksten her på norsk. Oversettelsene står i
   sprak-en.js og sprak-pl.js, under 'index.html'. Legg inn nytt
   materiell der også, ellers vises den norske teksten.
   ===================================================================== */

window.VBM = {

  seksjoner: [
    { id: "jukseboker", overskrift: "Juksebøker", tittel: "Bøker til", uthevet: "oppslag",
      ingress: "Oppslagsverk med ekte noter i C. Trykk på spill-knappen for å høre, på piano, strykere eller sinustoner." },
    { id: "oretrening", overskrift: "Øretrening", tittel: "Hør og", uthevet: "lytt",
      ingress: "Kjente sanger og verk som viser lyden av intervaller og akkorder, og gehørlekser i små forskjeller i tonehøyde." },
    { id: "teori", overskrift: "Musikkteori", tittel: "Lær og", uthevet: "forstå",
      ingress: "Interaktive leksjoner i musikkteori, med ekte noter og lyd." },
    { id: "elevhefter", overskrift: "Elevhefter", tittel: "Hefter til", uthevet: "timen",
      ingress: "Arbeidshefter til bruk i undervisningen." },
    { id: "gehorquiz", overskrift: "Gehørquiz", tittel: "Hør og", uthevet: "svar",
      ingress: "Hør intervaller, akkorder, skalaer og kadenser, og finn navnet. Med øvemodus i eget tempo og prøvemodus slik som på opptaksprøver." },
    { id: "teoriquiz", overskrift: "Teoriquiz", tittel: "Les og", uthevet: "svar",
      ingress: "Les fortegn og noter, og finn svaret. Med øvemodus i eget tempo og prøvemodus med 20 oppgaver." }
  ],

  materialer: [
    {
      seksjon: "jukseboker",
      merke: "25 intervaller",
      tittel: "Intervall-jukseboka",
      beskrivelse: "Alle intervaller fra ren prim til dobbel oktav, med begge navn over oktaven.",
      fil: "intervaller.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "grunnleggende",
      relatert: ["intervaller-teori.html", "intervaller-og-sanger.html", "gehorquiz.html"]
    },
    {
      seksjon: "jukseboker",
      merke: "47 akkorder",
      tittel: "Den ultimate jukseboka for akkorder og intervaller",
      beskrivelse: "Seks kapitler, fra treklanger til jazzakkorder, med omvendingene i et eget kapittel.",
      fil: "akkorder-og-intervaller.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "avansert",
      relatert: ["akkordanalyse.html", "omvendinger.html", "lytteguide-septim-og-nonakkorder.html"]
    },
    {
      seksjon: "oretrening",
      merke: "Intervaller",
      tittel: "Intervaller & sanger",
      beskrivelse: "Hvert intervall oppover og nedover, med eksempelsanger og Spotify-lenker.",
      fil: "intervaller-og-sanger.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "grunnleggende",
      relatert: ["intervaller-teori.html", "intervaller.html", "gehorquiz.html"]
    },
    {
      seksjon: "oretrening",
      merke: "Lytteguide",
      tittel: "Dominant- og majorakkorder med septim og none",
      beskrivelse: "Septim- og nonakkorder hos Chopin, Debussy, Hendrix og James Brown.",
      fil: "lytteguide-septim-og-nonakkorder.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "avansert",
      relatert: ["akkordanalyse.html", "akkorder-og-intervaller.html", "gehorquiz-akkorder.html"]
    },
    {
      seksjon: "oretrening",
      merke: "Mikrointervaller",
      tittel: "Gehørlekser med mikrointervaller",
      beskrivelse: "Seks øvelser i små forskjeller i tonehøyde, som forberedelse til pianostemmerutdanningen ved NMH.",
      fil: "gehorlekser-mikrointervaller.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "ekspert",
      relatert: ["stemming.html", "intervaller-teori.html", "quiz-stemming.html"]
    },
    {
      seksjon: "teori",
      merke: "Noter",
      tittel: "Notelesing",
      beskrivelse: "Notelinjen, G-nøkkel, F-nøkkel, alt- og tenornøkkel, og oktavnavnene, med et piano som viser hver tone.",
      fil: "notelesing.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "grunnleggende",
      relatert: ["rytme.html", "intervaller-teori.html", "quiz-notelesing.html"]
    },
    {
      seksjon: "teori",
      merke: "Rytme",
      tittel: "Rytme og taktarter",
      beskrivelse: "Seks kapitler fra nivå 1 til 5: notelengder, punktering, trioler, synkoper, sammensatt og ujevn takt, med trommer.",
      fil: "rytme.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "grunnleggende",
      relatert: ["notelesing.html", "melodilesing.html", "quiz-rytme.html"]
    },
    {
      seksjon: "teori",
      merke: "Intervaller",
      tittel: "Intervaller",
      beskrivelse: "Tell bokstavene, tell halvtonene: rene, store, små, forstørrede og forminskede intervaller, omvending, sammensatte intervaller, og konsonans og dissonans.",
      fil: "intervaller-teori.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "grunnleggende",
      relatert: ["intervaller.html", "intervaller-og-sanger.html", "quiz-intervaller.html", "gehorquiz.html"]
    },
    {
      seksjon: "teori",
      merke: "Skalaer",
      tittel: "Skalaer og modi",
      beskrivelse: "Dur, moll, de sju modiene, pentatonikk, blues, heltone og jazzskalaer, i alle tonearter, med lyd og sangeksempler.",
      fil: "skalaer.html",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "avansert",
      relatert: ["kvintsirkelen.html", "melodilesing.html", "quiz-skalaer.html"]
    },
    {
      seksjon: "teori",
      merke: "Tonearter",
      tittel: "Kvintsirkelen",
      beskrivelse: "Alle dur- og molltonearter med fortegn, rekkefølgen på kryss og b-er, og lyd for hver toneart.",
      fil: "kvintsirkelen.html",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "grunnleggende",
      relatert: ["skalaer.html", "transponering.html", "quiz-kvintsirkelen.html"]
    },
    {
      seksjon: "teori",
      merke: "Transponering",
      tittel: "Transponering",
      beskrivelse: "Flytt en melodi med et intervall eller til en ny toneart, transponer akkorder, bruk kapo, og se hva som klinger på klarinett, saksofon, valthorn og gitar.",
      fil: "transponering.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["kvintsirkelen.html", "intervaller-teori.html", "quiz-transponering.html"]
    },
    {
      seksjon: "teori",
      merke: "Omvendinger",
      tittel: "Omvendinger",
      beskrivelse: "Alle stillingene til treklanger og septimakkorder, fra sekstakkord til sekundakkord, i alle tonearter.",
      fil: "omvendinger.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "avansert",
      relatert: ["akkordhefte.html", "akkordanalyse.html", "gehorquiz-omvendinger.html"]
    },
    {
      seksjon: "teori",
      merke: "Akkordanalyse",
      tittel: "Akkordanalyse",
      beskrivelse: "Finn grunntone, akkordtype og omvending, skriv besifringen, og finn trinn og funksjon, for treklanger og septimakkorder i dur og moll.",
      fil: "akkordanalyse.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["akkordhefte.html", "omvendinger.html", "harmonilaere.html", "quiz-akkordanalyse.html"]
    },
    {
      seksjon: "teori",
      merke: "Harmoni",
      tittel: "Harmonilære",
      beskrivelse: "Funksjoner, kadenser, kvartsekstakkordens bruk, beliggenhet og leie, og skråstrekakkorder, i firstemmig sats.",
      fil: "harmonilaere.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "avansert",
      relatert: ["akkordanalyse.html", "bitreklanger.html", "gehorquiz-harmoni.html"]
    },
    {
      seksjon: "teori",
      merke: "Bitreklanger",
      tittel: "Bitreklanger og forholdninger",
      beskrivelse: "Hoved- og bitreklanger i dur og moll, navnene i opptaksprøven og i andre systemer, typiske akkordforløp, omvendinger og forholdninger, og hvor fagfolk er uenige.",
      fil: "bitreklanger.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["harmonilaere.html", "akkordanalyse.html", "quiz-akkordforlop.html"]
    },
    {
      seksjon: "teori",
      merke: "Melodi",
      tittel: "Melodilesing og melodidiktat",
      beskrivelse: "Tonika og skalatrinn, trinnvis bevegelse og sprang, dur eller moll, følge notene mens du lytter, finne feil i notene og skrive ned en melodi.",
      fil: "melodilesing.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["skalaer.html", "intervaller-teori.html", "rytme.html", "quiz-melodi.html"]
    },
    {
      seksjon: "teori",
      merke: "Stemming",
      tittel: "Stemming og temperatur",
      beskrivelse: "Frekvens og kammertone, overtonerekken, rene intervaller og svevninger, det pytagoreiske kommaet, og fire temperaturer du kan høre.",
      fil: "stemming.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["intervaller-teori.html", "gehorlekser-mikrointervaller.html", "quiz-stemming.html"]
    },
    {
      seksjon: "elevhefter",
      merke: "Treklanger",
      tittel: "Akkordhefte",
      beskrivelse: "Treklanger, trinnakkorder og diatonisk harmoni, med harmonisk moll.",
      fil: "akkordhefte.html",
      svartHvitt: false,
      lagtTil: "",
      niva: "grunnleggende",
      relatert: ["intervaller-teori.html", "akkordanalyse.html", "omvendinger.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Intervaller",
      tittel: "Gehørquiz: intervaller",
      beskrivelse: "Hør et intervall og finn navnet, innen én oktav eller opptil to oktaver, i øvemodus eller som en prøve med 20 oppgaver.",
      fil: "gehorquiz.html",
      svartHvitt: false,
      lagtTil: "2026-10-02",
      niva: "grunnleggende",
      relatert: ["intervaller-teori.html", "intervaller-og-sanger.html", "quiz-intervaller.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Skalaer",
      tittel: "Gehørquiz: skalaer og modi",
      beskrivelse: "Hør en skala og finn navnet: dur, moll, modi, pentatonikk, blues og jazzskalaer.",
      fil: "quiz-skalaer.html?type=hor",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "avansert",
      relatert: ["skalaer.html", "kvintsirkelen.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Rytme",
      tittel: "Gehørquiz: rytme",
      beskrivelse: "Hør en rytme og finn notene, eller hør hvilken taktart musikken går i.",
      fil: "quiz-rytme.html?type=hor",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "grunnleggende",
      relatert: ["rytme.html", "quiz-melodi.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Transponering",
      tittel: "Gehørquiz: transponering",
      beskrivelse: "Hør en melodi bli transponert og finn tonearten, hør en akkordrekke og skriv den i en ny toneart, eller hør tonen fra et transponerende instrument og finn noten.",
      fil: "quiz-transponering.html?type=hor",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["transponering.html", "kvintsirkelen.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Akkorder",
      tittel: "Gehørquiz: akkorder",
      beskrivelse: "Alle akkordene fra Den ultimate jukseboka, også omvendingene, i øvemodus eller som en prøve med 20 oppgaver.",
      fil: "gehorquiz-akkorder.html",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "grunnleggende",
      relatert: ["akkordanalyse.html", "akkordhefte.html", "gehorquiz-omvendinger.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Omvendinger",
      tittel: "Gehørquiz: omvendinger",
      beskrivelse: "Hør en akkord og finn stillingen, fra grunnstilling til sekundakkord.",
      fil: "gehorquiz-omvendinger.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "avansert",
      relatert: ["omvendinger.html", "akkordanalyse.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Harmoni",
      tittel: "Gehørquiz: kadenser og funksjoner",
      beskrivelse: "Hør en kadens og finn typen, eller hør en akkord etter tonika og finn funksjonen.",
      fil: "gehorquiz-harmoni.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "avansert",
      relatert: ["harmonilaere.html", "bitreklanger.html", "quiz-akkordforlop.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Akkordforløp",
      tittel: "Gehørquiz: akkordforløp",
      beskrivelse: "Hør korte akkordforløp og velg analysen med romertall eller funksjoner, og hør hvilken forholdning det er.",
      fil: "quiz-akkordforlop.html?type=hor",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["bitreklanger.html", "harmonilaere.html", "gehorquiz-harmoni.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Melodi",
      tittel: "Gehørquiz: melodi",
      beskrivelse: "Hør melodier og velg riktig notebilde, finn tonen som står feil i notene, og hør om melodien er i dur eller moll.",
      fil: "quiz-melodi.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["melodilesing.html", "rytme.html", "quiz-rytme.html"]
    },
    {
      seksjon: "gehorquiz",
      merke: "Stemming",
      tittel: "Gehørquiz: rent eller svevende",
      beskrivelse: "Hør to toner samtidig og avgjør om intervallet er rent eller svever, slik en pianostemmer lytter.",
      fil: "quiz-stemming.html?type=hor",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["stemming.html", "gehorlekser-mikrointervaller.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Noter",
      tittel: "Teoriquiz: notelesing",
      beskrivelse: "Les en note og finn navnet, eller finn en tone på notelinjen, i fire nøkler.",
      fil: "quiz-notelesing.html",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "grunnleggende",
      relatert: ["notelesing.html", "quiz-intervaller.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Rytme",
      tittel: "Teoriquiz: rytme",
      beskrivelse: "Les en rytme og tell: finn taktarten eller noten som mangler.",
      fil: "quiz-rytme.html?type=les",
      svartHvitt: false,
      lagtTil: "2026-10-06",
      niva: "grunnleggende",
      relatert: ["rytme.html", "quiz-melodi.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Intervaller",
      tittel: "Teoriquiz: intervaller",
      beskrivelse: "Les et intervall på notelinjen og finn navnet, eller skriv det ved å velge riktig notebilde, i G- og F-nøkkel.",
      fil: "quiz-intervaller.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "grunnleggende",
      relatert: ["intervaller-teori.html", "gehorquiz.html", "intervaller.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Skalaer",
      tittel: "Teoriquiz: skalaer og modi",
      beskrivelse: "Les en skala på notelinjen og finn navnet.",
      fil: "quiz-skalaer.html?type=les",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "avansert",
      relatert: ["skalaer.html", "kvintsirkelen.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Tonearter",
      tittel: "Teoriquiz: kvintsirkelen",
      beskrivelse: "Les fortegnene og finn tonearten, eller finn fortegnene til en toneart.",
      fil: "quiz-kvintsirkelen.html",
      svartHvitt: false,
      lagtTil: "2026-10-05",
      niva: "grunnleggende",
      relatert: ["kvintsirkelen.html", "skalaer.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Transponering",
      tittel: "Teoriquiz: transponering",
      beskrivelse: "Transponer en tone eller en akkordrekke, og finn hva som klinger og hva som står skrevet for transponerende instrumenter.",
      fil: "quiz-transponering.html?type=les",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["transponering.html", "kvintsirkelen.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Akkordanalyse",
      tittel: "Teoriquiz: akkordanalyse",
      beskrivelse: "Les en akkord på notelinjen og finn besifringen, eller trinn og omvending, eller funksjonen.",
      fil: "quiz-akkordanalyse.html",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "avansert",
      relatert: ["akkordanalyse.html", "omvendinger.html", "gehorquiz-akkorder.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Akkordforløp",
      tittel: "Teoriquiz: akkordforløp",
      beskrivelse: "Les korte akkordforløp i firstemmig sats og velg analysen, og finn typen forholdning.",
      fil: "quiz-akkordforlop.html?type=les",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["bitreklanger.html", "harmonilaere.html", "gehorquiz-harmoni.html"]
    },
    {
      seksjon: "teoriquiz",
      merke: "Stemming",
      tittel: "Teoriquiz: stemming og temperatur",
      beskrivelse: "Frekvensforhold, cent, kommaet, temperaturene og utregning av frekvenser.",
      fil: "quiz-stemming.html?type=les",
      svartHvitt: false,
      lagtTil: "2026-10-09",
      niva: "ekspert",
      relatert: ["stemming.html", "gehorlekser-mikrointervaller.html"]
    }
  ]

};
