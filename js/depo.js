/* ============================================================================
   DEPO — Tarayıcının kendi hafızasında (localStorage) saklama katmanı.

   GİZLİLİK NOTU
   Burada tutulan her şey sadece bu cihazda kalır. Uygulamanın hiçbir yerinde
   ağ isteği yoktur; index.html'deki Content-Security-Policy zaten dışarıya
   bağlantıyı yasaklar. Ne isim, ne konum, ne de başka kişisel bilgi istenir.
   Saklanan tek şey: işaretlediğin malzemeler, favorilerin ve birkaç ayar.
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  var ANAHTAR = "alganis-mutfak";
  var SEMA = 1;

  var varsayilan = {
    s: SEMA,
    sepet: null,      // null = kullanıcı henüz hiç seçim yapmadı
    fav: [],
    filtre: "hepsi",
    oneriIx: 0,
    tolerans: true,   // ufak eksiklere göz yum
    yazi: "n",        // n | b | cb
    tema: "gunisigi", // gunisigi | gece | sistem
    palet: "domates", // renk paleti (bkz. GECERLI_PALETLER)
    ogun: "hepsi"     // "Bugün" ekranındaki yemek türü seçimi
  };

  /* Ayarlardaki renk paletleri. css/style.css içindeki [data-palet] blokları
     ve js/uygulama.js içindeki PALETLER listesiyle aynı sırada tutulmalı. */
  var GECERLI_PALETLER = [
    "domates", "zeytin", "patlican", "deniz", "gul", "bal", "kontrast"
  ];

  var durum = null;

  /* --- yardımcılar ------------------------------------------------------- */

  /**
   * Kayıttan okunan id listesini temizler.
   *
   * ÖNEMLİ — bilerek katalogla karşılaştırma YAPILMIYOR:
   * Bir malzeme ya da tarif ileride katalogdan çıkarılırsa veya yeniden
   * adlandırılırsa, kullanıcının o seçimi silinmemeli. Tanınmayan id'ler
   * saklanır ama hiçbir tarifle eşleşmez; ekranlar her zaman katalogdan
   * çizildiği için de hiçbir yerde görünmezler. Böylece bir sonraki sürümde
   * malzeme geri gelirse seçim de geri gelir.
   * (Sürüm 2.0.0'da 12 malzeme çıkarılmış ve o seçimler sessizce kaybolmuştu.)
   */
  function guvenliDizi(deger, enFazla) {
    if (!Array.isArray(deger)) return [];
    var sonuc = [];
    for (var i = 0; i < deger.length && sonuc.length < enFazla; i++) {
      var d = deger[i];
      if (typeof d === "string" && d.length > 0 && d.length <= 64 &&
          sonuc.indexOf(d) === -1) {
        sonuc.push(d);
      }
    }
    return sonuc;
  }

  function temelSepet() {
    return (AM.MALZEMELER || []).filter(function (m) { return m[3] === 1; })
                                .map(function (m) { return m[0]; });
  }

  /* --- okuma / yazma ----------------------------------------------------- */

  function yukle() {
    var ham = null;
    try { ham = localStorage.getItem(ANAHTAR); } catch (e) { ham = null; }

    var d = null;
    if (ham) {
      try { d = JSON.parse(ham); } catch (e) { d = null; }
    }
    if (!d || typeof d !== "object" || Array.isArray(d)) d = {};

    durum = {
      s: SEMA,
      sepet: Array.isArray(d.sepet) ? guvenliDizi(d.sepet, 600) : null,
      fav: guvenliDizi(d.fav, 600),
      filtre: typeof d.filtre === "string" ? d.filtre : varsayilan.filtre,
      oneriIx: (typeof d.oneriIx === "number" && isFinite(d.oneriIx)) ? Math.abs(d.oneriIx | 0) : 0,
      tolerans: d.tolerans === false ? false : true,
      yazi: (d.yazi === "b" || d.yazi === "cb") ? d.yazi : "n",
      tema: (d.tema === "gece" || d.tema === "sistem") ? d.tema : "gunisigi",
      palet: GECERLI_PALETLER.indexOf(d.palet) !== -1 ? d.palet : "domates",
      ogun: typeof d.ogun === "string" ? d.ogun : "hepsi"
    };
    return durum;
  }

  function kaydet() {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(durum));
    } catch (e) {
      // Depolama dolu ya da kapalı olabilir. Uygulama yine de çalışsın.
    }
  }

  /* --- dışa açık API ----------------------------------------------------- */

  AM.depo = {
    baslat: function () { return yukle(); },

    ilkKezMi: function () { return durum.sepet === null; },

    /** Kullanıcının seçtiği malzemeler (Set olarak). */
    sepet: function () {
      return new Set(durum.sepet || []);
    },

    sepetDizi: function () { return (durum.sepet || []).slice(); },

    sepetteMi: function (id) { return (durum.sepet || []).indexOf(id) !== -1; },

    sepetDegistir: function (id) {
      if (durum.sepet === null) durum.sepet = [];
      var i = durum.sepet.indexOf(id);
      if (i === -1) durum.sepet.push(id); else durum.sepet.splice(i, 1);
      kaydet();
      return i === -1;
    },

    sepetKur: function (idler) {
      durum.sepet = guvenliDizi(idler, 600);
      kaydet();
    },

    temelleriSec: function () {
      var mevcut = new Set(durum.sepet || []);
      temelSepet().forEach(function (id) { mevcut.add(id); });
      durum.sepet = Array.from(mevcut);
      kaydet();
    },

    sepetTemizle: function () { durum.sepet = []; kaydet(); },

    /* --- favoriler --- */
    favMi: function (id) { return durum.fav.indexOf(id) !== -1; },
    favDegistir: function (id) {
      var i = durum.fav.indexOf(id);
      if (i === -1) durum.fav.push(id); else durum.fav.splice(i, 1);
      kaydet();
      return i === -1;
    },
    favlar: function () { return durum.fav.slice(); },

    /* --- ayarlar --- */
    filtre: function (yeni) {
      if (yeni !== undefined) { durum.filtre = String(yeni); durum.oneriIx = 0; kaydet(); }
      return durum.filtre;
    },
    oneriIx: function (yeni) {
      if (yeni !== undefined) { durum.oneriIx = Math.abs(yeni | 0); kaydet(); }
      return durum.oneriIx;
    },
    tolerans: function (yeni) {
      if (yeni !== undefined) { durum.tolerans = !!yeni; kaydet(); }
      return durum.tolerans;
    },
    yazi: function (yeni) {
      if (yeni !== undefined) { durum.yazi = yeni; kaydet(); }
      return durum.yazi;
    },
    tema: function (yeni) {
      if (yeni !== undefined) { durum.tema = yeni; kaydet(); }
      return durum.tema;
    },
    palet: function (yeni) {
      if (yeni !== undefined && GECERLI_PALETLER.indexOf(yeni) !== -1) {
        durum.palet = yeni; kaydet();
      }
      return durum.palet;
    },
    ogun: function (yeni) {
      if (yeni !== undefined) { durum.ogun = String(yeni); durum.oneriIx = 0; kaydet(); }
      return durum.ogun;
    },

    /** Her şeyi siler — ayarlardaki "sıfırla" düğmesi için. */
    sifirla: function () {
      try { localStorage.removeItem(ANAHTAR); } catch (e) {}
      durum = {
        s: SEMA, sepet: null, fav: [], filtre: "hepsi",
        oneriIx: 0, tolerans: true, yazi: "n",
        tema: "gunisigi", palet: "domates", ogun: "hepsi"
      };
    },

    varsayilanTemeller: temelSepet
  };
})();
