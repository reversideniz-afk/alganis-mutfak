/* ============================================================================
   BESİN DEĞERİ HESABI
   ----------------------------------------------------------------------------
   Tarifin malzeme satırlarını grama çevirip data/besin.js'teki 100 g başına
   değerlerle çarpar, porsiyona böler.

   NEDEN YAKLAŞIK
     • "kızartmak için" gibi miktarı yazılmayan satırlar hesaplanamaz. Kızartma
       yağının ne kadarının yemeğe geçtiği tarife ve ateşe göre değişir.
     • Pişerken kaybolan su toplam ağırlığı düşürür, bizim hesap çiğ üzerinden.
     • "1 adet patlıcan" ortalama ağırlıktan çevrilir.
   Bu yüzden sonuç her zaman "yaklaşık" etiketiyle sunulur ve hesaplanamayan
   malzeme oranı (kapsam) birlikte döndürülür — arayüz kapsam düşükse değeri
   göstermemeyi seçebilir.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  /* Birim adları uzundan kısaya sıralanıyor: "çay kaşığı" aranırken
     "kaşığı" ile yanlış eşleşme olmasın. */
  var GENEL_ANAHTARLAR = Object.keys(AM.GRAM_GENEL || {})
    .sort(function (a, b) { return b.length - a.length; });

  function birimNormal(birim) {
    return String(birim || "").toLocaleLowerCase("tr-TR").trim();
  }

  /* Miktarı yazılmamış baharat, tuz ve su hesabı bozmaz: bir tutam karabiberin
     kaloriye katkısı sıfıra yakındır. Bunları "hesaplanamadı" saymak kapsam
     oranını sebepsiz düşürür ve arayüzün doğru tarifte değer göstermemesine
     yol açardı (karabiber tek başına 158 tarifte miktarsız yazılmış). */
  var ONEMSIZ = Object.create(null);
  (AM.MALZEMELER || []).forEach(function (m) {
    if (m[2] === "baharat") ONEMSIZ[m[0]] = 1;
  });
  ONEMSIZ["tuz"] = 1;
  ONEMSIZ["su"] = 1;

  /**
   * Bir malzeme satırını grama çevirir.
   * Çeviremezse null döner (miktar yazılmamış ya da birim tanınmıyor).
   */
  function gramaCevir(id, miktar, birim) {
    if (miktar === null || miktar === undefined) return null;
    var m = Number(miktar);
    if (!isFinite(m) || m <= 0) return null;

    var b = birimNormal(birim);
    if (!b) return null;

    /* Önce malzemeye özel ağırlık: "1 su bardağı un" 200 g değil 120 g. */
    var ozel = AM.GRAM_OZEL && AM.GRAM_OZEL[id];
    if (ozel) {
      var ozelAnahtarlar = Object.keys(ozel).sort(function (a, b2) { return b2.length - a.length; });
      for (var i = 0; i < ozelAnahtarlar.length; i++) {
        if (b.indexOf(ozelAnahtarlar[i]) !== -1) return m * ozel[ozelAnahtarlar[i]];
      }
    }

    for (var j = 0; j < GENEL_ANAHTARLAR.length; j++) {
      if (b.indexOf(GENEL_ANAHTARLAR[j]) !== -1) {
        return m * AM.GRAM_GENEL[GENEL_ANAHTARLAR[j]];
      }
    }
    return null;
  }

  /**
   * Tarifin bir porsiyonundaki yaklaşık besin değeri.
   *
   * @param  t         tarif nesnesi
   * @param  porsiyon  kaç kişilik hesaplanacağı (varsayılan: tarifin kendi por'u)
   * @return { kcal, karb, prot, yag, kapsam, atlanan }
   *         kapsam  : 0–1 arası, hesaba girebilen malzeme oranı
   *         atlanan : hesaplanamayan malzeme id'leri
   */
  function hesapla(t, porsiyon) {
    var toplam = { kcal: 0, karb: 0, prot: 0, yag: 0 };
    var atlanan = [];
    var giren = 0, sayilan = 0;

    (t.m || []).forEach(function (satir) {
      var rol = satir[3] || "ana";
      var id = String(satir[0]).split("|")[0];

      /* Süs malzemeleri (maydanoz serpmek gibi) kapsam oranını bozmasın:
         hesaba katılır ama hesaplanamazsa eksik sayılmaz. */
      if (rol !== "ops") sayilan++;

      var besin = AM.BESIN && AM.BESIN[id];
      if (!besin) { if (rol !== "ops") atlanan.push(id); return; }

      var gram = gramaCevir(id, satir[1], satir[2]);
      if (gram === null) {
        /* Miktarsız baharat/tuz/su: katkısı sıfır sayılır, eksik sayılmaz. */
        if (ONEMSIZ[id]) { if (rol !== "ops") giren++; return; }
        if (rol !== "ops") atlanan.push(id);
        return;
      }

      if (rol !== "ops") giren++;
      var k = gram / 100;
      toplam.kcal += besin[0] * k;
      toplam.karb += besin[1] * k;
      toplam.prot += besin[2] * k;
      toplam.yag  += besin[3] * k;
    });

    var kisi = porsiyon || t.por || 1;
    return {
      kcal:   Math.round(toplam.kcal / kisi),
      karb:   Math.round(toplam.karb / kisi),
      prot:   Math.round(toplam.prot / kisi),
      yag:    Math.round(toplam.yag / kisi),
      kapsam: sayilan ? giren / sayilan : 0,
      atlanan: atlanan
    };
  }

  AM.besin = {
    hesapla: hesapla,
    gramaCevir: gramaCevir,

    /* Kapsam bu eşiğin altındaysa sayı yanıltıcı olur, gösterme.
       Örn. malzemelerin yarısı "göz kararı" yazılmış bir tarif. */
    ESIK: 0.6,

    gosterilsinMi: function (sonuc) {
      return sonuc && sonuc.kapsam >= AM.besin.ESIK && sonuc.kcal > 0;
    }
  };
})();
