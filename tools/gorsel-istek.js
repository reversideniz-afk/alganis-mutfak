/* ============================================================================
   GÖRSEL İSTEMİ ÜRETİCİ  —  node tools/gorsel-istek.js [--parti 50] [--hepsi]
   ----------------------------------------------------------------------------
   Görseli henüz üretilmemiş tarifleri öncelik sırasına dizer ve her biri için
   hazır bir görsel üretim istemi yazar.

   Öncelik nasıl belirleniyor?
     1) Kategori ve mutfak kapakları — ekranların üst görselleri, en çok görünen
        ve en az sayıda dosya.
     2) "Vitrin" tarifleri — malzemelerinin çoğu evde her zaman bulunan (temel)
        malzeme olanlar. Bunlar öneri listelerinde en sık çıkan tarifler, yani
        görselinin olması en çok fark yaratanlar.
     3) Kalan tarifler.

   ÇIKTI
     gorseller/_istekler.txt  → sırayla okunacak, elle kullanılacak liste
     gorseller/_istekler.csv  → aynı veri, id;istem biçiminde (araç için)

   AKIŞ
     1) node tools/gorsel-istek.js --parti 50
     2) Görselleri üret, ham dosyaları gorseller/_ham/<tarif-id>.png yap
     3) powershell -File tools/gorsel-isle.ps1
     4) node tools/veri-kontrol.js  (kaç görsel var/yok raporlar)
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const kok = path.join(__dirname, "..");
const gorselKlasor = path.join(kok, "gorseller");

/* --- veriyi yükle (veri-kontrol.js ile aynı yöntem) ---------------------- */
const tarifDosyalari = fs.readdirSync(path.join(kok, "data"))
  .filter((d) => /^tarifler-.*\.js$/.test(d))
  .sort()
  .map((d) => "data/" + d);

const kapsam = { window: {} };
kapsam.window.window = kapsam.window;
vm.createContext(kapsam.window);

["data/malzemeler.js", "data/surum.js"].concat(tarifDosyalari).forEach((d) => {
  vm.runInContext(fs.readFileSync(path.join(kok, d), "utf8"), kapsam.window, { filename: d });
});

const AM = kapsam.window.AM;
const EN = require("./malzeme-en.js");

/* --- malzeme id → temel mi, İngilizce adı ne ----------------------------- */
const malzeme = {};
AM.MALZEMELER.forEach((m) => { malzeme[m[0]] = { temel: m[3] === 1, en: EN[m[0]] || null }; });

/* --- kategori → yemeğin biçimi ve kabı ----------------------------------- */
const BICIM = {
  corba:    { tur: "soup",                       kap: "in a shallow ceramic soup bowl" },
  sebze:    { tur: "olive oil vegetable dish",   kap: "in a shallow ceramic bowl" },
  etli:     { tur: "meat stew",                  kap: "in a rustic ceramic bowl" },
  tavuk:    { tur: "chicken dish",               kap: "on a simple ceramic plate" },
  balik:    { tur: "fish dish",                  kap: "on a simple ceramic plate" },
  bakliyat: { tur: "legume dish",                kap: "in a deep ceramic bowl" },
  pilav:    { tur: "pilaf",                      kap: "on a white ceramic plate" },
  hamur:    { tur: "savoury pastry",             kap: "on a worn wooden board" },
  kahvalti: { tur: "breakfast dish",             kap: "on a small ceramic plate" },
  salata:   { tur: "salad",                      kap: "in a wide shallow bowl" },
  tatli:    { tur: "dessert",                    kap: "on a small dessert plate" }
};

/* --- her istemin sonuna eklenen değişmez stil kuyruğu ---------------------
   1150 görselin tek uygulamaya ait hissetmesini sağlayan tek şey bu. */
const STIL = "against a warm cream linen background, overhead 45 degree angle, " +
             "soft natural window light from the left, shallow depth of field, " +
             "muted warm color grade, photorealistic food photography";

const NEGATIF = "text, watermark, logo, hands, people, plastic, oversaturated, " +
                "blurry, cluttered cutlery, fine dining plating";

/* --- İngilizce çoğul (kapak istemlerinde "several dishes" için) ---------- */
function cogul(s) {
  if (/[^aeiou]y$/.test(s)) return s.slice(0, -1) + "ies";   // pastry → pastries
  if (/(s|x|z|ch|sh)$/.test(s)) return s + "es";             // dish   → dishes
  return s + "s";                                            // soup   → soups
}

/* --- bir tarifin istemini kur -------------------------------------------- */
function istem(t) {
  const bicim = BICIM[t.kat] || { tur: "dish", kap: "in a simple ceramic bowl" };

  /* Ana malzemelerden en fazla üç tanesi — yemeği tanımlayanlar bunlar.
     Tuz, su, yağ gibi her tarifte geçenler görseli anlatmadığı için elenir. */
  const atla = new Set(["tuz", "su", "sivi-yag", "karabiber", "un", "seker"]);
  const ana = [];
  t.m.forEach((satir) => {
    if ((satir[3] || "ana") !== "ana") return;
    const id = satir[0].split("|")[0];
    if (atla.has(id)) return;
    const en = malzeme[id] && malzeme[id].en;
    if (en && ana.indexOf(en) === -1 && ana.length < 3) ana.push(en);
  });

  const icerik = ana.length
    ? "Turkish " + bicim.tur + " with " + ana.join(", ")
    : "Turkish " + bicim.tur;

  return t.ad + " (" + icerik + "), served " + bicim.kap + " " + STIL;
}

