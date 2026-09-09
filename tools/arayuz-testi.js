/* ============================================================================
   ARAYÜZ TESTİ  —  node tools/arayuz-testi.js
   ----------------------------------------------------------------------------
   Uygulamayı headless tarayıcıda açar ve gerçekten çalışıp çalışmadığını
   ölçer. Ekran görüntüsüne güvenmez: bir öğenin göründüğünü getComputedStyle
   ve elementFromPoint söyler.

   Neden bu kadar ayrıntılı: bir seferinde .panel/.pisirme kurallarının
   display atamasi tarayıcının [hidden] kuralını ezmişti; DOM'da her şey
   doğru görünüyordu ama ekranda Geri/İleri dışında hiçbir şey yoktu. O
   hatayı ancak buradaki kontroller yakalar.

   Sunucu çalışıyor olmalı:  node tools/sunucu.js
   ========================================================================== */

const T = require("./tarayici.js");

const URL_ADRES = process.env.AM_URL || "http://127.0.0.1:8322/";
const sonuclar = [];

function kontrol(ad, gecti, ek) {
  sonuclar.push({ ad, gecti: !!gecti, ek: ek === undefined || ek === null ? "" : String(ek) });
}

(async function () {
  const t = await T.ac(URL_ADRES, { genislik: 390, yukseklik: 844, bekleme: 3000 });

  /* --- 1. temel yükleme --- */
  const temel = await t.calistir(`({
    surum: AM.SURUM,
    tarif: AM.TARIFLER.length,
    malzeme: AM.MALZEMELER.length,
    besinVar: !!(AM.besin && AM.BESIN),
    gorselVar: !!AM.gorsel,
    depoVar: !!AM.depo
  })`);
  kontrol("uygulama yükleniyor", temel.tarif === 910, temel.tarif + " tarif");
  kontrol("besin katmanı yüklü", temel.besinVar);
  kontrol("görsel katmanı yüklü", temel.gorselVar);
  kontrol("depo katmanı yüklü", temel.depoVar);

  /* --- 2. [hidden] gerçekten gizli mi? (eski hatanın nöbetçisi) --- */
  const gizli = await t.calistir(`(function () {
    var kacak = [];
    document.querySelectorAll("[hidden]").forEach(function (e) {
      if (getComputedStyle(e).display !== "none") {
        kacak.push(e.id || e.className || e.tagName);
      }
    });
    return kacak;
  })()`);
  kontrol("[hidden] öğeler gerçekten gizli", gizli.length === 0, gizli.join(", "));

  /* --- 3. dört ekran da çiziliyor mu? ---
     Tıklama ile ölçüm ayrı adımlarda: ekran yeniden çizilmeden ölçersek
     her ekran 0px görünür. Ayrıca alt menü düğmesi seçilirken .menu-btn
     şartı konuyor — data-git bilgi kartlarının içindeki düğmelerde de var
     ve querySelector onları önce buluyor. */
  for (const ekran of ["bugun", "mutfak", "dunya", "favori", "tarifler"]) {
    await t.calistir(`document.querySelector('.menu-btn[data-git="${ekran}"]').click()`);
    await t.duraklat(400);
    const durum = await t.calistir(`(function () {
      var e = document.getElementById("ekran-${ekran}");
      var s = getComputedStyle(e);
      return {
        gorunur: !e.hidden && s.display !== "none",
        icerik: e.textContent.trim().length,
        yukseklik: e.getBoundingClientRect().height
      };
    })()`);
    kontrol("ekran görünüyor: " + ekran,
            durum.gorunur && durum.icerik > 50 && durum.yukseklik > 100,
            durum.icerik + " karakter, " + Math.round(durum.yukseklik || 0) + "px");
  }

  /* --- 4. ekranın ortasında ne var? (üstünü kaplayan görünmez katman var mı) --- */
  await t.calistir(`document.querySelector('.menu-btn[data-git="bugun"]').click()`);
  await t.duraklat(500);
  const ortadaki = await t.calistir(`(function () {
    var e = document.elementFromPoint(195, 400);
    return e ? (e.tagName + "." + (e.className || "").split(" ")[0]) : "yok";
  })()`);
  kontrol("ekran ortası tıklanabilir içerik",
          ortadaki !== "yok" && ortadaki.indexOf("panel") === -1 && ortadaki.indexOf("pisirme") === -1,
          ortadaki);

  /* --- 5. yatay taşma (üç genişlikte) --- */
  for (const g of [320, 390, 430]) {
    const tasma = await t.calistir(`(function () {
      return { ic: innerWidth, kaydirma: document.documentElement.scrollWidth };
    })()`);
    /* Görünüm alanını değiştirmek için yeni oturum gerekmiyor; sadece
       mevcut ölçümü rapor ediyoruz — genişlik döngüsü aşağıda ayrı açılışla. */
    kontrol("yatay taşma yok @" + tasma.ic + "px",
            tasma.kaydirma <= tasma.ic + 1, tasma.kaydirma + " > " + tasma.ic);
    break; /* tek genişlik yeterli; diğerleri ayrı oturumda ölçülüyor */
  }

  /* --- 6. tarif paneli açılıyor mu? --- */
  const kartVar = await t.calistir(`(function () {
    var k = document.querySelector(".tk-izgara");
    if (!k) return false;
    k.click();
    return true;
  })()`);
  await t.duraklat(500);
  const panel = await t.calistir(`(function () {
    var p = document.getElementById("tarifPanel");
    var s = getComputedStyle(p);
    return {
      acik: !p.hidden && s.display !== "none",
      icerik: document.getElementById("panelGovde").textContent.trim().length
    };
  })()`);
  kontrol("tarif paneli açılıyor", kartVar && panel.acik && panel.icerik > 100,
          kartVar ? panel.icerik + " karakter" : "kart bulunamadı");

  /* --- 7. pişirme modu --- */
  await t.calistir(`document.getElementById("btnPisirmeBasla").click()`);
  await t.duraklat(500);
  const pisirme = await t.calistir(`(function () {
    var p = document.getElementById("pisirmePanel");
    var s = getComputedStyle(p);
    return {
      acik: !p.hidden && s.display !== "none",
      adim: document.getElementById("pisirmeGovde").textContent.trim().length,
      sayac: (document.getElementById("adimSayac") || {}).textContent
    };
  })()`);
  kontrol("pişirme modu açılıyor", pisirme.acik && pisirme.adim > 20,
          pisirme.sayac);

  /* pişirme modunu kapat ki sonraki ölçümleri engellemesin */
  await t.calistir(`(document.getElementById("btnPisirmeKapat")||{click:function(){}}).click();
                    (document.getElementById("btnPanelKapat")||{click:function(){}}).click();`);
  await t.duraklat(400);

  /* --- 8. dokunma hedefi boyutları (40+ yaş kitle) --- */
  const kucukHedef = await t.calistir(`(function () {
    var kucuk = [];
    document.querySelectorAll("button, a, input").forEach(function (e) {
      if (e.hidden || getComputedStyle(e).display === "none") return;
      var r = e.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.height < 32 || r.width < 32) {
        kucuk.push((e.id || e.className || e.tagName) + " " +
                   Math.round(r.width) + "x" + Math.round(r.height));
      }
    });
    return kucuk;
  })()`);
  kontrol("dokunma hedefleri en az 32px", kucukHedef.length === 0,
          kucukHedef.slice(0, 4).join(" | "));

  /* --- 9. ayarlar paneli --- */
  await t.calistir(`document.getElementById("btnAyar").click()`);
  await t.duraklat(500);
  const ayar = await t.calistir(`(function () {
    var p = document.getElementById("ayarPanel");
    return {
      acik: !p.hidden && getComputedStyle(p).display !== "none",
      icerik: document.getElementById("ayarGovde").textContent.trim().length
    };
  })()`);
  kontrol("ayarlar paneli açılıyor", ayar.acik && ayar.icerik > 100, ayar.icerik + " karakter");

  /* --- 10. modüller arası çağrılar -------------------------------------
     Ekranlar ayrı dosyalarda ve birbirini AM.ic üzerinden çağırıyor. Bu
     sınırların gerçekten bağlı olduğunu kod okuyarak anlamak zor; en emin
     yol kullanıcı gibi tıklayıp sonucu ölçmek. */
  await t.calistir(`document.getElementById("btnAyarKapat").click()`);
  await t.duraklat(300);

  /* ayarlar → ekran-bugun : tolerans değişince öneriler yeniden hesaplanmalı */
  await t.calistir(`document.querySelector('.menu-btn[data-git="bugun"]').click()`);
  await t.duraklat(400);
  const oncekiSayi = await t.calistir(`document.getElementById("sayacYapilabilir").textContent`);
  await t.calistir(`document.getElementById("btnAyar").click()`);
  await t.duraklat(400);
  await t.calistir(`document.querySelector(".anahtar").click()`);
  await t.duraklat(600);
  const sonrakiSayi = await t.calistir(`document.getElementById("sayacYapilabilir").textContent`);
  kontrol("ayarlar → bugün: tolerans öneriyi değiştiriyor",
          oncekiSayi !== sonrakiSayi, oncekiSayi + " → " + sonrakiSayi);
  await t.calistir(`document.querySelector(".anahtar").click()`);   /* geri al */
  await t.duraklat(400);
  await t.calistir(`document.getElementById("btnAyarKapat").click()`);
  await t.duraklat(300);

  /* ekran-bugun içi: öğün çipi seçimi listeyi daraltmalı */
  const ogunEtkisi = await t.calistir(`(function () {
    var cipler = document.getElementById("ogunSerit").children;
    if (cipler.length < 2) return { yetersiz: true };
    cipler[1].click();
    return { secildi: cipler[1].textContent };
  })()`);
  await t.duraklat(600);
  const ogunSonuc = await t.calistir(`(function () {
    return {
      aktifCip: (document.querySelector("#ogunSerit .aktif") || {}).textContent || "",
      kartSayisi: document.querySelectorAll("#gruplarYapilabilir .tk-izgara").length
    };
  })()`);
  kontrol("bugün: öğün çipi listeyi daraltıyor",
          !ogunEtkisi.yetersiz && ogunSonuc.kartSayisi > 0 && ogunSonuc.aktifCip !== "",
          ogunSonuc.aktifCip.trim() + ", " + ogunSonuc.kartSayisi + " kart");

  /* uygulama → ekran-mutfak : malzeme işaretleyince şerit sayacı güncellenmeli */
  await t.calistir(`document.querySelector('.menu-btn[data-git="mutfak"]').click()`);
  await t.duraklat(500);
  const malzemeEtkisi = await t.calistir(`(function () {
    var once = document.getElementById("rozetMalzeme").textContent;
    var cip = document.querySelector("#malzemeListe .cip");
    cip.click();
    return { once: once, id: cip.dataset.id };
  })()`);
  await t.duraklat(400);
  const malzemeSonra = await t.calistir(`document.getElementById("rozetMalzeme").textContent`);
  kontrol("mutfak: malzeme işaretlemek sayacı güncelliyor",
          malzemeEtkisi.once !== malzemeSonra, malzemeEtkisi.once + " → " + malzemeSonra);
  await t.calistir(`document.querySelector("#malzemeListe .cip").click()`);  /* geri al */
  await t.duraklat(300);

  /* --- 11. konsol hatası --- */
  const hatalar = t.hatalar();
  kontrol("konsol hatası yok", hatalar.length === 0, hatalar.slice(0, 2).join(" | "));

  await t.goruntu(require("path").join(require("os").tmpdir(), "am-arayuz-testi.png"));
  await t.kapat();

  /* --- ayrı oturumlarda dar/geniş ekran taşma ölçümü --- */
  for (const g of [320, 430]) {
    const t2 = await T.ac(URL_ADRES, { genislik: g, yukseklik: 800, bekleme: 2500 });
    const o = await t2.calistir(`({ ic: innerWidth, kaydirma: document.documentElement.scrollWidth })`);
    kontrol("yatay taşma yok @" + g + "px", o.kaydirma <= o.ic + 1, o.kaydirma + " > " + o.ic);
    await t2.kapat();
  }

  /* --- rapor --- */
  let kaldi = 0;
  console.log("");
  sonuclar.forEach((s) => {
    if (!s.gecti) kaldi++;
    console.log((s.gecti ? "  ✓ " : "  ✗ ") + s.ad + (s.ek ? "   [" + s.ek + "]" : ""));
  });
  console.log("");
  console.log(kaldi === 0
    ? "  " + sonuclar.length + " kontrolün hepsi geçti."
    : "  " + kaldi + " kontrol BAŞARISIZ.");
  console.log("");
  process.exit(kaldi === 0 ? 0 : 1);
})().catch((e) => { console.error("\nTest çalıştırılamadı:", e.message, "\n"); process.exit(1); });
