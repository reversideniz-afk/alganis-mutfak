/* ============================================================================
   GÖRSEL BULMA — internetten telifsiz/yeniden kullanılabilir fotoğraf
     node tools/gorsel-bul.js --parti 50   → sıradaki 50 tarif için görsel arar
     node tools/gorsel-bul.js --hepsi      → eksik olan hepsini dener
     node tools/gorsel-bul.js --deneme     → tek tarif dener (sıradaki ilk)
   ----------------------------------------------------------------------------
   Fooocus/yerel üretim yerine (Fooocus kaldırıldı) Openverse (api.openverse.org)
   üzerinden gerçek fotoğraf aranıyor. Openverse; Wikimedia Commons, Flickr'ın
   CC lisanslı havuzu gibi kaynakları tek çatıda arıyor, API anahtarı
   gerektirmiyor.

   ÖNCELİK: önce CC0/kamu malı (atıf gerektirmez), bulunamazsa ticari kullanım
   + türetmeye (kırpma/yeniden boyutlandırma) izin veren CC BY / CC BY-SA.

   STİL TUTARLILIĞI ARTIK GARANTİ EDİLEMEZ — her fotoğraf farklı kaynaktan
   geliyor, Fooocus'taki tek tip "sıcak keten, 45 derece" görünümü yok. Bu
   bilinçli bir ödün: gerçek fotoğraf, yapay ama tutarlı görselden daha
   değerli sayıldı (bkz. YOL-HARITASI.md Bölüm 6).

   ATIF: CC0 dışında kullanılan her görsel gorseller/_kaynaklar.csv'ye
   yazılır (tarif-id;kaynak-url;lisans;yazar). Uygulamaya bir "Fotoğraf
   Kaynakları" ekranı eklenene kadar bu liste sadece kayıt altında tutuluyor
   — atıf borcu unutulmasın diye.

   BULUNAMAYAN tarifler gorseller/_bulunamadi.csv'ye yazılır — hata değil,
   sonra elle bakılacak/yeniden aranacak liste. Aynı id bir daha denenmez;
   listeden silinirse tekrar denenir.

   Openverse anonim kullanımda hız sınırlı; 429 alınırsa 60 sn bekleyip
   aynı isteği tekrarlar. Çok daha yüksek hacimde çalıştırmak gerekirse
   api.openverse.org üzerinden ücretsiz bir client_id/secret alınabilir.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const https = require("https");
const vm = require("vm");

const kok = path.join(__dirname, "..");
const gorselKlasor = path.join(kok, "gorseller");
const hamKlasor = path.join(gorselKlasor, "_ham");
const kaynaklarCsv = path.join(gorselKlasor, "_kaynaklar.csv");
const bulunamadiCsv = path.join(gorselKlasor, "_bulunamadi.csv");

/* --- veriyi yükle (gorsel-istek.js ile aynı yöntem) ---------------------- */
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

const malzeme = {};
AM.MALZEMELER.forEach((m) => { malzeme[m[0]] = { temel: m[3] === 1, en: EN[m[0]] || null }; });

const tarifById = {};
(AM.TARIFLER || []).forEach((t) => { tarifById[t.id] = t; });

/* --- kategori → arama terimi (gorsel-istek.js'teki BICIM ile aynı) ------- */
const BICIM = {
  corba: "soup", sebze: "olive oil vegetable dish", etli: "meat stew",
  tavuk: "chicken dish", balik: "fish dish", bakliyat: "legume dish",
  pilav: "pilaf", hamur: "savoury pastry", kahvalti: "breakfast dish",
  salata: "salad", tatli: "dessert"
};

function cogul(s) {
  if (/[^aeiou]y$/.test(s)) return s.slice(0, -1) + "ies";
  if (/(s|x|z|ch|sh)$/.test(s)) return s + "es";
  return s + "s";
}

/* --- Türkçe diyakritikleri ASCII'ye çevir ---------------------------------
   Openverse'te "mercimek çorbası" 17 sonuç bulurken ASCII yaklaşığı
   "mercimek corbasi" SIFIR buluyor — ama bazı kaynaklar da tam tersi
   (Flickr'da "karniyarik" ASCII yazılmış). İkisini de deniyoruz. */
