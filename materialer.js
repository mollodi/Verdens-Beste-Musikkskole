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
   ===================================================================== */

window.VBM = {

  seksjoner: [
    { id: "jukseboker", overskrift: "Juksebøker", tittel: "Bøker til", uthevet: "oppslag",
      ingress: "Oppslagsverk med ekte noter i C. Trykk på spill-knappen for å høre, på piano, gitar eller strykere." },
    { id: "oretrening", overskrift: "Øretrening", tittel: "Hør og", uthevet: "lytt",
      ingress: "Kjente sanger og verk som viser lyden av intervaller og akkorder." },
    { id: "elevhefter", overskrift: "Elevhefter", tittel: "Hefter til", uthevet: "timen",
      ingress: "Arbeidshefter til bruk i undervisningen." }
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
      merke: "Lytteguide, på engelsk",
      tittel: "Dominant & Major 7th/9th Chords",
      beskrivelse: "Septim- og nonakkorder hos Chopin, Debussy, Hendrix og James Brown.",
      fil: "lytteguide-septim-og-nonakkorder.html",
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
    }
  ]

};
