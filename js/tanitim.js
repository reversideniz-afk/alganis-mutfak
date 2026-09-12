/* ============================================================================
   AÇILIŞ TANITIMI
   ----------------------------------------------------------------------------
   Faz 4: ilk açılışta doğrudan malzeme ekranına düşmek yerine üç adımlık,
   atlanabilir bir tanıtım gösterilir.

   Ayrı bir "tanıtım görüldü mü" bayrağı YOK — ilkKezMi() sinyali yeterli:
   js/uygulama.js içindeki calistir() ilkKez'i true bulduğunda zaten hemen
   temelleriSec() çağırıp sepeti dolduruyor, bu yüzden bir sonraki açılışta
   ilkKezMi() kendiliğinden false döner ve tanıtım bir daha çıkmaz. Kullanıcı
   Ayarlar → Sıfırla ile her şeyi silerse tanıtımın yeniden çıkması bilinçli
   bir davranış (sıfırlama = baştan başlama).
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = AM.ui.el, bosalt = ic.bosalt, $ = ic.$;

  var ADIMLAR = [
    { emoji: "🍲", baslik: "Bugün ne pişirsem?",
      metin: "Evdeki malzemeleri işaretle; o an elindekilerle yapabileceğin tarifleri sana gösterelim." },
    { emoji: "🌍", baslik: "Dünya mutfakları da burada",
      metin: "İtalyan'dan Hint'e, Balkan'dan Meksika'ya — sekiz ayrı mutfaktan tarifler seni bekliyor." },
    { emoji: "🔒", baslik: "Her şey telefonunda kalır",
      metin: "Hesap açmaya, internete bağlanmaya gerek yok. Seçtiklerin ve notların yalnızca bu cihazda saklanır." }
  ];

  var adim = 0;

  function ciz() {
    var a = ADIMLAR[adim];

    var govde = $("tanitimGovde");
    bosalt(govde);
    govde.appendChild(el("div", { sinif: "tanitim-emoji", "aria-hidden": "true", metin: a.emoji }));
    govde.appendChild(el("h2", { sinif: "tanitim-baslik", metin: a.baslik }));
    govde.appendChild(el("p", { sinif: "tanitim-metin", metin: a.metin }));

    var nokta = $("tanitimNokta");
    bosalt(nokta);
    ADIMLAR.forEach(function (_, ix) {
      nokta.appendChild(el("span", { sinif: "tanitim-nokta-tek" + (ix === adim ? " aktif" : "") }));
    });

    $("btnTanitimIleri").textContent = (adim === ADIMLAR.length - 1) ? "Başla" : "İleri";
  }

  ic.tanitimAc = function () {
    adim = 0;
    ciz();
    ic.panelAc("tanitimPanel");
  };

  ic.tanitimKapat = function () {
    ic.panelKapat("tanitimPanel");
  };

  ic.tanitimIleri = function () {
    if (adim < ADIMLAR.length - 1) { adim++; ciz(); } else { ic.tanitimKapat(); }
  };
})();
