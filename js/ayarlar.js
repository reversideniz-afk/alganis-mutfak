/* ============================================================================
   AYARLAR — tema, renk paleti, yazı boyutu, ölçü cetveli, sıfırlama
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  /* ============================================== RENK PALETLERİ VE TEMA */

  /* css/style.css içindeki [data-palet] blokları ve js/depo.js içindeki
     GECERLI_PALETLER listesiyle aynı sırada tutulmalı. Buradaki renkler
     sadece ayar ekranındaki küçük önizleme şeridi içindir. */
  var PALETLER = [
    { id: "domates",  ad: "Domates",   renkler: ["#CB431A", "#F5843C", "#F7BE4B"] },
    { id: "zeytin",   ad: "Zeytin",    renkler: ["#4A7A2B", "#7BA83F", "#C3D46A"] },
    { id: "patlican", ad: "Patlıcan",  renkler: ["#6B3A78", "#8E5A9C", "#C98BB8"] },
    { id: "deniz",    ad: "Deniz",     renkler: ["#1F5F84", "#3B87A8", "#6FBFCB"] },
    { id: "gul",      ad: "Gül kurusu",renkler: ["#A83E5C", "#D06A82", "#E9A3A8"] },
    { id: "bal",      ad: "Bal köpüğü",renkler: ["#9A6212", "#C98A2A", "#F0C264"] },
    { id: "kontrast", ad: "Yüksek kontrast", renkler: ["#000000", "#2E2E2E", "#FFFFFF"] }
  ];

  /** Seçili tema ve paleti <html> üzerine yazar, tarayıcı çubuğu rengini eşitler. */
  ic.temayiUygula = function () {
    var tema = AM.depo.tema();
    var palet = AM.depo.palet();
    document.documentElement.dataset.tema = tema;
    document.documentElement.dataset.palet = palet;

    var koyuMu = tema === "gece" ||
      (tema === "sistem" && window.matchMedia &&
       window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Yüksek kontrast paleti her zaman beyaz zeminlidir, temadan bağımsız.
    if (palet === "kontrast") koyuMu = false;

    var secili = PALETLER.filter(function (p) { return p.id === palet; })[0] || PALETLER[0];
    var etiket = document.querySelector('meta[name="theme-color"]');
    if (etiket) etiket.setAttribute("content", koyuMu ? "#1B1714" : secili.renkler[0]);
  };

  /* ========================================================= ÖLÇÜ CETVELİ */

  /* Tariflerde kullanılan kap ölçülerinin karşılıkları.
     Buradaki kabuller data/besin.js'teki AM.GRAM_GENEL ile AYNI olmalı;
     ikisi ayrışırsa kullanıcı cetvelde bir şey, besin hesabında başka bir
     şey görür. */
  var OLCU_HACIM = [
    ["1 su bardağı", "200 ml"],
    ["1 çay bardağı", "~100 ml"],
    ["1 kahve fincanı", "~80 ml"],
    ["1 yemek kaşığı", "15 ml"],
    ["1 tatlı kaşığı", "10 ml"],
    ["1 çay kaşığı", "5 ml"]
  ];
  var OLCU_AGIRLIK = [
    ["1 su bardağı un", "~120 g"],
    ["1 su bardağı toz şeker", "~180 g"],
    ["1 su bardağı pirinç", "~180 g"],
    ["1 su bardağı bulgur", "~170 g"],
    ["1 su bardağı irmik", "~160 g"],
    ["1 su bardağı mercimek", "~190 g"],
    ["1 su bardağı su / süt", "200 g"],
    ["1 su bardağı sıvı yağ", "~180 g"],
    ["1 su bardağı yoğurt", "~220 g"],
    ["1 yemek kaşığı un", "~10 g"],
    ["1 yemek kaşığı tereyağı", "~15 g"]
  ];
  var OLCU_PAKET = [
    ["1 paket kabartma tozu", "10 g"],
    ["1 paket vanilya", "5 g"],
    ["1 paket kuru maya", "10 g"],
    ["1 paket yaş maya", "42 g"],
    ["1 paket tereyağı", "250 g"]
  ];

  function olcuTablosu(baslik, satirlar) {
    var tablo = el("table", { sinif: "olcu-tablo" });
    tablo.appendChild(el("caption", { metin: baslik }));
    var govde = el("tbody");
    satirlar.forEach(function (s) {
      govde.appendChild(el("tr", null, [
        el("th", { scope: "row", metin: s[0] }),
        el("td", { metin: s[1] })
      ]));
    });
    tablo.appendChild(govde);
    return tablo;
  }

  function olcuCetveli() {
    var kap = document.createDocumentFragment();
    kap.appendChild(olcuTablosu("Hacim", OLCU_HACIM));
    kap.appendChild(olcuTablosu("Ağırlık karşılıkları", OLCU_AGIRLIK));
    kap.appendChild(olcuTablosu("Paket ölçüleri", OLCU_PAKET));
    kap.appendChild(el("p", { sinif: "ayar-not", metin:
      "Ağırlıklar yaklaşıktır — un ve şeker gibi malzemeler bardağa nasıl " +
      "doldurulduğuna göre değişir. Hassas ölçü gereken tatlılarda mutfak " +
      "terazisi kullanmak en doğrusu. Bardak ölçüsü 200 ml'lik standart su " +
      "bardağına göredir." }));
    return kap;
  }

  /* ========================================================= AYAR PANELİ */

  ic.ciz_ayarlar = function () {
    var govde = $("ayarGovde");
    bosalt(govde);

    /* tema */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Görünüm" }));
    var temalar = [["gunisigi", "☀️ Gün ışığı"], ["gece", "🌙 Gece"], ["sistem", "📱 Telefona uy"]];
    var temaSerit = el("div", { sinif: "filtre-serit" });
    temalar.forEach(function (t) {
      var btn = el("button", {
        type: "button",
        sinif: "filtre-cip" + (AM.depo.tema() === t[0] ? " aktif" : ""),
        metin: t[1]
      });
      btn.addEventListener("click", function () {
        AM.depo.tema(t[0]);
        ic.temayiUygula();
        ic.ciz_ayarlar();
      });
      temaSerit.appendChild(btn);
    });
    govde.appendChild(temaSerit);

    /* renk paleti */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Renk paleti" }));
    var paletIzgara = el("div", { sinif: "palet-izgara" });
    PALETLER.forEach(function (p) {
      var ornek = el("span", { sinif: "palet-ornek", "aria-hidden": "true" });
      p.renkler.forEach(function (renk) {
        /* stil CSSOM ile atanıyor: CSP satır içi style özniteliğini engelliyor */
        ornek.appendChild(el("i", { stil: { background: renk } }));
      });
      var btn = el("button", {
        type: "button", sinif: "palet-btn",
        "aria-pressed": AM.depo.palet() === p.id ? "true" : "false"
      }, [ornek, p.ad]);
      btn.addEventListener("click", function () {
        AM.depo.palet(p.id);
        ic.temayiUygula();
        ic.ciz_ayarlar();
      });
      paletIzgara.appendChild(btn);
    });
    govde.appendChild(paletIzgara);

    /* yazı boyutu */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Yazı boyutu" }));
    var boyutlar = [["n", "Normal"], ["b", "Büyük"], ["cb", "Çok büyük"]];
    var boyutSerit = el("div", { sinif: "filtre-serit" });
    boyutlar.forEach(function (b) {
      var btn = el("button", {
        type: "button",
        sinif: "filtre-cip" + (AM.depo.yazi() === b[0] ? " aktif" : ""),
        metin: b[1]
      });
      btn.addEventListener("click", function () {
        AM.depo.yazi(b[0]);
        document.documentElement.dataset.yazi = b[0];
        ic.ciz_ayarlar();
      });
      boyutSerit.appendChild(btn);
    });
    govde.appendChild(boyutSerit);

    /* tolerans */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Öneri davranışı" }));
    var anahtar = el("button", {
      type: "button", sinif: "anahtar",
      "aria-pressed": AM.depo.tolerans() ? "true" : "false",
      "aria-label": "Ufak eksiklere göz yum"
    });
    anahtar.addEventListener("click", function () {
      AM.depo.tolerans(!AM.depo.tolerans());
      ic.ciz_ayarlar();
      ic.ciz_bugun();
    });
    govde.appendChild(el("div", { sinif: "ayar-satir" }, [
      el("div", { sinif: "as-yazi" }, [
        el("strong", { metin: "Ufak eksiklere göz yum" }),
        el("small", { metin: "Sadece maydanoz, havuç gibi tali malzemesi eksik yemekler de önerilsin." })
      ]),
      anahtar
    ]));

    /* sürüm & güncelleme */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Uygulama" }));
    govde.appendChild(el("div", { sinif: "ayar-satir" }, [
      el("div", { sinif: "as-yazi" }, [
        el("strong", { metin: "Sürüm " + AM.SURUM }),
        el("small", { metin: AM.TARIFLER.length + " tarif · " + AM.MALZEMELER.length + " malzeme" })
      ])
    ]));

    var gncBtn = el("button", { type: "button", sinif: "btn hayalet tam", metin: "Güncelleme var mı, bak" });
    gncBtn.addEventListener("click", function () {
      if (!navigator.serviceWorker) { ic.bildir("Bu tarayıcıda güncelleme denetimi yok."); return; }
      navigator.serviceWorker.getRegistration().then(function (r) {
        if (!r) { ic.bildir("Çevrimdışı kurulum bulunamadı."); return; }
        r.update().then(function () { ic.bildir("Denetlendi. Yenisi varsa haber vereceğim."); });
      }).catch(function () { ic.bildir("Şu an denetlenemedi."); });
    });
    govde.appendChild(gncBtn);

    /* ölçü cetveli */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Ölçü cetveli" }));
    govde.appendChild(olcuCetveli());

    /* sıfırlama */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Verilerim" }));
    var silBtn = el("button", { type: "button", sinif: "btn hayalet tehlike tam", metin: "Seçimlerimi ve favorilerimi sil" });
    var onayda = false;
    silBtn.addEventListener("click", function () {
      /* İki dokunuşlu onay: yanlışlıkla her şeyi silmek kolay olmasın. */
      if (!onayda) {
        onayda = true;
        silBtn.textContent = "Emin misin? Silmek için tekrar dokun";
        setTimeout(function () { onayda = false; silBtn.textContent = "Seçimlerimi ve favorilerimi sil"; }, 4000);
        return;
      }
      AM.depo.sifirla();
      AM.depo.baslat();
      AM.depo.temelleriSec();
      ic.panelKapat("ayarPanel");
      ic.basla_ilkCizim(true);
      ic.bildir("Sıfırlandı.");
    });
    govde.appendChild(silBtn);

    govde.appendChild(el("p", { sinif: "ayar-not", metin:
      "Bu uygulama tamamen telefonunuzda çalışır. İnternet bağlantısı kullanmaz, " +
      "hiçbir veri hiçbir yere gönderilmez, hesap veya izin istemez. İşaretlediğiniz " +
      "malzemeler ve favorileriniz yalnızca bu cihazda saklanır." }));
  };
})();
