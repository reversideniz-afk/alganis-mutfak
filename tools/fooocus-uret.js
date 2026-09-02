/* ============================================================================
   FOOOCUS TOPLU GÖRSEL ÜRETİMİ
     node tools/fooocus-uret.js --incele        → arayüz eşlemesini gösterir
     node tools/fooocus-uret.js --deneme        → tek görsel üretir (test)
     node tools/fooocus-uret.js --parti 50      → sıradaki 50 görseli üretir
     node tools/fooocus-uret.js --hepsi         → eksik olan her şeyi üretir
   ----------------------------------------------------------------------------
   NASIL ÇALIŞIYOR
   Fooocus bir Gradio uygulaması ve isimli API ucu tanımlamıyor; üretim
   fonksiyonu 153 konumsal parametre alıyor. Bu 153 değeri elle kurmak yerine
   Gradio'nun /config çıktısından arayüzün O ANKİ değerlerini okuyoruz ve
   yalnızca istem alanını değiştiriyoruz.

   Bunun anlamı: Fooocus arayüzünde ne ayarladıysan (model, stil, en-boy oranı,
   kalite) aynen kullanılır. Ayarı buradan değil, Fooocus arayüzünden yap.

   ÖNEMLİ: Fooocus açık ve http://127.0.0.1:7865 üzerinde çalışıyor olmalı.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const http = require("http");
const vm = require("vm");

const SUNUCU = process.env.FOOOCUS_ADRES || "http://127.0.0.1:7865";
const kok = path.join(__dirname, "..");
const hamKlasor = path.join(kok, "gorseller", "_ham");

/* ========================================================== küçük yardımcılar */

function istek(yol, govde) {
  return new Promise((coz, red) => {
    const url = new URL(yol, SUNUCU);
    const veri = govde ? Buffer.from(JSON.stringify(govde)) : null;
    const r = http.request(
      {
        hostname: url.hostname, port: url.port, path: url.pathname + url.search,
        method: govde ? "POST" : "GET",
        headers: govde
          ? { "Content-Type": "application/json", "Content-Length": veri.length }
          : {}
      },
      (cevap) => {
        const parcalar = [];
        cevap.on("data", (p) => parcalar.push(p));
        cevap.on("end", () => {
          const metin = Buffer.concat(parcalar).toString("utf8");
          try { coz(JSON.parse(metin)); } catch (e) { coz(metin); }
        });
      }
    );
    r.on("error", red);
    if (veri) r.write(veri);
    r.end();
  });
}

function indir(yol, hedef) {
  return new Promise((coz, red) => {
    const url = new URL(yol, SUNUCU);
    http.get(url, (cevap) => {
      if (cevap.statusCode !== 200) { red(new Error("HTTP " + cevap.statusCode)); return; }
      const dosya = fs.createWriteStream(hedef);
      cevap.pipe(dosya);
      dosya.on("finish", () => dosya.close(() => coz()));
    }).on("error", red);
  });
}

const bekle = (ms) => new Promise((c) => setTimeout(c, ms));

/* ================================================== Gradio arayüz durumu oku */

/* Fooocus ayakta mı? Toplu üretim sırasında da kullanılıyor: bağlantı koparsa
   araç ölmek yerine burada bekliyor. */
async function ayaktaMi() {
  try {
    const y = await istek("/config");
    return !!(y && y.dependencies);
  } catch (e) {
    return false;
  }
}

async function ayagaKalkmasiniBekle(enFazlaDakika) {
  const bitis = Date.now() + enFazlaDakika * 60 * 1000;
  let duyuruldu = false;
  while (Date.now() < bitis) {
    if (await ayaktaMi()) {
      if (duyuruldu) console.log("Fooocus geri geldi, devam ediliyor.");
      return true;
    }
    if (!duyuruldu) {
      console.log("Fooocus'a ulaşılamıyor — geri gelmesi bekleniyor…");
      duyuruldu = true;
    }
    await bekle(15000);
  }
  return false;
}

