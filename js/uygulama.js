/* ============================================================================
   UYGULAMA — çatı: olay bağlama, service worker, başlatma
   ----------------------------------------------------------------------------
   Ekranların çizimi artık ayrı dosyalarda (js/ekran-*.js, js/panel-tarif.js,
   js/ayarlar.js). Burada kalan iş: her şeyi birbirine bağlamak ve çalıştırmak.
   Ortak durum ve yardımcılar js/cekirdek.js içindeki AM.ic üzerinde.

   Bu dosya bütün ekran modüllerinden SONRA yüklenmeli.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, $ = ic.$;

  /** Yapışkan arama çubuğu tam başlığın altına otursun diye gerçek yüksekliği ölç. */
  function ustYuksekligiOlc() {
    var h = $("ustBar").offsetHeight;
    if (h > 0) document.documentElement.style.setProperty("--ust-h", h + "px");
  }

  ic.basla_ilkCizim = function (ilkKez) {
    ic.ciz_katSerit();
    ic.ciz_malzemeler();
    ic.rozetGuncelle();
    ic.ciz_tarifKatSerit();

    // İlk açılışta doğrudan malzeme ekranı; sonraki açılışlarda öneriler.
    var hosgeldin = $("hosgeldinNot");
    if (hosgeldin) hosgeldin.hidden = !ilkKez;
    ic.git((ilkKez || AM.depo.sepet().size === 0) ? "mutfak" : "bugun");
  };

  /* ======================================================== OLAY BAĞLAMA */

  function olaylariBagla() {
    /* alt menü + "şuraya git" düğmeleri */
    document.addEventListener("click", function (e) {
      var hedef = e.target.closest("[data-git]");
      if (hedef) { ic.git(hedef.dataset.git); return; }
    });

    /* malzeme çipleri (olay delegasyonu — 200 dinleyici yerine 1 tane) */
    $("malzemeListe").addEventListener("click", function (e) {
      var cip = e.target.closest(".cip");
      if (!cip) return;
      var acikMi = AM.depo.sepetDegistir(cip.dataset.id);
      cip.setAttribute("aria-pressed", acikMi ? "true" : "false");
      ic.rozetGuncelle();
      ic.ciz_katSerit();
    });

    /* malzeme arama */
    var mArama = $("malzemeArama");
    mArama.addEventListener("input", function () {
      ic.durum.malzemeArama = mArama.value;
      $("btnAramaTemizle").hidden = !mArama.value;
      ic.ciz_malzemeler();
    });
    $("btnAramaTemizle").addEventListener("click", function () {
      mArama.value = ""; ic.durum.malzemeArama = "";
      $("btnAramaTemizle").hidden = true;
      ic.ciz_malzemeler(); mArama.focus();
    });

    /* Dünya ekranı: mutfak detayından geri dön / seçili mutfağı "Bugün ne
       pişirsem?" kapsamına al */
    $("btnDunyaGeri").addEventListener("click", ic.dunyaGeri);
    $("btnDunyaBuMutfakIcinOner").addEventListener("click", ic.dunyaBuMutfakIcinOner);
    $("btnMutfakKapsamKaldir").addEventListener("click", function () {
      AM.depo.mutfak("hepsi");
      ic.ciz_bugun();
    });

    $("btnTemelleriSec").addEventListener("click", function () {
      AM.depo.temelleriSec();
      ic.ciz_malzemeler(); ic.ciz_katSerit(); ic.rozetGuncelle();
      ic.bildir("Temel malzemeler işaretlendi.");
    });
    $("btnHepsiniTemizle").addEventListener("click", function () {
      AM.depo.sepetTemizle();
      ic.ciz_malzemeler(); ic.ciz_katSerit(); ic.rozetGuncelle();
      ic.bildir("Tüm seçimler kaldırıldı.");
    });

    /* filtreler */
    $("filtreSerit").addEventListener("click", function (e) {
      var b = e.target.closest(".filtre-cip");
      if (!b) return;
      AM.depo.filtre(b.dataset.filtre);
      ic.durum.gosterYapilabilir = ic.SAYFA_ADET;
      ic.durum.gosterNerdeyse = 12;
      Array.prototype.forEach.call($("filtreSerit").children, function (x) {
        x.classList.toggle("aktif", x === b);
      });
      ic.ciz_bugun();
    });

    /* öneri düğmeleri */
    $("btnTarifiAc").addEventListener("click", function () {
      var id = $("oneriKart").dataset.id;
      if (id) ic.tarifAc(id);
    });
    $("btnBaskaOner").addEventListener("click", function () {
      AM.depo.oneriIx(AM.depo.oneriIx() + 1);
      ic.ciz_bugun();
      $("oneriKart").scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    $("btnDahaFazlaYapilabilir").addEventListener("click", function () {
      ic.durum.gosterYapilabilir += ic.SAYFA_ADET; ic.ciz_bugun();
    });
    $("btnDahaFazlaNerdeyse").addEventListener("click", function () {
      ic.durum.gosterNerdeyse += ic.SAYFA_ADET; ic.ciz_bugun();
    });
    $("btnDahaFazlaTum").addEventListener("click", function () {
      ic.durum.gosterTum += ic.SAYFA_ADET; ic.ciz_tarifler();
    });

    /* tarif arama */
    var tArama = $("tarifArama");
    tArama.addEventListener("input", function () {
      ic.durum.tarifArama = tArama.value;
      ic.durum.gosterTum = ic.SAYFA_ADET;
      $("btnTarifAramaTemizle").hidden = !tArama.value;
      ic.ciz_tarifler();
    });
    $("btnTarifAramaTemizle").addEventListener("click", function () {
      tArama.value = ""; ic.durum.tarifArama = "";
      $("btnTarifAramaTemizle").hidden = true;
      ic.ciz_tarifler(); tArama.focus();
    });

    /* Bugün ekranındaki arama "kutusu" aslında bir düğme — arama mantığını
       tekrarlamak yerine doğrudan Tarifler ekranına gidip oradaki gerçek
       kutuya odaklanıyor. */
    $("btnBugunAramaKisayol").addEventListener("click", function () {
      ic.git("tarifler");
      tArama.focus();
    });

    /* tarif paneli */
    $("btnPanelKapat").addEventListener("click", ic.geriGit);
    $("tarifPanel").addEventListener("click", function (e) {
      if (e.target === $("tarifPanel")) ic.geriGit();
    });
    $("btnFavori").addEventListener("click", function () {
      if (!ic.durum.acikTarif) return;
      var eklendi = AM.depo.favDegistir(ic.durum.acikTarif.id);
      $("btnFavori").setAttribute("aria-pressed", eklendi ? "true" : "false");
      ic.bildir(eklendi ? "Favorilere eklendi 💛" : "Favorilerden çıkarıldı");
      if (ic.durum.ekran === "favori") ic.ciz_favori();
    });
    /* Web Share API tarayıcı desteklemiyorsa düğme baştan gizli kalır —
       özellik yoksa da uygulama çalışır (bkz. pişirme modundaki wake lock
       ile aynı "sessizce vazgeç" mantığı). Paylaşılan sadece uygulamanın
       kendi bağlantısı ve tarif adı; dış bir isteğe gitmediği için CSP'yi
       (connect-src 'self') bozmaz — OS'un paylaşım sayfasını açar. */
    if (navigator.share) {
      $("btnPaylas").hidden = false;
      $("btnPaylas").addEventListener("click", function () {
        var t = ic.durum.acikTarif;
        if (!t) return;
        navigator.share({
          title: t.ad,
          text: "Alganis Mutfak'ta " + t.ad + " tarifine bakıyordum:",
          url: location.href
        }).catch(function () { /* kullanıcı iptal etti — sorun değil */ });
      });
    }
    $("btnPisirmeBasla").addEventListener("click", ic.pisirmeAc);

    /* pişirme modu */
    $("btnPisirmeKapat").addEventListener("click", ic.geriGit);
    $("btnAdimGeri").addEventListener("click", function () {
      if (ic.durum.adim > 0) { ic.durum.adim--; ic.ciz_pisirme(); }
    });
    $("btnAdimIleri").addEventListener("click", function () {
      var t = ic.durum.acikTarif;
      if (ic.durum.adim < t.y.length - 1) { ic.durum.adim++; ic.ciz_pisirme(); }
      else {
        /* "Pişirdim" — pişirme geçmişini besleyen tek kaynak (bkz. js/depo.js).
           Akıllı öneri (js/oneri.js) bunu okuyup aynı yemeği hemen tekrar
           önermemek için kullanıyor. */
        AM.depo.pisirdim(t.id);
        ic.geriGit();
        ic.bildir("Afiyet olsun! 🎉");
      }
    });

    /* Defterim ekranı: koleksiyon oluşturma/silme/geri, geçmiş sayfalama.
       Dinamik olarak çizilen tarif kartları ve koleksiyon satırları kendi
       dinleyicilerini js/ekran-defter.js içinde alıyor (bkz. o dosyanın
       koleksiyonSatiri fonksiyonu) — burada sadece sabit HTML düğmeleri var. */
    $("btnYeniKoleksiyon").addEventListener("click", function () {
      var girdi = $("yeniKoleksiyonAdi");
      if (ic.defterYeniKoleksiyon(girdi.value)) girdi.value = "";
    });
    $("yeniKoleksiyonAdi").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("btnYeniKoleksiyon").click(); }
    });
    $("btnKoleksiyonGeri").addEventListener("click", ic.defterKoleksiyonGeri);
    $("btnKoleksiyonSil").addEventListener("click", function () { ic.defterKoleksiyonSilTikla(); });
    $("btnDahaFazlaGecmis").addEventListener("click", function () {
      ic.durum.gosterGecmis += 20;
      ic.ciz_defter();
    });

    /* ayarlar */
    $("btnAyar").addEventListener("click", function () {
      ic.ciz_ayarlar();
      ic.panelAc("ayarPanel");
    });
    $("btnAyarKapat").addEventListener("click", ic.geriGit);
    $("ayarPanel").addEventListener("click", function (e) {
      if (e.target === $("ayarPanel")) ic.geriGit();
    });

    /* açılış tanıtımı */
    $("btnTanitimAtla").addEventListener("click", ic.tanitimKapat);
    $("btnTanitimIleri").addEventListener("click", ic.tanitimIleri);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") ic.geriGit();
      if (!$("pisirmePanel").hidden) {
        if (e.key === "ArrowRight") $("btnAdimIleri").click();
        if (e.key === "ArrowLeft") $("btnAdimGeri").click();
      }
    });
  }

  /* ================================================ SERVICE WORKER */

  function swKur() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "file:") return;   // yerel dosyadan açıldıysa gerek yok

    function guncellemeVar(isci) {
      ic.bildir("Yeni tarifler hazır!", "Güncelle", function () {
        isci.postMessage({ tip: "HEMEN_GEC" });
      });
    }

    navigator.serviceWorker.register("sw.js").then(function (kayit) {
      function izle(isci) {
        if (!isci) return;
        isci.addEventListener("statechange", function () {
          if (isci.state === "installed" && navigator.serviceWorker.controller) {
            guncellemeVar(isci);
          }
        });
      }

      // Yeni sürüm zaten inmiş ve sırada bekliyor olabilir (sayfa açılmadan önce
      // inmişse "updatefound" olayını kaçırırız). Önce onu kontrol et.
      if (kayit.waiting && navigator.serviceWorker.controller) {
        guncellemeVar(kayit.waiting);
      }
      // register() çağrısı sırasında kurulum başlamış olabilir.
      izle(kayit.installing);
      kayit.addEventListener("updatefound", function () { izle(kayit.installing); });

      // Her açılışta bir kez sunucuya sor: yeni sürüm var mı?
      kayit.update().catch(function () {});
    }).catch(function () { /* sessizce geç */ });

    /* Sayfa zaten bir service worker tarafından yönetiliyorduysa, denetimin el
       değiştirmesi "yeni sürüm devraldı" demektir; sayfayı tazelemek gerekir.
       Ama ilk ziyarette denetim ilk kez kuruluyor — orada yenilemek uygulamayı
       gereksiz yere baştan başlatır ve karşılama ekranını atlatır. */
    var oncedenYonetiliyordu = !!navigator.serviceWorker.controller;
    var yenilendi = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!oncedenYonetiliyordu || yenilendi) return;
      yenilendi = true;
      location.reload();
    });
  }

  /* ====================================================== ÇALIŞTIR */

  function calistir() {
    AM.depo.baslat();
    var hatalar = AM.hazirla();

    if (hatalar.bilinmeyenMalzeme.length || hatalar.cakisanId.length) {
      // Geliştirme uyarısı: kullanıcıya gösterilmez, konsola yazılır.
      console.warn("[Alganis Mutfak] veri uyarısı", hatalar);
    }

    var ilkKez = AM.depo.ilkKezMi();
    if (ilkKez) AM.depo.temelleriSec();
    document.documentElement.dataset.yazi = AM.depo.yazi();
    ic.temayiUygula();

    // "Telefona uy" seçiliyken sistem teması değişirse anında yansısın
    if (window.matchMedia) {
      var sorgu = window.matchMedia("(prefers-color-scheme: dark)");
      var dinle = function () { if (AM.depo.tema() === "sistem") ic.temayiUygula(); };
      if (sorgu.addEventListener) sorgu.addEventListener("change", dinle);
      else if (sorgu.addListener) sorgu.addListener(dinle);
    }

    /* kayıtlı filtreyi şeritte işaretle */
    var kayitliFiltre = AM.depo.filtre();
    Array.prototype.forEach.call($("filtreSerit").children, function (x) {
      x.classList.toggle("aktif", x.dataset.filtre === kayitliFiltre);
    });

    olaylariBagla();
    ustYuksekligiOlc();
    window.addEventListener("resize", ustYuksekligiOlc);
    ic.basla_ilkCizim(ilkKez);
    swKur();

    // İlk açılışta doğrudan malzeme ekranına düşmeden önce kısa bir tanıtım.
    if (ilkKez) ic.tanitimAc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", calistir);
  } else {
    calistir();
  }
})();
