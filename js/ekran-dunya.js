/* ============================================================================
   EKRAN: DÜNYA — mutfak ansiklopedisi ve kapsam seçici
   ----------------------------------------------------------------------------
   Karar C (bkz. YOL-HARITASI.md): iki fikir aynı ekranda. Mutfak kartları
   gezmek için (tarif, malzeme, yapılış — kapalı bir tarif kitabı gibi); bir
   mutfak seçilip "Bu mutfak için öner" düğmesine basılınca "Bugün ne
   pişirsem?" motoru da o mutfak için çalışmaya başlıyor (AM.depo.mutfak).

   Türk mutfağı burada kart olarak çıkmaz — varsayılan mutfak, zaten Tarifler
   ekranından erişilebiliyor. Bu ekran yalnızca "dünya" mutfaklarını gezer.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  function dunyaMutfaklari() {
    return (AM.MUTFAKLAR || []).filter(function (m) { return m.id !== AM.MUTFAK_VARSAYILAN; });
  }

  function mutfakBul(id) {
    return dunyaMutfaklari().filter(function (m) { return m.id === id; })[0];
  }

  function tarifleriGetir(mutfakId) {
    return (AM.TARIFLER || []).filter(function (t) { return AM.mutfakBul(t) === mutfakId; });
  }

  function mutfakKarti(m) {
    var sayi = tarifleriGetir(m.id).length;
    var kart = el("button", { type: "button", sinif: "mk", veri: { mutfak: m.id } });
    kart.appendChild(AM.gorsel.kutu({ id: "kapak-mutfak-" + m.id, kat: null, em: m.emoji }, "gk-mk"));
    var govde = el("div", { sinif: "mk-govde" }, [
      el("span", { sinif: "mk-ad", metin: m.ad }),
      el("span", { sinif: "mk-alt", metin: sayi ? sayi + " tarif" : "Yakında" })
    ]);
    kart.appendChild(govde);
    kart.addEventListener("click", function () { mutfakAc(m.id); });
    return kart;
  }

  ic.ciz_dunya = function () {
    var kap = $("dunyaIzgara");
    bosalt(kap);
    dunyaMutfaklari().forEach(function (m) { kap.appendChild(mutfakKarti(m)); });
    $("dunyaDetay").hidden = true;
    $("dunyaGiris").hidden = false;
  };

  function mutfakAc(mutfakId) {
    var m = mutfakBul(mutfakId);
    if (!m) return;
    ic.durum.dunyaMutfak = mutfakId;

    $("dunyaGiris").hidden = true;
    $("dunyaDetay").hidden = false;
    $("dunyaMutfakBaslik").textContent = (m.emoji || "") + " " + m.ad;
    window.scrollTo(0, 0);

    var sepet = AM.depo.sepet();
    var tarifler = tarifleriGetir(mutfakId);
    var kap = $("dunyaTarifIzgara");
    bosalt(kap);
    tarifler.forEach(function (t) {
      kap.appendChild(AM.ui.tarifKarti({ t: t, d: AM.degerlendir(t, sepet) }, "izgara", ic.tarifAc));
    });
    $("dunyaTarifSayac").textContent = String(tarifler.length);
    $("dunyaTarifBos").hidden = tarifler.length > 0;
  }

  ic.dunyaGeri = function () {
    $("dunyaDetay").hidden = true;
    $("dunyaGiris").hidden = false;
    ic.durum.dunyaMutfak = null;
  };

  /** Seçili mutfağı "Bugün ne pişirsem?" kapsamına alıp Bugün ekranına gider. */
  ic.dunyaBuMutfakIcinOner = function () {
    if (!ic.durum.dunyaMutfak) return;
    AM.depo.mutfak(ic.durum.dunyaMutfak);
    ic.git("bugun");
  };
})();
