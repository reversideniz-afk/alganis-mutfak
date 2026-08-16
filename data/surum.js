/* ============================================================================
   SÜRÜM VE TARİF KATEGORİLERİ

   YENİ SÜRÜM YAYINLARKEN:
     1) Aşağıdaki AM.SURUM değerini artır (örn. "1.1.0").
     2) sw.js dosyasındaki SURUM sabitini AYNI değere getir.
   Bu ikisi eşleştiğinde, uygulama kullanıcının telefonunda kendini günceller ve
   "Yeni tarifler hazır!" bildirimi çıkar. Kullanıcının hiçbir şey yapması
   gerekmez, link de değişmez.
   ========================================================================== */

window.AM = window.AM || {};

AM.SURUM = "2.1.1";

AM.TARIF_KATEGORILERI = [
  { id: "corba",    ad: "Çorbalar",            emoji: "🍜" },
  { id: "sebze",    ad: "Sebze & Zeytinyağlı", emoji: "🥬" },
  { id: "etli",     ad: "Etli Yemekler",       emoji: "🥩" },
  { id: "tavuk",    ad: "Tavuk",               emoji: "🍗" },
  { id: "balik",    ad: "Balık & Deniz",       emoji: "🐟" },
  { id: "bakliyat", ad: "Bakliyat",            emoji: "🫘" },
  { id: "pilav",    ad: "Pilav & Makarna",     emoji: "🍚" },
  { id: "hamur",    ad: "Hamur İşi",           emoji: "🥐" },
  { id: "kahvalti", ad: "Kahvaltılık",         emoji: "🍳" },
  { id: "salata",   ad: "Salata & Meze",       emoji: "🥗" },
  { id: "tatli",    ad: "Tatlılar",            emoji: "🍮" }
];

AM.TARIF_KATEGORILERI_AD = {};
AM.TARIF_KATEGORILERI.forEach(function (k) { AM.TARIF_KATEGORILERI_AD[k.id] = k.ad; });


/* ============================================================================
   ÖĞÜN GRUPLARI
   ----------------------------------------------------------------------------
   "Bugün" ekranında öneriler bu başlıklar altında gruplanır. Yukarıdaki
   kategoriler mutfak sınıflandırması (tavuk, balık, bakliyat…), buradakiler ise
   sofra sınıflandırması (ana yemek, ara sıcak, tatlı…). İkisi ayrı tutuldu
   çünkü aynı kategoriden bir tarif farklı öğüne düşebiliyor: mücver "sebze"
   kategorisinde ama sofrada ara sıcaktır.
   ========================================================================== */

AM.OGUN_GRUPLARI = [
  { id: "corba",    ad: "Çorbalar",         emoji: "🍜" },
  { id: "ana",      ad: "Ana Yemekler",     emoji: "🍲" },
  { id: "yaninda",  ad: "Pilav & Makarna",  emoji: "🍚" },
  { id: "arasicak", ad: "Ara Sıcaklar",     emoji: "🥟" },
  { id: "meze",     ad: "Salata & Meze",    emoji: "🥗" },
  { id: "hamur",    ad: "Hamur İşi",        emoji: "🥐" },
  { id: "kahvalti", ad: "Kahvaltılık",      emoji: "🍳" },
  { id: "tatli",    ad: "Tatlılar",         emoji: "🍮" }
];

/* Kategoriden öğün grubuna varsayılan eşleme */
AM.KAT_GRUP = {
  corba: "corba",
  etli: "ana", tavuk: "ana", balik: "ana", sebze: "ana", bakliyat: "ana",
  pilav: "yaninda",
  hamur: "hamur",
  salata: "meze",
  kahvalti: "kahvalti",
  tatli: "tatli"
};

/* Kategorisi ne olursa olsun sofrada ara sıcak sayılanlar.
   Yeni bir ara sıcak eklersen tarifin id'sini buraya yazman yeterli. */
AM.ARA_SICAKLAR = [
  "sigara-boregi", "muska-boregi", "cig-borek", "talas-boregi", "pisi",
  "mucver", "mantar-sote", "patlican-kizartma", "karnabahar-graten",
  "citir-tavuk", "kalamar-tava", "icli-kofte", "arnavut-cigeri",
  "firinda-citir-nohut", "misir-sote", "tavuk-schnitzel",
  /* 2. bölümden eklenenler */
  "pacanga-boregi", "avci-boregi", "milfoy-peynirli-borek", "puf-borek",
  "kasarli-milfoy-cubuk", "sarimsakli-ekmek", "patates-koftesi",
  "karnabahar-kizartmasi", "karnabahar-mucveri", "pirasa-koftesi",
  "biber-kizartmasi", "kabak-kizartmasi", "kumpir", "midye-tava",
  "karides-tava", "istavrit-tava", "hamsi-kusu", "tavuk-cigeri-tava",
  "susamli-tavuk", "sebzeli-milfoy-tart", "firinda-yumurta-kokotel"
];

(function () {
  var araSicakKume = {};
  AM.ARA_SICAKLAR.forEach(function (id) { araSicakKume[id] = 1; });

  /** Bir tarifin hangi öğün grubuna düştüğünü söyler. */
  AM.grupBul = function (t) {
    if (araSicakKume[t.id]) return "arasicak";
    return AM.KAT_GRUP[t.kat] || "ana";
  };

  AM.OGUN_GRUP_AD = {};
  AM.OGUN_GRUPLARI.forEach(function (g) { AM.OGUN_GRUP_AD[g.id] = g.ad; });
})();
