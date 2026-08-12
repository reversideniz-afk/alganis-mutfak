/* ============================================================================
   YEREL SUNUCU  —  node tools/sunucu.js
   ----------------------------------------------------------------------------
   Uygulamayı yayınlamadan önce kendi bilgisayarında denemek için.
   Çalıştırdıktan sonra tarayıcıda  http://localhost:8322  adresini aç.
   (Service worker'ın çalışması için dosyayı çift tıklamak yerine bu sunucuyu
   kullanman gerekir; file:// üzerinden çevrimdışı katmanı devreye girmez.)
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const PORT = 8322;

const TIPLER = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

http.createServer((istek, cevap) => {
  let yol = decodeURIComponent(istek.url.split("?")[0]);
  if (yol === "/") yol = "/index.html";

  // Klasör dışına çıkışı engelle
  const tamYol = path.normalize(path.join(KOK, yol));
  if (!tamYol.startsWith(KOK)) {
    cevap.writeHead(403); cevap.end("Yasak");
    return;
  }

  fs.readFile(tamYol, (hata, veri) => {
    if (hata) {
      cevap.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      cevap.end("Bulunamadı: " + yol);
      return;
    }
    cevap.writeHead(200, {
      "Content-Type": TIPLER[path.extname(tamYol).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store, must-revalidate"
    });
    cevap.end(veri);
  });
}).listen(PORT, () => {
  console.log("Alganis Mutfak çalışıyor →  http://localhost:" + PORT);
});
