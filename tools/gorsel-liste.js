/* ============================================================================
   GÖRSEL LİSTESİ ÜRETİCİ  —  node tools/gorsel-liste.js
   ----------------------------------------------------------------------------
   gorseller/ klasörünü tarar ve hangi tariflerin görseli olduğunu
   data/gorseller.js dosyasına yazar.

   Neden liste tutuyoruz? Tarayıcı dosyanın var olup olmadığını önceden
   bilemez. Liste olmadan her görselsiz tarif için bir 404 isteği giderdi;
   service worker cache-first çalıştığı için bu istekler her açılışta
   tekrarlanırdı. Liste sayesinde görseli olmayan tarif hiç istek atmadan
   doğrudan SVG portresine düşer.

   YENİ GÖRSEL EKLEDİKTEN SONRA BUNU ÇALIŞTIR, sonra sürümü artır.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const kok = path.join(__dirname, "..");
const gorselKlasor = path.join(kok, "gorseller");

if (!fs.existsSync(gorselKlasor)) {
  console.error("gorseller/ klasörü yok.");
  process.exit(1);
}

const idler = fs.readdirSync(gorselKlasor)
  .filter((d) => /\.jpg$/i.test(d))
  .map((d) => d.replace(/\.jpg$/i, ""))
  .sort();

/* Satır başına birkaç id — dosya okunabilir kalsın, git farkı şişmesin. */
const satirlar = [];
for (let i = 0; i < idler.length; i += 4) {
  satirlar.push("  " + idler.slice(i, i + 4).map((s) => '"' + s + '"').join(", "));
}

const icerik = [
  "/* ============================================================================",
  "   GÖRSELİ OLAN TARİFLER",
  "   ----------------------------------------------------------------------------",
  "   Bu dosya ELLE DÜZENLENMEZ — tools/gorsel-liste.js üretir.",
  "   Yeni görsel ekledikten sonra:  node tools/gorsel-liste.js",
  "",
  "   js/gorsel.js bu listeye bakar: id buradaysa gorseller/<id>.jpg gösterilir,",
  "   değilse tarif kendi SVG portresine düşer. Böylece görseli olmayan tarif",
  "   boşuna 404 isteği atmaz.",
  "   ========================================================================== */",
  "",
  "window.AM = window.AM || {};",
  "",
  "AM.GORSELLER = [",
  satirlar.join(",\n"),
  "];",
  ""
].join("\n");

fs.writeFileSync(path.join(kok, "data", "gorseller.js"), icerik, "utf8");

const kapak = idler.filter((s) => s.indexOf("kapak-") === 0).length;
console.log("");
console.log("data/gorseller.js yazıldı.");
console.log("  Kapak görseli  :", kapak);
console.log("  Tarif görseli  :", idler.length - kapak);
console.log("  Toplam         :", idler.length);
console.log("");
