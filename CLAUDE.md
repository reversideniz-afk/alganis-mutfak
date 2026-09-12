# Alganis Mutfak

Annem için hazırlanan, "bugün ne pişirsem?" web uygulaması. Mobil öncelikli, çevrimdışı çalışan bir PWA. GitHub Pages'te yayında: **https://reversideniz-afk.github.io/alganis-mutfak/** (repo: `reversideniz-afk/alganis-mutfak`).

**3.0 mimari planı ve faz haritası** (Faz 0-4, verilen kararlar, görsel üretim sırası) → [`YOL-HARITASI.md`](YOL-HARITASI.md). Her fazın başında/sonunda o dosyanın **Durum** bölümünü oku/güncelle.

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

## Görsel üretim hattı — DURDURULDU (2026-09-10)

**Bu bölümdeki hat şu an KAPALI. Aşağıdaki adımları kendi başına ÇALIŞTIRMA.**
Openverse'ten bulunan fotoğrafların büyük kısmı tarifle uyuşmuyordu (bazıları
Fooocus'tan kalan hiç denetlenmemiş yapay zekâ görselleriydi) — kullanıcı
"midem kalkmaya başladı" diyerek **tüm görselleri kaldırmayı** istedi.
`gorseller/*.jpg` tamamen silindi, `data/gorseller.js` boş listeye döndü,
`_kaynaklar.csv` sıfırlandı. Uygulama şu an tamamen SVG portrelerle çalışıyor
— bu bir hata değil, bilinçli bir karar. Ayrıntı ve yeni konsept fikri
(kullanıcının "Nefis Yemek Tarifleri" örneği — aşçının kendi çektiği fotoğraf)
→ `YOL-HARITASI.md` Bölüm 6, "Görsel hattı durduruldu" alt başlığı. Yeniden
başlatma kararı kullanıcıdan gelmeli; kendi kendine `gorsel-bul.js`/`gorsel-
istek.js` çalıştırıp görsel eklemeye kalkışma.

**2026-09-09'da yön değişti: Fooocus kaldırıldı (kullanıcı sildi).** Yapay
zekâ üretimi yerine **internetten telifsiz/yeniden kullanılabilir gerçek
fotoğraf** kaynaklanıyor. `tools/fooocus-uret.js` bu yüzden silindi — yeniden
gerekirse git geçmişinde duruyor (`ea9c19d` ve öncesi). Ayrıntılı gerekçe ve
öğrenilenler için → `YOL-HARITASI.md` Bölüm 6. **(Bu yaklaşımın kendisi de
2026-09-10'da durduruldu, yukarıdaki nota bak — aşağıdaki adımlar artık
tarihsel referans, aktif talimat değil.)**

1. `node tools/gorsel-istek.js --hepsi` → `gorseller/_istekler.csv` (öncelik
   sırası: kategori/mutfak kapakları → "vitrin" tarifleri → gövde). Yeni tarif
   eklendiğinde (ör. dünya mutfağı) bu listeyi **tekrar üret** — yoksa yeni
   tarifler taramaya hiç girmez.
2. `node tools/gorsel-bul.js --parti 50` (ya da `--hepsi`) → Openverse API
   (api.openverse.org, anahtarsız) üzerinden her tarif için önce kendi
   Türkçe adıyla, sonra ASCII yaklaşığıyla, sonra genel İngilizce
   tanımla arar; bulduğunu `gorseller/_ham/<tarif-id>.<uzantı>` indirir.
   GPU kullanmıyor, saatler sürmüyor (~700 tarif ~1-1,5 saat) — **50'lik onay
   kuralı bu araca uygulanmaz**, `--hepsi` ile tek seferde çalıştırılabilir.
   Aynı Start-Process deseniyle oturumdan bağımsız başlat:
   ```powershell
   Start-Process -FilePath "node" -ArgumentList "tools/gorsel-bul.js","--hepsi" `
     -WorkingDirectory "$PWD" -WindowStyle Hidden `
     -RedirectStandardOutput "$PWD\gorseller\_bulma.log" `
     -RedirectStandardError "$PWD\gorseller\_bulma-hata.log"
   ```
   Durum kontrolü: `Get-Content gorseller\_bulma.log -Tail 10`. Bulunamayan
   tarifler hata değil, `gorseller/_bulunamadi.csv`'ye yazılır (id;denenen
   sorgular) — bunlar için Nano Banana Pro ile elle üretim ya da farklı bir
   arama stratejisi sonra düşünülecek, şimdilik SVG portreye düşüyorlar.
   Atıf gerektiren (CC0 dışı) her görsel `gorseller/_kaynaklar.csv`'ye
   yazılır (id;kaynak-url;lisans;yazar) — **bu liste kaybolmamalı**, ileride
   bir "Fotoğraf Kaynakları" ekranı/sayfası için gerekecek.
3. `powershell -File tools/gorsel-isle.ps1` → 4:3 kırpar, 800×600 JPEG q78
   olarak `gorseller/<tarif-id>.jpg` yazar (System.Drawing, kurulum
   gerektirmez) — kaynak PNG/JPG/WEBP fark etmez.
4. **`node tools/gorsel-liste.js` — ASLA ATLAMA.** `gorseller/` klasörünü
   tarar, `data/gorseller.js`'i (AM.GORSELLER) yeniden üretir. `js/gorsel.js`
   SADECE bu listeye bakar; disk'te jpg olsa bile listede yoksa kart SVG
   portreye düşer. 2026-09-09'da bu adım aylarca atlanmış (897→910 tarif,
   yüzlerce görsel eklenmiş) ve uygulama sadece 47/436 gerçek görseli
   gösteriyordu — kullanıcı "çoğu şey ikon kalmış" diye fark etti. `gorsel-
   isle.ps1`'den SONRA, commit'ten ÖNCE her seferinde çalıştır.
5. `node tools/veri-kontrol.js` görsel sayısını raporlar ve yanlış
   adlandırılmış dosyaları yakalar.

Kurallar (hat yeniden açılırsa geçerli): `gorseller/*.jpg` commit **edilir**;
`_ham/`, `_istekler.*` ve `_bulunamadi.csv` edilmez, **`_kaynaklar.csv`
edilir** (atıf borcu takibi). Eksik görsel hata değildir — `gorsel.js` SVG
portreye düşer, kart boş kalmaz (şu an TÜM tarifler bu durumda, kasıtlı).
`tools/malzeme-en.js` istem/arama üretiminde kullanılan İngilizce sözlüktür,
**uygulamaya dahil değildir** (yeni malzeme eklersen oraya da bir satır ekle).

**Stil tutarlılığı zaten garanti değildi** — her fotoğraf farklı kaynaktan
geliyordu, Fooocus'un tek tip görünümü yok. Bu artık tartışmalı değil çünkü
hat durduruldu; not tarihsel referans olarak duruyor.

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

975 tarif (869 Türk + 28 İtalyan + 13 Uzak Doğu + 13 Orta Doğu + 13 Meksika + 13 Hint + 13 Balkan + 13 Akdeniz), 259 malzeme, 11 tarif kategorisi, 9 mutfak, 8 öğün grubu (Bugün ekranı). Görsel yok — tüm kartlar SVG ikonla çalışıyor (bkz. "Görsel üretim hattı — DURDURULDU"). Ayarlarda 6 renk paleti + yüksek kontrast, tema (gün ışığı/gece/sistem), yazı boyutu, ölçü cetveli var. Malzeme/favori seçimleri katalogla karşılaştırılmadan saklanır (veri kaybını önlemek için — bkz. `js/depo.js` başındaki not). Güncel sürüm: `data/surum.js` → `AM.SURUM`.