const TR_ASCII = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
                   "Ç": "C", "Ğ": "G", "İ": "I", "Ö": "O", "Ş": "S", "Ü": "U" };
function asciiye(s) {
  return s.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => TR_ASCII[c] || c);
}

/* --- bir tarif/kapak için, öncelik sırasıyla denenecek arama sorguları ---- */
function sorguAdaylari(id) {
  if (id.indexOf("kapak-mutfak-") === 0) {
    const mid = id.slice("kapak-mutfak-".length);
    const m = (AM.MUTFAKLAR || []).find((x) => x.id === mid);
    return ["traditional " + (m ? (m.en || m.ad) : mid) + " food"];
  }
  if (id.indexOf("kapak-") === 0) {
    const kat = id.slice("kapak-".length);
    return ["turkish " + cogul(BICIM[kat] || "dish")];
  }

  const t = tarifById[id];
  if (!t) return [];

  const adaylar = [t.ad]; // 1) tarifin kendi Türkçe adı — en isabetli eşleşme
  const ascii = asciiye(t.ad);
  if (ascii !== t.ad) adaylar.push(ascii); // 2) ASCII yaklaşığı

  const atla = new Set(["tuz", "su", "sivi-yag", "karabiber", "un", "seker"]);
  const ana = [];
  (t.m || []).forEach((satir) => {
    if ((satir[3] || "ana") !== "ana") return;
    const mid = satir[0].split("|")[0];
    if (atla.has(mid)) return;
    const en = malzeme[mid] && malzeme[mid].en;
    if (en && ana.indexOf(en) === -1 && ana.length < 2) ana.push(en);
  });
  const tur = BICIM[t.kat] || "dish";
  adaylar.push(ana.length ? "turkish " + tur + " with " + ana.join(" ") : "turkish " + tur); // 3) genel İngilizce

  return adaylar;
}

/* ============================================================ Openverse API */

function openverseGetir(yol) {
  return new Promise((coz, red) => {
    https.get("https://api.openverse.org" + yol,
      { headers: { "User-Agent": "AlganisMutfakGorselBul/1.0 (https://reversideniz-afk.github.io/alganis-mutfak/)" } },
      (cevap) => {
        if (cevap.statusCode === 429) { cevap.resume(); red(new Error("HIZ_LIMITI")); return; }
        if (cevap.statusCode !== 200) { cevap.resume(); red(new Error("HTTP " + cevap.statusCode)); return; }
        const parcalar = [];
        cevap.on("data", (p) => parcalar.push(p));
        cevap.on("end", () => {
          try { coz(JSON.parse(Buffer.concat(parcalar).toString("utf8"))); }
          catch (e) { red(e); }
        });
      }
    ).on("error", red);
  });
}

const EN_KUCUK_KENAR = 600; // px — bundan küçükse 800x600'e büyütmek gerekir, kalite düşer
const SERBEST_LISANS = new Set(["cc0", "pdm"]); // atıf gerektirmeyenler

/* license_type=commercial,modification zaten cc0/pdm'yi de kapsıyor (ikisi de
   ticari kullanıma ve türetmeye izin veriyor) — tek çağrıda hem tarıyoruz hem
   de dönen "license" alanına bakıp atıf gerekip gerekmediğine karar veriyoruz. */
async function adayBul(sorgular) {
  for (const sorgu of sorgular) {
    const q = encodeURIComponent(sorgu);
    const y = await openverseGetir(
      "/v1/images/?q=" + q + "&license_type=commercial,modification&mature=false&page_size=20");
    const aday = (y.results || []).find((r) => Math.min(r.width || 0, r.height || 0) >= EN_KUCUK_KENAR);
    if (aday) {
      return { aday: aday, sorgu: sorgu, atifGerekir: !SERBEST_LISANS.has((aday.license || "").toLowerCase()) };
    }
    await bekle(1200); // adaylar arası da hız sınırına takılmayalım
  }
  return null;
}

