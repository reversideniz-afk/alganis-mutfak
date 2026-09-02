/* ============================================================================
   TARAYICI DENETİMİ  —  node tools/tarayici.js [--url ...] [--genislik 390]
   ----------------------------------------------------------------------------
   Headless Edge'i başlatır, uygulamayı açar ve içinde JavaScript çalıştırır.
   Ekran görüntüsü bazen yeterli olmuyor: bir öğenin gerçekten görünüp
   görünmediğini ancak getComputedStyle ve elementFromPoint söyler.

   Bağımlılık yok: Edge'in kendi hata ayıklama protokolüyle (CDP) konuşulur,
   Node 24'ün yerleşik WebSocket'i kullanılır. Puppeteer/Playwright gerekmez.

   KULLANIM (kod içinden)
     const T = require("./tarayici.js");
     const t = await T.ac("http://127.0.0.1:8322/");
     const sonuc = await t.calistir("document.title");
     await t.goruntu("cikti.png");
     await t.kapat();
   ========================================================================== */

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EDGE_ADAYLARI = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
];

function tarayiciBul() {
  for (const y of EDGE_ADAYLARI) if (fs.existsSync(y)) return y;
  throw new Error("Edge ya da Chrome bulunamadı.");
}

const bekle = (ms) => new Promise((c) => setTimeout(c, ms));

function jsonAl(port, yol) {
  return new Promise((coz, red) => {
    http.get({ host: "127.0.0.1", port, path: yol }, (c) => {
      let s = "";
      c.on("data", (p) => (s += p));
      c.on("end", () => { try { coz(JSON.parse(s)); } catch (e) { red(e); } });
    }).on("error", red);
  });
}

/**
 * Headless tarayıcıyı başlatıp verilen adresi açar.
 * @param {string} url
 * @param {object} secenek  { genislik, yukseklik, gorunur }
 */
