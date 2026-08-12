/* ============================================================================
   EŞLEŞTİRME MOTORU
   ----------------------------------------------------------------------------
   Malzeme rolleri:
     "ana"  → Bu olmadan yemek o yemek olmaz. (patatesli yemekte patates)
     "yrd"  → Önemli ama olmasa da yemek yenir. (mercimek çorbasında havuç)
     "ops"  → Süs / servis. Hiçbir zaman engel değil. (maydanoz, pul biber)

   Sonuç kümeleri:
     "tam"       → Eksik ana ve yardımcı yok. Hemen yapılır.
     "neredeyse" → Ana malzemelerin hepsi var, 1-2 yardımcı eksik.
                   ("Havuçsuz da olur" notuyla yine önerilir.)
     "yakin"     → 1-2 ANA malzeme eksik. "Neler yapabilirdiniz?" listesi.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  /* --- metin normalize (Türkçe duyarlı arama) ---------------------------- */
  function nrm(s) {
    return String(s == null ? "" : s)
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLowerCase()
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[âÂ]/g, "a").replace(/[îÎ]/g, "i").replace(/[ûÛ]/g, "u")
      .replace(/\s+/g, " ")
      .trim();
  }
  AM.nrm = nrm;

  /* --- basit, kararlı karma (günlük sıralama için) ----------------------- */
  function karma(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }

  function bugununTohumu() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  /* --- hazırlık: indeksler, türetilmiş bayraklar, doğrulama -------------- */

  AM.hazirla = function () {
    var malzemeIndeks = Object.create(null);
    var etIdleri = new Set(["et-suyu"]);

    (AM.MALZEMELER || []).forEach(function (m) {
      malzemeIndeks[m[0]] = { id: m[0], ad: m[1], kat: m[2], temel: m[3] === 1, ara: m[4] || "" };
      if (m[2] === "et") etIdleri.add(m[0]);
    });
    AM.M = malzemeIndeks;

    var tarifIndeks = Object.create(null);
    var bilinmeyen = [];
    var cakisan = [];
    var tarifler = AM.TARIFLER || [];

    tarifler.forEach(function (t) {
      if (tarifIndeks[t.id]) cakisan.push(t.id);
      tarifIndeks[t.id] = t;

      var etVar = false;
      var aramaParcalari = [t.ad, t.kat];

      t.m.forEach(function (satir) {
        var roller = satir[3] || "ana";
        satir[0].split("|").forEach(function (mid) {
          if (!malzemeIndeks[mid]) {
            bilinmeyen.push(t.id + " → " + mid);
          } else {
            aramaParcalari.push(malzemeIndeks[mid].ad);
            if (etIdleri.has(mid) && roller !== "ops") etVar = true;
          }
        });
      });

      if (t.etsiz === undefined) t.etsiz = !etVar;
      if (t.firinsiz === undefined) {
        t.firinsiz = !(t.y || []).some(function (a) { return /fırın|firin/i.test(a); });
      }
      t.ara = nrm(aramaParcalari.join(" "));
      t.puanTohum = karma(t.id);
    });

    AM.T = tarifIndeks;
    AM.HATALAR = { bilinmeyenMalzeme: bilinmeyen, cakisanId: cakisan };
    return AM.HATALAR;
  };

  /* --- tek bir tarifi sepete göre değerlendir ---------------------------- */

  AM.degerlendir = function (t, sepet) {
    var eksikAna = [], eksikYrd = [], eksikOps = [], varOlan = 0;

    for (var i = 0; i < t.m.length; i++) {
      var satir = t.m[i];
      var rol = satir[3] || "ana";
      var idler = satir[0].split("|");
      var bulundu = false;
      for (var j = 0; j < idler.length; j++) {
        if (sepet.has(idler[j])) { bulundu = true; break; }
      }
      if (bulundu) { varOlan++; continue; }
      if (rol === "ops") eksikOps.push(satir);
      else if (rol === "yrd") eksikYrd.push(satir);
      else eksikAna.push(satir);
    }

    var durum;
    if (eksikAna.length === 0 && eksikYrd.length === 0) durum = "tam";
    else if (eksikAna.length === 0 && eksikYrd.length <= 2) durum = "neredeyse";
    else if (eksikAna.length <= 2 && eksikYrd.length <= 3) durum = "yakin";
    else durum = "uzak";

    return {
      durum: durum,
      eksikAna: eksikAna,
      eksikYrd: eksikYrd,
      eksikOps: eksikOps,
      eksikSayi: eksikAna.length + eksikYrd.length,
      varOlan: varOlan
    };
  };

  /* --- filtreler --------------------------------------------------------- */

  var FILTRELER = {
    hepsi:    function () { return true; },
    hizli:    function (t) { return t.sure <= 30; },
    kolay:    function (t) { return t.zor === 1; },
    etsiz:    function (t) { return t.etsiz === true; },
    firinsiz: function (t) { return t.firinsiz === true; }
  };

  /* --- ana öneri hesabı --------------------------------------------------- */

  AM.oneriler = function (sepet, filtreAdi, tolerans) {
    var filtre = FILTRELER[filtreAdi] || FILTRELER.hepsi;
    var tohum = bugununTohumu();
    var tam = [], yakin = [];

    (AM.TARIFLER || []).forEach(function (t) {
      if (!filtre(t)) return;
      var d = AM.degerlendir(t, sepet);
      var kayit = { t: t, d: d, sira: karma(t.id + tohum) };

      if (d.durum === "tam") { kayit.oncelik = 0; tam.push(kayit); }
      else if (d.durum === "neredeyse") {
        if (tolerans) { kayit.oncelik = 1; tam.push(kayit); }
        else { kayit.oncelik = 0; yakin.push(kayit); }
      }
      else if (d.durum === "yakin") { kayit.oncelik = d.eksikAna.length; yakin.push(kayit); }
    });

    function sirala(a, b) {
      if (a.oncelik !== b.oncelik) return a.oncelik - b.oncelik;
      if (a.d.eksikSayi !== b.d.eksikSayi) return a.d.eksikSayi - b.d.eksikSayi;
      return a.sira - b.sira;
    }

    tam.sort(sirala);
    yakin.sort(sirala);
    return { tam: tam, yakin: yakin };
  };

  /* --- tarif arama (Tarifler ekranı) -------------------------------------- */

  AM.tarifAra = function (metin, kategori) {
    var q = nrm(metin);
    var kelimeler = q ? q.split(" ") : [];
    return (AM.TARIFLER || []).filter(function (t) {
      if (kategori && kategori !== "hepsi" && t.kat !== kategori) return false;
      if (!kelimeler.length) return true;
      for (var i = 0; i < kelimeler.length; i++) {
        if (t.ara.indexOf(kelimeler[i]) === -1) return false;
      }
      return true;
    });
  };
})();
