# Alganis Mutfak 3.0 — Mimari Plan ve Faz Haritası

> Bu dosya kalıcıdır — oturum `/clear` edilse bile plan burada durur. Faz
> ilerledikçe **Durum** bölümü güncellenir; geri kalan bölümler kararların
> gerekçesini taşıdığı için değişmez referans niteliğindedir.

Referans uygulamaların üçü de aynı şeye yaslanıyor: hesap, bulut ve fotoğraf.
Bizim elimizde bunların hiçbiri yok ve olmayacak da — çünkü uygulamanın ilk
sözü kullanıcıdan malzeme dışında hiçbir veri istememek. Bu yüzden plan
kopyalamak değil, çevirmek üzerine kurulu: her özelliğin cihazda kalan,
internetsiz çalışan bir karşılığını buluyoruz.

Plan yazıldığında: 869 tarif, 242 malzeme, 31 tarif dosyası, ~800 KB veri,
sürüm 2.1.2, 0 bağımlılık.

## Durum

- **Faz 0 — tamamlandı.** Mutfak şeması + besin hesabı, depo genişlemesi
  (geçmiş/puan/not/koleksiyon alanları), `uygulama.js` ekran modüllerine
  bölündü, tarayıcı testi altyapısı kuruldu, görsel üretim hattının araçları
  hazırlandı (`gorsel-istek.js`, `gorsel-isle.ps1` — üçüncü araç önce
  `fooocus-uret.js`'ti, 2026-09-09'da `gorsel-bul.js` ile değişti, bkz. alt
  madde ve Bölüm 6).
- **Faz 1 — kod tarafı tamamlandı, sürüm 3.0.0.** Kart sistemi tek üreteçten
  4 varyanta çıktı (`ui.tarifKarti`: kahraman/izgara/liste/serit), tarif
  paneli yenilendi (tam genişlik görsel, süre+zorluk+koşullu etsiz/fırın
  rozetleri, mutfak+kategori düz metin altbaşlıkta, nötr besin rozetleri,
  Malzemeler/Yapılışı sekmeleri), alt menü yüzen hap biçimine geçti ve
  "Bugün" üstüne binen bir FAB oldu, saate göre selamlama eklendi, jeton v2
  (`--r-round`, `--golge-yuzen`) ve yeni `tools/kontrast-kontrol.js` ile 14
  palet×tema kombinasyonu 4.5:1 üstünde doğrulandı. `node tools/arayuz-testi.js`
  (21 kontrol) ve `node tools/veri-kontrol.js` yeşil. Yeni `css/bilesenler.css`
  dosyası `sw.js` DOSYALAR listesine eklendi.
  **Tasarım sadakat denetimi ve Faz 1 artıkları kapatıldı (2026-09-09)** —
  ayrıntı `tasarim/REFERANSLAR.md`: referans tasarımlar tekrar paylaşılıp
  kalıcı olarak dosyalandı, 23 maddelik denetimden çıkan dört iş kapatıldı —
  şerit varyantı artık Bugün ekranında "Diğer seçenekler" olarak kullanılıyor
  (`ciz_digerSecenekler`), Bugün ekranına arama kısayolu eklendi (Tarifler
  ekranına yönlendirip odaklıyor, mantık tekrarlanmadı), Web Share API ile
  paylaş düğmesi eklendi (desteklenmezse sessizce gizli kalır), tarif
  panelindeki rozet sayısı altıdan dörde indi. Kalan üç madde Dünya
  ekranıyla birlikte kapatıldı (aşağıda). `node tools/gorsel-isle.ps1`
  çalıştırıldı: kapak görseli **20/20 tamamlandı**, tarif görseli 194 →
  370/897'ye çıktı. Faz 1 artık tamamen bitti — kod, görsel, doğrulama.