async function ac(url, secenek) {
  secenek = secenek || {};
  const genislik = secenek.genislik || 390;
  const yukseklik = secenek.yukseklik || 844;
  const port = 9222 + Math.floor(Math.random() * 400);
  const profil = path.join(os.tmpdir(), "am-tarayici-" + Date.now());

  const surec = spawn(tarayiciBul(), [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    /* Service worker önbelleği testleri kirletmesin: her açılış temiz profil. */
    "--user-data-dir=" + profil,
    "--remote-debugging-port=" + port,
    "--window-size=" + genislik + "," + yukseklik,
    "about:blank"
  ], { stdio: "ignore" });

  /* Hata ayıklama portunun açılmasını bekle. */
  let hedefler = null;
  for (let i = 0; i < 60 && !hedefler; i++) {
    await bekle(250);
    try { hedefler = await jsonAl(port, "/json/list"); } catch (e) { /* henüz hazır değil */ }
  }
  if (!hedefler) { surec.kill(); throw new Error("Tarayıcı hata ayıklama portu açılmadı."); }

  const sayfa = hedefler.find((h) => h.type === "page");
  if (!sayfa) { surec.kill(); throw new Error("Sayfa hedefi bulunamadı."); }

  const ws = new WebSocket(sayfa.webSocketDebuggerUrl);
  await new Promise((coz, red) => {
    ws.addEventListener("open", coz, { once: true });
    ws.addEventListener("error", () => red(new Error("CDP bağlantısı kurulamadı")), { once: true });
  });

  let sayac = 0;
  const bekleyen = new Map();
  ws.addEventListener("message", (olay) => {
    let ileti;
    try { ileti = JSON.parse(olay.data); } catch (e) { return; }
    if (ileti.id && bekleyen.has(ileti.id)) {
      const { coz, red } = bekleyen.get(ileti.id);
      bekleyen.delete(ileti.id);
      if (ileti.error) red(new Error(ileti.error.message)); else coz(ileti.result);
    }
  });

  function komut(yontem, parametre) {
    const id = ++sayac;
    return new Promise((coz, red) => {
      bekleyen.set(id, { coz, red });
      ws.send(JSON.stringify({ id, method: yontem, params: parametre || {} }));
      setTimeout(() => {
        if (bekleyen.has(id)) { bekleyen.delete(id); red(new Error(yontem + " zaman aşımı")); }
      }, 30000);
    });
  }

  /* Konsol hatalarını topla — sessiz JS hatası en sinsi hata türü. */
  const konsolHatalari = [];
  await komut("Runtime.enable");
  await komut("Log.enable");
  ws.addEventListener("message", (olay) => {
    let m;
    try { m = JSON.parse(olay.data); } catch (e) { return; }
    if (m.method === "Runtime.exceptionThrown") {
      const a = m.params.exceptionDetails;
      konsolHatalari.push((a.exception && a.exception.description) || a.text);
    }
    if (m.method === "Log.entryAdded" && m.params.entry.level === "error") {
      konsolHatalari.push(m.params.entry.text);
    }
  });

  await komut("Page.enable");

  /* Görünüm alanını CDP'den zorluyoruz. --window-size yeni headless modda
     sayfanın innerWidth'ini ayarlamıyor: ölçüm 492 px'e göre yapılırken
     ekran görüntüsü 390 px kesiyordu, bu da olmayan bir taşma varmış gibi
     görünmesine yol açtı. Telefon gibi ölçmek için mobilMi de veriliyor. */
  await komut("Emulation.setDeviceMetricsOverride", {
    width: genislik,
    height: yukseklik,
    deviceScaleFactor: secenek.olcek || 1,
    mobile: secenek.mobilMi !== false
  });

  await komut("Page.navigate", { url });
  await bekle(secenek.bekleme || 2500);

  return {
    /** Sayfada JS çalıştırır, sonucu döndürür. */
    async calistir(ifade) {
      const c = await komut("Runtime.evaluate", {
        expression: ifade,
        returnByValue: true,
        awaitPromise: true
      });
      if (c.exceptionDetails) {
        throw new Error("Sayfada hata: " +
          (c.exceptionDetails.exception && c.exceptionDetails.exception.description ||
           c.exceptionDetails.text));
      }
      return c.result.value;
    },

    async goruntu(hedefDosya) {
      const c = await komut("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(hedefDosya, Buffer.from(c.data, "base64"));
      return hedefDosya;
    },

    async git(yeniUrl, ms) {
      await komut("Page.navigate", { url: yeniUrl });
      await bekle(ms || 2000);
    },

    /** Tıklamadan sonra ölçüm yapmadan önce beklemek için. */
    duraklat: bekle,

    hatalar() { return konsolHatalari.slice(); },

    async kapat() {
      try { ws.close(); } catch (e) {}
      surec.kill();
      await bekle(300);
      try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {}
    }
  };
}

module.exports = { ac };

/* Doğrudan çalıştırılırsa hızlı bir sağlık kontrolü yapar. */
if (require.main === module) {
  (async function () {
    const argv = process.argv.slice(2);
    const deger = (ad, v) => { const i = argv.indexOf(ad); return i !== -1 && argv[i + 1] ? argv[i + 1] : v; };
    const url = deger("--url", "http://127.0.0.1:8322/");
    const genislik = parseInt(deger("--genislik", "390"), 10);

    const t = await ac(url, { genislik: genislik, yukseklik: 844 });
    const ozet = await t.calistir(`(function () {
      return {
        baslik: document.title,
        surum: window.AM && AM.SURUM,
        tarif: window.AM && AM.TARIFLER && AM.TARIFLER.length,
        icGenislik: innerWidth,
        kaydirmaGenisligi: document.documentElement.scrollWidth,
        tasma: document.documentElement.scrollWidth > innerWidth
      };
    })()`);
    console.log("");
    console.log(JSON.stringify(ozet, null, 2));
    const hatalar = t.hatalar();
    console.log("\nKonsol hataları:", hatalar.length ? hatalar : "yok");
    await t.kapat();
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
