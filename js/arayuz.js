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

  /* --- tarif kartı --------------------------------------------------------- */

  /** kayit: {t: tarif, d: degerlendirme} — d verilmezse eksik bilgisi çizilmez */
  ui.tarifKart = function (kayit, secildi) {
    var t = kayit.t || kayit;
    var d = kayit.d;

    var kart = el("button", {
      type: "button", sinif: "tarif-kart", veri: { id: t.id }
    });

    if (AM.depo.favMi(t.id)) {
      kart.appendChild(el("span", { sinif: "tk-kalp", metin: "💛", "aria-hidden": "true" }));
    }
    kart.appendChild(el("span", { sinif: "tk-emoji", "aria-hidden": "true", metin: t.em || "🍽" }));
    kart.appendChild(el("span", { sinif: "tk-ad", metin: t.ad }));
    kart.appendChild(el("span", {
      sinif: "tk-alt",
      metin: ui.sureYaz(t.sure) + " · " + ZORLUK[t.zor]
    }));

    if (d && d.durum === "neredeyse") {
      // Ana malzemelerin hepsi var, sadece tali olanlar eksik.
      kart.appendChild(el("span", {
        sinif: "tk-eksik",
        metin: eksikMetni(d.eksikYrd) + " olmadan da olur"
      }));
    } else if (d && d.durum === "yakin") {
      kart.appendChild(el("span", {
        sinif: "tk-eksik",
        metin: "+ " + eksikMetni(d.eksikAna.concat(d.eksikYrd))
      }));
    } else if (d && d.durum === "uzak") {
      kart.appendChild(el("span", {
        sinif: "tk-eksik",
        metin: d.eksikSayi + " malzeme eksik"
      }));
    }

    if (secildi) kart.addEventListener("click", function () { secildi(t.id); });
    return kart;
  };

  /* --- kahraman (bugünün önerisi) kartı ------------------------------------ */

  ui.heroKart = function (kayit) {
    var t = kayit.t, d = kayit.d;
    var kutu = el("div", { sinif: "hero" });

    kutu.appendChild(el("span", { sinif: "hero-emoji", "aria-hidden": "true", metin: t.em || "🍽" }));
    kutu.appendChild(el("span", { sinif: "hero-etiket", metin: "Bugün ne pişirsem?" }));
    kutu.appendChild(el("h2", { metin: t.ad }));

    var ozet = AM.TARIF_KATEGORILERI_AD[t.kat] || "";
    kutu.appendChild(el("p", { sinif: "hero-ozet", metin: ozet + " · " + t.por + " kişilik" }));

    var satir = el("div", { sinif: "rozet-satir" });
    satir.appendChild(rozet("⏱ " + ui.sureYaz(t.sure)));
    satir.appendChild(rozet("👩‍🍳 " + ZORLUK[t.zor]));
    if (t.etsiz) satir.appendChild(rozet("🌱 Etsiz"));

    if (d.eksikYrd.length) {
      satir.appendChild(rozet(eksikMetni(d.eksikYrd) + " olmasa da olur", "eksik"));
    } else {
      satir.appendChild(rozet("✓ Her şey evde var", "iyi"));
    }
    kutu.appendChild(satir);
    return kutu;
  };

  /* --- tarif detayı --------------------------------------------------------- */

  ui.detay = function (t, sepet, porsiyon, porsiyonDegisti) {
    var parca = document.createDocumentFragment();
    var carpan = porsiyon / t.por;

    var ust = el("div", { sinif: "td-ust" }, [
      el("span", { sinif: "td-emoji", "aria-hidden": "true", metin: t.em || "🍽" }),
      el("div", null, [
        el("h2", { sinif: "td-baslik", metin: t.ad }),
        el("div", { sinif: "td-kaynak", metin: AM.TARIF_KATEGORILERI_AD[t.kat] || "" })
      ])
    ]);
    parca.appendChild(ust);

    var rozetler = el("div", { sinif: "rozet-satir" });
    rozetler.appendChild(rozet("⏱ " + ui.sureYaz(t.sure)));
    rozetler.appendChild(rozet("👩‍🍳 " + ZORLUK[t.zor]));
    if (t.etsiz) rozetler.appendChild(rozet("🌱 Etsiz"));
    if (!t.firinsiz) rozetler.appendChild(rozet("🔥 Fırın gerekir"));
    parca.appendChild(rozetler);

    /* porsiyon çarpanı — değişince panel baştan çizilmez, sadece miktarlar
       güncellenir (bkz. ui.porsiyonYenile). Böylece sayfa yukarı kaymaz. */
    parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Kaç kişilik?" }));
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
    parca.appendChild(el("div", { sinif: "porsiyon-kutu" }, [
      el("span", { metin: "Kişi sayısı" }), eksiBtn, sayiEl, artiBtn
    ]));

    /* malzemeler */
    parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Malzemeler" }));
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

      parca.appendChild(el("div", { sinif: sinif }, icerik));
    });

    /* hazırlanışı */
    parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Hazırlanışı" }));
    var liste = el("div", { sinif: "adim-liste" });
    t.y.forEach(function (adim) {
      liste.appendChild(el("div", { sinif: "adim" }, [el("span", { metin: adim })]));
    });
    parca.appendChild(liste);

    /* püf noktası */
    if (t.ip) {
      parca.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Püf noktası" }));
      parca.appendChild(el("div", { sinif: "ipucu-kart" }, [
        el("span", { "aria-hidden": "true", metin: "💡" }),
        el("span", null, [el("b", { metin: "" }), t.ip])
      ]));
    }

    return parca;
  };

  /**
   * Porsiyon değiştiğinde sadece miktar yazılarını tazeler.
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
