/* ============================================================================
   EKRANLAR: FAVORİLER ve TÜM TARİFLER
   ----------------------------------------------------------------------------
   İkisi de aynı işi yapıyor — bir tarif listesini kart olarak dökmek — bu
   yüzden aynı dosyada duruyorlar.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  /* ================================================== EKRAN: FAVORİLER */

  ic.ciz_favori = function () {
    var kap = $("listeFavori");
    var sepet = AM.depo.sepet();
    bosalt(kap);

    /* Katalogdan çıkarılmış bir tarifin id'si favorilerde kalmış olabilir
       (bkz. js/depo.js — bilinmeyen id'ler bilerek silinmiyor). filter(Boolean)
       onları listeden düşürür, kayıttan değil. */
    var favlar = AM.depo.favlar()
      .map(function (id) { return AM.T[id]; })
      .filter(Boolean);

    favlar.forEach(function (t) {
      kap.appendChild(AM.ui.tarifKart({ t: t, d: AM.degerlendir(t, sepet) }, ic.tarifAc));
    });
    $("favoriBos").hidden = favlar.length > 0;
  };

  /* ================================================ EKRAN: TÜM TARİFLER */

  ic.ciz_tarifKatSerit = function () {
    var serit = $("tarifKatSerit");
    bosalt(serit);

    function cip(id, ad, emoji) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (ic.durum.tarifKat === id ? " aktif" : "")
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      b.addEventListener("click", function () {
        ic.durum.tarifKat = id;
        ic.durum.gosterTum = ic.SAYFA_ADET;
        ic.ciz_tarifKatSerit();
        ic.ciz_tarifler();
      });
      return b;
    }

    serit.appendChild(cip("hepsi", "Tümü", "📖"));
    AM.TARIF_KATEGORILERI.forEach(function (k) { serit.appendChild(cip(k.id, k.ad, k.emoji)); });
  };

  ic.ciz_tarifler = function () {
    var kap = $("listeTumTarifler");
    var sepet = AM.depo.sepet();
    bosalt(kap);
    var sonuc = AM.tarifAra(ic.durum.tarifArama, ic.durum.tarifKat);
    sonuc.slice(0, ic.durum.gosterTum).forEach(function (t) {
      kap.appendChild(AM.ui.tarifKart({ t: t, d: AM.degerlendir(t, sepet) }, ic.tarifAc));
    });
    $("tarifBos").hidden = sonuc.length > 0;
    $("btnDahaFazlaTum").hidden = sonuc.length <= ic.durum.gosterTum;
  };
})();
