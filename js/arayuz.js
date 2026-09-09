/* ============================================================================
   ARAYÜZ YARDIMCILARI
   Not: Hiçbir yerde innerHTML kullanılmaz — her düğüm tek tek oluşturulur.
   Böylece metin her zaman metin olarak kalır, hiçbir girdi kod olarak
   yorumlanamaz.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};
  var ui = AM.ui = {};

  /* --- küçük DOM yardımcısı ---------------------------------------------- */
  function el(etiket, ozellik, cocuklar) {
    var d = document.createElement(etiket);
    if (ozellik) {
      Object.keys(ozellik).forEach(function (k) {
        var v = ozellik[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "sinif") d.className = v;
        else if (k === "metin") d.textContent = v;
        else if (k === "veri") Object.keys(v).forEach(function (dk) { d.dataset[dk] = v[dk]; });
        /* Stil CSSOM ile atanıyor, style ÖZNİTELİĞİ ile değil.
           index.html'deki CSP style-src 'self' satır içi stil özniteliğini
           engelliyor: setAttribute("style", ...) sessizce iptal ediliyor ve
           öğe renksiz kalıyordu. CSSOM ataması CSP kapsamı dışında. */
        else if (k === "stil") Object.keys(v).forEach(function (sk) { d.style[sk] = v[sk]; });
        else d.setAttribute(k, v === true ? "" : v);
      });
    }
    if (cocuklar) {
      (Array.isArray(cocuklar) ? cocuklar : [cocuklar]).forEach(function (c) {
        if (c === null || c === undefined || c === false) return;
        d.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return d;
  }
  ui.el = el;

  function bosalt(kap) { while (kap.firstChild) kap.removeChild(kap.firstChild); }
  ui.bosalt = bosalt;

  /* --- ölçü biçimlendirme ------------------------------------------------- */

  var KESIRLER = [
    [0, ""], [0.125, "⅛"], [0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"],
    [2 / 3, "⅔"], [0.75, "¾"], [1, ""]
  ];

  function sayiYaz(v) {
    if (!isFinite(v) || v <= 0) return "";
    var tam = Math.floor(v + 1e-6);
    var kalan = v - tam;
    var enIyi = null, enIyiFark = 99;
    for (var i = 0; i < KESIRLER.length; i++) {
      var f = Math.abs(kalan - KESIRLER[i][0]);
      if (f < enIyiFark) { enIyiFark = f; enIyi = KESIRLER[i]; }
    }
    if (enIyiFark <= 0.07) {
      if (enIyi[0] === 1) { tam += 1; enIyi = KESIRLER[0]; }
      var parca = enIyi[1];
      if (tam > 0 && parca) return tam + " " + parca;
      if (tam > 0) return String(tam);
      if (parca) return parca;
      return "";
    }
    return String(Math.round(v * 10) / 10).replace(".", ",");
  }

  var YUVARLANIR = ["adet", "diş", "demet", "dilim", "yaprak", "dal", "baş", "kaşık"];

  /**
   * [malzemeIdler, miktar, birim, rol, not] satırını okunur metne çevirir.
   * carpan = seçilen porsiyon / tarifin temel porsiyonu
   */
  ui.olcu = function (satir, carpan) {
    var miktar = satir[1];
    var birim = satir[2] || "";
    var metin;

    if (miktar === null || miktar === undefined) {
      metin = birim;                       // "göz kararı", "servis için" …
    } else {
      var v = miktar * (carpan || 1);
      var yuvarla = YUVARLANIR.some(function (b) { return birim.indexOf(b) !== -1; });
      if (yuvarla && v >= 1) v = Math.round(v * 2) / 2;
      var s = sayiYaz(v);
      metin = s ? (s + " " + birim).trim() : birim;
    }
    return metin;
  };

  ui.malzemeAdi = function (satir) {
    var idler = satir[0].split("|");
    var adlar = idler.map(function (id) {
      return (AM.M[id] && AM.M[id].ad) ? AM.M[id].ad.toLocaleLowerCase("tr-TR") : id;
    });
    var ad = adlar[0];
    if (adlar.length > 1) ad += " (veya " + adlar.slice(1).join(", ") + ")";
    return ad;
  };

  /* --- rozetler ----------------------------------------------------------- */

  var ZORLUK = { 1: "Kolay", 2: "Orta", 3: "Ustalık ister" };

  ui.sureYaz = function (dk) {
    if (dk < 60) return dk + " dk";
    var s = Math.floor(dk / 60), k = dk % 60;
    return k ? s + " sa " + k + " dk" : s + " saat";
  };

  function rozet(metin, sinif) {
    return el("span", { sinif: "rozet-mini" + (sinif ? " " + sinif : ""), metin: metin });
  }
  ui.rozet = rozet;

  /* --- eksik malzeme özeti ------------------------------------------------ */

  function eksikMetni(satirlar) {
    return satirlar.map(function (s) { return ui.malzemeAdi(s); }).join(", ");
  }
  ui.eksikMetni = eksikMetni;

  /* --- mutfak + kategori metni ----------------------------------------------
     Mutfak sadece Türk dışıysa yazılır — 869 Türk tarifte sürekli "Türk"
     görmek gürültü olurdu. Kahraman kart özetinde ve tarif panelinin
     altbaşlığında (ui.detay) ortak kullanılıyor. */
  function mutfakKategoriMetni(t) {
    var mutfakId = AM.mutfakBul(t);
    var katAdi = AM.TARIF_KATEGORILERI_AD[t.kat] || "";
    if (mutfakId === AM.MUTFAK_VARSAYILAN) return katAdi;
    return (AM.MUTFAKLAR_EMOJI[mutfakId] || "") + " " + (AM.MUTFAKLAR_AD[mutfakId] || "") + " · " + katAdi;
  }
  ui.mutfakKategoriMetni = mutfakKategoriMetni;

  /* --- saate göre selamlama ------------------------------------------------ */

  ui.selamlama = function () {
    var saat = new Date().getHours();
    var giris =
      saat < 5  ? "İyi geceler!" :
      saat < 11 ? "Günaydın!" :
      saat < 17 ? "Tünaydın!" :
      saat < 22 ? "İyi akşamlar!" : "İyi geceler!";
    return giris + " Bugün ne pişirsem?";
  };

  /* --- tarif kartı: dört varyant, tek üreteç -------------------------------
     varyant: "kahraman" | "izgara" | "liste" | "serit" (öntanımlı "izgara").
     "kahraman" tıklanabilir değildir — Bugün ekranında ayrı "Tarifi aç"
     düğmesiyle açılır, o yüzden tikla parametresi yoksayılır. */

  /** kayit: {t: tarif, d: degerlendirme} — d verilmezse eksik bilgisi çizilmez */
  ui.tarifKarti = function (kayit, varyant, tikla) {
    var t = kayit.t || kayit;
    var d = kayit.d;
    varyant = varyant || "izgara";
    var kahramanMi = varyant === "kahraman";

    var kart = kahramanMi
      ? el("div", { sinif: "tk tk-kahraman" })
      : el("button", { type: "button", sinif: "tk tk-" + varyant, veri: { id: t.id } });

    kart.appendChild(AM.gorsel.kutu(t, "gk-" + varyant));

    /* Mutfak rozeti — sadece Türk dışı tariflerde, kahramanda değil (orada
       zaten alt metinde mutfak adı geçiyor, rozet tekrar olurdu). */
    var mutfakId = AM.mutfakBul(t);
    if (!kahramanMi && mutfakId !== AM.MUTFAK_VARSAYILAN) {
      kart.appendChild(el("span", {
        sinif: "tk-mutfak", metin: AM.MUTFAKLAR_EMOJI[mutfakId] || "🌍", "aria-hidden": "true"
      }));
    }

    if (AM.depo.favMi(t.id)) {
      kart.appendChild(el("span", { sinif: "tk-kalp", metin: "💛", "aria-hidden": "true" }));
    }

    var govde = el("div", { sinif: "tk-govde" });

    if (kahramanMi) {
      govde.appendChild(el("span", { sinif: "tk-etiket", metin: ui.selamlama() }));
      govde.appendChild(el("h2", { metin: t.ad }));
      govde.appendChild(el("p", { sinif: "tk-ozet", metin: mutfakKategoriMetni(t) + " · " + t.por + " kişilik" }));

      var pilSatir = el("div", { sinif: "rozet-satir" });
      pilSatir.appendChild(rozet("⏱ " + ui.sureYaz(t.sure)));
      pilSatir.appendChild(rozet("👩‍🍳 " + ZORLUK[t.zor]));
      if (t.etsiz) pilSatir.appendChild(rozet("🌱 Etsiz"));
      if (d && d.eksikYrd.length) {
        pilSatir.appendChild(rozet(eksikMetni(d.eksikYrd) + " olmasa da olur", "eksik"));
      } else if (d) {
        pilSatir.appendChild(rozet("✓ Her şey evde var", "iyi"));
      }
      govde.appendChild(pilSatir);
    } else {
      govde.appendChild(el("span", { sinif: "tk-ad", metin: t.ad }));
      govde.appendChild(el("span", {
        sinif: "tk-alt",
        metin: ui.sureYaz(t.sure) + " · " + ZORLUK[t.zor]
      }));

      if (d && d.durum === "neredeyse") {
        // Ana malzemelerin hepsi var, sadece tali olanlar eksik.
        govde.appendChild(el("span", {
          sinif: "tk-eksik",
          metin: eksikMetni(d.eksikYrd) + " olmadan da olur"
        }));
      } else if (d && d.durum === "yakin") {
        govde.appendChild(el("span", {
          sinif: "tk-eksik",
          metin: "+ " + eksikMetni(d.eksikAna.concat(d.eksikYrd))
        }));
      } else if (d && d.durum === "uzak") {
        govde.appendChild(el("span", {
          sinif: "tk-eksik",
          metin: d.eksikSayi + " malzeme eksik"
        }));
      }
    }

    kart.appendChild(govde);
    if (tikla) kart.addEventListener("click", function () { tikla(t.id); });
    return kart;
  };

  /* --- besin rozetleri -------------------------------------------------------
     Not: ilerleme halkası (yüzde/hedef) DEĞİL — bu uygulamada hiçbir yerde
     hedef/limit/uyarı yok (bkz. Karar D). Dört rozet de nötr, aynı yüzey
     rengiyle; sadece emoji + etiketle ayrışıyor, renkle "iyi/kötü" demiyor. */
  var BESIN_ALANLAR = [
    ["kcal", "🔥", "kcal"],
    ["karb", "🌾", "g karb"],
    ["prot", "🥩", "g prot"],
    ["yag",  "🫒", "g yağ"]
  ];

  function besinSatiri(besin) {
    var satir = el("div", { sinif: "besin-satir" });
    BESIN_ALANLAR.forEach(function (b) {
      satir.appendChild(el("div", { sinif: "besin-halka" }, [
        el("strong", { veri: { besin: b[0] }, metin: String(besin[b[0]]) }),
        el("small", { metin: b[2] })
      ]));
    });
    return satir;
  }

  /* --- tarif detayı --------------------------------------------------------- */

  ui.detay = function (t, sepet, porsiyon, porsiyonDegisti) {
    var parca = document.createDocumentFragment();
    var carpan = porsiyon / t.por;

    parca.appendChild(AM.gorsel.kutu(t, "gk-panel"));

    parca.appendChild(el("h2", { sinif: "td-baslik", metin: t.ad }));

    /* Mutfak + kategori düz metin altbaşlıkta (mutfakKategoriMetni).
       Süre/zorluk (ve varsa etsiz/fırın) aşağıda rozet olarak kalıyor —
       altı rozetten dörde indi, referans tasarımdaki iki-üç rozetlik
       sadelikle uyumlu (bkz. tasarim/REFERANSLAR.md madde 19). */
    parca.appendChild(el("p", { sinif: "td-alt-baslik", metin: mutfakKategoriMetni(t) }));

    /* Yalnızca dünya mutfağı tariflerinde var — Türk tariflerinde t.ozet yok. */
    if (t.ozet) parca.appendChild(el("p", { sinif: "td-ozet", metin: t.ozet }));

    var rozetler = el("div", { sinif: "rozet-satir" });
    rozetler.appendChild(rozet("⏱ " + ui.sureYaz(t.sure)));
    rozetler.appendChild(rozet("👩‍🍳 " + ZORLUK[t.zor]));
    if (t.etsiz) rozetler.appendChild(rozet("🌱 Etsiz"));
    if (!t.firinsiz) rozetler.appendChild(rozet("🔥 Fırın gerekir"));
    parca.appendChild(rozetler);

    var besinSonuc = AM.besin.hesapla(t, porsiyon);
    if (AM.depo.besinGoster() && AM.besin.gosterilsinMi(besinSonuc)) {
      parca.appendChild(besinSatiri(besinSonuc));
    }

    /* sekmeler: Malzemeler / Yapılışı */
    var sekmeler = el("div", { sinif: "td-sekmeler", role: "tablist" });
    var panoMalzeme = el("div", { sinif: "td-pano" });
    var panoYapilis = el("div", { sinif: "td-pano", hidden: true });

    function sekmeSec(btnMalzeme, btnYapilis, malzemeMi) {
      panoMalzeme.hidden = !malzemeMi;
      panoYapilis.hidden = malzemeMi;
      btnMalzeme.classList.toggle("aktif", malzemeMi);
      btnMalzeme.setAttribute("aria-selected", malzemeMi ? "true" : "false");
      btnYapilis.classList.toggle("aktif", !malzemeMi);
      btnYapilis.setAttribute("aria-selected", !malzemeMi ? "true" : "false");
    }

    var btnSekmeMalzeme = el("button", {
      type: "button", sinif: "td-sekme aktif", role: "tab", "aria-selected": "true", metin: "Malzemeler"
    });
    var btnSekmeYapilis = el("button", {
      type: "button", sinif: "td-sekme", role: "tab", "aria-selected": "false", metin: "Yapılışı"
    });
    btnSekmeMalzeme.addEventListener("click", function () { sekmeSec(btnSekmeMalzeme, btnSekmeYapilis, true); });
    btnSekmeYapilis.addEventListener("click", function () { sekmeSec(btnSekmeMalzeme, btnSekmeYapilis, false); });
    sekmeler.appendChild(btnSekmeMalzeme);
    sekmeler.appendChild(btnSekmeYapilis);
    parca.appendChild(sekmeler);

    /* porsiyon çarpanı — değişince panel baştan çizilmez, sadece miktarlar
       güncellenir (bkz. ui.porsiyonYenile). Böylece sayfa yukarı kaymaz. */
    var eksiBtn = el("button", { type: "button", sinif: "porsiyon-btn", "aria-label": "Porsiyonu azalt", metin: "−" });
    var artiBtn = el("button", { type: "button", sinif: "porsiyon-btn", "aria-label": "Porsiyonu artır", metin: "+" });
    var sayiEl = el("strong", {
      sinif: "porsiyon-sayi", metin: String(porsiyon),
      "aria-live": "polite", veri: { rol: "porsiyonSayi" }
    });
    eksiBtn.addEventListener("click", function () {
      porsiyonDegisti(Math.max(1, Number(sayiEl.textContent) - 1));
    });
    artiBtn.addEventListener("click", function () {
      porsiyonDegisti(Math.min(24, Number(sayiEl.textContent) + 1));
    });
    panoMalzeme.appendChild(el("div", { sinif: "porsiyon-kutu" }, [
      el("span", { metin: "Kişi sayısı" }), eksiBtn, sayiEl, artiBtn
    ]));

    t.m.forEach(function (satir, ix) {
      var rol = satir[3] || "ana";
      var idler = satir[0].split("|");
      var elde = idler.some(function (id) { return sepet.has(id); });

      var sinif = "malzeme-satir";
      if (!elde && rol !== "ops") sinif += " yok";
      if (rol === "ops") sinif += " ops";

      var icerik = [
        el("span", { sinif: "ms-mik", veri: { mi: String(ix) }, metin: ui.olcu(satir, carpan) }),
        el("span", { sinif: "ms-ad", metin: ui.malzemeAdi(satir) })
      ];
      if (satir[4]) icerik.push(el("span", { sinif: "ms-not", metin: satir[4] }));
      else if (rol === "ops") icerik.push(el("span", { sinif: "ms-not", metin: "isteğe bağlı" }));

      panoMalzeme.appendChild(el("div", { sinif: sinif }, icerik));
    });
    parca.appendChild(panoMalzeme);

    var liste = el("div", { sinif: "adim-liste" });
    t.y.forEach(function (adim) {
      liste.appendChild(el("div", { sinif: "adim" }, [el("span", { metin: adim })]));
    });
    panoYapilis.appendChild(liste);

    if (t.ip) {
      panoYapilis.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Püf noktası" }));
      panoYapilis.appendChild(el("div", { sinif: "ipucu-kart" }, [
        el("span", { "aria-hidden": "true", metin: "💡" }),
        el("span", null, [el("b", { metin: "" }), t.ip])
      ]));
    }
    parca.appendChild(panoYapilis);

    return parca;
  };

  /**
   * Porsiyon değiştiğinde sadece miktar ve besin yazılarını tazeler.
   * Paneli baştan çizmediğimiz için kullanıcının kaydırma konumu bozulmaz.
   */
  ui.porsiyonYenile = function (kap, t, porsiyon) {
    var carpan = porsiyon / t.por;
    var sayi = kap.querySelector('[data-rol="porsiyonSayi"]');
    if (sayi) sayi.textContent = String(porsiyon);
    Array.prototype.forEach.call(kap.querySelectorAll(".ms-mik[data-mi]"), function (e) {
      var satir = t.m[Number(e.dataset.mi)];
      if (satir) e.textContent = ui.olcu(satir, carpan);
    });
    if (AM.depo.besinGoster()) {
      var besin = AM.besin.hesapla(t, porsiyon);
      Array.prototype.forEach.call(kap.querySelectorAll("[data-besin]"), function (e) {
        if (besin[e.dataset.besin] !== undefined) e.textContent = String(besin[e.dataset.besin]);
      });
    }
  };

  /* --- pişirme modu adımı ---------------------------------------------------- */

  ui.pisirmeAdimi = function (t, indeks, carpan) {
    var parca = document.createDocumentFragment();
    parca.appendChild(el("div", { sinif: "pm-no", metin: (indeks + 1) + ". adım" }));
    parca.appendChild(el("div", { sinif: "pm-metin", metin: t.y[indeks] }));

    if (indeks === 0) {
      var kutu = el("div", { sinif: "pm-malzeme" });
      kutu.appendChild(el("h4", { metin: "Elinin altında bulunsun" }));
      var ul = el("ul");
      t.m.forEach(function (satir) {
        var m = ui.olcu(satir, carpan);
        ul.appendChild(el("li", { metin: (m ? m + " " : "") + ui.malzemeAdi(satir) }));
      });
      kutu.appendChild(ul);
      parca.appendChild(kutu);
    }
    return parca;
  };
})();
