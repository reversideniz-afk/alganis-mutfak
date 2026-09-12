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

  **Uzak Doğu mutfağı başladı (13/~35 tarif, 2026-09-09)** —
  `data/tarifler-dunya-uzakdogu.js` eklendi (`mutfak:"uzakdogu"`), tek
  "mutfak" olarak ele alınıyor, Çin/Japon/Kore ağırlıklı ev yemekleri alt
  kategoriye bölünmüyor. İlk parti: kung pao tavuk, tatlı-ekşi tavuk,
  Yangzhou usulü kızarmış pirinç, tavuklu Çin usulü erişte (chow mein),
  mapo tofu, ekşi-acı çorba, haşlama Çin mantısı (jiaozi), teriyaki
  tavuk, tavuk katsu, bulgogi, bibimbap, yumurtalı Çin çorbası (egg drop
  soup), yeşil soğanlı Çin gözlemesi (cong you bing) — kaynaklar The Woks
  of Life, Just One Cookbook, Maangchi, Korean Bapsang, Plays Well With
  Butter, Kirbie's Cravings (güvenilir ölçü/oran, uydurma yok).
  **Beş yeni kiler malzemesi eklendi** (`malzemeler.js`+`besin.js`(USDA
  yaklaşık)+`tools/malzeme-en.js` hepsi güncel): `soya-sosu`, `susam-yagi`,
  `pirinc-sirkesi`, `istiridye-sosu`, `tofu`. `susam-yagi` diğer yağlarla
  aynı yoğunlukta olduğu için `AM.GRAM_OZEL`'e de eklendi (13 g/yemek
  kaşığı). Zaten katalogda olup tekrar eklenmeyenler: `zencefil`, `eriste`.
  **Uyarlama kararları** (İtalyan'daki domuz/alkol kalıbı tekrarladı):
  domuz gerektiren yerlerde dana/tavuk kullanıldı (Yangzhou'da char siu +
  jambon yerine sosis, mapo tofu'da domuz kıyma yerine dana/tavuk); Şaoksing
  şarabı/sake/mirin gerektiren yerlerde alkol çıkarıldı, teriyakide
  pirinç sirkesi + şeker + su dengesiyle karşılandı. **Yeni bir uyarlama
  türü**: gochujang (Kore) ve doubanjiang (Sıçuan) — fermente biber
  ezmeleri — kataloğa hiç girmedi, biber salçası + pul biber + şeker
  karışımıyla yaklaşık karşılandı (bibimbap, mapo tofu; ilgili tariflerin
  "ip" alanında not edildi, tam aynı fermente tat beklenmemeli).
  `node tools/veri-kontrol.js` yeşil (910 tarif, 252 malzeme),
  `node tools/arayuz-testi.js` 22/22 (beklenen tarif sayısı 897→910
  güncellendi). `index.html` + `sw.js` DOSYALAR listesine dosya eklendi.
  `gorsel-istek.js --hepsi` ile liste tazelendi (540 eksik görsel) ve
  `gorsel-bul.js --hepsi` oturumdan bağımsız arka planda başlatıldı —
  durum kontrolü: `Get-Content gorseller\_bulma.log -Tail 15`.
  **Kalan ~22 tarif** (eksik: Kore pirinç keki/tteokbokki, kimchi'li
  tarifler, miso çorbası gibi ek fermente malzeme gerektirenler, ayrıca
  daha fazla Çin/Japon ev yemeği) sonraki bir oturumda eklenebilir —
  bilinçli olarak bu partiye dahil edilmedi çünkü her biri en az bir yeni
  fermente/özel malzeme (miso, gochujang'ın kendisi, tteok, kimchi)
  gerektiriyor ve tek seferde çok fazla yeni malzeme eklemek riskli
  görüldü (İtalyan'ın kademeli 3 partili yaklaşımıyla aynı mantık).

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
- **Orta Doğu mutfağı başladı (13/~30 tarif, 2026-09-11)** —
  `data/tarifler-dunya-ortadogu.js` eklendi (`mutfak:"ortadogu"`), Levant
  (Lübnan/Suriye/Filistin), Mısır ve İran ağırlıklı ev/sokak yemekleri
  tek mutfak altında. İlk parti: falafel, tabule, fettuş, tavuk şavarma,
  muhammara, şakşuka (yumurtalı), mücedere, maklube, ful, koşari, zahter
  ekmeği (manakish), ümmü ali, fesenjan — kaynaklar The Mediterranean
  Dish, Feel Good Foodie, Cookie and Kate, Little Sunny Kitchen, Daring
  Gourmet, Saveur, Silk Road Recipes. Humus, babagannuş ve künefe
  **eklenmedi** — zaten Türk kataloğunda vardı (Türk sofralarında da
  yaygın), tekrar oluşturmak yerine gerçekten yeni tarifler seçildi.
  **Domuz/alkol uyarlaması gerekmedi** — bu mutfak zaten büyük ölçüde
  bu iki malzemeyi kullanmıyor, İtalyan/Uzak Doğu'daki gibi bir uyarlama
  kararı alınmadı. Za'atar (zahter) kataloğa tek malzeme olarak
  eklenmedi, kekik+susam+sumak karışımı olarak doğrudan tarifte
  yazıldı — yeni malzeme sayısını azaltmak için bilinçli bir seçim.
  **Bir yeni bakliyat malzemesi eklendi**: `kuru-bakla` (ful medames
  için gerekli, katalogda kuru fasulyeden farklı bir baklagil yoktu) —
  `malzemeler.js`+`besin.js`(USDA yaklaşık)+`tools/malzeme-en.js` güncel.
  `node tools/veri-kontrol.js` yeşil (923 tarif, 253 malzeme),
  `node tools/arayuz-testi.js` 22/22 (beklenen tarif sayısı 910→923
  güncellendi). `index.html` + `sw.js` DOSYALAR listesine dosya eklendi.
  **Görsel eklenmedi** — görsel hattı 2026-09-10'da durduruldu (bkz.
  altındaki not), bu 13 tarif SVG ikonla kalacak, bu normal.
- **Meksika mutfağı başladı (13/~25 tarif, 2026-09-12)** —
  `data/tarifler-dunya-meksika.js` eklendi (`mutfak:"meksika"`). İlk
  parti: guacamole, pico de gallo, salsa roja, tacos al pastor (tavuklu),
  kesadilla, enchilada (tavuklu), frijoles refritos, arroz rojo, chili
  con carne, tavuk fajita, elote, churros, tres leches — kaynaklar Isabel
  Eats, Mexico in My Kitchen, Feel Good Foodie, Muy Delish, Chili Pepper
  Madness, Cookie and Kate, A Cozy Kitchen. **Domuz uyarlaması**: tek
  domuz gerektiren tarif (tacos al pastor) tavukla uyarlandı, achiote
  ezmesi yerine toz biber+pul biber karışımı kullanıldı ("ip" alanında
  not edildi). **Mısır tortillası** yerine katalogdaki lavaş/tortilla
  kullanıldı — gerçek mısır tortillası masa harina (nixtamalize mısır
  unu) gerektirir, Türkiye'de bulunmayan özel bir ürün, bu yüzden
  yeni malzeme olarak eklenmedi. **Dört yeni malzeme eklendi**: avokado,
  kara-fasulye, taze-kisnis, kondanse-sut (dördü de malzemeler.js +
  besin.js(USDA yaklaşık) + tools/malzeme-en.js'e işlendi; kondanse süt
  `AM.GRAM_OZEL`'e de eklendi, avokado "adet" ölçüsü aldı).
  `node tools/veri-kontrol.js` yeşil (936 tarif, 257 malzeme),
  `node tools/arayuz-testi.js` 22/22 (beklenen tarif sayısı 923→936
  güncellendi). `index.html` + `sw.js` DOSYALAR listesine dosya eklendi.
  **Görsel eklenmedi** — görsel hattı durduruldu, bu 13 tarif de
  SVG ikonla kalacak.
- **Hint mutfağı başladı (13/~25 tarif, 2026-09-12)** —
  `data/tarifler-dunya-hint.js` eklendi (`mutfak:"hint"`), Kuzey
  Hindistan/Pencap ağırlıklı ev ve restoran yemekleri. İlk parti: dal
  tadka, chana masala, palak paneer, tereyağlı tavuk (butter chicken),
  chicken tikka masala, tavuklu biryani, aloo gobi, raita, samosa, naan
  ekmeği, kuzu rogan josh, tandır usulü tavuk (tandoori chicken), gulab
  jamun — kaynaklar Swasthi's Recipes, Piping Pot Curry, Tea for
  Turmeric, Dassana's Veg Recipes, Ministry of Curry, Cook With Manali,
  Whisk Affair. **Domuz/alkol uyarlaması gerekmedi** — bu mutfak zaten
  ikisini de neredeyse hiç kullanmıyor. **Paneer** yerine dokusu/tadı
  yakın katalogdaki `lor` peyniri kullanıldı (yeni malzeme eklenmedi).
  **Garam masala** tek malzeme olarak eklenmedi — tarçın+karanfil+
  kakule+kimyon+kişniş tohumu karışımı doğrudan tariflerde yazıldı
  (za'atar'daki gibi aynı mantık). Keşmir kırmızı biberi yerine toz
  biber+pul biber, hardal yağı yerine sıvı yağ kullanıldı.
  **İki yeni malzeme eklendi**: `kisnis-tohumu` (toz kişniş —
  Meksika'da eklenen taze yaprak `taze-kisnis`'ten farklı, `kuru-nane`/
  `taze-nane` ayrımıyla aynı mantık), `sut-tozu` (gulab jamun için).
  İkisi de `malzemeler.js`+`besin.js`(USDA yaklaşık)+`tools/
  malzeme-en.js`'e işlendi; süt tozu `AM.GRAM_OZEL`'e de eklendi.
  `node tools/veri-kontrol.js` yeşil (949 tarif, 259 malzeme),
  `node tools/arayuz-testi.js` 22/22 (beklenen tarif sayısı 936→949
  güncellendi). `index.html` + `sw.js` DOSYALAR listesine dosya eklendi.
  **Görsel eklenmedi** — görsel hattı durduruldu, bu 13 tarif de
  SVG ikonla kalacak.
- **Balkan mutfağı başladı (13/~25 tarif, 2026-09-12)** —
  `data/tarifler-dunya-balkan.js` eklendi (`mutfak:"balkan"`), Sırp/
  Boşnak/Hırvat/Bulgar ağırlıklı ev ve sokak yemekleri. İlk parti:
  çevapi, ajvar, şopska salata, burek (Balkan böreği), pljeskavica,
  kaçamak, Bulgar usulü soğuk yoğurt çorbası (tarator), gibanica,
  palaçinke, musaka (Balkan usulü patatesli), krempita, Karađorđeva
  şnitzel, proja — kaynaklar Balkan Lunch Box, The Balkan Hostess,
  Foreign Fork, Zestful Kitchen, Delish Globe, Granny Zen Kitchen,
  Serbian Cookbook. **Türk kataloğuyla çakışma riski taşıyan** dolma/
  sarma/köfte/baklava/mısır ekmeği gibi zaten var olan dişler bilerek
  atlandı (`lahana-sarmasi`, `misir-ekmegi`, `etli-biber-dolmasi`,
  `balik-corbasi` kontrol edilip çakışanlar çıkarıldı) — gerçekten
  farklı tarifler seçildi. Tarator adı Türk kataloğundaki (ceviz sosu)
  ile çakıştığı için Balkan versiyonu "Bulgar Usulü Soğuk Yoğurt
  Çorbası (Tarator)" olarak ayrı id'yle eklendi. **Domuz/alkol
  uyarlaması**: çevapi/pljeskavica orijinalinde domuz+dana karışımı
  ister, sadece dana kullanıldı (Boşnak/helal varyantıyla aynı mantık).
  **Yeni malzeme eklenmedi** — kaymak, beyaz peynir, lor, mısır unu,
  maden suyu zaten katalogdaydı. `node tools/veri-kontrol.js` yeşil
  (962 tarif, 259 malzeme), `node tools/arayuz-testi.js` 22/22 (beklenen
  tarif sayısı 949→962 güncellendi). `index.html` + `sw.js` DOSYALAR
  listesine dosya eklendi. **Görsel eklenmedi** — görsel hattı
  durduruldu, bu 13 tarif de SVG ikonla kalacak.
- **Akdeniz mutfağı başladı (13/~25 tarif, 2026-09-12)** —
  `data/tarifler-dunya-akdeniz.js` eklendi (`mutfak:"akdeniz"`), Yunan
  ve İspanyol ağırlıklı Akdeniz kıyı mutfakları (İtalyan zaten ayrı
  mutfak). İlk parti: Yunan usulü tavuk şiş (souvlaki), horiatiki (Yunan
  köy salatası), Yunan usulü musakka (moussaka), spanakopita, avgolemono
  çorbası, paella, gazpacho, patatas bravas, tortilla española, pisto
  manchego, İspanyol usulü tavuklu kroket, gambas al ajillo,
  galaktoboureko — kaynaklar My Greek Dish, The Greek Foodie, The
  Mediterranean Dish, Spain on a Fork, Spanish Sabores, Downshiftology,
  196 Flavors. **Tzatziki eklenmedi** — Türk kataloğundaki cacıkla
  neredeyse birebir aynı, gereksiz tekrar sayıldı; souvlaki tarifinde
  servis önerisi olarak anıldı. **Domuz/alkol uyarlaması**: paella'daki
  chorizo yerine katalogdaki sucuk, şeri sirkesi yerine sıradan sirke
  kullanıldı. **Yeni malzeme eklenmedi** — safran, kapari, zeytin,
  beyaz peynir, sucuk, mayonez zaten katalogdaydı. `node tools/
  veri-kontrol.js` yeşil (975 tarif, 259 malzeme), `node tools/
  arayuz-testi.js` 22/22 (beklenen tarif sayısı 962→975 güncellendi).
  `index.html` + `sw.js` DOSYALAR listesine dosya eklendi. **Görsel
  eklenmedi** — görsel hattı durduruldu, bu 13 tarif de SVG ikonla
  kalacak.
- **Fransız mutfağı başladı (13/~25 tarif, 2026-09-12) — 8 mutfaklık
  ilk-parti turunun sonuncusu.** `data/tarifler-dunya-fransiz.js`
  eklendi (`mutfak:"fransiz"`). İlk parti: ratatouille, quiche
  lorraine, Fransız usulü soğan çorbası, coq au vin, beef bourguignon,
  croque monsieur, salade niçoise, tarte tatin, crème brûlée, peynirli
  süfle, bouillabaisse, cassoulet, madeleine — kaynaklar Once Upon a
  Chef, Pardon Your French, RecipeTin Eats, The Kitchn, Sally's Baking
  Addiction, Cookie and Kate, Leite's Culinaria. **Profiterol bilerek
  atlandı** — Türk kataloğunda (`data/tarifler-tatli-2.js`) zaten var.
  Soğan çorbasının id'si Türk kataloğundaki `sogan-corbasi` ile
  çakışmaması için `fransiz-sogan-corbasi` olarak ayrı verildi.
  **Domuz/alkol uyarlaması**: bacon/lardon/jambon yerine katalogdaki
  `kavurma` kullanıldı (İtalyan'daki guanciale/pancetta uyarlamasıyla
  aynı mantık); şarap gerektiren üç tarifte (coq au vin, beef
  bourguignon, soğan çorbası) alkol tamamen çıkarılıp sirke + nar
  ekşisi dengesiyle yaklaşık bir derinlik sağlandı (Uzak Doğu'daki
  Şaoksing şarabı uyarlamasıyla aynı desen). Gruyère peyniri yerine
  katalogdaki `kaşar`, ançuez yerine `hamsi`, kaz confit'i yerine
  basitleştirilmiş kavurma-haşlama tekniği kullanıldı — her uyarlama
  ilgili tarifin `ip` alanında not edildi. **Yeni malzeme eklenmedi** —
  kavurma, kaşar, nar ekşisi, safran, ton balığı, kaz zaten katalogdaydı.
  `node tools/veri-kontrol.js` yeşil (988 tarif, 259 malzeme), `node
  tools/arayuz-testi.js` 22/22 (beklenen tarif sayısı 975→988
  güncellendi). `index.html` + `sw.js` DOSYALAR listesine dosya eklendi,
  sürüm 3.7.0. **Görsel eklenmedi** — görsel hattı durduruldu, bu 13
  tarif de SVG ikonla kalacak. Bu partiyle Faz 2'nin 8 mutfaklık
  ilk-parti turu tamamlandı (İtalyan, Uzak Doğu, Orta Doğu, Meksika,
  Hint, Balkan, Akdeniz, Fransız — hepsi en az bir partiyle temsil
  ediliyor).
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

### Kritik hata bulundu ve düzeltildi: görsel listesi ayı boyunca bayattı (2026-09-09)

Kullanıcı "çoğu şey sadece ikon kalmış" diye fark etti. Kök neden:
`data/gorseller.js` (AM.GORSELLER — `js/gorsel.js`'in gerçek fotoğrafı
olan tarifleri bulmak için baktığı TEK liste) sürüm 3.0.0'dan
(commit `00a49e3`) sonra **hiç yeniden üretilmemiş** — `tools/gorsel-
liste.js` çalıştırılmadan üç ayrı görsel commit'i (`a9839ce`, `b9d1f4c`,
ve bu oturumun kendisi) atılmış. Disk'te 436 gerçek fotoğraf varken
uygulama sadece 47'sinin farkındaydı, kalan 389'u boşuna SVG portreye
düşüyordu. **Bu adım artık CLAUDE.md'de "ASLA ATLAMA" uyarısıyla
işaretli** — `gorsel-isle.ps1`'den sonra, her seferinde.

**İkinci bulgu — bulunan fotoğrafların bir kısmı yanlıştı.** Kullanıcının
"patates püresi" örneği doğrulandı (görsel zeytinyağlı köy patatesiydi,
püre değil) ve manifest düzeltmesinden sonra tüm 436 görsel etiketli bir
kontrol tablosunda (13 sayfa, PowerShell/System.Drawing ile üretildi,
`tools/gorsel-liste.js`'in ürettiği id→ad eşlemesiyle) elle tarandı.
**54 tarifin görseli tamamen yanlış çıktı ve silindi** — üç kategori:
- Konu tamamen alakasız: kitap kapağı (balık şiş), insanlar yemek yerken
  fotoğrafı (beyti sarma, karışık turşu, sumaklı soğan salatası), bir
  heykel (tarator), bir manolya ağacı (Magnolia tatlısı), boş tabak/masa
  düzeni (yoğurtlu patlıcan mezesi), tavuz kutusu/bento fotoğrafı.
- Aynı yanlış stok fotoğraf birden fazla farklı tarife düşmüş — Openverse'ün
  jenerik İngilizce sorgusu (3. seviye yedek sorgu) çok geniş kaldığında
  aynı popüler "Turkish food" etiketli fotoğrafı defalarca döndürüyor:
  ör. aynı Flickr fotoğrafı hem "sarığı burma" hem "bülbül yuvası" hem
  "ev baklavası" için, başka bir fotoğraf hem "beyti sarma" hem "karışık
  turşu" hem "sumaklı soğan salatası" için eşleşmiş.
- Kategori doğru ama yemek yanlış: cezerye (turuncu olması gerekirken
  kahverengi), krem karamel (pudding yerine haşlanmış yumurta), mozaik
  pasta (kare kesilmiş çikolatalı bisküvi yerine taş dokusu), vb.
- **Kendi eklediğimiz Uzak Doğu tarifinde de bulundu**: `yangzhou-pilavi`
  görseli kızarmış pirinç değil, bir sebze çorbasıydı — otomatik bulma
  aracının sonucu doğrulanmadan güvenilmemesi gerektiğinin kanıtı.

Silinen 54 id ve _kaynaklar.csv'den çıkarılan 42 atıf satırı için
git geçmişine bakılabilir (bu oturumun commit'i). Bu tarifler şimdilik
SVG portreye düşüyor — yanlış ama "gerçek" bir fotoğraf göstermek, doğru
bir ikon göstermekten kötü sayıldı. **Ders**: `gorsel-bul.js` bir eşleşme
bulduğunda otomatik doğru kabul edilmemeli; en azından örnek bir kontrol
tablosuyla gözden geçirilmeli, özellikle 3. seviye (jenerik İngilizce)
sorguyla bulunanlar için.

`js/gorsel.js`'te ayrıca bağımsız bir görsel hata düzeltildi: SVG
portresindeki emoji, tabak dairesiyle birlikte rastgele kaymış konuma
yerleşiyordu (kart türüne göre bazı tariflerde emoji köşede kalıyordu).
Emoji artık her zaman tam ortada, sadece arka plandaki atmosferik tabak
dairesi kayıyor.

#### İkinci tur (aynı gün) — kapak fotoğrafları ve tam kopya görseller

Kullanıcı ilk temizlikten sonra iki şey daha fark etti: (1) dünya mutfağı
kapak fotoğrafları ("Dünya" ekranındaki 9 mutfak kartı) hiç kontrol
edilmemişti ve üçü çok kötüydü; (2) bazı tarif kartları birebir aynı
fotoğrafı gösteriyordu.

**Kapak fotoğrafları** — `tools/gorsel-bul.js`'in kapak sorgusu tek ve
çok geniş: `"traditional " + mutfağın İngilizce adı + " food"`, tek
deneme, yedek sorgu yok (tarifler için 3 kademeli sorgu var, kapaklar
için yok — bu asimetri not edildi, ileride tools/gorsel-bul.js'e kapaklar
için de yedek sorgu eklenebilir). Sonuç: `kapak-mutfak-ortadogu` bir yol
kenarı fotoğrafıydı (sarı çiçekli ot + araba), `kapak-mutfak-uzakdogu`
çamurdaki bir çöp parçasıydı, `kapak-mutfak-meksika` kızarmış solucandı
(gerçek ama iğrenç bir Meksika yemeği — kapak için uygun değil). Üçü de
elle, daha spesifik sorgularla (`"middle eastern food falafel"`,
`"chinese food dim sum noodles"`, `"mexican street tacos al pastor"`)
yeniden arandı ve iyi sonuçlar bulundu (meze tabağı, dim sum, sokak
tacosu) — ikisi atıf gerektiriyor (`_kaynaklar.csv`'ye eklendi), biri
CC0. **Ders**: kapak sorgusu ülke/bölge adı gibi çok genel kaldığında
Openverse coğrafi etiketleme yüzünden tamamen alakasız (bitki, yol,
çamur) sonuç dönebiliyor — bir sonraki kapak aramasında ilk denemede
somut bir yemek adı (falafel, dim sum, taco gibi) kullanmak daha güvenli.

**Tam kopya görseller** — `md5sum gorseller/*.jpg | sort | uniq -c -w32`
ile bayt-bayt aynı dosyalar tarandı (önceki elle taramada bu kontrol
yapılmamıştı, sadece "görsel doğru mu" bakılmıştı, "aynı görsel iki
tarife mi düşmüş" bakılmamıştı). **10 grup, 19 fazla dosya** bulundu —
en çarpıcısı aynı Wikimedia fotoğrafı (curid=42965567, patlıcanlı/biberli
yoğurtlu bir tepsi) yedi ayrı tarife (fırında patlıcan dizme, kıymasız
musakka, patatesli biber sote, patlıcan kızartma, patlıcan sote,
sarımsaklı fırın patates, silkme) atanmıştı. Her grupta en isabetli tek
tarif seçildi (ör. "patlıcanlı yoğurtlu tepsi" — ad zaten yoğurtlu diyor),
kalanı silindi. Bazı gruplarda (kabaklı pilav + mantarlı risotto'nun
paylaştığı fine-dining tabağı; fırında hindi + tavuk sote'nin paylaştığı
uçak yemeği tepsisi) hiçbir tarif iyi eşleşmiyordu, ikisi de silindi.
**Ders**: görsel doğruluk denetimi hem "bu fotoğraf bu yemek mi?" hem
"bu fotoğraf başka bir tarife de atanmış mı?" sorusunu sormalı — ikinci
soru md5 karşılaştırmasıyla saniyeler içinde otomatik yanıtlanabiliyor,
elle taramaya hiç gerek yok.

Toplamda bu iki turda 73 yanlış/tekrar eden görsel silindi (54 + 19),
3 kapak fotoğrafı değiştirildi, tarif görseli sayısı 436 → 363/910'a
düştü ama artık hepsi doğru. Sürüm 3.1.2.

#### Üçüncü tur (aynı gün) — Fooocus artıkları ve %95 yanlışlık iddiası

Kullanıcı ikinci turdan sonra da "yemeklerin %95'inin ismiyle fotoğrafı
uyuşmuyor" dedi ve "telifsiz olsun dedim diye rastgele fotoğraf
koyacaksan komple kaldırmayı düşüneceğim" diyerek özelliğin devam edip
etmeyeceğini sorguladı. Bu, ilk iki turun aslında **yüzeysel** kaldığını
gösterdi — kök nedene bakıldı ve çok daha büyük bir sorun bulundu:

**363 tarif görselinin 182'si (%50'si) `_kaynaklar.csv`'de hiç atıf
kaydı yoktu.** Bu, gerçek (Openverse) fotoğrafların neredeyse hepsinin
atıf gerektirdiği bilgisiyle (CC0 nadir) birleştirilince: bu 182 dosya
gerçek fotoğraf değil, **Fooocus döneminden kalan, hiçbir zaman
denetlenmemiş yapay zekâ görselleriydi**. Dosya tarihleri (2 ve 3 Eylül)
bunu doğruladı — Fooocus 9 Eylül'de kaldırılmıştı ama "Önceki (Fooocus
dönemi) ilerleme... korunuyor" kararıyla bu görseller silinmeden
bırakılmıştı. `data/gorseller.js` manifesti bozuk olduğu için bu
görseller uygulamada hiç görünmüyordu — birinci turdaki manifest
düzeltmesi (bkz. yukarı) bunları da sessizce diriltmiş, ne birinci ne
ikinci tur denetimi bunları "AI kalıntısı, güvenilmez" diye ayrı
kategoride ele almamıştı. Kullanıcının somut örneği ("Zeytinyağlı Havuç
Yemeği" — internette aratınca hiç benzemiyor) bu 182'nin içindeydi:
görsel, aynı stüdyo şablonunu (bakır kap + iki yağ şişesi + zeytin
kâsesi + keten örtü) tekrar tekrar üreten Fooocus çıktılarından biriydi.
**Bu 182 dosyanın hepsi, doğru görünüp görünmediğine bakılmadan
silindi** — çünkü "gerçek fotoğraf" kararının kendisiyle çelişiyorlardı
ve hiçbir zaman gözden geçirilmemişlerdi.

Kalan 181 gerçek (Openverse) fotoğraf bu sefer çok daha büyük ve net
kontrol tablolarıyla (5×5, 280×210 px), İLK turdaki "kabaca doğru
kategori" ölçütü yerine "bu gerçekten bu yemek mi" ölçütüyle yeniden
tarandı. Sonuç: **49 tane daha silindi** — künefe (kabarık pastane
görünümü yok, düz kahverengi sıvı), tavuklu köfte (makarna gösteriyor),
kazandibi (tost görünüyor), soğan dolması (soğan şekli yok), tiramisu
(klasik kat görünümü yok, soyut tabak), ışkembe/tarhana/sebze çorbaları
(rengi/dokusu tutmuyor) gibi. Sonuç: 181 → 132/910 tarif görseli.
**İlk turun ölçütü gevşekti** — "makul bir yemek fotoğrafı mı" ile
"bu spesifik yemeğin fotoğrafı mı" arasındaki fark, küçük thumbnail'de
kolayca kayboluyor; büyütülmüş görsel + daha şüpheci bir bakışla ikinci
geçişte iki katı hata yakalandı.

**Dünya kapakları — doğruluk yetmiyor, iştah açıcılık da gerekiyor.**
Kullanıcı "İtalyan'da enfes duran bir pizza resmi neden yok" diye sordu
— önceki turda kapaklar sadece "doğru mu" diye kontrol edilmişti, "güzel
mi" hiç sorulmamıştı. İtalyan (makarna → gerçek bir fırın pizza, kömürlü
kenarlı Napoli usulü), Balkan (kağıt havlu üstünde kızarmış köfte →
kajmaklı ekmek arası çevapi, yüksek çözünürlük), Akdeniz (dağınık mutfak
tezgahı → canlı renkli Yunan salatası, iri feta) değiştirildi — üçü de
hem doğru hem gerçekten "enfes duran" fotoğraflarla. Türk, Hint ve
Fransız kapakları için de alternatif arandı ama bulunanlar (bulanık
telefon fotoğrafı, arka planda dikkat dağıtan masa numarası) mevcuttan
daha iyi değildi, değiştirilmedi.

**Dürüst değerlendirme (kullanıcının doğrudan sorduğu soru — "yapılamayacak
bir şeyse söyle"):** Bu iş yapılabilir ama üç koşulla:
1. Her yeni bulunan fotoğraf **elle, büyütülmüş halde ve şüpheci bir
   gözle** onaylanmadan uygulamaya girmemeli — otomatik bulma aracının
   sonucu asla doğru kabul edilmemeli (bkz. [[gorsel-liste-ve-dogrulama]]).
2. Tanınmış/uluslararası yemekler (pizza, taco, humus, dim sum) için
   arama gerçekten iyi çalışıyor — bu oturumda aranan her şey ilk
   denemede güzel sonuç verdi. Türkiye'ye özgü, dar bölgesel ev
   yemekleri için (özellikle İngilizce karşılığı zayıf olanlar) başarı
   oranı çok daha düşük — bu durumda SVG portreye düşmek, yanlış
   fotoğraftan her zaman daha iyi.
3. Gerçekçi kapsam beklentisi: 897 Türk+İtalyan+Uzak Doğu tarifinin
   hepsine doğru fotoğraf bulmak mümkün değil; %15-20 (yaklaşık 130-150
   tarif) gerçekçi bir hedef, kalanı SVG'de kalır. Bu, "resim olsun
   hepsi" isteğiyle doğrudan çelişir — kapsam ile doğruluk arasında
   seçim yapılması gerekiyor, ikisi birden olmuyor.

Sürüm 3.1.3. `node tools/veri-kontrol.js` yeşil (910 tarif, 132/910
görsel), `node tools/arayuz-testi.js` 22/22, tüm görsellerde md5
tam-kopya taraması sıfır sonuç verdi.

#### Görsel hattı durduruldu (2026-09-10) — yeni konsept fikri var

Kullanıcı üçüncü tur özetini gördükten sonra ("%15-20 kapsam, kalanı SVG")
karar değiştirdi: **"midem kalkmaya başladı, şimdilik bütün fotoğrafları
kaldıralım minik ikonlarla devam edelim."** Bu, önceki turların düzeltme
çabası değil, **tüm Openverse görsel hattının geçici olarak tamamen
durdurulması** kararı. Yapılan: `gorseller/*.jpg` (132 tarif + 20 kapak,
hepsi) silindi, `data/gorseller.js` → `AM.GORSELLER = []`,
`gorseller/_kaynaklar.csv` başlık satırına sıfırlandı. Uygulama artık
tamamen SVG portrelerle çalışıyor — `tools/veri-kontrol.js` ve
`tools/arayuz-testi.js` (22/22) bunun sorunsuz çalıştığını doğruladı,
emoji artık her kartta tam ortada (bkz. yukarıdaki kaymış-ikon düzeltmesi).
`CLAUDE.md`deki "Görsel üretim hattı" bölümü **DURDURULDU** uyarısıyla
işaretlendi — bir sonraki oturum kendi başına `gorsel-bul.js` çalıştırıp
bu görselleri geri getirmeye kalkışmamalı, karar kullanıcıdan gelmeli.

**Kullanıcının yeni konsept önerisi**: Nefis Yemek Tarifleri'nin kart
tasarımını örnek verdi — video oynatma ikonlu kapak fotoğrafı, tarifi
yapan aşçının adı/avatarı, görüntülenme/yorum sayısı. Vurguladığı asıl
nokta sorgulanabilir stok fotoğraf değil, **tarifi gerçekten yapan
kişinin o tarife özel çektiği gerçek fotoğraf** olması — yani "internetten
bulunan alakasız bir fotoğraf" ile "bu yemeği yapan kişinin kendi çektiği
fotoğraf" arasındaki fark. Bu, Nefis gibi çok-kullanıcılı bir platformda
doğal geliyor (binlerce katılımcı kendi tarifini kendi fotoğrafıyla
yüklüyor); Alganis Mutfak'ta tek yazar (kullanıcının kendisi) olduğu için
doğrudan uygulanamaz — ama kavram olarak "gerçek, o tarife özel çekilmiş
fotoğraf" hedefi hâlâ geçerli, sadece kaynağı farklı olmalı (ör. kullanıcı
zamanla kendi mutfağında pişirip fotoğrafladığı tarifleri elle ekleyebilir,
ya da aile/çevre paylaşırsa onların fotoğrafları kullanılabilir). **Henüz
karar verilmedi** — bu bir sonraki konuşmada netleşecek, plan burada
güncellenecek.

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

Faz 0 ve Faz 1 tamamlandı (sürüm 3.0.0'da yayınlandı). **Faz 2 (Dünya
mutfakları) sürüyor**: İtalyan 28/~40 tarifte durdu, Uzak Doğu ilk
partiyle (13/~35) başladı, Orta Doğu ilk partiyle (13/~30) başladı,
Meksika ilk partiyle (13/~25) başladı, Hint ilk partiyle (13/~25)
başladı, Balkan ilk partiyle (13/~25) başladı, Akdeniz ilk partiyle
(13/~25) başladı, Fransız ilk partiyle (13/~25) başladı — sekizi de
kasıtlı olarak tamamlanmadan bırakıldı, tek mutfağa saplanıp kalmamak
için (bkz. Durum bölümü). **8 mutfaklık ilk-parti turu tamamlandı**:
İtalyan ✓, Uzak Doğu ✓, Orta Doğu ✓, Meksika ✓, Hint ✓, Balkan ✓,
Akdeniz ✓, Fransız ✓ — hepsi en az bir partiyle temsil ediliyor
(sürüm 3.7.0, 988 tarif). **Sırada** — kullanıcı henüz yön belirtmedi;
olası seçenekler: (a) herhangi bir mutfağın kalan tariflerini
tamamlamak (Uzak Doğu ~22, İtalyan ~12, Orta Doğu ~17, Meksika ~12,
Hint ~12, Balkan ~12, Akdeniz ~12, Fransız ~12), (b) Faz 3'e (akıllı
öneri) geçmek, (c) görsel hattı konusunda yeni bir karar (bkz. Bölüm 6
"Görsel hattı durduruldu" — kullanıcının "Nefis Yemek Tarifleri" tarzı
gerçek/kendi çekilen fotoğraf fikri henüz karara bağlanmadı). Görsel
hattı 2026-09-10'da durduruldu — yeni tarifler görselsiz, SVG ikonla
eklenecek. Faz 3 (akıllı öneri) ve Faz 4 (pişirme deneyimi) henüz
başlamadı.
