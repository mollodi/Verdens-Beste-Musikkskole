/* © 2026 Verdens Beste Musikkskole. Alle rettigheter forbeholdt. Verk-ID: VBM-K7Q4-QU4H. Signatur: bf337bfd3ba9686ea01e757a1996aa9c1cffd86425fb5f5115cfe4cf5e7d08e9 */
/* =====================================================================
   Verdens Beste Musikkskole – LISTEN OVER ALT MATERIELL
   ---------------------------------------------------------------------
   Dette er den eneste filen du trenger å endre for å legge til,
   flytte eller skjule noe på startsiden.

   NYTT MATERIELL: kopier en blokk { ... }, lim den inn der den skal
   stå, og endre teksten. Husk komma mellom blokkene.

     seksjon     hvilken del av startsiden (se «seksjoner» øverst)
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
      ingress: "Oppslagsverk med ekte noter i C. Trykk på spill-knappen for å høre, på piano, gitar eller strykere." },
    { id: "oretrening", overskrift: "Øretrening", tittel: "Hør og", uthevet: "lytt",
      ingress: "Kjente sanger og verk som viser lyden av intervaller og akkorder." },
    { id: "teori", overskrift: "Musikkteori", tittel: "Lær og", uthevet: "forstå",
      ingress: "Interaktive leksjoner i musikkteori, med ekte noter og lyd." },
    { id: "elevhefter", overskrift: "Elevhefter", tittel: "Hefter til", uthevet: "timen",
      ingress: "Arbeidshefter til bruk i undervisningen." },
    { id: "quiz", overskrift: "Quiz", tittel: "Øv og", uthevet: "test deg",
      ingress: "Gehørquizer med øvemodus i eget tempo og prøvemodus slik som på opptaksprøver." }
  ],

  materialer: [
    {
      seksjon: "jukseboker",
      merke: "25 intervaller",
      tittel: "Intervall-jukseboka",
      beskrivelse: "Alle intervaller fra ren prim til dobbel oktav, med begge navn over oktaven.",
      fil: "intervaller.html",
      svartHvitt: true,
      lagtTil: ""
    },
    {
      seksjon: "jukseboker",
      merke: "34 akkorder",
      tittel: "Den ultimate jukseboka for akkorder og intervaller",
      beskrivelse: "Fire kapitler, fra treklanger til 13-akkorder, kvartalakkorder og mer.",
      fil: "akkorder-og-intervaller.html",
      svartHvitt: true,
      lagtTil: ""
    },
    {
      seksjon: "oretrening",
      merke: "Intervaller",
      tittel: "Intervaller & sanger",
      beskrivelse: "Hvert intervall oppover og nedover, med eksempelsanger og Spotify-lenker.",
      fil: "intervaller-og-sanger.html",
      svartHvitt: false,
      lagtTil: ""
    },
    {
      seksjon: "oretrening",
      merke: "Lytteguide",
      tittel: "Dominant- og majorakkorder med septim og none",
      beskrivelse: "Septim- og nonakkorder hos Chopin, Debussy, Hendrix og James Brown.",
      fil: "lytteguide-septim-og-nonakkorder.html",
      svartHvitt: false,
      lagtTil: ""
    },
    {
      seksjon: "oretrening",
      merke: "Mikrointervaller",
      tittel: "Gehørlekser med mikrointervaller",
      beskrivelse: "Seks øvelser i små forskjeller i tonehøyde, som forberedelse til pianostemmerutdanningen ved NMH.",
      fil: "gehorlekser-mikrointervaller.html",
      svartHvitt: false,
      lagtTil: ""
    },
    {
      seksjon: "elevhefter",
      merke: "Treklanger",
      tittel: "Akkordhefte",
      beskrivelse: "Treklanger, trinnakkorder og diatonisk harmoni, med harmonisk moll.",
      fil: "akkordhefte.html",
      svartHvitt: false,
      lagtTil: ""
    },
    {
      seksjon: "teori",
      merke: "Tonearter",
      tittel: "Kvintsirkelen",
      beskrivelse: "Alle dur- og molltonearter med fortegn, rekkefølgen på kryss og b-er, og lyd for hver toneart.",
      fil: "kvintsirkelen.html",
      svartHvitt: false,
      lagtTil: "2026-10-05"
    },
    {
      seksjon: "quiz",
      merke: "Intervaller",
      tittel: "Gehørquiz: intervaller",
      beskrivelse: "Hør et intervall og finn navnet, i øvemodus eller som en prøve med 20 oppgaver.",
      fil: "gehorquiz.html",
      svartHvitt: false,
      lagtTil: "2026-10-02"
    },
    {
      seksjon: "quiz",
      merke: "Akkorder",
      tittel: "Gehørquiz: akkorder",
      beskrivelse: "Alle 34 akkordene fra Den ultimate jukseboka, i øvemodus eller som en prøve med 20 oppgaver.",
      fil: "gehorquiz-akkorder.html",
      svartHvitt: false,
      lagtTil: "2026-10-05"
    },
    {
      seksjon: "quiz",
      merke: "Tonearter",
      tittel: "Teoriquiz: kvintsirkelen",
      beskrivelse: "Les fortegnene og finn tonearten, eller finn fortegnene til en toneart.",
      fil: "quiz-kvintsirkelen.html",
      svartHvitt: false,
      lagtTil: "2026-10-05"
    }
  ]

};