async function arayuzDurumu() {
  let yapilandirma = null;
  try {
    yapilandirma = await istek("/config");
  } catch (e) {
    /* Bağlantı hatasını yutup aşağıdaki anlaşılır mesajı veriyoruz —
       ham ECONNREFUSED kullanıcıya ne yapması gerektiğini söylemiyor. */
  }
  if (!yapilandirma || !yapilandirma.dependencies) {
    throw new Error(
      "Fooocus'a ulaşılamadı (" + SUNUCU + ").\n" +
      "  Fooocus'u başlat, arayüz tarayıcıda açıldıktan sonra bu komutu tekrar çalıştır.\n" +
      "  Farklı porttaysa:  set FOOOCUS_ADRES=http://127.0.0.1:PORT"
    );
  }

  const bilesenler = {};
  yapilandirma.components.forEach((b) => { bilesenler[b.id] = b; });

  /* Zincirin üç halkasını sürüm bağımsız kurallarla buluyoruz:
       görev  → en çok girdi alan backend fonksiyonu (bütün ayarları o okur)
       üretim → tek girdisi, görev fonksiyonunun çıkardığı state olan fonksiyon
       başlat → aynı state'i çıktı veren, girdisiz "click" fonksiyonu           */
  let gorevIx = -1, enCok = 0;
  yapilandirma.dependencies.forEach((d, i) => {
    if (d.backend_fn && d.inputs.length > enCok) { enCok = d.inputs.length; gorevIx = i; }
  });
  if (gorevIx === -1) throw new Error("Görev fonksiyonu bulunamadı.");

  const gorevState = yapilandirma.dependencies[gorevIx].outputs[0];
  const galeriVar = (d) => d.outputs.some(
    (id) => bilesenler[id] && bilesenler[id].type === "gallery");

  /* Üretim: görev state'ini alıp galeri döndüren fonksiyon. Galeri şartı
     olmadan aynı state'i alan başka handler'lar da eşleşiyor. */
  const uretimIx = yapilandirma.dependencies.findIndex(
    (d) => d.backend_fn && d.inputs.length === 1 &&
           d.inputs[0] === gorevState && galeriVar(d));
  if (uretimIx === -1) throw new Error("Üretim fonksiyonu bulunamadı.");

  /* Başlat: Generate düğmesinin kendisi — girdisiz, hem state hem galeri sıfırlar. */
  const baslatIx = yapilandirma.dependencies.findIndex(
    (d) => d.backend_fn && d.trigger === "click" && d.inputs.length === 0 &&
           d.outputs.indexOf(gorevState) !== -1 && galeriVar(d));
  if (baslatIx === -1) throw new Error("Başlatma fonksiyonu bulunamadı.");

  const girdiler = yapilandirma.dependencies[gorevIx].inputs.map((id, sira) => {
    const b = bilesenler[id] || {};
    const p = b.props || {};
    return {
      sira: sira,
      id: id,
      tur: b.type || "?",
      etiket: p.label || null,
      elemId: b.elem_id || null,
      deger: p.value === undefined ? null : p.value
    };
  });

  return {
    baslatIx: baslatIx, gorevIx: gorevIx, uretimIx: uretimIx,
    girdiler: girdiler, surum: yapilandirma.version
  };
}

/* İstem kutusunu bul: Fooocus'ta pozitif istem, "prompt" elem_id'li ya da
   ilk sıradaki metin kutusudur. Negatif istemle karıştırmamak için elem_id
   ve etikete birlikte bakıyoruz. */
function istemAlaniniBul(girdiler) {
  let aday = girdiler.find((g) => g.elemId === "positive_prompt");
  if (aday) return aday;
  aday = girdiler.find((g) => g.tur === "textbox" && /^prompt$/i.test(g.etiket || ""));
  if (aday) return aday;
  /* Son çare: ilk metin kutusu — Fooocus'ta arayüzün en üstündeki büyük kutu. */
  return girdiler.find((g) => g.tur === "textbox");
}

/* ============================================================ üretim çağrısı */

/* Her üretimde uygulanan negatif istem — tarif görsellerinde istemediklerimiz. */
const NEGATIF = "text, watermark, logo, hands, people, plastic, oversaturated, " +
                "blurry, cluttered cutlery, fine dining plating";

/* Etiketine göre bir girdinin değerini değiştir. Sıra numarası yerine etiket
   kullanıyoruz: Fooocus sürüm değiştirdiğinde sıra kayar, etiket kaymaz. */
