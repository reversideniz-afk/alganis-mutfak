/* ============================================================================
   TARİF PANELİ ve PİŞİRME MODU
   ----------------------------------------------------------------------------
   Pişirme modu ekranı uyanık tutar (Wake Lock): ocak başında telefon
   kararmasın. İzin verilmezse ya da tarayıcı desteklemiyorsa sessizce
   vazgeçilir — özellik yoksa da uygulama çalışır.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, bosalt = ic.bosalt, $ = ic.$;

  var uyanikKilit = null;

  /* ==================================================== TARİF DETAYI */

  ic.tarifAc = function (id) {
    var t = AM.T[id];
    if (!t) return;
    ic.durum.acikTarif = t;
    ic.durum.porsiyon = t.por;
    ic.panelAc("tarifPanel");
    ic.ciz_detay();
  };

  ic.ciz_detay = function () {
    var t = ic.durum.acikTarif;
    if (!t) return;
    var govde = $("panelGovde");
    bosalt(govde);
    govde.appendChild(AM.ui.detay(t, AM.depo.sepet(), ic.durum.porsiyon, function (yeni) {
      ic.durum.porsiyon = yeni;
      /* Panel baştan çizilmiyor, sadece miktar yazıları tazeleniyor —
         yoksa kullanıcının kaydırma konumu başa dönerdi. */
      AM.ui.porsiyonYenile(govde, t, yeni);
    }));
    var fav = AM.depo.favMi(t.id);
    $("btnFavori").setAttribute("aria-pressed", fav ? "true" : "false");
    $("btnFavori").setAttribute("aria-label", fav ? "Favorilerden çıkar" : "Favorilere ekle");
  };

  /* ==================================================== PİŞİRME MODU */

  ic.pisirmeAc = function () {
    var t = ic.durum.acikTarif;
    if (!t) return;
    ic.durum.adim = 0;
    $("pisirmeBaslik").textContent = t.ad;
    $("pisirmePanel").hidden = false;
    document.body.style.overflow = "hidden";
    ic.ciz_pisirme();
    uyanikTut();
    ic.gecmisEkle("pisirme");
  };

  ic.ciz_pisirme = function () {
    var t = ic.durum.acikTarif;
    var govde = $("pisirmeGovde");
    bosalt(govde);
    govde.appendChild(AM.ui.pisirmeAdimi(t, ic.durum.adim, ic.durum.porsiyon / t.por));
    govde.scrollTop = 0;
    $("adimSayac").textContent = (ic.durum.adim + 1) + " / " + t.y.length;
    $("pisirmeDolgu").style.width = ((ic.durum.adim + 1) / t.y.length * 100) + "%";
    $("btnAdimGeri").disabled = ic.durum.adim === 0;
    $("btnAdimIleri").textContent =
      (ic.durum.adim === t.y.length - 1) ? "Afiyet olsun 🎉" : "İleri";
  };

  ic.pisirmeKapat = function () {
    $("pisirmePanel").hidden = true;
    document.body.style.overflow = "";
    uyanikBirak();
  };

  /* --- ekranı uyanık tutma ------------------------------------------------ */

  function uyanikTut() {
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(function (k) {
      uyanikKilit = k;
      $("ekranUyanikRozet").hidden = false;
      k.addEventListener("release", function () { $("ekranUyanikRozet").hidden = true; });
    }).catch(function () { /* izin yok ya da desteklenmiyor — sorun değil */ });
  }

  function uyanikBirak() {
    if (uyanikKilit) { try { uyanikKilit.release(); } catch (e) {} uyanikKilit = null; }
    $("ekranUyanikRozet").hidden = true;
  }

  /* Telefon kilitlenip açıldığında wake lock düşer; pişirme modu hâlâ
     açıksa yeniden alınır. */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && !$("pisirmePanel").hidden && !uyanikKilit) {
      uyanikTut();
    }
  });
})();