function indirTek(url, hedef) {
  return new Promise((coz, red) => {
    https.get(url, { headers: { "User-Agent": "AlganisMutfakGorselBul/1.0 (https://reversideniz-afk.github.io/alganis-mutfak/)" } }, (cevap) => {
      if (cevap.statusCode === 429) { cevap.resume(); red(new Error("HIZ_LIMITI")); return; }
      if (cevap.statusCode !== 200) { cevap.resume(); red(new Error("HTTP " + cevap.statusCode)); return; }
      const dosya = fs.createWriteStream(hedef);
      cevap.pipe(dosya);
      dosya.on("finish", () => dosya.close(() => coz()));
      dosya.on("error", red);
    }).on("error", red);
  });
}

/* Görsel sunucuları (Wikimedia/Flickr) art arda isteklerde 429 dönebiliyor —
   bir kere 15 sn bekleyip tekrar dener, yine olmazsa hata olarak yukarı atar. */
async function indir(url, hedef) {
  try {
    await indirTek(url, hedef);
  } catch (e) {
    if (e.message !== "HIZ_LIMITI") throw e;
    await bekle(15000);
    await indirTek(url, hedef);
  }
}

function uzanti(aday) {
  const ft = (aday.filetype || "").toLowerCase();
  if (ft === "jpeg") return "jpg";
  if (["jpg", "png", "webp"].indexOf(ft) !== -1) return ft;
  const m = /\.(jpg|jpeg|png|webp)(\?|$)/i.exec(aday.url || "");
  if (!m) return "jpg";
  return m[1].toLowerCase() === "jpeg" ? "jpg" : m[1].toLowerCase();
}

const bekle = (ms) => new Promise((c) => setTimeout(c, ms));

function satirEkle(dosyaYolu, satir) {
  fs.appendFileSync(dosyaYolu, satir + "\n", "utf8");
}

/* ====================================================== iş listesini yükle */

function tumIdler() {
  const csv = path.join(gorselKlasor, "_istekler.csv");
  if (!fs.existsSync(csv)) {
    throw new Error("gorseller/_istekler.csv yok. Önce: node tools/gorsel-istek.js --hepsi");
  }
  return fs.readFileSync(csv, "utf8").split("\n")
    .map((s) => s.trim()).filter(Boolean)
    .map((satir) => satir.slice(0, satir.indexOf(";")));
}

function idListesiOku(dosyaYolu) {
  if (!fs.existsSync(dosyaYolu)) return new Set();
  return new Set(
    fs.readFileSync(dosyaYolu, "utf8").split("\n").slice(1) // başlık satırını atla
      .map((s) => s.slice(0, s.indexOf(";")))
      .filter(Boolean)
  );
}

/* ==================================================================== ana akış */

