# Arayüz referansları ve sadakat denetimi

> **Bu dosya neden var:** Referans tasarımlar sohbet oturumlarında paylaşıldı ve
> oturum temizlenince kayboldular; plan (`YOL-HARITASI.md` Bölüm 2) onlardan
> türetilmiş kararları taşıyordu ama görsellerin kendisi hiçbir yerde durmuyordu.
> Bu yüzden "tasarıma sadık kalındı mı?" sorusu bir süre cevaplanamadı.
> Buradaki döküm, görseller bir daha kaybolsa bile karşılaştırmanın
> yapılabilmesi için yazıldı.
>
> **Görsel dosyaları:** `tasarim/referans-1-ai-tarif.png` ve
> `tasarim/referans-2-cookshelf.png` adlarıyla bu klasöre konacak (dosyaları
> sohbete ekleyen kişi kaydetmeli — asistan sohbetteki görseli diske yazamıyor).
> Kaynak: <https://dribbble.com/shots/26870462-Food-Recipe-Mobile-App-UI-UX-Design>

---

## Referans 1 — AI destekli helal tarif uygulaması (turuncu)

### 1.1 · Açılış (onboarding)
Üstte ekranın ~%60'ını kaplayan tam taşma yemek fotoğrafı; altta beyaz kart:
başlık **"Huge Recipe Collection"**, iki satır açıklama, sol altta sayfa
noktaları (4 adım), sağ altta turuncu daire içinde ok düğmesi.

### 1.2 · Ana ekran
- **Üst başlık**: yuvarlak profil fotoğrafı + **"Welcome Naweed"** + altında
  ince gri satır *"What do you want to cook today?"*
- **Arama satırı**: geniş arama kutusu + yanında ayrı filtre düğmesi (kaydırıcı ikonu)
- **Vurgu kartı** (koyu zemin, sağında yemek fotoğrafı): **"Be Creative —
  Create halal dishes with AI using what you already have"** + turuncu hap
  düğme **"Start Creating"**
- **Kategori çipleri**: yatay kaydırmalı — Breakfast (aktif, turuncu dolgu) ·
  Lunch · Dinner · Din…
- **"Popular" bölümü**: yatay kaydırmalı kart şeridi. Her kart: köşeleri yuvarlak
  fotoğraf, fotoğrafın sol üstünde **mutfak rozeti ("Turkish")**, altında ad,
  **★4.7 (7.4k ratings)**, süre "30 Min", sağda yer imi ikonu
- **Alt menü**: Home · Blog · G.Recipe · Profile (dört sekme, aktif olan kırmızı)

### 1.3 · Tarif detayı
- Tam taşma kahraman fotoğraf (~%45), üstünde daire içinde geri ve paylaş düğmeleri
- Beyaz sayfa: **renkli iki çip** — "Lunch" (mavi) ve "Medium" (sarı)
- Başlık **"Chicken kebab"** + sağda yer imi
- **★4.4 (6.4k ratings)**
- İki satır tanıtım metni + **"View More"** bağlantısı
- **Dört besin halkası**: 320 Kcal · 30g Carb · 20g Protein · 15g fat —
  her biri renkli yay (yeşil/turuncu/turuncu/kırmızı) içinde sayı
