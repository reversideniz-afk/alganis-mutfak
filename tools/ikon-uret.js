/* ============================================================================
   İKON ÜRETİCİ  —  node tools/ikon-uret.js
   ----------------------------------------------------------------------------
   icons/ klasöründeki PNG dosyalarını sıfırdan çizer. Hiçbir dış kütüphane
   kullanmaz (Node'un kendi zlib'i yeterli). İkonu değiştirmek istersen
   aşağıdaki renkleri ve şekil koordinatlarını düzenleyip tekrar çalıştır.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/* ------------------------------------------------------------- PNG yazıcı */

function crc32(buf) {
  let c, tablo = crc32.tablo;
  if (!tablo) {
    tablo = crc32.tablo = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      tablo[n] = c;
    }
  }
  c = -1;
  for (let i = 0; i < buf.length; i++) c = tablo[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function parca(tip, veri) {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(veri.length, 0);
  const govde = Buffer.concat([Buffer.from(tip, "ascii"), veri]);
  const kontrol = Buffer.alloc(4);
  kontrol.writeUInt32BE(crc32(govde), 0);
  return Buffer.concat([uzunluk, govde, kontrol]);
}

function pngYaz(genislik, yukseklik, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(genislik, 0);
  ihdr.writeUInt32BE(yukseklik, 4);
  ihdr[8] = 8;    // bit derinliği
  ihdr[9] = 6;    // renk tipi: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const satirlar = Buffer.alloc(yukseklik * (genislik * 4 + 1));
  for (let y = 0; y < yukseklik; y++) {
    satirlar[y * (genislik * 4 + 1)] = 0;   // filtre: yok
    rgba.copy(satirlar, y * (genislik * 4 + 1) + 1, y * genislik * 4, (y + 1) * genislik * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    parca("IHDR", ihdr),
    parca("IDAT", zlib.deflateSync(satirlar, { level: 9 })),
    parca("IEND", Buffer.alloc(0))
  ]);
}

/* --------------------------------------------------------------- çizim */

const RENK = {
  bas:    [232, 85, 45],    // #E8552D  domates kırmızısı
  son:    [242, 180, 65],   // #F2B441  safran sarısı
  beyaz:  [255, 250, 244]
};

function karistir(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

/** Yuvarlatılmış dikdörtgen içinde mi? (birim koordinat) */
function kutuIcinde(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const kx = Math.min(Math.max(x, x0 + r), x1 - r);
  const ky = Math.min(Math.max(y, y0 + r), y1 - r);
  const dx = x - kx, dy = y - ky;
  return dx * dx + dy * dy <= r * r;
}

function daireIcinde(x, y, cx, cy, r) {
  const dx = x - cx, dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

/** Tencere + buhar deseni. (x, y) birim kare içinde, olcek ile küçültülür. */
function desenIcinde(x, y, olcek) {
  // içeriği merkeze göre ölçekle
  const px = (x - 0.5) / olcek + 0.5;
  const py = (y - 0.5) / olcek + 0.5;
  if (px < 0 || px > 1 || py < 0 || py > 1) return false;

  // tencere gövdesi
  if (kutuIcinde(px, py, 0.235, 0.505, 0.765, 0.815, 0.075)) return true;
  // kulplar
  if (kutuIcinde(px, py, 0.135, 0.545, 0.245, 0.625, 0.038)) return true;
  if (kutuIcinde(px, py, 0.755, 0.545, 0.865, 0.625, 0.038)) return true;
  // kapak
  if (kutuIcinde(px, py, 0.185, 0.435, 0.815, 0.505, 0.032)) return true;
  // kapak topuzu
  if (daireIcinde(px, py, 0.5, 0.412, 0.042)) return true;

  // buhar: üç dalgalı çizgi
  // Not: yatay mesafe yerine eğriye dik mesafe kullanılıyor; yoksa dalganın
  // dik olduğu yerlerde çizgi kalınlaşıp testere dişi gibi görünüyor.
  const merkezler = [0.345, 0.5, 0.655];
  const genlik = 0.024;
  const periyot = 0.17;
  const k = (Math.PI * 2) / periyot;
  for (let i = 0; i < merkezler.length; i++) {
    const ust = 0.125 + (i === 1 ? 0 : 0.05);
    const alt = 0.375;
    if (py < ust || py > alt) continue;
    const faz = (py - ust) * k;
    const egri = merkezler[i] + genlik * Math.sin(faz);
    const egim = genlik * k * Math.cos(faz);
    const mesafe = Math.abs(px - egri) / Math.sqrt(1 + egim * egim);
    if (mesafe <= 0.019) return true;
  }
  return false;
}

/** Tencerenin içindeki oyuk (gövdenin üst kısmında koyu bir şerit yok, düz) */

function ikonUret(boyut, maskeliMi) {
  const ORNEK = 3;                       // kenar yumuşatma için üst örnekleme
  const veri = Buffer.alloc(boyut * boyut * 4);

  for (let y = 0; y < boyut; y++) {
    for (let x = 0; x < boyut; x++) {
      let zeminKapsam = 0, desenKapsam = 0;

      for (let sy = 0; sy < ORNEK; sy++) {
        for (let sx = 0; sx < ORNEK; sx++) {
          const ux = (x + (sx + 0.5) / ORNEK) / boyut;
          const uy = (y + (sy + 0.5) / ORNEK) / boyut;

          const zeminVar = maskeliMi ? true : kutuIcinde(ux, uy, 0, 0, 1, 1, 0.225);
          if (zeminVar) zeminKapsam++;
          if (zeminVar && desenIcinde(ux, uy, maskeliMi ? 0.66 : 0.86)) desenKapsam++;
        }
      }

      const toplam = ORNEK * ORNEK;
      const i = (y * boyut + x) * 4;

      if (zeminKapsam === 0) { veri[i + 3] = 0; continue; }

      // köşegen gradyan
      const t = Math.min(1, Math.max(0, (x / boyut * 0.55 + y / boyut * 0.45)));
      const zemin = karistir(RENK.bas, RENK.son, t);

      const d = desenKapsam / toplam;
      const renk = karistir(zemin, RENK.beyaz, d);

      veri[i] = renk[0];
      veri[i + 1] = renk[1];
      veri[i + 2] = renk[2];
      veri[i + 3] = Math.round(255 * (zeminKapsam / toplam));
    }
  }
  return pngYaz(boyut, boyut, veri);
}

/* ---------------------------------------------------------------- çalıştır */

const klasor = path.join(__dirname, "..", "icons");
fs.mkdirSync(klasor, { recursive: true });

const uretilecek = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-maskable-512.png", 512, true]
];

for (const [ad, boyut, maskeli] of uretilecek) {
  const dosya = path.join(klasor, ad);
  fs.writeFileSync(dosya, ikonUret(boyut, maskeli));
  console.log("yazıldı:", ad, "(" + boyut + "x" + boyut + ")");
}
