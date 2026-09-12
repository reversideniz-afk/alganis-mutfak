/* ============================================================================
   EKRAN: DEFTERİM — koleksiyonlar, pişirme geçmişi, haftalık özet
   ----------------------------------------------------------------------------
   js/depo.js Faz 0'dan beri bunları tutuyordu (gecmis/puan/not/koleksiyon);
   bu ekran onları ilk kez görünür kılıyor (Faz 3). Koleksiyon kartına
   tıklanınca açılan detay görünümü, js/ekran-dunya.js'teki giriş/detay
   örüntüsünün birebir aynısı.

   Koleksiyona tarif ekleme/çıkarma burada DEĞİL, tarif panelinde olur
   (js/panel-tarif.js: koleksiyonBolumu) — burası sadece gezinme ve silme.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  /* --- bu hafta ne pişirdim ------------------------------------------------ */

  function buHaftaListesi() {
    var sinir = Date.now() - 7 * 86400000;
    var gorulen = Object.create(null);
    var sonuc = [];
    AM.depo.gecmis().forEach(function (k) {
      if (k.z < sinir || gorulen[k.i]) return;
      gorulen[k.i] = true;
      var t = AM.T[k.i];
      if (t) sonuc.push(t);
    });
    return sonuc;
  }

  function ciz_buHafta() {
    var serit = $("buHaftaSerit");
    var sepet = AM.depo.sepet();
    bosalt(serit);
    var liste = buHaftaListesi();
    liste.forEach(function (t) {
      serit.appendChild(AM.ui.tarifKarti({ t: t, d: AM.degerlendir(t, sepet) }, "serit", ic.tarifAc));
    });
    serit.hidden = liste.length === 0;
    $("buHaftaBos").hidden = liste.length > 0;
  }

  /* --- koleksiyonlar --------------------------------------------------------- */

  function koleksiyonSatiri(k) {
    var btn = el("button", { type: "button", sinif: "koleksiyon-satir" }, [
      el("strong", { metin: k.ad }),
      el("span", { sinif: "grup-adet", metin: String(k.idler.length) })
    ]);
    btn.addEventListener("click", function () { koleksiyonAc(k.ad); });
    return btn;
  }

  function ciz_koleksiyonlar() {
    var kap = $("koleksiyonListesi");
    bosalt(kap);
    var listeler = AM.depo.koleksiyonlar();
    listeler.forEach(function (k) { kap.appendChild(koleksiyonSatiri(k)); });
    $("koleksiyonBos").hidden = listeler.length > 0;
  }

  var silOnay = false;

  function koleksiyonAc(ad) {
    var k = AM.depo.koleksiyonlar().filter(function (x) { return x.ad === ad; })[0];
    if (!k) return;
    ic.durum.defterKoleksiyon = ad;
    silOnay = false;
    $("btnKoleksiyonSil").textContent = "Bu listeyi sil";

    $("defterGiris").hidden = true;
    $("koleksiyonDetay").hidden = false;
    window.scrollTo(0, 0);
    $("koleksiyonDetayBaslik").textContent = k.ad;

    var sepet = AM.depo.sepet();
    var tarifler = k.idler.map(function (id) { return AM.T[id]; }).filter(Boolean);
    var izgara = $("koleksiyonDetayIzgara");
    bosalt(izgara);
    tarifler.forEach(function (t) {
      izgara.appendChild(AM.ui.tarifKarti({ t: t, d: AM.degerlendir(t, sepet) }, "izgara", ic.tarifAc));
    });
    $("koleksiyonDetayBos").hidden = tarifler.length > 0;
  }

  ic.defterKoleksiyonGeri = function () {
    $("koleksiyonDetay").hidden = true;
    $("defterGiris").hidden = false;
    ic.durum.defterKoleksiyon = null;
  };

  /** İki dokunuşlu onay — ayarlar ekranındaki "sıfırla" ile aynı mantık
      (bkz. js/ayarlar.js), burada tek fark düğme her açılışta değil statik
      olduğu için onay bayrağı koleksiyonAc()'ta elle sıfırlanıyor. */
  ic.defterKoleksiyonSilTikla = function () {
    var ad = ic.durum.defterKoleksiyon;
    if (!ad) return;
    if (!silOnay) {
      silOnay = true;
      $("btnKoleksiyonSil").textContent = "Emin misin? Tekrar dokun";
      setTimeout(function () {
        silOnay = false;
        $("btnKoleksiyonSil").textContent = "Bu listeyi sil";
      }, 4000);
      return;
    }
    AM.depo.koleksiyonSil(ad);
    ic.defterKoleksiyonGeri();
    ciz_koleksiyonlar();
    ic.bildir("Liste silindi.");
  };

  /** Yeni koleksiyon oluşturur. Başarılıysa true döner (uygulama.js girdi
      kutusunu temizlemek için kullanıyor). */
  ic.defterYeniKoleksiyon = function (ad) {
    if (AM.depo.koleksiyonEkle(ad)) {
      ciz_koleksiyonlar();
      return true;
    }
    ic.bildir("Bu isimde bir liste zaten var ya da liste sayısı doldu.");
    return false;
  };

  /* --- geçmiş ----------------------------------------------------------------- */

  function ciz_gecmis() {
    var kap = $("gecmisListesi");
    var sepet = AM.depo.sepet();
    /* Katalogdan çıkarılmış bir tarifin id'si geçmişte kalmış olabilir (bkz.
       js/depo.js — bilinmeyen id'ler bilerek silinmiyor); sayaç ve sayfalama
       sadece hâlâ var olan tariflere göre hesaplanıyor. */
    var gecerliler = AM.depo.gecmis().filter(function (k) { return !!AM.T[k.i]; });
    bosalt(kap);
    gecerliler.slice(0, ic.durum.gosterGecmis).forEach(function (k) {
      var t = AM.T[k.i];
      var satir = el("div", { sinif: "gecmis-satir" }, [
        el("span", { sinif: "gecmis-tarih", metin: AM.ui.goreliTarih(k.z) })
      ]);
      satir.appendChild(AM.ui.tarifKarti({ t: t, d: AM.degerlendir(t, sepet) }, "liste", ic.tarifAc));
      kap.appendChild(satir);
    });
    $("sayacGecmis").textContent = String(gecerliler.length);
    $("gecmisBos").hidden = gecerliler.length > 0;
    $("btnDahaFazlaGecmis").hidden = gecerliler.length <= ic.durum.gosterGecmis;
  }

  /* --- giriş noktası ------------------------------------------------------------ */

  ic.ciz_defter = function () {
    $("koleksiyonDetay").hidden = true;
    $("defterGiris").hidden = false;
    ciz_buHafta();
    ciz_koleksiyonlar();
    ciz_gecmis();
  };
})();
