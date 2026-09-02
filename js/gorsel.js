/* ============================================================================
   TARİF GÖRSELİ
   ----------------------------------------------------------------------------
   İki katmanlı: üretilmiş bir fotoğraf varsa o gösterilir, yoksa tarifin
   kendi SVG portresi çizilir. Kart hiçbir koşulda boş kalmaz.

   Portre tarifin id'sinden türetiliyor: aynı tarif her zaman aynı portreyi
   alır, farklı tarifler farklı görünür. Kategori rengi belirler, id ise
   açıyı, tabak konumunu ve ton kaymasını.

   Görseli olan tariflerin listesi data/gorseller.js'te (tools/gorsel-liste.js
   üretir). Liste olmadan her görselsiz tarif boşuna 404 isteği atardı ve
   service worker cache-first çalıştığı için bu her açılışta tekrarlanırdı.

   Not: innerHTML kullanılmaz. SVG düğümleri createElementNS ile kurulur.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  var AD_ALANI = "http://www.w3.org/2000/svg";

  /* Görseli olan id'ler — hızlı arama için kümeye çevriliyor. */
  var kume = Object.create(null);
  (AM.GORSELLER || []).forEach(function (id) { kume[id] = 1; });

  /* --- id'den kararlı sayı (aynı tarif hep aynı portre) ------------------- */
  function karma(metin) {
    var h = 2166136261;
    for (var i = 0; i < metin.length; i++) {
      h ^= metin.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* --- kategoriye göre portre rengi (ton, doygunluk) ---------------------
     Yemeğin kendi rengine yakın tonlar: çorba amber, balık deniz mavisi,
     tatlı gül kurusu… Portre fotoğrafın yerini tutmuyor ama kategoriyi
     bir bakışta belli ediyor. */
  var TONLAR = {
    corba:    38,   /* amber      */
    sebze:    96,   /* yeşil      */
    etli:     8,    /* kiremit    */
    tavuk:    36,   /* altın      */
    balik:    194,  /* deniz      */
    bakliyat: 26,   /* toprak     */
    pilav:    44,   /* buğday     */
    hamur:    30,   /* fırın      */
    kahvalti: 48,   /* tereyağı   */
    salata:   118,  /* taze yeşil */
    tatli:    340   /* gül kurusu */
  };

  function svg(etiket, ozellik) {
    var d = document.createElementNS(AD_ALANI, etiket);
    if (ozellik) {
      Object.keys(ozellik).forEach(function (k) { d.setAttribute(k, ozellik[k]); });
    }
    return d;
  }

  /* --- SVG portre ---------------------------------------------------------- */
  function portre(t) {
    var h = karma(t.id);
    var anaTon = TONLAR[t.kat] === undefined ? 30 : TONLAR[t.kat];

    /* id'ye göre ±14 derece ton kayması: aynı kategorideki tarifler
       birbirinin kopyası görünmesin. */
    var ton = (anaTon + ((h % 29) - 14) + 360) % 360;
    var aci = (h >> 5) % 60 - 30;                 /* gradyan açısı  */
    var tabakX = 300 + ((h >> 11) % 200);         /* tabak konumu   */
    var tabakY = 240 + ((h >> 17) % 120);

    var kok = svg("svg", {
      viewBox: "0 0 800 600",
      preserveAspectRatio: "xMidYMid slice",
      "aria-hidden": "true",
      focusable: "false",
      class: "gorsel-portre"
    });

    var tanim = svg("defs");
    var gradyan = svg("linearGradient", {
      id: "g-" + t.id,
      x1: "0", y1: "0", x2: "1", y2: "1",
      gradientTransform: "rotate(" + aci + " 0.5 0.5)"
    });
    gradyan.appendChild(svg("stop", {
      offset: "0", "stop-color": "hsl(" + ton + " 62% 72%)"
    }));
    gradyan.appendChild(svg("stop", {
      offset: "1", "stop-color": "hsl(" + ((ton + 22) % 360) + " 54% 52%)"
    }));
    tanim.appendChild(gradyan);
    kok.appendChild(tanim);

    kok.appendChild(svg("rect", {
      x: "0", y: "0", width: "800", height: "600", fill: "url(#g-" + t.id + ")"
    }));

    /* Tabak: yumuşak, yarı saydam bir daire. Kompozisyona derinlik veriyor. */
    kok.appendChild(svg("circle", {
      cx: String(tabakX), cy: String(tabakY), r: "205",
      fill: "hsl(" + ton + " 40% 96%)", opacity: "0.30"
    }));
    kok.appendChild(svg("circle", {
      cx: String(tabakX), cy: String(tabakY), r: "150",
      fill: "hsl(" + ton + " 40% 98%)", opacity: "0.22"
    }));

    /* Tarifin emojisi — portrenin okunur kısmı burası. */
    var yazi = svg("text", {
      x: String(tabakX), y: String(tabakY),
      "text-anchor": "middle", "dominant-baseline": "central",
      "font-size": "170"
    });
    yazi.appendChild(document.createTextNode(t.em || "🍽"));
    kok.appendChild(yazi);

    return kok;
  }

  /* ------------------------------------------------------------------------ */

  AM.gorsel = {
    /** Bu tarifin üretilmiş bir fotoğrafı var mı? */
    varMi: function (id) { return kume[id] === 1; },

    /** Kategori kapağı (Dünya/kategori ekranlarının üst görseli). */
    kapakVarMi: function (katId) { return kume["kapak-" + katId] === 1; },

    yol: function (id) { return "gorseller/" + id + ".jpg"; },

    /**
     * Tarif için görsel kutusu döndürür.
     * Fotoğraf varsa <img>, yoksa SVG portre.
     * sinif: kutuya eklenecek ek CSS sınıfı ("gk-kart", "gk-hero" …)
     */
    kutu: function (t, sinif) {
      var kap = document.createElement("div");
      kap.className = "gorsel-kutu" + (sinif ? " " + sinif : "");

      if (kume[t.id] === 1) {
        var im = document.createElement("img");
        im.src = AM.gorsel.yol(t.id);
        im.alt = "";                       /* dekoratif: ad zaten yanında yazıyor */
        im.loading = "lazy";
        im.decoding = "async";
        /* Dosya bir şekilde inmezse (önbellek boş + çevrimdışı) portreye düş. */
        im.addEventListener("error", function () {
          if (im.parentNode === kap) kap.removeChild(im);
          kap.appendChild(portre(t));
        });
        kap.appendChild(im);
      } else {
        kap.appendChild(portre(t));
      }

      return kap;
    },

    /** Yalnızca portre — fotoğraf olsa bile. (Ayarlar önizlemesi gibi yerler) */
    portre: portre
  };
})();
