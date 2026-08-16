/* ============================================================================
   SERVICE WORKER — çevrimdışı çalışma ve sessiz güncelleme

   NASIL ÇALIŞIR
   İlk ziyarette aşağıdaki bütün dosyalar telefona indirilir. Sonrasında
   uygulama internete hiç ihtiyaç duymadan açılır.

   YENİ SÜRÜM YAYINLARKEN (ÖNEMLİ)
     1) Aşağıdaki SURUM değerini artır  →  örn. "1.0.0" yerine "1.1.0"
     2) data/surum.js içindeki AM.SURUM değerini de aynı yap
     3) Yeni bir veri dosyası eklediysen DOSYALAR listesine ekle
   Bunu yapıp GitHub'a gönderdiğinde, kullanıcıların telefonu yeni sürümü
   arka planda indirir ve "Yeni tarifler hazır!" bildirimi çıkar. Link
   değişmez, kimsenin bir şey yüklemesi gerekmez.
   ========================================================================== */

const SURUM = "2.1.2";
const ONBELLEK = "alganis-mutfak-v" + SURUM;

const DOSYALAR = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./data/malzemeler.js",
  "./data/tarifler-corba.js",
  "./data/tarifler-corba-2.js",
  "./data/tarifler-corba-3.js",
  "./data/tarifler-sebze.js",
  "./data/tarifler-sebze-2.js",
  "./data/tarifler-sebze-3.js",
  "./data/tarifler-etli.js",
  "./data/tarifler-etli-2.js",
  "./data/tarifler-etli-3.js",
  "./data/tarifler-tavuk-balik.js",
  "./data/tarifler-tavuk-balik-2.js",
  "./data/tarifler-tavuk-balik-3.js",
  "./data/tarifler-bakliyat.js",
  "./data/tarifler-bakliyat-2.js",
  "./data/tarifler-bakliyat-3.js",
  "./data/tarifler-pilav-makarna.js",
  "./data/tarifler-pilav-makarna-2.js",
  "./data/tarifler-pilav-makarna-3.js",
  "./data/tarifler-hamur.js",
  "./data/tarifler-hamur-2.js",
  "./data/tarifler-hamur-3.js",
  "./data/tarifler-kahvalti.js",
  "./data/tarifler-kahvalti-2.js",
  "./data/tarifler-kahvalti-3.js",
  "./data/tarifler-salata-meze.js",
  "./data/tarifler-salata-meze-2.js",
  "./data/tarifler-salata-meze-3.js",
  "./data/tarifler-tatli.js",
  "./data/tarifler-tatli-2.js",
  "./data/tarifler-tatli-3.js",
  "./data/surum.js",
  "./js/depo.js",
  "./js/eslestir.js",
  "./js/arayuz.js",
  "./js/uygulama.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

/* --- kurulum: bütün dosyaları önbelleğe al -------------------------------
   Dosyalar TEK TEK indiriliyor. cache.addAll() atomiktir: tek bir dosya
   inmezse hiçbiri kaydedilmez ve kullanıcı çevrimdışı açamaz hale gelir.
   Zayıf bağlantıda ilk kurulumun yarım kalmaması için her dosya ayrı
   deneniyor; inmeyenler zaten fetch olayında ilk kullanımda tamamlanır. */
async function dosyalariIndir() {
  const onbellek = await caches.open(ONBELLEK);
  const basarisiz = [];

  await Promise.all(DOSYALAR.map(async (yol) => {
    try {
      const cevap = await fetch(yol, { cache: "reload" });
      if (cevap && cevap.ok) await onbellek.put(yol, cevap);
      else basarisiz.push(yol);
    } catch (e) {
      basarisiz.push(yol);
    }
  }));

  if (basarisiz.length) {
    console.warn("[Alganis Mutfak] önbelleğe alınamayan dosyalar:", basarisiz);
  }
  return basarisiz;
}

self.addEventListener("install", (olay) => {
  olay.waitUntil(dosyalariIndir());
});

/* --- etkinleşme: eski sürümlerin önbelleğini temizle ---------------------- */
self.addEventListener("activate", (olay) => {
  olay.waitUntil(
    caches.keys()
      .then((adlar) => Promise.all(
        adlar.filter((ad) => ad.startsWith("alganis-mutfak-v") && ad !== ONBELLEK)
             .map((ad) => caches.delete(ad))
      ))
      .then(() => self.clients.claim())
  );
});

/* --- istekler: önce önbellek, sonra ağ ----------------------------------- */
self.addEventListener("fetch", (olay) => {
  const istek = olay.request;

  // Sadece bu uygulamanın kendi dosyaları. Başka hiçbir adrese gidilmez.
  if (istek.method !== "GET") return;
  if (new URL(istek.url).origin !== self.location.origin) return;

  // Sayfa gezinmeleri: ağ önce, olmazsa önbellekteki index.html
  if (istek.mode === "navigate") {
    olay.respondWith(
      fetch(istek)
        .then((cevap) => {
          const kopya = cevap.clone();
          caches.open(ONBELLEK).then((o) => o.put("./index.html", kopya));
          return cevap;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Diğer dosyalar: önbellekte varsa oradan ver (çevrimdışı da çalışsın)
  olay.respondWith(
    caches.match(istek).then((bulunan) => {
      if (bulunan) return bulunan;
      return fetch(istek).then((cevap) => {
        if (cevap && cevap.status === 200 && cevap.type === "basic") {
          const kopya = cevap.clone();
          caches.open(ONBELLEK).then((o) => o.put(istek, kopya));
        }
        return cevap;
      });
    })
  );
});

/* --- uygulamadan gelen "hemen geç" mesajı -------------------------------- */
self.addEventListener("message", (olay) => {
  if (olay.data && olay.data.tip === "HEMEN_GEC") self.skipWaiting();
});
