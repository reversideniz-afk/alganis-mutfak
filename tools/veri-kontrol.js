/* ============================================================================
   VERİ KONTROLÜ  —  node tools/veri-kontrol.js
   ----------------------------------------------------------------------------
   Tarif dosyalarını okuyup şu hataları arar:
     • Katalogda olmayan malzeme id'si
     • Tekrar eden tarif / malzeme id'si
     • Eksik veya hatalı alan (ad, kategori, süre, zorluk, porsiyon, adımlar)
     • Tanımsız tarif kategorisi
     • Hiç kullanılmayan malzemeler (uyarı, hata değil)

   Yeni tarif ekledikten sonra bunu çalıştır. "SORUN YOK" yazıyorsa
   uygulamayı gönül rahatlığıyla yayınlayabilirsin.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const kok = path.join(__dirname, "..");

/* Tarif dosyaları klasörden otomatik bulunur; yeni bir dosya eklediğinde
   bu listeyi güncellemen gerekmez. */
const tarifDosyalari = fs.readdirSync(path.join(kok, "data"))
  .filter((d) => /^tarifler-.*\.js$/.test(d))
  .sort()
  .map((d) => "data/" + d);

const dosyalar = ["data/malzemeler.js", "data/surum.js"].concat(tarifDosyalari);

const kapsam = { window: {} };
kapsam.window.window = kapsam.window;
vm.createContext(kapsam.window);

for (const d of dosyalar) {
  const tamYol = path.join(kok, d);
  if (!fs.existsSync(tamYol)) {
    console.error("EKSİK DOSYA:", d);
    process.exit(1);
  }
  vm.runInContext(fs.readFileSync(tamYol, "utf8"), kapsam.window, { filename: d });
}

const AM = kapsam.window.AM;
const hatalar = [];
const uyarilar = [];

/* --- malzeme kataloğu --------------------------------------------------- */
const malzemeIdler = new Set();
const gecerliKategoriler = new Set(AM.KATEGORILER.map((k) => k.id));

AM.MALZEMELER.forEach((m, i) => {
  const [id, ad, kat] = m;
  if (typeof id !== "string" || !id) hatalar.push(`MALZEME[${i}]: id eksik`);
  if (malzemeIdler.has(id)) hatalar.push(`MALZEME "${id}": tekrar eden id`);
  malzemeIdler.add(id);
  if (typeof ad !== "string" || !ad) hatalar.push(`MALZEME "${id}": ad eksik`);
  if (!gecerliKategoriler.has(kat)) hatalar.push(`MALZEME "${id}": bilinmeyen kategori "${kat}"`);
});

/* --- tarifler ------------------------------------------------------------ */
const tarifIdler = new Set();
const gecerliTarifKat = new Set(AM.TARIF_KATEGORILERI.map((k) => k.id));
const kullanilan = new Set();
const katSayilari = {};

(AM.TARIFLER || []).forEach((t, i) => {
  const etiket = `TARİF "${t.id || "#" + i}"`;

  if (!t.id) hatalar.push(`${etiket}: id eksik`);
  if (tarifIdler.has(t.id)) hatalar.push(`${etiket}: tekrar eden id`);
  tarifIdler.add(t.id);

  if (!t.ad) hatalar.push(`${etiket}: ad eksik`);
  if (!gecerliTarifKat.has(t.kat)) hatalar.push(`${etiket}: bilinmeyen kategori "${t.kat}"`);
  katSayilari[t.kat] = (katSayilari[t.kat] || 0) + 1;

  if (!Number.isFinite(t.sure) || t.sure <= 0) hatalar.push(`${etiket}: süre hatalı`);
  if (![1, 2, 3].includes(t.zor)) hatalar.push(`${etiket}: zorluk 1/2/3 olmalı`);
  if (!Number.isFinite(t.por) || t.por <= 0) hatalar.push(`${etiket}: porsiyon hatalı`);
  if (!t.em) uyarilar.push(`${etiket}: emoji yok`);

  if (!Array.isArray(t.m) || !t.m.length) {
    hatalar.push(`${etiket}: malzeme listesi boş`);
  } else {
    let anaVar = false;
    t.m.forEach((satir, j) => {
      if (!Array.isArray(satir) || typeof satir[0] !== "string") {
        hatalar.push(`${etiket}: malzeme satırı ${j} bozuk`);
        return;
      }
      const rol = satir[3] || "ana";
      if (!["ana", "yrd", "ops"].includes(rol)) {
        hatalar.push(`${etiket}: "${satir[0]}" için bilinmeyen rol "${rol}"`);
      }
      if (rol === "ana") anaVar = true;
      if (satir[1] !== null && satir[1] !== undefined && !Number.isFinite(satir[1])) {
        hatalar.push(`${etiket}: "${satir[0]}" miktarı sayı değil`);
      }
      satir[0].split("|").forEach((mid) => {
        kullanilan.add(mid);
        if (!malzemeIdler.has(mid)) {
          hatalar.push(`${etiket}: katalogda olmayan malzeme "${mid}"`);
        }
      });
    });
    if (!anaVar) uyarilar.push(`${etiket}: hiç "ana" malzeme yok — her şeye uyar hale gelir`);
  }

  if (!Array.isArray(t.y) || t.y.length < 2) hatalar.push(`${etiket}: hazırlanış adımı yetersiz`);
  else t.y.forEach((a, j) => {
    if (typeof a !== "string" || a.trim().length < 10) {
      hatalar.push(`${etiket}: ${j + 1}. adım çok kısa veya bozuk`);
    }
  });
});

/* --- ara sıcak listesi: yazım hatası olan id var mı? --------------------- */
(AM.ARA_SICAKLAR || []).forEach(function (id) {
  if (!tarifIdler.has(id)) {
    hatalar.push('ARA_SICAKLAR: "' + id + '" diye bir tarif yok (yazım hatası?)');
  }
});

/* --- öğün gruplarının dağılımı (bilgi) ----------------------------------- */
var grupSayilari = {};
(AM.TARIFLER || []).forEach(function (t) {
  var g = AM.grupBul(t);
  grupSayilari[g] = (grupSayilari[g] || 0) + 1;
});

/* --- kullanılmayan malzemeler (uyarı) ------------------------------------ */
malzemeIdler.forEach((id) => {
  if (!kullanilan.has(id)) uyarilar.push(`Malzeme "${id}" hiçbir tarifte kullanılmıyor`);
});

/* --- rapor --------------------------------------------------------------- */
console.log("");
console.log("Sürüm            :", AM.SURUM);
console.log("Toplam tarif     :", (AM.TARIFLER || []).length);
console.log("Toplam malzeme   :", AM.MALZEMELER.length);
console.log("");
console.log("Kategoriye göre:");
AM.TARIF_KATEGORILERI.forEach((k) => {
  console.log("  " + k.ad.padEnd(24, ".") + " " + (katSayilari[k.id] || 0));
});

console.log("");
console.log("Öğün grubuna göre (Bugün ekranı):");
AM.OGUN_GRUPLARI.forEach(function (g) {
  console.log("  " + g.ad.padEnd(24, ".") + " " + (grupSayilari[g.id] || 0));
});

if (uyarilar.length) {
  console.log("\nUYARILAR (" + uyarilar.length + "):");
  uyarilar.forEach((u) => console.log("  ~ " + u));
}

if (hatalar.length) {
  console.log("\nHATALAR (" + hatalar.length + "):");
  hatalar.forEach((h) => console.log("  ! " + h));
  console.log("");
  process.exit(1);
}

console.log("\nSORUN YOK — veri tutarlı.\n");