- **Ingredients / Instructions sekmeleri** (Ingredients aktif, turuncu dolgu)
- Malzeme listesi: solda küçük ikon, ortada ad, sağda miktar ("Yogurt (curd)
  — 1/2 cup")
- Sağ altta yüzen turuncu **"Review"** düğmesi

---

## Referans 2 — Cookshelf (yeşil)

### 2.1 · Kilit açma / abonelik ekranı
"Ready to Unlock Your Cookbooks?", yemek kitabı kapaklarından ızgara, koyu
kartta **"Weeks $39.80 · Save 33%"** ve yeşil tikli özellik listesi, yeşil
**"Get Started for Free"** düğmesi, altında "Redeem Code".
→ **Bu ekran bilinçli olarak alınmadı** (bkz. aşağıdaki tablo).

### 2.2 · Ana ekran
- Başlık **"Cookshelf"** + sağda ayar dişlisi
- Arama kutusu + yanında yeşil daire filtre düğmesi
- Sarı **boş durum kartı**: "Looking Empty Here" + aşçı/kitap illüstrasyonu +
  siyah "Create Book Shelf" düğmesi
- **Recipes / Books ikili geçişi** (Recipes aktif, yeşil)
- **Filtre açılırları**: `Dish ∨` · `Cuisine ∨` · `Available Online ∨` · `D…`
- Tarif kartları ızgarası; kartın altında kaynak/atıf satırı
  ("Inspired By Marcella… Italian Cooking Guide")
- **Yüzen hap biçimli alt menü**: koyu zemin, üç ikon, aktif olan yeşil daire

### 2.3 · Tarif detayı
- Tam taşma koyu kahraman fotoğraf; üstte daire içinde geri, takvim, paylaş
- **Küçük görsel şeridi** (4 küçük kare, seçili olanın kenarı yeşil)
- Başlık **"Golden Fried Chicken"** + yer imi
- **"Page 203 · ★4.9 (76 reviews)"**
- Kitap referans kartı: kapak küçük görseli + "Classic Italian Essentials" +
  açıklama + `foodandwine.com` bağlantısı
- Tam genişlik yeşil ana eylem düğmesi **"Add to Your Shelf"**

---

## Dribbble açıklamasındaki özellik listesi

| Onlarda | Bizdeki karşılığı | Durum |
|---|---|---|
| AI-Powered Recipes (kişiselleştirilmiş öneri) | Cihaz içi puanlama: mevsim, saat, geçmiş, favori | Faz 3 |
| Smart Ingredient Detection (buzdolabındakini gir) | **Çekirdek özelliğimiz** — Mutfağım + "Bugün ne pişirsem?" | Var, daha güçlü |
| Clean & Modern UI | Faz 1 kabuğu | Kod tamam |
| Step-by-Step Cooking Guide | Pişirme modu (ekran uyanık kalır) | Var |
| Global Cuisine Library | Dünya sekmesi + mutfak alanı | Şema var, **ekran yok** |
| Quick & Healthy Options | Süre/zorluk filtresi + yaklaşık besin değeri | Var |
| Save & Favorite Recipes | Favoriler + koleksiyonlar | Favori var, koleksiyon Faz 3 |

---

## Sadakat denetimi (2026-09-09)

`✅` uygulandı · `🟡` kısmen/yeri farklı · `🔴` yapılmadı · `⛔` bilinçli reddedildi

| # | Referanstaki öğe | Alganis Mutfak'taki hali | |
|---|---|---|---|
| 01 | Yüzen hap alt menü, ortada eylem düğmesi | `index.html:181` — hap menü + ortada "Bugün ne pişirsem?" FAB'ı | ✅ |
| 02 | Ingredients / Instructions sekmeleri | `td-sekmeler` → Malzemeler / Yapılışı | ✅ |
| 03 | Kategori çipleri (yatay, aktif vurgulu) | `ciz_ogunSerit()` — üstelik adet rozetli, sadece gerçekten yapılabilen gruplar çıkıyor | ✅ |
| 04 | Dört kart tipi | `ui.tarifKarti(kayit, varyant)` — kahraman/ızgara/liste/şerit | ✅ |
| 05 | Tam taşma kahraman fotoğraf (detayda) | `gorsel.kutu(t, "gk-panel")` | ✅ |
| 06 | Selamlama ("Welcome Naweed / What do you want to cook today?") | `ui.selamlama()` var ama **kahraman kartın içinde etiket olarak** (`arayuz.js:163`); referansta ekranın en üstünde, avatarla. Üst başlıkta sabit "Bugün ne pişirsem?" duruyor | 🟡 |
| 07 | Dört besin halkası (renkli yay) | `besinSatiri()` dört değeri veriyor ama **kenarlıklı kutu**, halka değil; renk yok. Gerekçe kodda yazılı (`arayuz.js:209`): hedef/limit göstermeme kararı — renk "iyi/kötü" der | 🟡 gerekçeli |
| 08 | "Popular" yatay kaydırmalı kart şeridi | Kapatıldı (2026-09-09): Bugün ekranında kahramanın altında **"Diğer seçenekler"** şeridi — `ciz_digerSecenekler()`, `serit` varyantını kullanıyor | ✅ |
| 09 | Ana ekranda arama kutusu | Kapatıldı: Bugün ekranının en üstünde arama kutusu görünümlü düğme — dokununca Tarifler ekranına gidip oradaki gerçek kutuya odaklanıyor (mantık tekrarlanmadı) | ✅ |
| 10 | Kartın üstünde mutfak rozeti ("Turkish") | Mutfak rozeti **yalnızca detay panelinde** (`arayuz.js:243`), kartta yok | 🔴 Faz 2 ile |
| 11 | Filtre açılırları: Dish · **Cuisine** · Available | Öğün/süre/zorluk/etsiz var; **mutfak filtresi yok** — Faz 2'nin eksik parçası | 🔴 Faz 2 ile |
| 12 | Tarif tanıtım metni + "View More" | Tariflerde **açıklama/özet alanı yok** (yalnızca `ip` = püf noktası). Karar (2026-09-09): sadece dünya mutfağı tariflerine elle yazılacak — Türk tarifleri için gereksiz, 897'sine elle yazmak da çok pahalı | 🔴 Faz 2 ile |
| 13 | ★ puan ve yorum sayısı | Yabancıların puanı alınmıyor; **kendi puanın + kendi notun** gelecek | Faz 3 |
| 14 | Yer imi ikonu (her kartta) | Favori kalbi **yalnızca favoriyse** görünüyor; kartta ekleme düğmesi yok | 🟡 |
| 15 | Çoklu fotoğraf şeridi (detayda) | Tarif başına tek görsel | 🔴 düşük öncelik |
| 16 | Paylaş düğmesi | Kapatıldı: `btnPaylas`, Web Share API — desteklenmiyorsa sessizce gizli kalıyor (wake lock ile aynı desen) | ✅ |
| 17 | Açılış tanıtım karuseli | Yok — ilk açılışta doğrudan Mutfağım ekranına düşülüyor | 🔴 Faz 4 |
| 18 | Boş durum kartı (illüstrasyonlu) | `bosMutfakUyari` var, illüstrasyon yok | 🟡 |
| 19 | Renkli anlamsal çipler (mavi öğün / sarı zorluk) | Kapatıldı: detay panelindeki rozet altıdan dörde indi — mutfak+kategori düz metin altbaşlığa taşındı (`td-alt-baslik`), süre+zorluk rozet olarak kaldı, etsiz/fırın koşullu | ✅ |
| 20 | Abonelik / paywall ekranı, "Save 33%" | Alınmıyor — veri istemeden çalışmaz; gelir modeli de ertelendi | ⛔ |
| 21 | Hesap, bulut senkron, yorum akışı | Alınmıyor — uygulamanın ilk kuralı | ⛔ |
| 22 | Kitap rafı / "Add to Your Shelf" | Kitap kavramı yok; karşılığı **koleksiyonlar** | ⛔→Faz 3 |
| 23 | Kartta dış kaynak bağlantısı (`foodandwine.com`) | Dış bağlantı yasağı; fotoğraf atfı `_kaynaklar.csv` ile çözülüyor | ⛔ |

**Özet (2026-09-09 güncellemesi):** Alt menü, sekmeler, çipler, kart sistemi ve
kahraman görsel referansa uygun kuruldu. Sapmaların ikisi gerekçeli (besin
halkası, reddedilen ekranlar). Faz 1 artıklarının dördü (08, 09, 16, 19)
kapatıldı — `node tools/arayuz-testi.js` (21/21) ve özel bir CDP betiğiyle
tek tek doğrulandı. Geri kalan üç madde (10, 11, 12) bilinçli olarak **Dünya
ekranıyla birlikte** yapılacak — üçü de mutfak kavramı olmadan anlamsız
(Türk tarifi kartında "Türk" rozeti, tek mutfaklı bir kataloğa mutfak filtresi
eklemek gibi). 17 zaten Faz 4'te.

---

## Bunlardan çıkan işler

1. ✅ **Şerit varyantını bağla** (madde 08) — `ekran-bugun.js`: `ciz_digerSecenekler()`.
2. ✅ **Bugün ekranına arama** (madde 09) — `btnBugunAramaKisayol`, Tarifler ekranına yönlendirip odaklıyor.
3. ⬜ **Kartta mutfak rozeti** (madde 10) — Dünya ekranı işiyle birlikte.
4. ⬜ **Mutfak filtresi** (madde 11) — Dünya ekranı işiyle birlikte.
5. ⬜ **Tarife `ozet` alanı** (madde 12) — Dünya mutfağı tarifleri için, elle;
   Faz 2 içerik işiyle birlikte yazılacak (karar 2026-09-09'da verildi).
6. ✅ **Paylaş düğmesi** (madde 16) — `btnPaylas`, Web Share API.
7. ✅ **Rozet şeridini sadeleştir** (madde 19) — mutfak+kategori `td-alt-baslik`'e
   taşındı, rozet-satir'da süre+zorluk (+koşullu etsiz/fırın) kaldı.

1-2-6-7 tamamlandı ve `node tools/arayuz-testi.js` (21/21) ile doğrulandı.
3-4-5 kasıtlı olarak Dünya ekranı işine bırakıldı.
