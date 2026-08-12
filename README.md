# Alganis Mutfak — "Bugün ne pişirsem?"

Evdeki malzemeleri tıklayarak işaretlersin, uygulama o malzemelerle
yapabileceğin yemekleri söyler. **283 tarif**, **185 malzeme**.
İnternetsiz çalışır, telefona uygulama gibi kurulur, hiçbir veri toplamaz.

---

## İçindekiler

- [Hızlıca dene](#hızlıca-dene)
- [Yayınlama — GitHub Pages](#yayınlama--github-pages)
- [Anneye nasıl anlatılır](#anneye-nasıl-anlatılır)
- [Güncelleme yayınlama](#güncelleme-yayınlama)
- [Yeni tarif ekleme](#yeni-tarif-ekleme)
- [Güvenlik ve gizlilik](#güvenlik-ve-gizlilik)
- [Dosya düzeni](#dosya-düzeni)

---

## Hızlıca dene

```bash
node tools/sunucu.js
```

Sonra tarayıcıda `http://localhost:8321` adresini aç.

> Dosyayı çift tıklayarak da açabilirsin, uygulama çalışır — ama çevrimdışı
> katmanı (service worker) yalnızca gerçek bir adres üzerinden devreye girer.

Tarifleri değiştirdikten sonra veri tutarlılığını kontrol et:

```bash
node tools/veri-kontrol.js
```

---

## Yayınlama — GitHub Pages

**Bu adımlar tamamlandı.** Uygulama şu adreste yayında:

```
https://reversideniz-afk.github.io/alganis-mutfak/
```

Depo: [github.com/reversideniz-afk/alganis-mutfak](https://github.com/reversideniz-afk/alganis-mutfak)

> ### ⚠️ Aşağıdaki komutlar TERMİNALE yazılır
>
> Bu bölümdeki `git ...` satırları **bilgisayarındaki komut satırına** (PowerShell
> ya da Git Bash) yazılacak komutlardır — GitHub sitesinde dosya içeriği olarak
> yapıştırılacak metin değil.
>
> Windows'ta: proje klasöründe boş bir yere **sağ tık → "Open in Terminal"**,
> sonra komutları tek tek yapıştırıp Enter.

### İlk kurulum (bir kez yapılır, yapıldı)

<details>
<summary>Sıfırdan yeni bir depoya yayınlamak istersen adımlar</summary>

**1. GitHub'da boş bir depo aç**

[github.com/new](https://github.com/new) → ad: `alganis-mutfak` → **Public** seç
→ "Add a README" gibi kutuların hiçbirini işaretleme → **Create repository**.

**2. Bu klasörü depoya gönder** — proje klasöründe açtığın terminale:

```bash
git init -b main
```

```bash
git add .
```

```bash
git commit -m "Alganis Mutfak ilk sürüm"
```

```bash
git remote add origin https://github.com/KULLANICI-ADIN/alganis-mutfak.git
```

```bash
git push -u origin main
```

`KULLANICI-ADIN` yerine kendi GitHub kullanıcı adını yaz.

**3. Pages'i aç**

Depo sayfasında **Settings** → sol menüden **Pages** →
*Build and deployment* altında **Source: Deploy from a branch**,
**Branch: main**, klasör **/ (root)** → **Save**.

1-2 dakika sonra adres hazır olur.

</details>

### Önemli: dosyalar deponun KÖKÜNDE olmalı

GitHub Pages yayını deponun kökünden yapar. `index.html` kökte görünmüyorsa
(örneğin bir alt klasörün içindeyse) adres 404 verir. Depo ana sayfasında
`index.html`, `css`, `js`, `data`, `icons` doğrudan listeleniyor olmalı.

---

## Anneye nasıl anlatılır

Gönderilecek link:

```
https://reversideniz-afk.github.io/alganis-mutfak/
```

> `http://localhost:8322` adresi **sadece kendi bilgisayarında** çalışır.
> `localhost` "bu cihaz" demektir; telefonda açılmaz. Telefona yukarıdaki
> github.io adresini gönder.

Telefonda linki aç, sonra:

- **Android (Chrome):** sağ üstteki ⋮ → **Uygulamayı yükle** / *Ana ekrana ekle*
- **iPhone (Safari):** alttaki paylaş simgesi → **Ana Ekrana Ekle**

Ana ekranda tencere ikonuyla bir uygulama belirir. Açıldığında tarayıcı
çubuğu görünmez, normal bir uygulama gibi çalışır ve **internet olmadan da açılır.**

İlk açılışta uygulama "Mutfağım" ekranıyla karşılar ve mutfakta hemen her zaman
bulunan malzemeleri (tuz, un, yağ, soğan, salça…) kendisi işaretler. Anne sadece
olmayanlara dokunup kaldırır, dolapta ne varsa ekler. Sonra alttaki **Bugün**
sekmesi ne pişirebileceğini söyler.

**Bugün** ekranında öneriler sofra düzenine göre gruplanır: Çorbalar, Ana
Yemekler, Pilav & Makarna, Ara Sıcaklar, Salata & Meze, Hamur İşi, Kahvaltılık,
Tatlılar. Üstteki şeritten bir tür seçilirse hem günün önerisi hem listeler o
türe göre daralır — "bugün canım çorba istiyor" dendiğinde tek dokunuş yetiyor.

Seçimler telefonda kalır. Uygulama kapanıp açıldığında bir daha malzeme sormaz,
doğrudan öneriyi gösterir.

Ayarlardan görünüm **Gün ışığı** (varsayılan, beyaz ve aydınlık), **Gece** ya da
**Telefona uy** olarak değiştirilebilir; yazı boyutu üç kademelidir.

---

## Güncelleme yayınlama

Kullanıcının hiçbir şey yapması gerekmez, link de değişmez. Sadece **iki yerdeki
sürüm numarasını aynı anda artır**:

| Dosya | Satır |
|---|---|
| `data/surum.js` | `AM.SURUM = "1.1.0";` |
| `sw.js` | `const SURUM = "1.1.0";` |

Örneğin ikisini de `"1.2.0"` yap, sonra:

```bash
git add . && git commit -m "Tatlı tarifleri eklendi" && git push
```

Anne uygulamayı bir sonraki açışında yeni dosyalar arka planda iner ve ekranda
**"Yeni tarifler hazır! [Güncelle]"** bildirimi çıkar. Dokunması yeterli.

> **Sürümü artırmayı unutursan** eski dosyalar önbellekten sunulmaya devam eder
> ve değişiklikler görünmez. Bir şey değiştirdiysen sürümü de artır.

Kendi bilgisayarında test ederken aynı durum başına gelirse: tarayıcı konsoluna
şunu yapıştırıp sayfayı yenile —

```js
navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));
caches.keys().then(a => a.forEach(k => caches.delete(k)));
```

---

## Yeni tarif ekleme

Tarifler `data/` klasöründe kategoriye göre ayrılmış düz JavaScript dosyalarında.
Herhangi birini aç, listenin sonuna yeni bir kayıt ekle:

```js
{ id:"kabak-mucveri-2", ad:"Fırında Mücver", kat:"sebze", em:"🥒",
  sure:45, zor:1, por:4,
  m:[["kabak",4,"adet"],
     ["yumurta",3,"adet"],
     ["un",5,"yemek kaşığı","yrd"],
     ["dereotu",0.5,"demet","ops"]],
  y:["Kabakları rendeleyip suyunu sık.",
     "Diğer malzemelerle karıştır.",
     "Yağlanmış tepside 190°C fırında 30 dakika pişir."],
  ip:"Kabağın suyunu sıkmazsan hamurlaşır." }
```

**Alan alan ne demek:**

| Alan | Anlamı |
|---|---|
| `id` | Benzersiz anahtar. **Yayınladıktan sonra asla değiştirme** — favoriler buna bağlı. |
| `ad` | Ekranda görünen isim |
| `kat` | `data/surum.js` içindeki kategori id'lerinden biri |
| `em` | Kart emojisi |
| `sure` | Toplam dakika |
| `zor` | `1` kolay · `2` orta · `3` ustalık ister |
| `por` | Bu ölçüler kaç kişilik (porsiyon çarpanı buna göre hesaplar) |
| `m` | Malzemeler → `["id", miktar, "birim", rol, "not"]` |
| `y` | Hazırlanış adımları |
| `ip` | Püf noktası (isteğe bağlı) |

**Malzeme rolleri — uygulamanın kalbi burası:**

| Rol | Anlamı | Öneriye etkisi |
|---|---|---|
| *(boş)* = `"ana"` | Bu olmadan yemek o yemek olmaz | Yoksa yemek önerilmez |
| `"yrd"` | Önemli ama olmasa da olur | Yoksa "havuçsuz da olur" notuyla yine önerilir |
| `"ops"` | Süs / servis malzemesi | Hiçbir zaman engel değil |

Patatesli yemekte patates `ana`, mercimek çorbasındaki havuç `yrd`,
üzerine serpilen maydanoz `ops` olmalı. Doğru işaretlersen öneriler isabetli olur.

**Birkaç ince nokta:**

- `"sivi-yag|tereyagi"` → ikisinden **biri** varsa yeterli.
- Miktar yerine `null` yazarsan sadece birim metni görünür: `["tuz",null,"bir tutam","ops"]`
- Malzeme id'leri `data/malzemeler.js` dosyasında. Listede olmayan bir şey
  gerekiyorsa önce oraya ekle.
- `etsiz` ve `fırınsız` etiketleri otomatik hesaplanır, elle yazma.

**Öğün grubu:** Tarif, "Bugün" ekranında kategorisine göre otomatik gruplanır
(`AM.KAT_GRUP`, `data/surum.js`). Sofrada ara sıcak sayılan bir şeyse — mücver,
sigara böreği, çıtır tavuk gibi — tarifin id'sini `AM.ARA_SICAKLAR` listesine
ekle; kategorisi ne olursa olsun "Ara Sıcaklar" başlığı altında görünür.

Ekledikten sonra:

```bash
node tools/veri-kontrol.js
```

"SORUN YOK" yazmıyorsa yayınlama — hatayı söyler.

### Yeni bir kategori dosyası eklersen

Örneğin `data/tarifler-icecek.js` oluşturduysan üç yeri güncelle:

1. `index.html` → script listesine ekle
2. `sw.js` → `DOSYALAR` listesine ekle
3. `data/surum.js` → yeni bir kategori tanımla (`AM.TARIF_KATEGORILERI`)

Sonra her iki dosyadaki sürüm numarasını artır.

---

## Güvenlik ve gizlilik

Uygulamanın tasarım kararı: **hiçbir veri cihazdan çıkmaz.**

- Sunucu yok, hesap yok, giriş yok, çerez yok, analytics yok.
- `index.html` içindeki `Content-Security-Policy` dışarıya bağlantıyı tarayıcı
  seviyesinde yasaklar. Kod isteseydi bile veri gönderemezdi.
- Hiçbir CDN, dış font, dış görsel yok — her şey bu klasörde.
- Arayüzde hiçbir yerde `innerHTML` kullanılmaz; her düğüm tek tek oluşturulur,
  metin daima metin olarak kalır.
- Sorulan tek şey "evde şu var mı?" — isim, konum, e-posta, telefon istenmez.
- Saklanan tek veri: işaretli malzemeler, favoriler ve iki ayar. Hepsi telefonun
  kendi `localStorage` alanında. Ayarlar → "Seçimlerimi ve favorilerimi sil"
  ile tek dokunuşta silinir.
- Kayıtlı veri okunurken doğrulanır: bilinmeyen id'ler ve bozuk JSON sessizce atılır.

Ekran uyanık tutma (pişirme modunda) tarayıcının Wake Lock iznini kullanır;
desteklenmiyorsa uygulama sessizce onsuz devam eder.

---

## Dosya düzeni

```
Alganis Mutfak/
├─ index.html                  Uygulama iskeleti
├─ manifest.webmanifest        Telefona kurulum bilgileri
├─ sw.js                       Çevrimdışı katmanı + güncelleme  ← SÜRÜM BURADA
├─ css/style.css               Tema, doodle'lar, koyu mod
├─ js/
│  ├─ depo.js                  localStorage (doğrulamalı)
│  ├─ eslestir.js              Öneri motoru (ana/yrd/ops mantığı)
│  ├─ arayuz.js                Kart, tarif, ölçü biçimlendirme
│  └─ uygulama.js              Ekranlar, olaylar, pişirme modu
├─ data/
│  ├─ malzemeler.js            185 malzeme, kategorili
│  ├─ surum.js                 Sürüm + kategoriler + öğün grupları  ← SÜRÜM BURADA
│  └─ tarifler-*.js            283 tarif, 11 dosya
├─ icons/                      PWA ikonları (üretilmiş)
└─ tools/
   ├─ sunucu.js                Yerel test sunucusu
   ├─ veri-kontrol.js          Tarif verisi doğrulayıcı
   └─ ikon-uret.js             İkonları yeniden çizer
```

### Tarif sayıları

| Kategori | Adet |
|---|---:|
| Çorbalar | 31 |
| Sebze & Zeytinyağlı | 44 |
| Etli Yemekler | 34 |
| Tavuk | 18 |
| Balık & Deniz | 13 |
| Bakliyat | 18 |
| Pilav & Makarna | 26 |
| Hamur İşi | 26 |
| Kahvaltılık | 19 |
| Salata & Meze | 28 |
| Tatlılar | 26 |
| **Toplam** | **283** |

---

## Tarifler hakkında

Ölçüler Türk ev mutfağının yerleşik oranlarına dayanıyor; kritik olanlar
(pilav su oranı, sütlaç süt-pirinç oranı, kısır bulgur-su oranı, mantı hamuru,
şerbet oranları) yaygın kaynaklarla karşılaştırılarak yazıldı. Yine de her
mutfak, her ocak ve her malzeme farklıdır — tarifler başlangıç noktasıdır,
kesin reçete değil. Tuzu ve kıvamı kendi damak tadına göre ayarla.