(async function () {
  const argv = process.argv.slice(2);
  const bayrak = (ad) => argv.indexOf(ad) !== -1;
  const sayi = (ad, varsayilan) => {
    const i = argv.indexOf(ad);
    return i !== -1 && argv[i + 1] ? parseInt(argv[i + 1], 10) : varsayilan;
  };

  if (!fs.existsSync(hamKlasor)) fs.mkdirSync(hamKlasor, { recursive: true });
  if (!fs.existsSync(kaynaklarCsv)) fs.writeFileSync(kaynaklarCsv, "tarif-id;kaynak-url;lisans;yazar\n", "utf8");
  if (!fs.existsSync(bulunamadiCsv)) fs.writeFileSync(bulunamadiCsv, "tarif-id;denenen-sorgu\n", "utf8");

  const denenmis = idListesiOku(bulunamadiCsv);

  const yapilacak = tumIdler().filter((id) =>
    !fs.existsSync(path.join(hamKlasor, id + ".png")) &&
    !fs.existsSync(path.join(hamKlasor, id + ".jpg")) &&
    !fs.existsSync(path.join(gorselKlasor, id + ".jpg")) &&
    !denenmis.has(id)
  );

  const sinir = bayrak("--hepsi") ? yapilacak.length : (bayrak("--deneme") ? 1 : sayi("--parti", 50));
  const secilen = yapilacak.slice(0, sinir);

  if (!secilen.length) {
    console.log("\nListedeki her tarif için ya görsel var ya da daha önce denenip");
    console.log("bulunamadı (gorseller/_bulunamadi.csv). Listeden bir id silersen tekrar denenir.\n");
    return;
  }

  console.log("");
  console.log("Denenecek     :", secilen.length);
  console.log("Klasör        : gorseller/_ham/");
  console.log("");

  let bulundu = 0, bulunamadi = 0;

  /* Üst üste gelen sunucu hatalarını sayar — API çöktüyse geri çekilmek için. */
  let ardArdaSunucuHatasi = 0;

  for (let i = 0; i < secilen.length; i++) {
    const id = secilen[i];
    const etiket = "[" + (i + 1) + "/" + secilen.length + "] " + id;
    const sorgular = sorguAdaylari(id);

    if (!sorgular.length) {
      console.log(etiket.padEnd(50) + "ATLANDI (tarif verisi bulunamadı)");
      continue;
    }

    try {
      const sonuc = await adayBul(sorgular);
      /* İstek geçtiyse API ayakta demektir — arka arkaya sayacı sıfırla ki
         zamana yayılmış tek tük 504'ler birikip taramayı durdurmasın. */
      ardArdaSunucuHatasi = 0;
      if (!sonuc) {
        console.log(etiket.padEnd(50) + "bulunamadı  [\"" + sorgular.join('" / "') + "\"]");
        satirEkle(bulunamadiCsv, id + ";" + sorgular.join(" | "));
        bulunamadi++;
      } else {
        const ext = uzanti(sonuc.aday);
        const hedef = path.join(hamKlasor, id + "." + ext);
        await indir(sonuc.aday.url, hedef);
        const kb = Math.round(fs.statSync(hedef).size / 1024);
        console.log(etiket.padEnd(50) + kb + " KB" +
                    (sonuc.atifGerekir ? "  (atıf gerekir)" : "  (CC0)") +
                    '  ["' + sonuc.sorgu + '"]');
        if (sonuc.atifGerekir) {
          satirEkle(kaynaklarCsv, [
            id,
            sonuc.aday.foreign_landing_url,
            sonuc.aday.license + " " + (sonuc.aday.license_version || ""),
            (sonuc.aday.creator || "bilinmiyor").replace(/;/g, ",")
          ].join(";"));
        }
        bulundu++;
      }
    } catch (e) {
      if (e.message === "HIZ_LIMITI") {
        console.log("\nOpenverse hız limitine takıldı, 60 sn bekleniyor…");
        i--; await bekle(60000); continue;
      }

      /* Sunucu hatası (502/503/504): Openverse'te geçici bir çökme demek.
         Geri çekilmezsek kalan yüzlerce tarifi 1,2 saniyede bir boşuna
         tüketip "bitti" deriz — hiçbiri gerçekten aranmamış olur. Bunlar
         _bulunamadi.csv'ye YAZILMADIĞI için sonradan tekrar denenirler,
         ama aynı çalıştırmada kurtarmak daha iyi. */
      var sunucuHatasi = /^HTTP 5\d\d$/.test(e.message);
      if (sunucuHatasi) {
        ardArdaSunucuHatasi++;
        if (ardArdaSunucuHatasi <= 5) {
          var bekleme = Math.min(60000, 5000 * ardArdaSunucuHatasi);
          console.log(etiket.padEnd(50) + e.message +
                      " — " + Math.round(bekleme / 1000) + " sn bekleyip tekrar denenecek");
          i--; await bekle(bekleme); continue;
        }
        /* Beş denemede de düzelmediyse API gerçekten çökmüş. Kalan tarifleri
           boşuna tüketmek yerine duruyoruz; aynı komut kaldığı yerden devam
           eder çünkü bu tarifler bulunamadı listesine yazılmadı. */
        console.log("\nOpenverse üst üste " + ardArdaSunucuHatasi + " sunucu hatası verdi " +
                    "(" + e.message + "). Kalan " + (secilen.length - i) + " tarif " +
                    "boşuna tüketilmesin diye duruluyor.");
        console.log("Sonra aynı komutu çalıştır — bu tarifler bulunamadı listesine " +
                    "yazılmadığı için kaldığı yerden devam eder.\n");
        break;
      }

      ardArdaSunucuHatasi = 0;
      console.log(etiket.padEnd(50) + "HATA: " + e.message);
    }

    await bekle(1200);
  }

  console.log("");
  console.log("Bulundu: " + bulundu + "   Bulunamadı: " + bulunamadi);
  console.log("Sırada:  powershell -File tools/gorsel-isle.ps1");
  console.log("");
})();
