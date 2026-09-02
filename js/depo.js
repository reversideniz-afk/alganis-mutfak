/* ============================================================================
   DEPO — Tarayıcının kendi hafızasında (localStorage) saklama katmanı.

   GİZLİLİK NOTU
   Burada tutulan her şey sadece bu cihazda kalır. Uygulamanın hiçbir yerinde
   ağ isteği yoktur; index.html'deki Content-Security-Policy zaten dışarıya
   bağlantıyı yasaklar. Ne isim, ne konum, ne de başka kişisel bilgi istenir.

   Saklananlar:
     • işaretlenen malzemeler ve favoriler
     • ayarlar (tema, palet, yazı boyutu, filtre…)
     • pişirme geçmişi — hangi tarif ne zaman pişirildi
     • tarife verilen puan ve yazılan kişisel not
     • kullanıcının kendi oluşturduğu koleksiyonlar

   Son üçü sürüm 2.4.0'da eklendi. Hiçbiri cihazdan çıkmaz; "Ayarlar →
   Sıfırla" hepsini siler. Kişisel not kullanıcının kendi yazdığı serbest
   metindir, ekrana her zaman metin olarak basılır (innerHTML kullanılmaz).
   ========================================================================== */

(function () {
  "use strict";
  window.AM = window.AM || {};

  var ANAHTAR = "alganis-mutfak";
  var SEMA = 2;

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
    ogun: "hepsi",    // "Bugün" ekranındaki yemek türü seçimi
    mutfak: "hepsi",  // seçili dünya mutfağı ("hepsi" = kısıtlama yok)
    besinGoster: true,// besin değeri gösterilsin mi
    gecmis: [],       // pişirilenler: [{ i: tarifId, z: zaman }]
    puan: {},         // { tarifId: 1..5 }
    not: {},          // { tarifId: "kişisel not" }
    koleksiyon: []    // [{ ad: "Bayram sofrası", idler: [...] }]
  };

  /* Sınırlar — localStorage kotası taşmasın diye. Aşan veri sessizce kırpılır,
     kullanıcı bir şey kaybetmiş hissetmesin diye sınırlar cömert tutuldu. */
  var SINIR = {
    gecmis: 400,
    puan: 1000,
    not: 300,
    notUzunluk: 500,
    koleksiyon: 30,
    koleksiyonAd: 40,
    koleksiyonIcerik: 300
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

  function gecerliId(d) {
    return typeof d === "string" && d.length > 0 && d.length <= 64;
  }

  /* Pişirme geçmişi: en yeni başta. Kayıtta bozuk satır olabilir (elle
     düzenlenmiş localStorage, yarım yazma), o yüzden her alan tek tek
     doğrulanıyor. */
  function guvenliGecmis(deger) {
    if (!Array.isArray(deger)) return [];
    var sonuc = [];
    for (var i = 0; i < deger.length && sonuc.length < SINIR.gecmis; i++) {
      var k = deger[i];
      if (k && typeof k === "object" && gecerliId(k.i) &&
          typeof k.z === "number" && isFinite(k.z) && k.z > 0) {
        sonuc.push({ i: k.i, z: Math.floor(k.z) });
      }
    }
    sonuc.sort(function (a, b) { return b.z - a.z; });
    return sonuc;
  }

  function guvenliPuan(deger) {
    var sonuc = {};
    if (!deger || typeof deger !== "object" || Array.isArray(deger)) return sonuc;
    var anahtarlar = Object.keys(deger);
    for (var i = 0; i < anahtarlar.length && i < SINIR.puan; i++) {
      var id = anahtarlar[i], p = deger[id];
      if (gecerliId(id) && typeof p === "number" && p >= 1 && p <= 5) {
        sonuc[id] = Math.round(p);
      }
    }
    return sonuc;
  }

  function guvenliNot(deger) {
    var sonuc = {};
    if (!deger || typeof deger !== "object" || Array.isArray(deger)) return sonuc;
    var anahtarlar = Object.keys(deger);
    for (var i = 0; i < anahtarlar.length && i < SINIR.not; i++) {
      var id = anahtarlar[i], m = deger[id];
      if (gecerliId(id) && typeof m === "string" && m.length) {
        sonuc[id] = m.slice(0, SINIR.notUzunluk);
      }
    }
    return sonuc;
  }

  function guvenliKoleksiyon(deger) {
    if (!Array.isArray(deger)) return [];
    var sonuc = [];
    for (var i = 0; i < deger.length && sonuc.length < SINIR.koleksiyon; i++) {
      var k = deger[i];
      if (k && typeof k === "object" && typeof k.ad === "string" && k.ad.trim()) {
        sonuc.push({
          ad: k.ad.trim().slice(0, SINIR.koleksiyonAd),
          idler: guvenliDizi(k.idler, SINIR.koleksiyonIcerik)
        });
      }
    }
    return sonuc;
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
      ogun: typeof d.ogun === "string" ? d.ogun : "hepsi",
      mutfak: typeof d.mutfak === "string" ? d.mutfak : "hepsi",
      besinGoster: d.besinGoster === false ? false : true,
      gecmis: guvenliGecmis(d.gecmis),
      puan: guvenliPuan(d.puan),
      not: guvenliNot(d.not),
      koleksiyon: guvenliKoleksiyon(d.koleksiyon)
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
    mutfak: function (yeni) {
      if (yeni !== undefined) { durum.mutfak = String(yeni); durum.oneriIx = 0; kaydet(); }
      return durum.mutfak;
    },
    besinGoster: function (yeni) {
      if (yeni !== undefined) { durum.besinGoster = !!yeni; kaydet(); }
      return durum.besinGoster;
    },

    /* --- pişirme geçmişi ---------------------------------------------------
       "Pişirdim" düğmesi buraya yazar. Akıllı öneri (Faz 3) bunu okuyup aynı
       yemeği üst üste önermemek ve alışkanlıkları öğrenmek için kullanacak. */
    pisirdim: function (id) {
      if (!gecerliId(id)) return;
      durum.gecmis.unshift({ i: id, z: Date.now() });
      if (durum.gecmis.length > SINIR.gecmis) durum.gecmis.length = SINIR.gecmis;
      kaydet();
    },

    gecmis: function () { return durum.gecmis.slice(); },

    /** Bu tarif en son ne zaman pişirildi? Hiç pişirilmediyse null. */
    sonPisirme: function (id) {
      for (var i = 0; i < durum.gecmis.length; i++) {
        if (durum.gecmis[i].i === id) return durum.gecmis[i].z;
      }
      return null;
    },

    /** Son N gün içinde pişirilenlerin id kümesi. */
    sonGunlerde: function (gun) {
      var sinir = Date.now() - gun * 86400000;
      var kume = new Set();
      durum.gecmis.forEach(function (k) { if (k.z >= sinir) kume.add(k.i); });
      return kume;
    },

    /* --- puan ve kişisel not ---------------------------------------------- */
    puan: function (id, yeni) {
      if (yeni !== undefined) {
        if (yeni === null) delete durum.puan[id];
        else if (yeni >= 1 && yeni <= 5) durum.puan[id] = Math.round(yeni);
        kaydet();
      }
      return durum.puan[id] || null;
    },

    not: function (id, yeni) {
      if (yeni !== undefined) {
        var m = String(yeni).slice(0, SINIR.notUzunluk).trim();
        if (m) durum.not[id] = m; else delete durum.not[id];
        kaydet();
      }
      return durum.not[id] || "";
    },

    notUzunlukSiniri: SINIR.notUzunluk,

    /* --- koleksiyonlar ------------------------------------------------------
       Kullanıcının kendi adlandırdığı listeler: "Bayram sofrası", "Misafir
       gelirse". Favorilerden farkı, birden fazla olabilmesi. */
    koleksiyonlar: function () {
      return durum.koleksiyon.map(function (k) {
        return { ad: k.ad, idler: k.idler.slice() };
      });
    },

    koleksiyonEkle: function (ad) {
      var temiz = String(ad || "").trim().slice(0, SINIR.koleksiyonAd);
      if (!temiz || durum.koleksiyon.length >= SINIR.koleksiyon) return false;
      if (durum.koleksiyon.some(function (k) { return k.ad === temiz; })) return false;
      durum.koleksiyon.push({ ad: temiz, idler: [] });
      kaydet();
      return true;
    },

    koleksiyonSil: function (ad) {
      var i = durum.koleksiyon.findIndex(function (k) { return k.ad === ad; });
      if (i === -1) return false;
      durum.koleksiyon.splice(i, 1);
      kaydet();
      return true;
    },

    /** Tarifi koleksiyona ekler/çıkarır. Eklendiyse true döner. */
    koleksiyonDegistir: function (ad, id) {
      var k = durum.koleksiyon.find(function (x) { return x.ad === ad; });
      if (!k || !gecerliId(id)) return false;
      var i = k.idler.indexOf(id);
      if (i === -1) {
        if (k.idler.length >= SINIR.koleksiyonIcerik) return false;
        k.idler.push(id);
      } else {
        k.idler.splice(i, 1);
      }
      kaydet();
      return i === -1;
    },

    /** Her şeyi siler — ayarlardaki "sıfırla" düğmesi için. */
    sifirla: function () {
      try { localStorage.removeItem(ANAHTAR); } catch (e) {}
      durum = {
        s: SEMA, sepet: null, fav: [], filtre: "hepsi",
        oneriIx: 0, tolerans: true, yazi: "n",
        tema: "gunisigi", palet: "domates", ogun: "hepsi",
        mutfak: "hepsi", besinGoster: true,
        gecmis: [], puan: {}, not: {}, koleksiyon: []
      };
    },

    varsayilanTemeller: temelSepet
  };
})();