/* --- vitrin puanı: evdeki temel malzemeyle yapılabilirlik ---------------- */
function vitrinPuani(t) {
  let temel = 0, toplam = 0;
  t.m.forEach((satir) => {
    if ((satir[3] || "ana") === "ops") return;
    toplam++;
    const id = satir[0].split("|")[0];
    if (malzeme[id] && malzeme[id].temel) temel++;
  });
  if (!toplam) return 0;
  /* Temel oranı yüksek + malzemesi az olan tarif, öneri listelerinde en sık
     çıkandır. İkisini tek puanda birleştiriyoruz. */
  return (temel / toplam) - (toplam / 100);
}

/* --- mevcut görseller ----------------------------------------------------- */
if (!fs.existsSync(gorselKlasor)) fs.mkdirSync(gorselKlasor, { recursive: true });
const mevcut = new Set(
  fs.readdirSync(gorselKlasor)
    .filter((d) => /\.jpg$/i.test(d))
    .map((d) => d.replace(/\.jpg$/i, ""))
);

/* --- iş listesini kur ----------------------------------------------------- */
const isler = [];

/* 1. parti — kategori kapakları */
AM.TARIF_KATEGORILERI.forEach((k) => {
  const id = "kapak-" + k.id;
  if (mevcut.has(id)) return;
  const bicim = BICIM[k.id] || { tur: "dish", kap: "in a ceramic bowl" };
  isler.push({
    id: id,
    parti: "kapak",
    istem: "An inviting spread of Turkish " + cogul(bicim.tur) + ", several dishes " +
           "arranged together, " + STIL
  });
});

/* 1. parti — mutfak kapakları (Faz 2'de AM.MUTFAKLAR tanımlanınca dolar) */
(AM.MUTFAKLAR || []).forEach((m) => {
  const id = "kapak-mutfak-" + m.id;
  if (mevcut.has(id)) return;
  isler.push({
    id: id,
    parti: "kapak",
    istem: "An inviting spread of traditional " + (m.en || m.ad) + " home cooking, " +
           "several dishes arranged together, " + STIL
  });
});

/* 2. ve 3. parti — tarifler */
const tarifler = (AM.TARIFLER || [])
  .filter((t) => !mevcut.has(t.id))
  .map((t) => ({ t: t, puan: vitrinPuani(t) }))
  .sort((a, b) => b.puan - a.puan);

tarifler.forEach((k, ix) => {
  isler.push({
    id: k.t.id,
    parti: ix < 150 ? "vitrin" : "gövde",
    istem: istem(k.t)
  });
});

/* --- parti sınırı --------------------------------------------------------- */
const argv = process.argv.slice(2);
let sinir = 50;
if (argv.indexOf("--hepsi") !== -1) sinir = isler.length;
const partiIx = argv.indexOf("--parti");
if (partiIx !== -1 && argv[partiIx + 1]) sinir = parseInt(argv[partiIx + 1], 10) || 50;

const secilen = isler.slice(0, sinir);

/* --- yaz ------------------------------------------------------------------ */
const basliklar = [
  "ALGANİS MUTFAK — GÖRSEL ÜRETİM LİSTESİ",
  "",
  "Üretilen her dosyayı  gorseller/_ham/<dosya adı>.png  olarak kaydet.",
  "Dosya adı tarif id'siyle birebir aynı olmalı — sonraki adım buna bakıyor.",
  "Bittiğinde:  powershell -File tools/gorsel-isle.ps1",
  "",
  "Her üretimde kullanılacak NEGATİF istem:",
  "  " + NEGATIF,
  "",
  "Toplam eksik görsel : " + isler.length,
  "Bu listede          : " + secilen.length,
  "=".repeat(78),
  ""
];

const satirlar = secilen.map((is, i) => {
  return [
    "--- " + (i + 1) + " / " + secilen.length + "  [" + is.parti + "] " + "-".repeat(40),
    "dosya adı: " + is.id + ".png",
    "",
    is.istem,
    ""
  ].join("\n");
});

fs.writeFileSync(
  path.join(gorselKlasor, "_istekler.txt"),
  basliklar.join("\n") + satirlar.join("\n"),
  "utf8"
);

fs.writeFileSync(
  path.join(gorselKlasor, "_istekler.csv"),
  secilen.map((is) => is.id + ";" + is.istem.replace(/;/g, ",")).join("\n"),
  "utf8"
);

/* --- rapor ---------------------------------------------------------------- */
const sayac = {};
isler.forEach((is) => { sayac[is.parti] = (sayac[is.parti] || 0) + 1; });

console.log("");
console.log("Toplam tarif       :", (AM.TARIFLER || []).length);
console.log("Görseli olan       :", mevcut.size);
console.log("Görseli olmayan    :", isler.length);
console.log("");
Object.keys(sayac).forEach((p) => {
  console.log("  " + p.padEnd(12, ".") + " " + sayac[p]);
});
console.log("");
console.log("Yazıldı: gorseller/_istekler.txt  (" + secilen.length + " istem)");
console.log("         gorseller/_istekler.csv");
console.log("");
