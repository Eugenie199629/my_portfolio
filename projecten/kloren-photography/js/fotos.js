/* =========================================================
   JOUW FOTO'S
   ---------------------------------------------------------
   Zo voeg je een foto toe:
   1. Zet het fotobestand in de map  fotos/
   2. Voeg hieronder een regel toe, bijvoorbeeld:
      { bestand: "fotos/mijn-foto.jpg", categorie: "natuur", titel: "Ochtendmist" },

   Categorieën: newborn, dieren, macro, natuur, portretten
   (een foto kan ook in meerdere: categorie: "macro natuur")

   De volgorde hieronder = de volgorde in de galerij.
   ========================================================= */

const FOTOS = [
 
  { bestand: "fotos/noortje01.jpg",   categorie: "newborn", titel: "In het gouden uur" },
  { bestand: "fotos/noortje02.jpg",   categorie: "newborn", titel: "In het gouden uur" },
  { bestand: "fotos/noortje03.jpg",   categorie: "newborn", titel: "In het gouden uur" },
  { bestand: "fotos/noortje04.jpg", categorie: "newborm", titel: "in het gouden uur" },
  { bestand: "fotos/noortje05.jpg",   categorie: "newborn", titel: "In het gouden uur" },
  { bestand: "fotos/noortje06.jpg",   categorie: "newborn", titel: "In het gouden uur" },
  

  { bestand: "fotos/schaapp.jpg",        categorie: "dieren",       titel: "Nieuwsgierig schaap" },
  { bestand: "fotos/vogel.jpg",          categorie: "dieren",       titel: "Nieuwsgierig schaap" },

  { bestand: "fotos/bloem01.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/bloem02.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/bloem03.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/bloem04.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/bloem05.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/bloem06.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },

  { bestand: "fotos/gitaar01.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/gitaar02.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/gitaar03.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },

  { bestand: "fotos/zeepbel01.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/zeepbel02.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },

  { bestand: "fotos/maddelief.jpg",       categorie: "macro",        titel: "Bloesem na de regen" },
  { bestand: "fotos/paddenstoel.jpg",     categorie: "macro",        titel: "Bloesem na de regen" },

  { bestand: "fotos/natuur01.jpg",          categorie: "natuur",       titel: "Doorkijk op het meer" },
   { bestand: "fotos/natuur02.jpg",          categorie: "natuur",       titel: "Doorkijk op het meer" },

  { bestand: "fotos/vera01.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera02.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera03.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera04.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera05.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera06.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/vera07.jpg",       categorie: "portretten",   titel: "Avond op het festival" },

  { bestand: "fotos/ralita01.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/ralita02.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/ralita03.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/ralita04.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/ralita05.jpg",       categorie: "portretten",   titel: "Avond op het festival" },

  { bestand: "fotos/celesta01.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
  { bestand: "fotos/celesta02.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
{ bestand: "fotos/celesta03.jpg",       categorie: "portretten",   titel: "Avond op het festival" },

{ bestand: "fotos/opa.jpg",       categorie: "portretten",   titel: "Avond op het festival" },
{ bestand: "fotos/simone.jpg",       categorie: "portretten",   titel: "Avond op het festival" },

{ bestand: "fotos/adam01.jpg",       categorie: "architectuur",   titel: "Avond op het festival" },
{ bestand: "fotos/adam02.jpg",       categorie: "architectuur",   titel: "Avond op het festival" },
{ bestand: "fotos/brug.jpg",       categorie: "architectuur",   titel: "Avond op het festival" },
{ bestand: "fotos/semetrisch.jpg",       categorie: "architectuur",   titel: "Avond op het festival" },

];