function etiketleAyarla(girdiler, veri, etiket, yeniDeger) {
  const alan = girdiler.find((g) => g.etiket === etiket);
  if (alan) { veri[alan.sira] = yeniDeger; return true; }
  return false;
}

async function uret(durum, istemMetni) {
  const veri = durum.girdiler.map((g) => g.deger);
  const istemAlani = istemAlaniniBul(durum.girdiler);
  if (!istemAlani) throw new Error("İstem alanı bulunamadı.");
  veri[istemAlani.sira] = istemMetni;

  /* İstem başına tek görsel — Fooocus varsayılanı 2, bu süreyi ikiye katlar. */
  etiketleAyarla(durum.girdiler, veri, "Image Number", 1);
  etiketleAyarla(durum.girdiler, veri, "Negative Prompt", NEGATIF);

  const oturum = "am" + Math.random().toString(36).slice(2, 12);

  /* Fooocus'ta üretim tek çağrı değil, üç halkalı bir zincir:
       fn 65  Generate düğmesi — arayüzü sıfırlar, oturum durumunu hazırlar
       fn 67  get_task        — 153 ayarı okuyup görev nesnesini state'e yazar
       fn 68  generate_clicked — asıl üretim; son çıktısı galeri
     Üçü de AYNI session_hash ile çağrılmalı: görev nesnesi sunucu tarafında
     o oturuma bağlı tutuluyor. Sadece 67'yi çağırmak görevi kurar ama hiçbir
     şey üretmez. */
  await cagir(durum.baslatIx, [], oturum, 60 * 1000);
  await cagir(durum.gorevIx, veri, oturum, 60 * 1000);
  const cikti = await cagir(durum.uretimIx, [null], oturum, 20 * 60 * 1000);
  return cikti;
}

/* Tek bir Gradio fonksiyonunu kuyruğa atıp sonucunu bekler.
   Gradio 3.41 kuyruğu WebSocket üzerinden yürüyor (SSE Gradio 4 ile geldi):
   send_hash → oturum gönder → send_data → veri gönder → process_completed
   Node 24'ün yerleşik WebSocket'i kullanılıyor; ek paket yok. */
function cagir(fnIndex, veri, oturum, sure) {
  return new Promise((coz, red) => {
    const ws = new WebSocket(SUNUCU.replace(/^http/, "ws") + "/queue/join");
    let bitti = false;

    const kapat = (hata, sonuc) => {
      if (bitti) return;
      bitti = true;
      try { ws.close(); } catch (e) { /* zaten kapalı */ }
      if (hata) red(hata); else coz(sonuc);
    };

    /* Takılan bir üretim toplu işi sonsuza kadar bekletmesin. */
    const zamanAsimi = setTimeout(
      () => kapat(new Error("zaman aşımı (" + Math.round(sure / 60000) + " dk)")), sure);

    ws.addEventListener("message", (olay) => {
      let ileti;
      try { ileti = JSON.parse(olay.data); } catch (e) { return; }

      if (ileti.msg === "send_hash") {
        ws.send(JSON.stringify({ fn_index: fnIndex, session_hash: oturum }));
      } else if (ileti.msg === "send_data") {
        ws.send(JSON.stringify({
          fn_index: fnIndex,
          session_hash: oturum,
          data: veri,
          event_data: null
        }));
      } else if (ileti.msg === "process_completed") {
        clearTimeout(zamanAsimi);
        if (ileti.success === false) {
          kapat(new Error((ileti.output && ileti.output.error) || "üretim başarısız"));
        } else {
          kapat(null, ileti.output && ileti.output.data);
        }
      }
    });

    ws.addEventListener("error", () => {
      clearTimeout(zamanAsimi);
      kapat(new Error("WebSocket bağlantı hatası — Fooocus kapandı mı?"));
    });
    ws.addEventListener("close", () => {
      clearTimeout(zamanAsimi);
      kapat(new Error("bağlantı beklenmedik şekilde kapandı"));
    });
  });
}

