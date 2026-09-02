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

1. `node tools/gorsel-istek.js --hepsi` → `gorseller/_istekler.txt` + `.csv` (öncelik sırası: kategori kapakları → "vitrin" tarifleri → gövde).
2. `node tools/fooocus-uret.js --parti 50` → Fooocus'u sürüp ham görselleri `gorseller/_ham/<tarif-id>.png` yazar. **Fooocus açık olmalı** (`http://127.0.0.1:7865`). Ayarları (model, stil, oran) araç değil Fooocus arayüzü belirler — araç arayüzün o anki durumunu okuyup yalnızca istemi değiştirir. Görsel başına ~2,5 dk. `--incele` eşlemeyi gösterir, `--deneme` tek görsel üretir.
   **Her 50 görselde dur ve devam için kullanıcıdan izin iste** — üretim kullanıcının GPU'sunu saatlerce meşgul ediyor, ne kadar süre bağlanacağına o karar veriyor. `--hepsi` bayrağını kendiliğinden kullanma.

   **Uzun üretimi oturuma bağlama.** Arka plan görevi olarak başlatırsan oturum kapanınca ölebilir. Bunun yerine ayrı süreç olarak başlat:
   ```powershell
   Start-Process -FilePath "node" -ArgumentList "tools/fooocus-uret.js","--parti","50" `
     -WorkingDirectory "$PWD" -WindowStyle Hidden `
     -RedirectStandardOutput "$PWD\gorseller\_uretim.log" `
     -RedirectStandardError "$PWD\gorseller\_uretim-hata.log"
   ```
   Durum kontrolü (yeni oturumda ilk bakılacak yer): `Get-Content gorseller\_uretim.log -Tail 5` ve `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like "*fooocus-uret*" }`. Süreç yoksa parti bitmiş ya da durmuş demektir; aynı komut kaldığı yerden devam eder.

   Üretim yavaşsa sebep genelde GPU'yu paylaşan başka bir uygulamadır (oyun vb.), Fooocus'ta sorun değil.
3. `powershell -File tools/gorsel-isle.ps1` → 4:3 kırpar, 800×600 JPEG q78 olarak `gorseller/<tarif-id>.jpg` yazar (System.Drawing, kurulum gerektirmez).
4. `node tools/veri-kontrol.js` görsel sayısını raporlar ve yanlış adlandırılmış dosyaları yakalar.

Kurallar: `gorseller/*.jpg` commit **edilir**; `_ham/` ve `_istekler.*` edilmez. Eksik görsel hata değildir — `gorsel.js` SVG portreye düşer, kart boş kalmaz. Service worker tarif görsellerini önden indirmez, yalnızca kapakları; kalanı görüldükçe önbelleğe alınır. `tools/malzeme-en.js` istem üretiminde kullanılan İngilizce sözlüktür, **uygulamaya dahil değildir** (yeni malzeme eklersen oraya da bir satır ekle).

## Test/doğrulama yaklaşımı

Arayüze dokunan her değişiklikten sonra:

```
node tools/sunucu.js          (ayrı pencerede, açık kalsın)
node tools/arayuz-testi.js
```

`tools/tarayici.js` headless Edge'i CDP ile sürer (bağımlılık yok, Node'un yerleşik WebSocket'i). `tools/arayuz-testi.js` bunun üstünde 18 kontrol çalıştırır: dört ekranın gerçekten çizildiği, `[hidden]` öğelerin CSS tarafından ezilmediği, panel/pişirme modunun açıldığı, üç genişlikte yatay taşma olmadığı, dokunma hedeflerinin ≥32px olduğu ve konsolun temiz olduğu.

Kendi kodundan kullanmak için: `const t = await require("./tools/tarayici.js").ac(url); await t.calistir("...")`, `t.goruntu("x.png")`, `t.duraklat(ms)`, `t.hatalar()`.

Dikkat edilecekler:
- **Tıklama ile ölçümü ayrı adımlarda yap** — aynı ifadede ölçersen ekran yeniden çizilmeden ölçer, her şey 0px görünür.
- Alt menü düğmesini seçerken `.menu-btn[data-git="..."]` kullan; `data-git` bilgi kartlarının içindeki gizli düğmelerde de var.
- Görünüm alanını `--window-size` değil `Emulation.setDeviceMetricsOverride` belirler (araç bunu zaten yapıyor).
- **CSP satır içi stili engeller**: `setAttribute("style", ...)` sessizce iptal edilir. `el()` yardımcısının `stil: { ... }` alanını kullan, CSSOM ile atar.
- Renk paleti/tema değişikliklerinde WCAG 4.5:1 kontrastı programatik hesapla, tahmin etme.

## Durum (özet — detaylar için git log)

869 tarif, 242 malzeme, 11 mutfak kategorisi, 8 öğün grubu (Bugün ekranı). Ayarlarda 6 renk paleti + yüksek kontrast, tema (gün ışığı/gece/sistem), yazı boyutu, ölçü cetveli var. Malzeme/favori seçimleri katalogla karşılaştırılmadan saklanır (veri kaybını önlemek için — bkz. `js/depo.js` başındaki not). Güncel sürüm: `data/surum.js` → `AM.SURUM`.
