/* ============================================================================
   GÖRSELİ OLAN TARİFLER
   ----------------------------------------------------------------------------
   Bu dosya ELLE DÜZENLENMEZ — tools/gorsel-liste.js üretir.
   Yeni görsel ekledikten sonra:  node tools/gorsel-liste.js

   js/gorsel.js bu listeye bakar: id buradaysa gorseller/<id>.jpg gösterilir,
   değilse tarif kendi SVG portresine düşer. Böylece görseli olmayan tarif
   boşuna 404 isteği atmaz.
   ========================================================================== */

window.AM = window.AM || {};

AM.GORSELLER = [
  "arpa-sehriye-pilavi", "biber-kizartmasi", "biber-tursusu", "domates-kavurmasi",
  "ekmek-kadayifi", "ev-yapimi-yufka", "firinda-citir-nohut", "gozleme",
  "havuc-tarator", "kahvaltilik-patates", "kapak-bakliyat", "kapak-balik",
  "kapak-corba", "kapak-etli", "kapak-hamur", "kapak-kahvalti",
  "kapak-pilav", "kapak-salata", "kapak-sebze", "kapak-tatli",
  "kapak-tavuk", "krep", "kumpir", "kuru-fasulye-corbasi",
  "kuru-fasulye-yogurtlu", "mayasiz-lavas", "menemen", "muhallebi",
  "murtuga", "nohut-corbasi", "nohutlu-pilav", "patates-puresi",
  "patatesli-yumurta", "peynirli-makarna", "peynirli-omlet", "peynirli-patates-tava",
  "peynirli-yumurta-sahan", "pirinc-pilavi", "sade-omlet", "sahanda-peynir",
  "sahanda-yumurta", "sarimsakli-ekmek", "sehriye-corbasi", "soganli-yumurta",
  "sut-corbasi", "sut-helvasi", "tuzlu-katmer", "un-corbasi",
  "un-helvasi", "yumurtali-ekmek", "zeytinli-omlet"
];