/* Sonuç verisinden görsel dosya yolunu çıkar (Gradio galeri biçimi).
   Üretim fonksiyonunun çıktısı [html, önizleme, ara galeri, son galeri];
   SONDAN başa tarıyoruz ki ara adımın önizleme karesi değil, bitmiş görsel
   alınsın. */
function gorselYolunuBul(cikti) {
  const bul = (d) => {
    if (!d) return null;
    if (typeof d === "string") return /\.(png|jpg|jpeg|webp)$/i.test(d) ? d : null;
    if (Array.isArray(d)) {
      for (let i = d.length - 1; i >= 0; i--) { const s = bul(d[i]); if (s) return s; }
      return null;
    }
    if (typeof d === "object") {
      if (typeof d.name === "string" && /\.(png|jpg|jpeg|webp)$/i.test(d.name)) return d.name;
      if (typeof d.path === "string" && /\.(png|jpg|jpeg|webp)$/i.test(d.path)) return d.path;
      const anahtarlar = Object.keys(d);
      for (let i = anahtarlar.length - 1; i >= 0; i--) {
        const s = bul(d[anahtarlar[i]]); if (s) return s;
      }
    }
    return null;
  };
  return Array.isArray(cikti) ? bul(cikti) : bul([cikti]);
}

/* ====================================================== iş listesini yükle */

function isListesi() {
  const csv = path.join(kok, "gorseller", "_istekler.csv");
  if (!fs.existsSync(csv)) {
    throw new Error("gorseller/_istekler.csv yok. Önce: node tools/gorsel-istek.js --hepsi");
  }
  return fs.readFileSync(csv, "utf8").split("\n")
    .map((s) => s.trim()).filter(Boolean)
    .map((satir) => {
      const ix = satir.indexOf(";");
      return { id: satir.slice(0, ix), istem: satir.slice(ix + 1) };
    });
}

/* ==================================================================== ana akış */

