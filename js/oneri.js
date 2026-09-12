/* ============================================================================
   ÖNERİ AĞIRLIKLANDIRMA — Faz 3 ("Bugün ne pişirsem?" akıllı sıralama)
   ----------------------------------------------------------------------------
   js/eslestir.js zaten malzeme eksikliğine göre "tam"/"neredeyse"/"yakın"
   ayrımını yapıp bir öncelik sırası kuruyor — bu dosya AYNI önceliğin İÇİNDE
   ince ayar yapıyor: favori, kişisel puan, son pişirilme ve günün saati bir
   tarifi bugün ne kadar akla yatkın kılıyor. Eksik malzeme sayısına göre
   kurulan sırayı asla değiştirmez (bkz. eslestir.js: sirala()) — sadece eşit
   eksiklikteki tarifler arasında tercih kurar.

   Mevsim bilerek YOK: tariflerde mevsim verisi hiç tutulmuyor, kategoriden
   ("çorba" = kış, "salata" = yaz gibi) tahmin üretmek çoğu tarif için (tavuk,
   balık, pilav mevsimsiz) yanlış olurdu — CLAUDE.md'nin "uydurma oran yazma"
   ilkesiyle aynı gerekçe. Saat + geçmiş + favori/puan zaten güçlü bir sinyal.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  /**
   * Günün saatine göre hangi öğün grubu öne çıksın (AM.OGUN_GRUPLARI id'leri).
   * Kesişmeyen saatlerde (ikindi, gece yarısı) kimseye bonus verilmez —
   * zorlama bir eşleşme uydurmaktansa nötr kalmak tercih edildi.
   */
  AM.saatGrubu = function () {
    var s = new Date().getHours();
    if (s >= 6 && s < 11) return "kahvalti";
    if (s >= 11 && s < 15) return "ana";   // öğle
    if (s >= 17 && s < 22) return "ana";   // akşam
    return null;
  };

  /**
   * Bir tarifin bugünkü sıralamada ne kadar öne çıkması gerektiğini söyleyen
   * ağırlık (kabaca -4..+3 aralığı). eslestir.js bunu sadece AYNI eksik
   * malzeme grubundaki tarifleri karşılaştırmak için kullanır.
   */
  AM.oneriAgirlik = function (t) {
    var w = 0;

    if (AM.depo.favMi(t.id)) w += 1.5;

    var p = AM.depo.puan(t.id);
    if (p) w += (p - 3) * 0.5;   // 1★ → -1, 3★ → 0, 5★ → +1

    var son = AM.depo.sonPisirme(t.id);
    if (son !== null) {
      var gunOnce = (Date.now() - son) / 86400000;
      if (gunOnce < 3) w -= 3;                                  // aynı yemeği hemen tekrar önerme
      else if (gunOnce < 14) w -= 1.3 * (1 - gunOnce / 14);      // 14 güne kadar yumuşak, azalan ceza
    }

    var grup = AM.saatGrubu();
    if (grup && AM.grupBul(t) === grup) w += 0.8;

    return w;
  };
})();
