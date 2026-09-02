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
  "kapak-corba"
];