- **Faz 2 — sürüyor: İtalyan mutfağı (28/~40 tarif).** İlk dünya mutfağı
  tarifi `data/tarifler-dunya-italyan.js` olarak eklendi (spagetti
  carbonara, bolonez, pesto, cacio e pepe, mantarlı risotto, minestrone,
  caprese, bruschetta, margherita pizza, tiramisu) — güvenilir kaynaklardan
  (GialloZafferano, RecipeTin Eats, Recipes from Italy, AVPN) doğrulanmış
  oranlarla. Üç yeni malzeme eklendi: `parmesan`, `mozzarella`,
  `kedi-dili-biskuvi` (`malzemeler.js` + `besin.js` + `tools/malzeme-en.js`
  hepsi güncel). **Uyarlama kararı**: katalogda hiç domuz ürünü ve alkol
  yok — guanciale/pancetta yerine `kavurma`, şarap tariften çıkarıldı. Bu
  ikisi diğer 7 mutfakta da (özellikle Uzak Doğu, Balkan, Fransız) tekrar
  çıkacak, aynı mantık uygulanacak.
  **İkinci parti (10 tarif daha) eklendi**: lazanya bolonez, osso buco
  (kuzu incik ile uyarlanmış — dana incik katalogda yok), fırında
  patlıcanlı parmigiana, safranlı risotto (Milano usulü, orijinalinde
  zaten şarapsız), tavuk saltimbocca (dana yerine tavuk göğsü, prosciutto
  yerine pastırma — adaçayı zorunlu olduğu için ilk kez eklendi), patates
  gnocchi, fırında levrek İtalyan usulü, pasta e fagioli (barbunyalı
  makarna çorbası — `kuru-barbunya` zaten katalogda vardı), panzanella,
  İtalyan frittatası. İki yeni malzeme eklendi: `adacayi` (adaçayı —
  saltimbocca'nın vazgeçilmezi) ve `muskat` (muskat cevizi — beşamel
  sosunun geleneksel baharatı); ikisi de `malzemeler.js` + `besin.js`
  (USDA) + `tools/malzeme-en.js`'e işlendi.
  **Üçüncü parti (8 tarif daha) eklendi**: aglio e olio, avcı usulü tavuk
  (pollo alla cacciatora), Milano usulü şnitzel (cotoletta alla milanese —
  dana yerine tavuk göğsü), ribollita (karalahana katalogda zaten vardı,
  cavolo nero karşılığı olarak birebir uyuyor), caponata, arancini,
  Toskana usulü ızgara biftek (bistecca alla fiorentina — porterhouse
  yerine bonfile), torta caprese. `node tools/veri-kontrol.js`
  (897 tarif, 247 malzeme) yeşil.
  **Dünya ekranı kuruldu (2026-09-09)** — `js/ekran-dunya.js`, alt menüde
  5. sekme. Karar C'nin iki fikri birden çalışıyor: mutfak kartları grid
  (Türk hariç 8 mutfak, tarif sayısı gösteriliyor) → tıklanınca o mutfağın
  ansiklopedisi (tarif-izgara, boş kalanlarda "yakında"); "Bu mutfak için
  öner" düğmesi `AM.depo.mutfak()`'ı set edip Bugün ekranına gider —
  `AM.oneriler()` artık 4. parametre olarak mutfakId alıyor ve sadece o
  mutfaktan öneriyor, Bugün ekranında bir kapsam bandı ("Tüm mutfaklara
  dön" düğmeli) çıkıyor. Kartlarda mutfak rozeti (`.tk-mutfak`) ve 28
  İtalyan tarifinin hepsine elle yazılmış tek cümlelik `ozet` alanı
  (tarif panelinde gösteriliyor) eklendi. Bir CSP ihlali bulundu ve
  düzeltildi (satır içi `style=` — `el()`'in `stil` alanı kullanılmalıydı,
  CLAUDE.md'nin uyardığı tam o hata). `node tools/arayuz-testi.js` (22/22)
  ve birkaç özel CDP betiğiyle uçtan uca doğrulandı — ayrıntı
  `tasarim/REFERANSLAR.md`.
  **Görsel tarama bitti**: 683/683, bulundu 181, `gorsel-isle.ps1` ile
  işlendi (bkz. Faz 1). 28 İtalyan tarifinden sadece ilk partideki 6'sının
  görseli vardı (`_istekler.csv` diğer 22'den önce üretilmişti) — liste
  `gorsel-istek.js --hepsi` ile tazelendi (527 eksik) ve `gorsel-bul.js
  --hepsi` **oturumdan bağımsız arka planda tekrar başlatıldı** (187 yeni
  denenecek — kalanı zaten `_bulunamadi.csv`'de). Bu, bir sonraki oturum
  açıldığında bitmiş olabilir; durum kontrolü: `Get-Content
  gorseller\_bulma.log -Tail 10`. Bitmişse sırayla `gorsel-isle.ps1` →
  `veri-kontrol.js` → commit (bkz. CLAUDE.md Görsel üretim hattı).

  **Karar (2026-09-09): İtalyan mutfağı 28 tarifte durup Uzak Doğu'ya
  geçiliyor** — kullanıcı "clear atacağım sonra uzak doğu mutfağına
  geçelim" dedi. İtalyan'ın eksik ~12 tarifi (cannoli, insalata di riso,
  involtini, peperonata, stracciatella gibi) sonra istenirse eklenir,
  şu an planda değil.

  **Sırada — Uzak Doğu mutfağı** (`mutfak:"uzakdogu"`, `AM.MUTFAKLAR`'da
  zaten tanımlı, kapak görseli hazır: `gorseller/kapak-mutfak-uzakdogu.jpg`
  — 9 mutfak kapağının hepsi tarandı). Tek "mutfak" olarak ele alınıyor —
  Çin/Japon/Kore ağırlıklı ev yemekleri, alt kategoriye bölünmüyor.
  Beklenen desen (İtalyan'la aynı mantık, bkz. yukarısı):
  - **Domuz** çok yaygın (Çin/Kore) → tavuk/dana/kuzu ile uyarla.
  - **Alkol**: Şaoxing şarabı (Çin), sake/mirin (Japon), rice wine (Kore)
    → çıkar ya da pirinç sirkesi + su gibi alkolsüz bir karşılıkla dengele.
  - **Muhtemelen yeni malzeme gerekecek** (kontrol edilip eksikse
    eklenecek — `malzemeler.js`+`besin.js`(USDA)+`tools/malzeme-en.js`):
    soya sosu, susam yağı, mısır/patates nişastası (kıvam için), pirinç
    sirkesi, istiridye sosu, tofu. **Zaten katalogda var, tekrar ekleme**:
    `zencefil` (baharat), `eriste` (noodle karşılığı olabilir, kontrol et).
  - Kaynak önerisi: The Woks of Life, Just One Cookbook, Maangchi,
    Omnivore's Cookbook — İtalyan'da olduğu gibi güvenilir, ölçü veren
    siteler; uydurma oran yazma.
  - Tarifler eklendikten sonra: `gorsel-istek.js --hepsi` (listeyi
    tazele) unutulmasın, yoksa yeni tarifler taramaya girmez (bkz.
    Faz 2'nin İtalyan'da yaşadığı gecikme).

  **Telif kontrolü yapıldı (2026-09-09)**: Kullanıcı isteği üzerine hem
  tarif metinlerinin hem görsellerin telif riski gözden geçirildi.
  *Tarifler*: hiçbir kaynağın düz yazısı/başlığı kopyalanmadı — ölçüler
  (facts, telif kapsamı dışı) araştırıldı, adımlar sıfırdan Türkçe
  yazıldı, katalogdaki mevcut 869 tarifle aynı sade/emir kipi üslupla.
  *Görseller*: Openverse sorgusundaki `license_type=commercial,modification`
  filtresi canlı API testiyle doğrulandı — sonuç kümesinde `by`/`by-sa`
  dışında hiçbir lisans çıkmadı (NC/ND sızmıyor). `_kaynaklar.csv`'deki
  63 kayıtlı atıf da elle sayıldı: 44 `by-sa`, 19 `by`, sıfır `nc`/`nd`.
  **Açık kalan tek risk**: CC BY/BY-SA görsel içeren bir uygulamayı
  yayınlamak hukuken görünür atıf ister; uygulamada henüz "Fotoğraf
  Kaynakları" ekranı yok (bkz. Bölüm 6). Bu, ücretsiz/kapalı test
  aşamasında acil değil ama **Play Store'a çıkmadan veya $5 IAP
  eklenmeden önce mutlaka yapılmalı** — aksi halde CC BY-SA'nın atıf
  şartını ihlal eder.
- **Tasarım sadakat denetimi yapıldı (2026-09-09).** Referans tasarımlar
  yeniden paylaşıldı ve `tasarim/REFERANSLAR.md`'ye kalıcı olarak döküldü
  (ekran ekran tarif + 23 maddelik sadakat tablosu). **Sonuç**: alt menü,
  sekmeler, çipler, kart sistemi ve kahraman görsel referansa uygun kuruldu;
  iki sapma gerekçeli (besin rozetlerinin halka değil nötr kutu olması —
  Karar D; reddedilen paywall/hesap ekranları); geri kalan yedi madde
  **tasarımdan sapma değil, sırası gelmemiş iş**. Bunlar plana şöyle
  dağıtıldı:
  - *Faz 1 artıkları (küçük, kod çoğunlukla hazır)*: `serit` kart varyantını
    bir ekrana bağla — yazıldı ama `js/` içinde tek geçtiği yer bir yorum
    satırı, referanstaki "Popular" yatay şeridinin karşılığı bu; Bugün
    ekranına arama kutusu (şu an arama yalnızca Mutfağım ve Tarifler'de);
    tarif panelindeki altı rozeti ikiye-üçe indir; Web Share API ile paylaş
    düğmesi (dış istek yok, CSP'yi bozmaz).
  - *Faz 2 ile birlikte*: kartın üstünde mutfak rozeti (şu an yalnızca
    detay panelinde), mutfak filtresi (referanstaki `Cuisine ∨` açılırı) —
    ikisi de Dünya sekmesiyle anlam kazanıyor.
  - *Karar bekliyor*: tarife `ozet` alanı (referanstaki tanıtım metni +
    "View More"). 897 tarife elle yazmak çok pahalı; kategori + ana
    malzemeden üretmek mümkün ama kalitesi tartışmalı.
- Henüz yok (Faz 3 kapsamı): `oneri.js`, `arama.js` (ağırlıklı puanlama),
  `ekran-defter.js`, `tools/derle.js`. `ekran-dunya.js` Faz 2'nin geri
  kalanıyla birlikte gelecek.

### Görsel üretimi — yön değişikliği ve canlı durum (2026-09-09)

**Kullanıcı Fooocus'u sildi, yerel/yapay zekâ üretimi bırakıldı.** Yeni
yaklaşım: internetten telifsiz/yeniden kullanılabilir **gerçek fotoğraf**
bulmak. Yeni araç `tools/gorsel-bul.js` (Openverse API, anahtarsız) —
ayrıntı için CLAUDE.md "Görsel üretim hattı". `tools/fooocus-uret.js`
silindi (git geçmişinde `ea9c19d` ve öncesinde duruyor).

**Neden bu karar önemli**: Fooocus'la üretilen görsel başına ~2,5 dk ve
GPU saatlerce meşgul oluyordu (869+280 tarif için gerçekçi değildi, Faz 2/3
ilerlemesini bloke ediyordu). Openverse taraması tarif başına saniyeler
sürüyor, GPU kullanmıyor — bu yüzden **50'lik onay kuralı bu araca
uygulanmıyor**, `--hepsi` ile tek seferde koşturulabilir.

**Öğrenilen kritik ayrıntılar** (bir sonraki kişi/oturum tekerleği yeniden
icat etmesin diye):
- Openverse'te CC0/kamu malı (atıf gerektirmeyen) içerik bu ölçekte
  **çok nadir** — pratikte neredeyse her bulunan görsel CC BY / CC BY-SA
  (atıf gerektirir). `gorseller/_kaynaklar.csv` bu yüzden var ve
  **commit edilmesi gerekiyor** — atıf borcunun tek kaydı bu.
- **Tarifin kendi Türkçe adıyla arama** (`t.ad`, diyakritikli — "mercimek
  çorbası") çoğu zaman genel İngilizce açıklamadan ("turkish lentil soup")
  daha isabetli sonuç veriyor; ASCII yaklaşığı ("mercimek corbasi") ise
  bazı kaynaklarda SIFIR sonuç veriyor, bazılarında (Flickr) daha iyi —
  üçü de sırayla deneniyor.
- Wikimedia'nın kullanıcı-ajanı politikası var: iletişim bilgisi içermeyen
  User-Agent ile indirme yapınca görsel sunucusu (upload.wikimedia.org)
  hızlıca 429 (çok istek) dönüyor. `AlganisMutfakGorselBul/1.0 (proje-url)`
  biçiminde bir User-Agent kullanmak bunu büyük ölçüde çözdü.
- Wikimedia'da "E4024" adlı bir katkıcı onlarca Türk ev yemeğini
  fotoğraflayıp CC BY-SA ile paylaşmış — bu proje için beklenmedik bir
  şans, birçok nadir yemek onun sayesinde bulunuyor.
- Stil tutarlılığı artık yok — her fotoğraf farklı kaynaktan, farklı ışık/
  açı/tabakla geliyor. Bilinçli bir ödün.

**Güncel durum**: `node tools/gorsel-istek.js --hepsi` ile liste tazelendi
(İtalyan tarifleri dahil, 694 eksik görsel), sonra
`node tools/gorsel-bul.js --hepsi` (683 tarif) oturumdan bağımsız ayrı
süreç olarak başlatıldı (~1-1,5 saat sürmesi bekleniyor). Test taramasında
(14 örnek) bulma oranı ~%65-70 civarındaydı. Durum kontrolü:
`Get-Content gorseller\_bulma.log -Tail 15` ve
`Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like "*gorsel-bul*" }`.
Bittiğinde sırayla: `powershell -File tools/gorsel-isle.ps1` →
`node tools/veri-kontrol.js` → `gorseller/_bulunamadi.csv`'ye bakıp kaç
tarifin fotoğrafsız kaldığını gör (SVG portreye düşerler, hata değil) →
`git status` ile `_kaynaklar.csv`'nin de eklendiğinden emin ol.

Önceki (Fooocus dönemi) ilerleme burada kalmıştı: 154 tarif görseli
işlenmiş, 194/879 tarif fotoğraflı, 11/20 kapak görseli hazırdı. Bunlar
korunuyor, üstüne ekleniyor.

### Mobil çıkış ve gelir modeli — ERTELENDİ (2026-09-09)

**Karar E**: Play Store / App Store çıkışı ve her türlü gelir modeli **uzun
süreliğine ertelendi**. Uygulama şimdilik yalnızca çevredeki insanlar
tarafından GitHub Pages linkiyle kullanılacak, para kazanma amacı yok.
Bunun iki pratik sonucu var:
- $5 IAP / abonelik tartışması rafta — aşağıdaki analiz arşiv olarak duruyor.
- Telif tarafında acele yok: NC lisansı zaten hiç kullanmıyoruz (bkz. telif
  kontrolü notu), CC BY/BY-SA'nın atıf şartı ticari olmayan kullanımda da
  geçerli olduğu için "Fotoğraf Kaynakları" ekranı yine yapılacak — ama
  Faz 4 işi, acil değil.

**Bağış**: Uygulamaya **IBAN konmayacak**. Uygulama herkese açık bir adreste
yayınlandığı için oraya yazılan IBAN, ad-soyadla birlikte taranabilir halde
internette durur — akrabaların harçlık yollaması için gereksiz bir maruziyet.
Destek göndermek isteyen olursa IBAN aile grubunda paylaşılır. İleride
uygulama içi bir "Destek" bölümü istenirse yeniden değerlendirilecek.

Aşağısı ertelenen kararın arşivlenmiş araştırma notu:
- **Android**: TWA (Bubblewrap/PWABuilder) ile Play Store'a taşınabilir,
  kod değişmez, $25 tek seferlik hesap ücreti + `.well-known/assetlinks.json`
  gerekir. Yeni bireysel hesaplarda 12 test kullanıcısı × 14 gün kapalı
  test şartı var.
- **iOS**: App Store'a girmek riskli (Apple'ın 4.2 kuralı "repackaged
  website"i reddediyor) — öneri: App Store'a hiç girmeden iOS'ta "ana
  ekrana ekle" ile bırakmak.
- **Gelir modeli**: Kullanıcı reklamı sevmiyor; analiz sonucu **tek
  seferlik $5 satın alma** ("Dünya Mutfakları + reklamsız" kilidini aç,
  Paprika Recipe Manager'ın $4.99'luk emsaliyle uyumlu) önerildi,
  **abonelik önerilmedi** (tarif kitabı için yanlış model — kullanıcı
  "zaten tüm tarifleri gördüm" diyip 2-3 ayda iptal eder). Büyüme için
  asıl kaldıraç fiyat değil kullanıcı sayısı: uygulama içi paylaşım
  düğmesi (Web Share API), TikTok/Instagram tarif videoları, Play Store
  ASO, aile/topluluk ağızdan ağıza. Henüz hiçbir adım uygulanmadı —
  sadece analiz yapıldı.

---

## Bölüm 1 — Elimizdeki

### Sağlam duran

- Tarif şeması genişlemeye açık. Yeni alan eklemek bedava — 869 tarifi
  bozmadan mutfak, besin, görsel ekleyebiliriz.
- Eşleştirme motoru genel. `ana`/`yrd`/`ops` rolleri ve `id1|id2`
  alternatifleri her mutfakta aynı şekilde çalışır.
- Katmanlar ayrık. Veri, motor, arayüz ve denetleyici birbirine sızmıyor.
- İçerik hazır. En pahalı iş — 869 doğrulanmış tarif — arkamızda.

### Yeni yönü taşımayan

- Tarifin görseli yok — sadece emoji. Referanslarla aramızdaki en büyük
  fark bu.
- Mutfak alanı yok; dünya mutfakları için şema değişikliği şart.
- Geçmiş tutulmuyor — ne zaman ne pişirildiği bilinmediği için "akıllı"
  öneri mümkün değil.
- Tek kart biçimi var; referanslarda dört ayrı kart tipi kullanılıyor.

### Sorunlar

| # | Sorun | Neden önemli | Çözüm yönü |
|---|-------|---------------|------------|
| 01 | Denetleyici tek dosyada büyüdü — `js/uygulama.js` 828 satır: dört ekran, ayarlar, tema, servis işçisi ve geçmiş yönetimi aynı yerde. | Dört ekran daha eklenirse bakım maliyeti katlanır. | Ekran başına ayrı dosya: `js/ekran-bugun.js`, `ekran-mutfak.js`, `ekran-dunya.js`… |
| 02 | 31 tarif dosyası açılışta senkron yükleniyor — `index.html` her açılışta ~800 KB JS ayrıştırıyor. | Dünya mutfaklarıyla 1,2 MB'ı geçecek; orta seviye bir Android'de açılış hissedilir yavaşlar. | Tarifleri tek üretilmiş dosyada birleştir (bkz. Karar A). |
| 03 | Kart sistemi tek biçimli — `ui.tarifKart` her yerde aynı kutuyu üretiyor. | Yeni tasarımda dört varyant gerekiyor: kahraman, ızgara, liste satırı, yatay şerit. | Varyant parametreli tek kart üreteci. |
| 04 | Arama ham alt dize eşlemesi — `t.ara` içinde `indexOf` aranıyor. Sıralama yok, yazım hatası toleransı yok. | "mercimek çorbsı" hiçbir şey bulmuyor. | Alan ağırlıklı puanlama + tek harf toleransı. |
| 05 | Ara sıcak grubu elle tutulan listede — `AM.ARA_SICAKLAR` 52 id'lik manuel dizi. | Her yeni ara sıcakta güncellenmesi gerekiyor; unutulursa tarif yanlış grupta çıkıyor. | Tarife grup alanı; liste yalnızca istisna eziciye dönüşür. |

---

## Bölüm 2 — Referanslardan ne alıyoruz

| Onlarda | Bizde |
|---|---|
| Yapay zekâ destekli kişisel öneri | Cihaz içi akıllı sıralama. Mevsim, günün saati, son pişirilenler, favoriler ve puanlar tarifleri sıralar. Hiçbir veri cihazdan çıkmaz — "yapay zekâ" kısmı sunucuda değil, telefonda çalışan bir puanlama fonksiyonu. |
| "Buzdolabında ne var?" ile tarif bulma | Zaten var ve daha güçlü. Üstüne acele mod: üç malzemeye dokun, sonuç anında gelsin. Bu bizim özgün çekirdeğimiz; yeni arayüz onu gölgelemeyecek, öne çıkaracak. |
| Global cuisine library | Dünya Mutfakları. Tarife mutfak alanı, mutfak kartlarıyla ayrı bir keşif ekranı, her listede mutfak filtresi. |
| Fotoğraflı kartlar, tam ekran yemek görselleri | İnternetten kaynaklanan telifsiz/yeniden kullanılabilir fotoğraflar, depoda duruyor — dış bağlantı yok, ama atıf gerektirenler için kaynak/lisans kaydı tutuluyor (`gorseller/_kaynaklar.csv`). Altında her zaman SVG portre tabanı durur: görsel bulunamamışsa kart boş kalmaz (bkz. Bölüm 6). |
| Kalori ve makro halkaları (320 kcal · 30 g karb…) | Yaklaşık besin değeri. Malzeme miktarlarından hesaplanır; porsiyon değişince birlikte değişir. Kaynak: USDA FoodData Central (kamu malı, CC0). |
| Yıldız puanı ve kullanıcı yorumları | Kendi puanın ve kendi notun. "Tuzu az geldi, yarım kaşık daha" — tarifin altında, sadece bu telefonda. Yabancıların puanı yerine mutfağı kullanan kişinin kendi hafızası. |
| Bookmark, kişisel yemek kitabı, raf | Favoriler var, üstüne koleksiyonlar: "Bayram sofrası", "Çabuk akşam yemeği", "Misafir gelirse". |
| Ingredients / Instructions sekmeleri | Aynısını alıyoruz. Tarif panelinde iki sekme — uzun tariflerde kaydırmayı yarıya indirir. |
| Filtre açılırları (Dish · Cuisine · Available) | Filtre şeridi genişliyor: mutfak, öğün, süre, zorluk, etsiz. Süre/zorluk/etsiz zaten var. |
| "Welcome Naweed" — profil fotoğrafı ve isim | Saate göre selamlama: "Günaydın, bugün ne pişirsem?" — akşam başka, öğlen başka. İsim sormuyoruz; isteyen ayarlardan takma ad yazabilir, o da cihazda kalır. |
| Yüzen alt menü ve ortadaki eylem düğmesi | Hap biçimli yüzen menü, ortada "Bugün ne pişirsem?" düğmesi. Uygulamanın tek cümlelik vaadi her ekranda parmak altında. |
| Açılış tanıtım karuseli | Üç adımlık, atlanabilir tanıtım. Şu an ilk açılışta doğrudan malzeme listesine düşüyoruz; bu biraz ani. |
| Görsel ve videolu adım adım pişirme | Adım adım mod var. Üstüne adım içi zamanlayıcı: "20 dakika kısık ateşte" yazan adımda dokunmatik kronometre. Video koyamayız ama zamanlayıcı mutfakta videodan daha çok işe yarıyor. |
| Hesap açma, bulut senkron, yorum akışı, abonelik ekranı, "Save 33%" paketleri | **Alınmıyor.** Hiçbiri kullanıcıdan veri istemeden çalışmaz. Uygulamanın ilk kuralı bu; tasarım bu kuralın etrafından dolaşmaz, onunla birlikte kurulur. |

---

## Bölüm 3 — Hedef mimari

Katman ayrımı korunuyor; her katman kendi içinde bölünüyor.

- **Veri**: `malzemeler.js`, `tarifler-*.js` (+mutfak alanı), `tarifler-dunya-*.js` (yeni), `besin.js` (yeni), `surum.js`
- **Saklama**: `depo.js` (+geçmiş +puan +koleksiyon +not)
- **Motor**: `eslestir.js`, `oneri.js` (yeni), `besin-hesap.js`, `arama.js` (yeni)
- **Görsel**: `arayuz.js` (kart varyantları), `gorsel.js` (yeni), `style.css`, `bilesenler.css` (yeni)
- **Ekranlar**: `ekran-bugun.js`, `ekran-mutfak.js`, `ekran-dunya.js` (yeni), `ekran-defter.js` (yeni), `ekran-tarifler.js`, `panel-tarif.js`
- **Çatı**: `uygulama.js` (yalnızca yönlendirme), `sw.js`, `veri-kontrol.js`, `tools/derle.js` (yeni), `tools/gorsel-istek.js`, `tools/gorsel-isle.ps1`

Kural değişmiyor — `innerHTML` yok, dış bağlantı yok, npm yok.

---

## Bölüm 4 — Faz haritası

Fazlar bağımlılık sırasına göre dizildi: her biri kendinden öncekine
yaslanıyor. Her fazın sonunda uygulama yayınlanabilir durumda — yarım
kalmış bir ekran telefona düşmez.

### Faz 0 — TEMEL (Şema ve iskelet) — ✅ tamamlandı

Görünürde hiçbir şey değişmez; sonraki her fazın dayandığı zemin bu.

- Mutfak taksonomisi — mutfak alanı, `AM.MUTFAKLAR` listesi, 869 tarife
  toplu geri doldurma (Türk mutfağı varsayılan).
- Tarife grup alanı — `ARA_SICAKLAR` manuel listesinden kurtuluş.
- Besin tablosu — 242 malzeme × 100 g başına kalori, karbonhidrat,
  protein, yağ.
- Depo genişlemesi — pişirme geçmişi, puanlar, notlar, koleksiyonlar.
  "Bilinmeyen id'yi asla silme" kuralı aynen korunur.
- `uygulama.js` bölünmesi — 828 satır, ekran başına dosyalara ayrılır.
- Doğrulayıcı güncellemesi — yeni alanlar `veri-kontrol.js`'te denetlenir.

### Faz 1 — GÖRÜNÜŞ (Yeni arayüz) — 🔵 sürüyor

İstenen değişimin gözle görülen kısmı. İçerik aynı kalır, kabuk yenilenir.

- Görsel katmanı — `gorsel.js`: varsa üretilmiş fotoğraf, yoksa SVG
  portre. Kart hiçbir koşulda boş kalmaz.
- Birinci parti görseller — 11 kategori + 8 mutfak + en sık çıkan 150
  tarif (bkz. Bölüm 6).
- Kart sistemi — kahraman, ızgara, liste satırı, yatay şerit: dört
  varyant tek üreteçten.
- Tarif paneli yeniden — tam genişlik görsel, etiket şeridi, besin
  halkaları, Malzemeler/Yapılışı sekmeleri.
- Yüzen alt menü — hap biçimi, ortada "Bugün ne pişirsem?" düğmesi.
- Selamlama başlığı — saate göre değişen karşılama.
- Jeton sistemi v2 — yeni köşe yarıçapları, gölge ve aralık ölçeği;
  6 palet + yüksek kontrast korunur, 14 kombinasyon yeniden ölçülür.

### Faz 2 — İÇERİK (Dünya mutfakları)

En uzun faz — tarif araştırması elle ve kaynak doğrulayarak yapılıyor.

- Sekiz mutfak — İtalyan, Uzak Doğu, Orta Doğu, Meksika, Hint, Balkan,
  Akdeniz, Fransız. Türk mutfağı dokuzuncu değil, varsayılan.
- Yeni "Dünya" sekmesi — alt menüde beşinci sekme. Mutfak kartları →
  o mutfağın ansiklopedisi: tarif, malzeme, yapılış, besin değeri.
- Mutfak kapsamı — bir mutfak seçildiğinde "Bugün ne pişirsem?" o
  mutfak için çalışır. Ansiklopedi ve öneri motoru aynı veriyi paylaşır.
- Yeni malzemeler — soya sosu, tortilla, mozzarella, köri, susam yağı…
  "temel" işaretlenmez ki Mutfağım ekranı şişmesin.
- "Evde olmayan malzeme" tonu — dünya tariflerinde eksik malzeme
  normaldir; motor bunu ceza değil, alışveriş fikri olarak sunar.

### Faz 3 — ZEKÂ (Akıllı öneri ve defter)

Faz 0'da toplanmaya başlayan geçmiş, burada işe yarar hale gelir.

- Öneri puanlaması — mevsim, saat, son 14 günde pişirilenler, favori
  ve puan; aynı yemeği üst üste önermeme kuralı.
- "Pişirdim" düğmesi — pişirme modunun sonunda; geçmişi besleyen tek
  kaynak.
- Puan ve kişisel not — tarifin altında, cihazda.
- Koleksiyonlar — kullanıcının kendi adlandırdığı listeler.
- Bu hafta ne pişirdim — küçük bir geriye bakış.

### Faz 4 — MUTFAKTA (Pişirme deneyimi)

Uygulamanın gerçekten ocak başında kullanıldığı an.

- Adım içi zamanlayıcı — adım metnindeki "20 dakika" ifadesi
  dokunulabilir kronometreye dönüşür.
- Adıma ait malzeme vurgusu — o adımda kullanılan malzemeler yanda
  görünür.
- Arama iyileştirmesi — alan ağırlıklı sıralama, tek harf yazım
  toleransı.
- Açılış tanıtımı — üç adım, atlanabilir.
- Hareket ve geçişler — `prefers-reduced-motion`'a saygılı.

---

## Bölüm 5 — Verilen kararlar

### A · Derleme adımı ✓

`tools/derle.js` tarifleri tek dosyada birleştirecek. Kaynak dosyalar
kategori kategori düzenli kalır; derleyici `data/tarifler.js` üretir, o
commit edilir. Çıktı düz okunur JS — `file://` çalışır, npm girmez.
"Bağımlılık yok" kuralı korunmuş olur, çünkü kuralın amacı paket
yöneticisinden kaçınmaktı.

### B · Yemek görselleri ✓ (2026-09-09'da revize edildi)

~~Görselleri kendimiz üreteceğiz — Nano Banana Pro ve yerel Fooocus ile.~~
Fooocus kaldırıldı; internetten telifsiz/yeniden kullanılabilir gerçek
fotoğraf kaynaklanıyor (bkz. Bölüm 6, güncel). Dosyalar yine depoda
duruyor, dış bağlantı yasağı bozulmuyor — ama artık telif tamamen sorunsuz
değil: atıf gerektiren görseller için `gorseller/_kaynaklar.csv` tutuluyor.
Geriye kalan kısıt aynı: toplam boyut ve üretim sırası. **Bu karar planın
gidişatını değiştirmişti: elimizde bir görsel kaynağı olduğu için görsel
katmanı ikinci sınıf bir çözüm olmaktan çıkıp Faz 1'in merkezine oturdu —
bu, kaynak değişse de geçerliliğini koruyor.**

### C · Dünya mutfakları ✓

Alt menüye "Dünya" sekmesi — hem ansiklopedi hem kapsam seçici. İki
fikir birbirinin alternatifi değil, aynı şeyin iki yüzü: sekme
mutfakları gezmek için (tarif, malzeme, yapılış, besin değeri — kapalı
bir tarif kitabı gibi), bir mutfak seçildiğinde de "Bugün ne pişirsem?"
motoru o mutfak için çalışır. Tek veri, iki giriş kapısı. Kapsam: 8
mutfak, ~280 tarif.

### D · Besin değeri ✓

Gösterilecek, "yaklaşık" etiketiyle ve ayarlardan kapatılabilir. Porsiyon
değiştikçe birlikte değişir. Kaynak USDA FoodData Central (kamu malı).
Ekranda hiçbir yerde hedef, limit ya da uyarı yok — bilgi var, yargı yok.

---

## Bölüm 6 — Görsel üretim hattı

> **2026-09-09'da yön değişti.** Bu bölüm önce "kendi ürettiğimiz yapay
> zekâ görseli" (Nano Banana Pro / Fooocus) planıydı — Karar B buydu.
> Kullanıcı Fooocus'u sildi ve **internetten telifsiz/yeniden
> kullanılabilir gerçek fotoğraf** kaynaklamaya geçildi. Aşağıdaki metin
> güncel duruma göre yeniden yazıldı; eski planın kalıntısı olan "Karar B"
> etiketi Bölüm 5'te bilinçli olarak korunuyor (o kararın neden alınıp
> neden değiştiğinin izini taşısın diye).

Üretim kapasitesi zaten kısıt değildi (Fooocus'la da değildi) — asıl kısıt
**hız** oldu: yapay zekâ üretimi görsel başına ~2,5 dk ve saatlerce GPU
gerektiriyordu, 869+280 tarif için bu, Faz 2/3'ü bloke edecek kadar
yavaştı. Gerçek fotoğraf kaynaklama tarif başına saniyeler sürüyor.
Karşılığında **stil tutarlılığından** ve **atıfsızlıktan** vazgeçildi —
bilinçli bir ödün, ayrıntı aşağıda.

**Taban her zaman var.** `gorsel.js` önce üretilmiş/bulunmuş fotoğrafı
arar; yoksa tarif id'sinden türeyen SVG portreyi çizer. Bu yüzden tek bir
görsel bulunamadan da uygulama yayınlanabilir, görseller damla damla
eklenir. Bir tarifin hiç fotoğrafı bulunamaması hata değildir — sadece
SVG portrede kalır.

### Kaynak: Openverse

`tools/gorsel-bul.js`, api.openverse.org üzerinden arama yapıyor —
Wikimedia Commons, Flickr'ın CC lisanslı havuzu gibi kaynakları tek
çatıda toplayan, API anahtarı gerektirmeyen bir arama motoru. Öncelik:

1. **CC0 / kamu malı** — atıf gerektirmez. Bu ölçekte çok nadir bulunuyor.
2. **CC BY / CC BY-SA** (ticari kullanım + türetmeye izin veren) — pratikte
   bulunan görsellerin büyük çoğunluğu bu. **Atıf gerektirir.**

Atıf gerektiren her görsel `gorseller/_kaynaklar.csv`'ye kaydediliyor
(tarif-id;kaynak-url;lisans;yazar) — **bu dosya commit edilmeli**, atıf
borcunun tek kaydı bu. Uygulamaya henüz bir "Fotoğraf Kaynakları" ekranı/
sayfası eklenmedi — bu listenin okunabilir hale getirilmesi lazım, CC BY
lisansları teknik olarak görünür bir atıf istiyor (link şart değil, düz
metin de kabul edilir norm olarak — ör. "Fotoğraf: E4024, CC BY-SA 4.0").
**Bu, "dış bağlantı yok" kuralını bozmaz** — atıf metni durağan, tıklanan
bir şey değil; CSP hâlâ hiçbir canlı dış isteğe izin vermiyor.

Arama sorgusu üç sırayla deneniyor (ilk isabet kazanır):
1. Tarifin kendi Türkçe adı (`t.ad`, diyakritikli) — "Mercimek Çorbası"
   gibi isimlendirilmiş fotoğraflarla en isabetli eşleşme burada çıkıyor.
2. ASCII yaklaşığı ("Mercimek Corbasi") — bazı kaynaklar diyakritiksiz
   etiketli.
3. Genel İngilizce tanım (kategori + en fazla 2 ana malzeme, İngilizce) —
   Türkçe adın hiç karşılığı olmayan durumlarda son çare.

### Format ve önbellekleme (değişmedi)

800×600 JPEG (kalite 78) — hem kart hem tam genişlik başlık görseli için
yeterli. Servis işçisi tarif görsellerini önden indirmez: yalnızca kapak
görselleri önbelleğe girer, kalanı görüldükçe saklanır. Çevrimdışıyken
görülmemiş bir tarif SVG portresine düşer.

### Akış

1. `node tools/gorsel-istek.js --hepsi` — görseli olmayan tarifleri
   öncelik sırasına dizip `gorseller/_istekler.csv` yazar. **Yeni tarif
   eklendiğinde bu listeyi tekrar üret**, yoksa yeni tarifler taranmaz.
2. `node tools/gorsel-bul.js --parti 50` (ya da `--hepsi`, GPU kullanmadığı
   için 50'lik onay şartı yok) — Openverse'te arar, bulduğunu
   `gorseller/_ham/<tarif-id>.<uzantı>` indirir. Bulamadığını
   `gorseller/_bulunamadi.csv`'ye yazar (hata değil, elle bakılacak liste
   — bir kısmı için sonradan Nano Banana Pro ile elle üretim düşünülebilir).
3. `tools/gorsel-isle.ps1` — ham klasörü tarar, 4:3 kırpar, 800×600'e
   küçültür, JPEG q78 olarak `gorseller/<tarif-id>.jpg` yazar. Kaynak
   PNG/JPG/WEBP fark etmez.
4. `node tools/veri-kontrol.js` — kaç tarifin görseli var, kaçı SVG
   portrede kalıyor, rapora eklenir.
5. Sürüm ve yayın — normal prosedür: `surum.js` + `sw.js` aynı değere,
   doğrulayıcı temiz, `_kaynaklar.csv` commit'e dahil olduğundan emin ol,
   push. Yeni görseller sürüm bump'ı olmadan da telefona iner.

---

## Sıradaki adım

Faz 0 tamamlandı. Faz 1 sürüyor: şema/iskelet katmanı bitti, şimdi görünen
kabuk yenileniyor. Faz 0 ve Faz 1 tek sürümde (3.0.0) çıkacak; annen
telefonunda önce yeni arayüzü ve ilk 169 görseli (parti 1 + 2) görecek,
dünya mutfakları ve akıllı öneri arkasından gelecek. Link değişmiyor,
kurulum gerekmiyor.
