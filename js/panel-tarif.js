/* ============================================================================
   TARİF PANELİ ve PİŞİRME MODU
   ----------------------------------------------------------------------------
   Pişirme modu ekranı uyanık tutar (Wake Lock): ocak başında telefon
   kararmasın. İzin verilmezse ya da tarayıcı desteklemiyorsa sessizce
   vazgeçilir — özellik yoksa da uygulama çalışır.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = AM.ui.el, bosalt = ic.bosalt, $ = ic.$;

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
    govde.appendChild(ciz_kisisel(t));
    var fav = AM.depo.favMi(t.id);
    $("btnFavori").setAttribute("aria-pressed", fav ? "true" : "false");
    $("btnFavori").setAttribute("aria-label", fav ? "Favorilerden çıkar" : "Favorilere ekle");
  };

  /* ============================================== PUAN / NOT / KOLEKSİYON
     Tarif panelinin altında, kullanıcının kendi puanı/notu/listeleri (Faz 3).
     js/depo.js bu alanları Faz 0'dan beri tutuyor — burası ilk arayüzü.
     ui.detay() (js/arayuz.js) pasif içerik çiziyor; buradaki bölüm etkileşimli
     olduğu ve ic.bildir gibi çekirdek yardımcılara ihtiyaç duyduğu için
     panel-tarif.js'te, favori düğmesiyle aynı katmanda kalıyor. */

  function yildizSatiri(t) {
    var kap = el("div", { sinif: "puan-satir", role: "group", "aria-label": "Puanın" });
    var dugmeler = [];
    var mevcut = AM.depo.puan(t.id) || 0;

    function boyaAlBoyaVer(puan) {
      dugmeler.forEach(function (d, ix) {
        var basiliMi = puan !== null && (ix + 1) <= puan;
        d.setAttribute("aria-pressed", basiliMi ? "true" : "false");
        d.textContent = basiliMi ? "★" : "☆";
      });
    }

    for (var i = 1; i <= 5; i++) {
      (function (deger) {
        var b = el("button", {
          type: "button", sinif: "puan-yildiz",
          "aria-label": deger + " yıldız",
          "aria-pressed": deger <= mevcut ? "true" : "false",
          metin: deger <= mevcut ? "★" : "☆"
        });
        b.addEventListener("click", function () {
          var yeniPuan = AM.depo.puan(t.id) === deger ? null : deger;
          AM.depo.puan(t.id, yeniPuan);
          boyaAlBoyaVer(yeniPuan);
        });
        dugmeler.push(b);
        kap.appendChild(b);
      })(i);
    }
    return kap;
  }

  function notAlani(t) {
    var kap = el("div", { sinif: "not-kutu" });
    var alan = el("textarea", {
      sinif: "not-alani", rows: "2", maxlength: String(AM.depo.notUzunlukSiniri),
      "aria-label": "Kişisel notun",
      placeholder: "Kendine not bırak — ör. \"tuzu az koy\""
    });
    alan.value = AM.depo.not(t.id);

    /* "blur" tek başına güvenilir değil: kullanıcı panel'i X'e ya da geri
       tuşuna basıp kapatırsa (başka bir yere dokunmadan) blur hiç tetiklenmez
       ve yazdığı not kaybolur. Yazarken 600ms sessizlikte otomatik kaydeden
       bir zamanlayıcı bunu güvenceye alıyor; blur olursa da bekletmeden
       hemen kaydedip zamanlayıcıyı iptal ediyor. */
    var zamanlayici = null;
    function kaydetSimdi() { AM.depo.not(t.id, alan.value); }
    alan.addEventListener("input", function () {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(kaydetSimdi, 600);
    });
    alan.addEventListener("blur", function () {
      clearTimeout(zamanlayici);
      kaydetSimdi();
    });
    kap.appendChild(alan);
    return kap;
  }

  function koleksiyonBolumu(t) {
    var kap = el("div", { sinif: "koleksiyon-blok" });
    var cipSatir = el("div", { sinif: "cip-izgara" });

    function cizCipler() {
      bosalt(cipSatir);
      AM.depo.koleksiyonlar().forEach(function (k) {
        var icinde = k.idler.indexOf(t.id) !== -1;
        var cip = el("button", {
          type: "button", sinif: "cip", "aria-pressed": icinde ? "true" : "false"
        }, [el("span", { sinif: "tik", metin: "✓ " }), k.ad]);
        cip.addEventListener("click", function () {
          var eklendi = AM.depo.koleksiyonDegistir(k.ad, t.id);
          cip.setAttribute("aria-pressed", eklendi ? "true" : "false");
        });
        cipSatir.appendChild(cip);
      });
    }
    cizCipler();
    kap.appendChild(cipSatir);

    var yeniSatir = el("div", { sinif: "yeni-koleksiyon-satir" });
    var girdi = el("input", { type: "text", placeholder: "Yeni liste adı…", maxlength: "40" });
    var ekleBtn = el("button", { type: "button", sinif: "btn ikincil kucuk", metin: "+ Ekle" });

    function yeniOlustur() {
      var ad = girdi.value.trim();
      if (!ad) return;
      if (AM.depo.koleksiyonEkle(ad)) {
        AM.depo.koleksiyonDegistir(ad, t.id);
        girdi.value = "";
        cizCipler();
      } else {
        ic.bildir("Bu isimde bir liste zaten var ya da liste sayısı doldu.");
      }
    }
    ekleBtn.addEventListener("click", yeniOlustur);
    girdi.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); yeniOlustur(); }
    });
    yeniSatir.appendChild(girdi);
    yeniSatir.appendChild(ekleBtn);
    kap.appendChild(yeniSatir);

    return kap;
  }

  function ciz_kisisel(t) {
    var parca = document.createDocumentFragment();

    parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Puanın ve notun" }));
    var sonPisirilme = AM.depo.sonPisirme(t.id);
    if (sonPisirilme) {
      parca.appendChild(el("p", {
        sinif: "kisisel-alt", metin: "Son pişirilme: " + AM.ui.goreliTarih(sonPisirilme)
      }));
    }
    parca.appendChild(yildizSatiri(t));
    parca.appendChild(notAlani(t));

    parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Listelerim" }));
    parca.appendChild(koleksiyonBolumu(t));

    return parca;
  }

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
      (ic.durum.adim === t.y.length - 1) ? "Pişirdim ✓" : "İleri";
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
