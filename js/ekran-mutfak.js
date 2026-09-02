/* ============================================================================
   EKRAN: MUTFAĞIM — evdeki malzemelerin işaretlendiği yer
   ========================================================================== */

(function () {
  "use strict";
  var ic = AM.ic, el = ic.el, bosalt = ic.bosalt, $ = ic.$;

  /** Kategori başına kaç malzeme seçili — şeritteki sayaçlar için. */
  function malzemeSayaclari() {
    var sepet = AM.depo.sepet();
    var say = {};
    AM.MALZEMELER.forEach(function (m) {
      if (sepet.has(m[0])) say[m[2]] = (say[m[2]] || 0) + 1;
    });
    return { say: say, toplam: sepet.size };
  }

  ic.ciz_katSerit = function () {
    var serit = $("katSerit");
    var bilgi = malzemeSayaclari();
    bosalt(serit);

    function cip(id, ad, emoji, adet) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (ic.durum.katFiltre === id ? " aktif" : ""),
        veri: { kat: id }
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      if (adet) b.appendChild(el("span", { sinif: "kat-adet", metin: String(adet) }));
      b.addEventListener("click", function () {
        ic.durum.katFiltre = id;
        ic.ciz_katSerit();
        ic.ciz_malzemeler();
      });
      return b;
    }

    serit.appendChild(cip("hepsi", "Tümü", "🧺", bilgi.toplam));
    AM.KATEGORILER.forEach(function (k) {
      serit.appendChild(cip(k.id, k.ad, k.emoji, bilgi.say[k.id] || 0));
    });
  };

  ic.ciz_malzemeler = function () {
    var kap = $("malzemeListe");
    var sepet = AM.depo.sepet();
    var q = AM.nrm(ic.durum.malzemeArama);
    bosalt(kap);

    AM.KATEGORILER.forEach(function (k) {
      if (ic.durum.katFiltre !== "hepsi" && ic.durum.katFiltre !== k.id) return;

      var uygun = AM.MALZEMELER.filter(function (m) {
        if (m[2] !== k.id) return false;
        if (!q) return true;
        return AM.nrm(m[1] + " " + (m[4] || "")).indexOf(q) !== -1;
      });
      if (!uygun.length) return;

      var bolum = el("section", { sinif: "kat-bolum" });
      bolum.appendChild(el("h3", { sinif: "kat-baslik" }, [
        el("span", { sinif: "em", "aria-hidden": "true", metin: k.emoji }), k.ad
      ]));

      var izgara = el("div", { sinif: "cip-izgara" });
      uygun.forEach(function (m) {
        var secili = sepet.has(m[0]);
        var b = el("button", {
          type: "button", sinif: "cip",
          "aria-pressed": secili ? "true" : "false",
          veri: { id: m[0] }
        }, [el("span", { sinif: "tik", "aria-hidden": "true", metin: "✓" }), m[1]]);
        izgara.appendChild(b);
      });
      bolum.appendChild(izgara);
      kap.appendChild(bolum);
    });

    if (!kap.firstChild) {
      kap.appendChild(el("div", { sinif: "bos-durum" }, [
        el("div", { sinif: "bos-emoji", metin: "🥄" }),
        el("p", { metin: "Bu aramaya uyan malzeme yok." })
      ]));
    }
  };

  ic.rozetGuncelle = function () {
    var n = AM.depo.sepet().size;
    var r = $("rozetMalzeme");
    r.textContent = String(n);
    r.hidden = n === 0;
  };
})();
