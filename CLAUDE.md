# Alganis Mutfak

Annem için hazırlanan, "bugün ne pişirsem?" web uygulaması. Mobil öncelikli, çevrimdışı çalışan bir PWA. GitHub Pages'te yayında: **https://reversideniz-afk.github.io/alganis-mutfak/** (repo: `reversideniz-afk/alganis-mutfak`).

## Kesin kurallar

- **Her şey Türkçe**: arayüz metni, kod yorumları, değişken/fonksiyon adları.
- **Güvenlik birincil öncelik**: uygulama sebze/meyve/malzeme dışında kullanıcıdan HİÇBİR veri toplamaz. `index.html`'deki CSP tüm dış bağlantıları engeller. **`innerHTML` asla kullanılmaz** — her DOM düğümü `js/arayuz.js`'teki `el()` yardımcısıyla kurulur. Veri sadece `localStorage`'da kalır, cihazdan çıkmaz.
- **Bağımlılık yok**: saf JS, build adımı yok, düz `<script>` etiketleri, global `AM` ad alanı. `file://` üzerinden de çalışmalı.

## Sürüm yayınlama prosedürü (ÖNEMLİ — atlanırsa kullanıcıların telefonu güncellenmez)

1. `data/surum.js` → `AM.SURUM` değerini artır.
2. `sw.js` → `SURUM` sabitini AYNI değere getir.
3. Yeni bir veri dosyası eklendiyse `sw.js` içindeki `DOSYALAR` listesine ekle.
4. `node tools/veri-kontrol.js` çalıştır — "SORUN YOK" çıkmadan asla push atma.
5. Commit + `git push origin main`. Link değişmez, kullanıcı bir şey yapmaz; SW arka planda güncelleyip "Yeni tarifler hazır!" bildirimi çıkarır.

## Geliştirme sunucusu

`node tools/sunucu.js` → port **8322**. Farklı origin/port kullanma: service worker cache-first çalıştığı için eski dosyaları önbellekte tutabilir; test ederken SW'yi unregister edip cache temizlemek gerekebilir. `Ctrl+Shift+R` SW'yi bypass ETMEZ — sürüm numarası bump edilmeden değişiklik telefona/tarayıcıya yansımaz.

## Veri şeması

- `data/malzemeler.js`: `[ id, "Görünen ad", "kategori", temelMi(0/1), "arama takma adları" ]`
- `data/tarifler-*.js`: her dosya `AM.TARIFLER = (AM.TARIFLER||[]).concat([...])`. Tarif alanları `data/tarifler-corba.js` başında belgeli: `m` satırı = `["id"|"id1|id2", miktar|null, "birim", rol("ana"/"yrd"/"ops"), "not"]`.
- Yeni tarif eklerken **önce internetten güvenilir ölçü/oran araştır**, uydurma oran yazma.
- Yeni bir "ara sıcak" tarifi eklersen `data/surum.js` → `AM.ARA_SICAKLAR` listesine id'sini ekle (yoksa "Bugün" ekranında yanlış grupta görünür); `veri-kontrol.js` bu listedeki yazım hatalarını yakalar.
- Değişiklikten sonra HER ZAMAN `node tools/veri-kontrol.js` çalıştır.

## Görsel üretim hattı

Tarif görselleri elle üretiliyor (Nano Banana Pro / yerel Fooocus) ve depoda duruyor — dış bağlantı yok.

1. `node tools/gorsel-istek.js --parti 50` → `gorseller/_istekler.txt` (öncelik sırası: kategori kapakları → "vitrin" tarifleri → gövde).
2. Üretilen ham dosyalar `gorseller/_ham/<tarif-id>.png` — **dosya adı tarif id'siyle birebir aynı olmalı**, hattın geri kalanı buna bakıyor.
3. `powershell -File tools/gorsel-isle.ps1` → 4:3 kırpar, 800×600 JPEG q78 olarak `gorseller/<tarif-id>.jpg` yazar (System.Drawing, kurulum gerektirmez).
4. `node tools/veri-kontrol.js` görsel sayısını raporlar ve yanlış adlandırılmış dosyaları yakalar.

Kurallar: `gorseller/*.jpg` commit **edilir**; `_ham/` ve `_istekler.*` edilmez. Eksik görsel hata değildir — `gorsel.js` SVG portreye düşer, kart boş kalmaz. Service worker tarif görsellerini önden indirmez, yalnızca kapakları; kalanı görüldükçe önbelleğe alınır. `tools/malzeme-en.js` istem üretiminde kullanılan İngilizce sözlüktür, **uygulamaya dahil değildir** (yeni malzeme eklersen oraya da bir satır ekle).

## Test/doğrulama yaklaşımı

Bu ortamda ekran görüntüsü bazen çalışmıyor — `document.elementFromPoint()` + `getComputedStyle(el).display` ile neyin gerçekten göründüğünü doğrula, `[hidden]` öğelerin CSS tarafından ezilmediğinden emin ol. Renk paleti/tema değişikliklerinde WCAG 4.5:1 kontrastı programatik hesapla, tahmin etme.

## Durum (özet — detaylar için git log)

869 tarif, 242 malzeme, 11 mutfak kategorisi, 8 öğün grubu (Bugün ekranı). Ayarlarda 6 renk paleti + yüksek kontrast, tema (gün ışığı/gece/sistem), yazı boyutu, ölçü cetveli var. Malzeme/favori seçimleri katalogla karşılaştırılmadan saklanır (veri kaybını önlemek için — bkz. `js/depo.js` başındaki not). Güncel sürüm: `data/surum.js` → `AM.SURUM`.
