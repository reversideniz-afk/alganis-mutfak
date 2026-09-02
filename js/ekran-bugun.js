/* ============================================================================
   EKRAN: BUGÜN — günün önerisi ve yapılabilecekler
   ----------------------------------------------------------------------------
   Öneriler sofra düzenine göre gruplanır (çorba, ana yemek, ara sıcak…).
   "Tümü" seçiliyken her gruptan en fazla GRUP_ONIZLEME kart gösterilir;
   belirli bir grup seçiliyse tek liste halinde sayfalı gösterilir.
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  ic.ciz_bugun = function () {
    var sepet = AM.depo.sepet();
    var bos = sepet.size === 0;
    $("bosMutfakUyari").hidden = !bos;
    $("oneriAlan").hidden = bos;
    if (bos) return;

    var sonuc = AM.oneriler(sepet, AM.depo.filtre(), AM.depo.tolerans());
    ic.durum.sonOneriler = sonuc;

    /* --- kahraman kart --- */
    var kap = $("oneriKart");
    bosalt(kap);
    var yokKart = $("sonucYokKart");

    if (sonuc.tam.length) {
      // Günün önerisi seçili yemek türünden gelir. "Hepsi" seçiliyken ana
      // yemeklerden seçilir; tatlı ya da salata baş köşeye oturmasın.
      var ogun = AM.depo.ogun();
      var havuz = sonuc.tam.filter(function (k) {
        return AM.grupBul(k.t) === (ogun === "hepsi" ? "ana" : ogun);
      });
      if (!havuz.length) havuz = sonuc.tam;

      var ix = AM.depo.oneriIx() % havuz.length;
      var secili = havuz[ix];
      kap.appendChild(AM.ui.heroKart(secili));
      $("btnTarifiAc").disabled = false;
      $("btnBaskaOner").disabled = havuz.length < 2;
      kap.dataset.id = secili.t.id;
      yokKart.hidden = true;
    } else {
      $("btnTarifiAc").disabled = true;
      $("btnBaskaOner").disabled = true;
      kap.dataset.id = "";
      yokKart.hidden = sonuc.yakin.length > 0;
      if (sonuc.yakin.length) {
        kap.appendChild(el("div", { sinif: "bilgi-kart mor" }, [
          el("h2", { metin: "Tam çıkan bir şey yok" }),
          el("p", { metin: "Ama aşağıdaki listeye bak — bir iki malzemeyle hepsi olur." })
        ]));
      }
    }

    /* --- yapılabilirler: yemek türüne göre gruplanmış --- */
    ciz_ogunSerit(sonuc.tam);
    ciz_yapilabilirler(sonuc.tam);
    $("sayacYapilabilir").textContent = String(sonuc.tam.length);
    $("bolumYapilabilir").hidden = sonuc.tam.length === 0;

    /* --- neler yapabilirdiniz (seçili yemek türüne uyanlar) --- */
    var ogunSecimi = AM.depo.ogun();
    var yakin = ogunSecimi === "hepsi" ? sonuc.yakin : sonuc.yakin.filter(function (k) {
      return AM.grupBul(k.t) === ogunSecimi;
    });
    var lst2 = $("listeNerdeyse");
    bosalt(lst2);
    yakin.slice(0, ic.durum.gosterNerdeyse).forEach(function (k) {
      lst2.appendChild(AM.ui.tarifKart(k, ic.tarifAc));
    });
    $("sayacNerdeyse").textContent = String(yakin.length);
    $("bolumNerdeyse").hidden = yakin.length === 0;
    $("btnDahaFazlaNerdeyse").hidden = yakin.length <= ic.durum.gosterNerdeyse;
  };

  /** Yemek türü şeridi: Tümü + o an gerçekten yapılabilen gruplar. */
  function ciz_ogunSerit(kayitlar) {
    var serit = $("ogunSerit");
    var secili = AM.depo.ogun();
    var sayim = {};
    kayitlar.forEach(function (k) {
      var g = AM.grupBul(k.t);
      sayim[g] = (sayim[g] || 0) + 1;
    });
    bosalt(serit);

    function cip(id, ad, emoji, adet) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (secili === id ? " aktif" : "")
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      if (adet) b.appendChild(el("span", { sinif: "kat-adet", metin: String(adet) }));
      b.addEventListener("click", function () { ogunSec(id); });
      return b;
    }

    serit.appendChild(cip("hepsi", "Tümü", "🍽", kayitlar.length));
    AM.OGUN_GRUPLARI.forEach(function (g) {
      if (!sayim[g.id]) return;          // o gruptan yapılabilir bir şey yoksa gösterme
      serit.appendChild(cip(g.id, g.ad, g.emoji, sayim[g.id]));
    });
  }

  function ogunSec(id) {
    AM.depo.ogun(id);
    ic.durum.gosterYapilabilir = ic.SAYFA_ADET;
    ic.durum.gosterNerdeyse = 12;
    ic.ciz_bugun();
    $("bolumYapilabilir").scrollIntoView({ block: "start", behavior: "smooth" });
  }
  ic.ogunSec = ogunSec;

  /**
   * "Tümü" seçiliyken her yemek türü kendi başlığı altında, en fazla
   * GRUP_ONIZLEME kart olacak şekilde listelenir. Belirli bir tür seçiliyse
   * tek liste halinde, sayfalı gösterilir.
   */
  function ciz_yapilabilirler(kayitlar) {
    var kap = $("gruplarYapilabilir");
    var secili = AM.depo.ogun();
    var dahaFazla = $("btnDahaFazlaYapilabilir");
    bosalt(kap);

    if (secili !== "hepsi") {
      var uyanlar = kayitlar.filter(function (k) { return AM.grupBul(k.t) === secili; });
      var izgara = el("div", { sinif: "tarif-izgara" });
      uyanlar.slice(0, ic.durum.gosterYapilabilir).forEach(function (k) {
        izgara.appendChild(AM.ui.tarifKart(k, ic.tarifAc));
      });
      kap.appendChild(izgara);
      dahaFazla.hidden = uyanlar.length <= ic.durum.gosterYapilabilir;
      return;
    }

    dahaFazla.hidden = true;
    AM.OGUN_GRUPLARI.forEach(function (g) {
      var uyanlar = kayitlar.filter(function (k) { return AM.grupBul(k.t) === g.id; });
      if (!uyanlar.length) return;

      var baslik = el("div", { sinif: "grup-baslik" }, [
        el("span", { sinif: "gb-emoji", "aria-hidden": "true", metin: g.emoji }),
        el("h4", { metin: g.ad }),
        el("span", { sinif: "grup-adet", metin: String(uyanlar.length) })
      ]);
      if (uyanlar.length > ic.GRUP_ONIZLEME) {
        var tumu = el("button", { type: "button", sinif: "grup-tumu", metin: "Tümü →" });
        tumu.addEventListener("click", function () { ogunSec(g.id); });
        baslik.appendChild(tumu);
      }

      var izgara2 = el("div", { sinif: "tarif-izgara" });
      uyanlar.slice(0, ic.GRUP_ONIZLEME).forEach(function (k) {
        izgara2.appendChild(AM.ui.tarifKart(k, ic.tarifAc));
      });

      kap.appendChild(el("section", { sinif: "grup-bolum" }, [baslik, izgara2]));
    });
  }
})();
