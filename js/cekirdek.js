/* ============================================================================
   ÇEKİRDEK — ekran modüllerinin ortak zemini
   ----------------------------------------------------------------------------
   Uygulama tek bir 828 satırlık dosyaydı; ekranlar çoğaldıkça bakımı zorlaştı.
   Artık her ekran kendi dosyasında ve hepsi burada tanımlanan AM.ic ("iç")
   ad alanı üzerinden konuşuyor: paylaşılan durum, bildirim, gezinme ve panel
   yönetimi burada.

   Modüller birbirini doğrudan çağırmaz, hep AM.ic üzerinden çağırır. Böylece
   yükleme sırası önemsiz kalır — çağrılar çalışma anında çözülür.

   YÜKLEME SIRASI: bu dosya ekran modüllerinden ÖNCE, uygulama.js hepsinden
   SONRA gelmeli (uygulama.js olayları bağlayıp calistir()'i çağırıyor).
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  var el = AM.ui.el, bosalt = AM.ui.bosalt;
  function $(id) { return document.getElementById(id); }

  var EKRANLAR = ["bugun", "mutfak", "favori", "tarifler"];

  var ic = AM.ic = {
    el: el,
    bosalt: bosalt,
    $: $,
    EKRANLAR: EKRANLAR,
    SAYFA_ADET: 24,

    /* "Hepsi" seçiliyken her öğün grubundan kaç kart gösterilsin */
    GRUP_ONIZLEME: 6,

    durum: {
      ekran: "bugun",
      katFiltre: "hepsi",
      malzemeArama: "",
      tarifKat: "hepsi",
      tarifArama: "",
      gosterYapilabilir: 24,
      gosterNerdeyse: 12,
      gosterTum: 24,
      acikTarif: null,
      porsiyon: 4,
      adim: 0,
      sonOneriler: null
    }
  };

  /* ====================================================== BİLDİRİM (toast) */

  var bildirimZaman = null;
  ic.bildir = function (metin, aksiyonAdi, aksiyon) {
    var kutu = $("bildirim");
    bosalt(kutu);
    kutu.appendChild(document.createTextNode(metin));
    if (aksiyonAdi) {
      var b = el("button", { type: "button", metin: aksiyonAdi });
      b.addEventListener("click", aksiyon);
      kutu.appendChild(b);
    }
    kutu.hidden = false;
    clearTimeout(bildirimZaman);
    if (!aksiyonAdi) bildirimZaman = setTimeout(function () { kutu.hidden = true; }, 2200);
  };

  /* ============================================================== GEZİNME */

  ic.git = function (ad) {
    if (EKRANLAR.indexOf(ad) === -1) ad = "bugun";
    ic.durum.ekran = ad;
    EKRANLAR.forEach(function (e) { $("ekran-" + e).hidden = (e !== ad); });
    Array.prototype.forEach.call(document.querySelectorAll(".menu-btn"), function (b) {
      b.classList.toggle("aktif", b.dataset.git === ad);
    });
    var altYazi = {
      bugun: "Bugün ne pişirsem?",
      mutfak: "Evde neler var?",
      favori: "En sevdikleriniz",
      tarifler: (AM.TARIFLER.length) + " tarif"
    };
    $("ustAltYazi").textContent = altYazi[ad];
    window.scrollTo(0, 0);

    if (ad === "bugun") ic.ciz_bugun();
    if (ad === "favori") ic.ciz_favori();
    if (ad === "tarifler") ic.ciz_tarifler();
  };

  /* ======================================================== PANELLER */

  ic.panelAc = function (id) {
    $(id).hidden = false;
    document.body.style.overflow = "hidden";
    ic.gecmisEkle(id);
  };

  ic.panelKapat = function (id) {
    $(id).hidden = true;
    if ($("pisirmePanel").hidden && $("tarifPanel").hidden && $("ayarPanel").hidden) {
      document.body.style.overflow = "";
    }
  };

  ic.hepsiniKapat = function () {
    if (!$("pisirmePanel").hidden) { ic.pisirmeKapat(); return true; }
    if (!$("tarifPanel").hidden) { ic.panelKapat("tarifPanel"); return true; }
    if (!$("ayarPanel").hidden) { ic.panelKapat("ayarPanel"); return true; }
    return false;
  };

  /* Android geri tuşu paneli kapatsın, uygulamadan çıkmasın. */
  var gecmisDerinlik = 0;

  ic.gecmisEkle = function (ad) {
    gecmisDerinlik++;
    try { history.pushState({ am: ad, d: gecmisDerinlik }, ""); } catch (e) {}
  };

  window.addEventListener("popstate", function () {
    if (gecmisDerinlik > 0) gecmisDerinlik--;
    ic.hepsiniKapat();
  });

  ic.geriGit = function () {
    if (gecmisDerinlik > 0) history.back();
    else ic.hepsiniKapat();
  };
})();
