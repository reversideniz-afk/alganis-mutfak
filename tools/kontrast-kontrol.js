/* ============================================================================
   KONTRAST KONTROLÜ  —  node tools/kontrast-kontrol.js
   ----------------------------------------------------------------------------
   CLAUDE.md kuralı: "Renk paleti/tema değişikliklerinde WCAG 4.5:1 kontrastını
   programatik hesapla, tahmin etme." Bu araç onu gerçekleştirir.

   7 palet (6 renk + yüksek kontrast) × 2 görünen tema (gün ışığı, gece —
   "sistem" prefers-color-scheme'e göre ikisinden birine eşleniyor, ayrı bir
   görsel durum değil) = 14 kombinasyon. Her kombinasyonda uygulamanın gerçek
   bileşenlerini (küçük DOM parçaları olarak) sayfaya ekleyip getComputedStyle
   ile okunan renkleri Node tarafında WCAG göreli parlaklık formülüyle
   karşılaştırır — CSS'ten renk okumaya çalışmaz (rgba karışımını, kalıtımı
   vs. atlar), gerçekten render edilmiş rengi ölçer.

   Sunucu çalışıyor olmalı:  node tools/sunucu.js
   ========================================================================== */

const T = require("./tarayici.js");

const URL_ADRES = process.env.AM_URL || "http://127.0.0.1:8322/";
const ESIK = 4.5;

const PALETLER = ["domates", "zeytin", "patlican", "deniz", "gul", "bal", "kontrast"];
const TEMALAR = ["gunisigi", "gece"];

/* Her çift gerçek bir bileşenin DOM parçası — sınıf adları style.css/
   bilesenler.css'teki gerçek kurallarla birebir eşleşiyor. */
const CIFTLER = [
  { ad: "gövde metni", html: null }, // body'nin kendisi, ayrıca ekleniyor
  {
    ad: "kart alt yazı (.tk-izgara .tk-alt)",
    html: '<div class="tk tk-izgara"><div class="tk-govde"><span class="tk-alt" id="prob">x</span></div></div>'
  },
  {
    ad: "aktif alt menü (.menu-btn.aktif)",
    html: '<nav class="alt-menu"><button class="menu-btn aktif" id="prob">x</button></nav>'
  },
  {
    ad: "aktif sekme (.td-sekme.aktif)",
    html: '<div class="td-sekmeler"><button class="td-sekme aktif" id="prob">x</button></div>'
  },
  {
    ad: "birincil düğme (.btn.birincil)",
    html: '<button class="btn birincil" id="prob">x</button>'
  },
  {
    ad: "rozet · iyi (.rozet-mini.iyi)",
    html: '<span class="rozet-mini iyi" id="prob">x</span>'
  },
  {
    ad: "eksik uyarısı (.tk-eksik)",
    html: '<span class="tk-eksik" id="prob">x</span>'
  },
  {
    ad: "YENİ besin rozeti (.besin-halka strong)",
    html: '<div class="besin-satir"><div class="besin-halka"><strong id="prob">x</strong></div></div>'
  },
  {
    ad: "YENİ FAB (.menu-btn-fab)",
    html: '<nav class="alt-menu"><button class="menu-btn menu-btn-fab" id="prob">x</button></nav>'
  }
];

function srgbLin(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function parlaklik(rgb) {
  return 0.2126 * srgbLin(rgb[0]) + 0.7152 * srgbLin(rgb[1]) + 0.0722 * srgbLin(rgb[2]);
}
function oran(fg, bg) {
  const a = parlaklik(fg), b = parlaklik(bg);
  const ust = Math.max(a, b) + 0.05, alt = Math.min(a, b) + 0.05;
  return ust / alt;
}
function rgbAyristir(s) {
  const m = String(s).match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0];
  return m[1].split(",").slice(0, 3).map((x) => parseFloat(x));
}

(async function () {
  const t = await T.ac(URL_ADRES, { genislik: 390, yukseklik: 844, bekleme: 2500 });

  const sonuclar = []; // { kombinasyon, cift, oran, gecti }

  for (const tema of TEMALAR) {
    for (const palet of PALETLER) {
      await t.calistir(
        `(function(){document.documentElement.dataset.tema=${JSON.stringify(tema)};` +
        `document.documentElement.dataset.palet=${JSON.stringify(palet)};})()`
      );

      const olcumler = await t.calistir(`(function () {
        function ayristir(s) {
          var m = String(s).match(/rgba?\\(([^)]+)\\)/);
          if (!m) return null;
          var p = m[1].split(",").map(function (x) { return parseFloat(x); });
          return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
        }
        function arkaplanBul(el) {
          var node = el;
          while (node) {
            var c = ayristir(getComputedStyle(node).backgroundColor);
            if (c && c.a === 1) return [c.r, c.g, c.b];
            node = node.parentElement;
          }
          return [255, 255, 255];
        }
        var sonuc = [];

        // gövde metni
        var bs = getComputedStyle(document.body);
        sonuc.push({ ad: "gövde metni", fg: bs.color, bg: bs.backgroundColor });

        var kalipler = ${JSON.stringify(CIFTLER.filter((c) => c.html).map((c) => ({ ad: c.ad, html: c.html })))};
        kalipler.forEach(function (k) {
          var sarici = document.createElement("div");
          sarici.style.position = "fixed";
          sarici.style.left = "-9999px";
          sarici.innerHTML = k.html;
          document.body.appendChild(sarici);
          var prob = sarici.querySelector("#prob");
          var fg = getComputedStyle(prob).color;
          var bg = arkaplanBul(prob);
          sonuc.push({ ad: k.ad, fg: fg, bg: "rgb(" + bg.join(",") + ")" });
          document.body.removeChild(sarici);
        });
        return sonuc;
      })()`);

      olcumler.forEach((o) => {
        const fg = rgbAyristir(o.fg), bg = rgbAyristir(o.bg);
        const r = oran(fg, bg);
        sonuclar.push({
          kombinasyon: tema + " / " + palet,
          cift: o.ad,
          oran: Math.round(r * 100) / 100,
          gecti: r >= ESIK
        });
      });
    }
  }

  await t.kapat();

  const basarisiz = sonuclar.filter((s) => !s.gecti);
  console.log("");
  console.log("  " + PALETLER.length + " palet × " + TEMALAR.length + " tema = " +
    (PALETLER.length * TEMALAR.length) + " kombinasyon, her birinde " +
    (sonuclar.length / (PALETLER.length * TEMALAR.length)) + " çift ölçüldü.");
  console.log("");

  if (basarisiz.length === 0) {
    console.log("  ✓ Hepsi " + ESIK + ":1 üzerinde.");
  } else {
    basarisiz.forEach((s) => {
      console.log("  ✗ " + s.kombinasyon + " — " + s.cift + "   " + s.oran + ":1 (eşik " + ESIK + ":1)");
    });
  }
  console.log("");
  console.log(basarisiz.length === 0
    ? "  SORUN YOK — 14 kombinasyonun hepsi geçti."
    : "  " + basarisiz.length + " eşleşme " + ESIK + ":1 altında kaldı.");
  console.log("");
  process.exit(basarisiz.length === 0 ? 0 : 1);
})().catch((e) => { console.error("\nKontrast kontrolü çalıştırılamadı:", e.message, "\n"); process.exit(1); });
