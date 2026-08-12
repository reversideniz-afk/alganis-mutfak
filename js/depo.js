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
    ogun: "hepsi"     // "Bugün" ekranındaki yemek türü seçimi
  };

  var durum = null;

  /* --- yardımcılar ------------------------------------------------------- */

  function guvenliDizi(deger, gecerliKume, enFazla) {
    if (!Array.isArray(deger)) return [];
    var sonuc = [];
    for (var i = 0; i < deger.length && sonuc.length < enFazla; i++) {
      var d = deger[i];
      // Sadece string ve sadece bilinen id'ler kabul edilir.
      if (typeof d === "string" && gecerliKume.has(d) && sonuc.indexOf(d) === -1) {
        sonuc.push(d);
      }
    }
    return sonuc;
  }

  function malzemeKumesi() {
    var k = new Set();
    (AM.MALZEMELER || []).forEach(function (m) { k.add(m[0]); });
    return k;
  }

  function tarifKumesi() {
    var k = new Set();
    (AM.TARIFLER || []).forEach(function (t) { k.add(t.id); });
    return k;
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

    var mKume = malzemeKumesi();
    var tKume = tarifKumesi();

    durum = {
      s: SEMA,
      sepet: Array.isArray(d.sepet) ? guvenliDizi(d.sepet, mKume, 400) : null,
      fav: guvenliDizi(d.fav, tKume, 500),
      filtre: typeof d.filtre === "string" ? d.filtre : varsayilan.filtre,
      oneriIx: (typeof d.oneriIx === "number" && isFinite(d.oneriIx)) ? Math.abs(d.oneriIx | 0) : 0,
      tolerans: d.tolerans === false ? false : true,
      yazi: (d.yazi === "b" || d.yazi === "cb") ? d.yazi : "n",
      tema: (d.tema === "gece" || d.tema === "sistem") ? d.tema : "gunisigi",
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
      durum.sepet = guvenliDizi(idler, malzemeKumesi(), 400);
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
        tema: "gunisigi", ogun: "hepsi"
      };
    },

    varsayilanTemeller: temelSepet
  };
})();