(async function () {
  const argv = process.argv.slice(2);
  const bayrak = (ad) => argv.indexOf(ad) !== -1;
  const sayi = (ad, varsayilan) => {
    const i = argv.indexOf(ad);
    return i !== -1 && argv[i + 1] ? parseInt(argv[i + 1], 10) : varsayilan;
  };

  let durum;
  try {
    durum = await arayuzDurumu();
  } catch (e) {
    console.error("\n" + e.message + "\n");
    process.exit(1);
  }

  /* --- inceleme modu --- */
  if (bayrak("--incele")) {
    const istemAlani = istemAlaniniBul(durum.girdiler);
    console.log("");
    console.log("Gradio sürümü     :", durum.surum);
    console.log("Zincir            : başlat fn=" + durum.baslatIx +
                " → görev fn=" + durum.gorevIx + " → üretim fn=" + durum.uretimIx);
    console.log("Girdi sayısı      :", durum.girdiler.length);
    console.log("");
    console.log("İstem alanı olarak seçilen:");
    console.log("  sıra   :", istemAlani.sira);
    console.log("  tür    :", istemAlani.tur);
    console.log("  etiket :", istemAlani.etiket);
    console.log("  elem_id:", istemAlani.elemId);
    console.log("  değer  :", JSON.stringify(String(istemAlani.deger || "")).slice(0, 80));
    console.log("");
    console.log("İlk 14 girdi (arayüzün o anki durumu):");
    durum.girdiler.slice(0, 14).forEach((g) => {
      const d = JSON.stringify(g.deger);
      console.log("  " + String(g.sira).padStart(3) + "  " + (g.tur || "?").padEnd(12) +
                  (g.etiket || g.elemId || "-").padEnd(26) +
                  (d === undefined ? "null" : d.slice(0, 40)));
    });
    console.log("");
    return;
  }

  if (!fs.existsSync(hamKlasor)) fs.mkdirSync(hamKlasor, { recursive: true });

  /* --- deneme modu: tek görsel --- */
  if (bayrak("--deneme")) {
    const isler = isListesi();
    const is = isler[0];
    console.log("\nDeneme üretimi:", is.id);
    console.log("İstem:", is.istem.slice(0, 90) + "…\n");
    const t0 = Date.now();
    const cikti = await uret(durum, is.istem);
    const yol = gorselYolunuBul(cikti);
    if (!yol) {
      console.log("Üretim bitti ama görsel yolu okunamadı. Ham çıktı:");
      console.log(JSON.stringify(cikti).slice(0, 600));
      process.exit(1);
    }
    const hedef = path.join(hamKlasor, is.id + ".png");
    await indir("/file=" + yol, hedef);
    const kb = Math.round(fs.statSync(hedef).size / 1024);
    console.log("Tamam:", path.relative(kok, hedef), "(" + kb + " KB, " +
                Math.round((Date.now() - t0) / 1000) + " sn)");
    console.log("\nGörseli aç, beğendiysen:  node tools/fooocus-uret.js --hepsi\n");
    return;
  }

  /* --- toplu üretim --- */
  const isler = isListesi();
  /* Varsayılan parti 50: üretim kullanıcının GPU'sunu görsel başına ~2,5 dk
     meşgul ediyor, o yüzden partiler arasında onay alınıyor (bkz. CLAUDE.md). */
  const sinir = bayrak("--hepsi") ? isler.length : sayi("--parti", 50);

  /* İki yerde birden bakıyoruz: henüz işlenmemiş ham dosya (_ham/) ve
     işlenip yerine konmuş son görsel (gorseller/). İkincisi olmazsa
     gorsel-isle.ps1 ham dosyayı _bitti/'ye taşıdıktan sonra araç aynı
     görseli yeniden üretmeye kalkardı. */
  const bitmisKlasor = path.join(kok, "gorseller");
  const yapilacak = isler.filter((is) =>
    !fs.existsSync(path.join(hamKlasor, is.id + ".png")) &&
    !fs.existsSync(path.join(bitmisKlasor, is.id + ".jpg"))
  ).slice(0, sinir);

  if (!yapilacak.length) {
    console.log("\nListedeki her görsel zaten üretilmiş.\n");
    return;
  }

  console.log("");
  console.log("Fooocus       :", SUNUCU);
  console.log("Üretilecek    :", yapilacak.length);
  console.log("Klasör        : gorseller/_ham/");
  console.log("");

  let basarili = 0, basarisiz = 0;
  const baslangic = Date.now();

  for (let i = 0; i < yapilacak.length; i++) {
    const is = yapilacak[i];
    const etiket = "[" + (i + 1) + "/" + yapilacak.length + "] " + is.id;
    const t0 = Date.now();
    let oldu = false;

    /* Saatler süren gözetimsiz bir çalışmada tek bir aksama her şeyi
       düşürmesin: üç deneme, arada Fooocus'un geri gelmesini bekleyerek. */
    for (let deneme = 1; deneme <= 3 && !oldu; deneme++) {
      try {
        const cikti = await uret(durum, is.istem);
        const yol = gorselYolunuBul(cikti);
        if (!yol) throw new Error("görsel yolu okunamadı");
        await indir("/file=" + yol, path.join(hamKlasor, is.id + ".png"));
        const sn = Math.round((Date.now() - t0) / 1000);
        console.log(etiket.padEnd(50) + sn + " sn" + (deneme > 1 ? "  (" + deneme + ". deneme)" : ""));
        basarili++;
        oldu = true;
      } catch (e) {
        if (deneme === 3) {
          console.log(etiket.padEnd(50) + "HATA: " + e.message);
          basarisiz++;
        } else if (!(await ayaktaMi())) {
          /* Fooocus kapandı ya da yeniden başlıyor — 30 dakikaya kadar bekle. */
          const geldi = await ayagaKalkmasiniBekle(30);
          if (!geldi) {
            console.log("\nFooocus 30 dakikadır kapalı. Üretim durduruldu.");
            console.log("Fooocus'u açıp aynı komutu çalıştır — kaldığı yerden devam eder.\n");
            i = yapilacak.length;
            break;
          }
        } else {
          await bekle(5000);
        }
      }
    }
    await bekle(300);
  }

  const dk = Math.round((Date.now() - baslangic) / 60000);
  console.log("");
  console.log("Üretilen: " + basarili + "   Hata: " + basarisiz + "   Süre: " + dk + " dk");
  console.log("Sırada:  powershell -File tools/gorsel-isle.ps1");
  console.log("");
})();
