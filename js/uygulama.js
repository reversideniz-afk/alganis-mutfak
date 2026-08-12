/* ============================================================================
   UYGULAMA — ekranlar, olaylar, pişirme modu, güncelleme bildirimi
   ========================================================================== */

(function () {
  "use strict";
  var el = AM.ui.el, bosalt = AM.ui.bosalt;
  var $ = function (id) { return document.getElementById(id); };

  var EKRANLAR = ["bugun", "mutfak", "favori", "tarifler"];
  var SAYFA_ADET = 24;

  /* "Hepsi" seçiliyken her öğün grubundan kaç kart gösterilsin */
  var GRUP_ONIZLEME = 6;

  var durum = {
    ekran: "bugun",
    katFiltre: "hepsi",
    malzemeArama: "",
    tarifKat: "hepsi",
    tarifArama: "",
    gosterYapilabilir: SAYFA_ADET,
    gosterNerdeyse: 12,
    gosterTum: SAYFA_ADET,
    acikTarif: null,
    porsiyon: 4,
    adim: 0,
    sonOneriler: null
  };

  var uyanikKilit = null;

  /* ====================================================== BİLDİRİM (toast) */
  var bildirimZaman = null;
  function bildir(metin, aksiyonAdi, aksiyon) {
    var kutu = $("bildirim");
    bosalt(kutu);
    kutu.appendChild(document.createTextNode(metin));
    if (aksiyonAdi) {
      var b = el("button", { type: "button", metin: aksiyonAdi });
      b.addEventListener("click", aksiyon);
      kutu.appendChild(b);
    }
    kutu.hidden = false;
    clearTimeout(bildirimZaman);
    if (!aksiyonAdi) bildirimZaman = setTimeout(function () { kutu.hidden = true; }, 2200);
  }

  /* ============================================================== GEZİNME */
  function git(ad) {
    if (EKRANLAR.indexOf(ad) === -1) ad = "bugun";
    durum.ekran = ad;
    EKRANLAR.forEach(function (e) { $("ekran-" + e).hidden = (e !== ad); });
    Array.prototype.forEach.call(document.querySelectorAll(".menu-btn"), function (b) {
      b.classList.toggle("aktif", b.dataset.git === ad);
    });
    var altYazi = {
      bugun: "Bugün ne pişirsem?",
      mutfak: "Evde neler var?",
      favori: "En sevdikleriniz",
      tarifler: (AM.TARIFLER.length) + " tarif"
    };
    $("ustAltYazi").textContent = altYazi[ad];
    window.scrollTo(0, 0);

    if (ad === "bugun") ciz_bugun();
    if (ad === "favori") ciz_favori();
    if (ad === "tarifler") ciz_tarifler();
  }

  /* ================================================== EKRAN: MUTFAĞIM */

  function malzemeSayaclari() {
    var sepet = AM.depo.sepet();
    var say = {};
    AM.MALZEMELER.forEach(function (m) {
      if (sepet.has(m[0])) say[m[2]] = (say[m[2]] || 0) + 1;
    });
    return { say: say, toplam: sepet.size };
  }

  function ciz_katSerit() {
    var serit = $("katSerit");
    var bilgi = malzemeSayaclari();
    bosalt(serit);

    function cip(id, ad, emoji, adet) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (durum.katFiltre === id ? " aktif" : ""),
        veri: { kat: id }
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      if (adet) b.appendChild(el("span", { sinif: "kat-adet", metin: String(adet) }));
      b.addEventListener("click", function () {
        durum.katFiltre = id;
        ciz_katSerit();
        ciz_malzemeler();
      });
      return b;
    }

    serit.appendChild(cip("hepsi", "Tümü", "🧺", bilgi.toplam));
    AM.KATEGORILER.forEach(function (k) {
      serit.appendChild(cip(k.id, k.ad, k.emoji, bilgi.say[k.id] || 0));
    });
  }

  function ciz_malzemeler() {
    var kap = $("malzemeListe");
    var sepet = AM.depo.sepet();
    var q = AM.nrm(durum.malzemeArama);
    bosalt(kap);

    AM.KATEGORILER.forEach(function (k) {
      if (durum.katFiltre !== "hepsi" && durum.katFiltre !== k.id) return;

      var uygun = AM.MALZEMELER.filter(function (m) {
        if (m[2] !== k.id) return false;
        if (!q) return true;
        return AM.nrm(m[1] + " " + (m[4] || "")).indexOf(q) !== -1;
      });
      if (!uygun.length) return;

      var bolum = el("section", { sinif: "kat-bolum" });
      bolum.appendChild(el("h3", { sinif: "kat-baslik" }, [
        el("span", { sinif: "em", "aria-hidden": "true", metin: k.emoji }), k.ad
      ]));

      var izgara = el("div", { sinif: "cip-izgara" });
      uygun.forEach(function (m) {
        var secili = sepet.has(m[0]);
        var b = el("button", {
          type: "button", sinif: "cip",
          "aria-pressed": secili ? "true" : "false",
          veri: { id: m[0] }
        }, [el("span", { sinif: "tik", "aria-hidden": "true", metin: "✓" }), m[1]]);
        izgara.appendChild(b);
      });
      bolum.appendChild(izgara);
      kap.appendChild(bolum);
    });

    if (!kap.firstChild) {
      kap.appendChild(el("div", { sinif: "bos-durum" }, [
        el("div", { sinif: "bos-emoji", metin: "🥄" }),
        el("p", { metin: "Bu aramaya uyan malzeme yok." })
      ]));
    }
  }

  function rozetGuncelle() {
    var n = AM.depo.sepet().size;
    var r = $("rozetMalzeme");
    r.textContent = String(n);
    r.hidden = n === 0;
  }

  /* ===================================================== EKRAN: BUGÜN */

  function ciz_bugun() {
    var sepet = AM.depo.sepet();
    var bos = sepet.size === 0;
    $("bosMutfakUyari").hidden = !bos;
    $("oneriAlan").hidden = bos;
    if (bos) return;

    var sonuc = AM.oneriler(sepet, AM.depo.filtre(), AM.depo.tolerans());
    durum.sonOneriler = sonuc;

    /* --- kahraman kart --- */
    var kap = $("oneriKart");
    bosalt(kap);
    var yokKart = $("sonucYokKart");

    if (sonuc.tam.length) {
      // Günün önerisi seçili yemek türünden gelir. "Hepsi" seçiliyken ana
      // yemeklerden seçilir; tatlı ya da salata baş köşeye oturmasın.
      var ogun = AM.depo.ogun();
      var havuz = sonuc.tam.filter(function (k) {
        return AM.grupBul(k.t) === (ogun === "hepsi" ? "ana" : ogun);
      });
      if (!havuz.length) havuz = sonuc.tam;

      var ix = AM.depo.oneriIx() % havuz.length;
      var secili = havuz[ix];
      kap.appendChild(AM.ui.heroKart(secili));
      $("btnTarifiAc").disabled = false;
      $("btnBaskaOner").disabled = havuz.length < 2;
      kap.dataset.id = secili.t.id;
      yokKart.hidden = true;
    } else {
      $("btnTarifiAc").disabled = true;
      $("btnBaskaOner").disabled = true;
      kap.dataset.id = "";
      yokKart.hidden = sonuc.yakin.length > 0;
      if (sonuc.yakin.length) {
        kap.appendChild(el("div", { sinif: "bilgi-kart mor" }, [
          el("h2", { metin: "Tam çıkan bir şey yok" }),
          el("p", { metin: "Ama aşağıdaki listeye bak — bir iki malzemeyle hepsi olur." })
        ]));
      }
    }

    /* --- yapılabilirler: yemek türüne göre gruplanmış --- */
    ciz_ogunSerit(sonuc.tam);
    ciz_yapilabilirler(sonuc.tam);
    $("sayacYapilabilir").textContent = String(sonuc.tam.length);
    $("bolumYapilabilir").hidden = sonuc.tam.length === 0;

    /* --- neler yapabilirdiniz (seçili yemek türüne uyanlar) --- */
    var ogunSecimi = AM.depo.ogun();
    var yakin = ogunSecimi === "hepsi" ? sonuc.yakin : sonuc.yakin.filter(function (k) {
      return AM.grupBul(k.t) === ogunSecimi;
    });
    var lst2 = $("listeNerdeyse");
    bosalt(lst2);
    yakin.slice(0, durum.gosterNerdeyse).forEach(function (k) {
      lst2.appendChild(AM.ui.tarifKart(k, tarifAc));
    });
    $("sayacNerdeyse").textContent = String(yakin.length);
    $("bolumNerdeyse").hidden = yakin.length === 0;
    $("btnDahaFazlaNerdeyse").hidden = yakin.length <= durum.gosterNerdeyse;
  }

  /** Yemek türü şeridi: Tümü + o an gerçekten yapılabilen gruplar. */
  function ciz_ogunSerit(kayitlar) {
    var serit = $("ogunSerit");
    var secili = AM.depo.ogun();
    var sayim = {};
    kayitlar.forEach(function (k) {
      var g = AM.grupBul(k.t);
      sayim[g] = (sayim[g] || 0) + 1;
    });
    bosalt(serit);

    function cip(id, ad, emoji, adet) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (secili === id ? " aktif" : "")
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      if (adet) b.appendChild(el("span", { sinif: "kat-adet", metin: String(adet) }));
      b.addEventListener("click", function () { ogunSec(id); });
      return b;
    }

    serit.appendChild(cip("hepsi", "Tümü", "🍽", kayitlar.length));
    AM.OGUN_GRUPLARI.forEach(function (g) {
      if (!sayim[g.id]) return;          // o gruptan yapılabilir bir şey yoksa gösterme
      serit.appendChild(cip(g.id, g.ad, g.emoji, sayim[g.id]));
    });
  }

  function ogunSec(id) {
    AM.depo.ogun(id);
    durum.gosterYapilabilir = SAYFA_ADET;
    durum.gosterNerdeyse = 12;
    ciz_bugun();
    $("bolumYapilabilir").scrollIntoView({ block: "start", behavior: "smooth" });
  }

  /**
   * "Tümü" seçiliyken her yemek türü kendi başlığı altında, en fazla
   * GRUP_ONIZLEME kart olacak şekilde listelenir. Belirli bir tür seçiliyse
   * tek liste halinde, sayfalı gösterilir.
   */
  function ciz_yapilabilirler(kayitlar) {
    var kap = $("gruplarYapilabilir");
    var secili = AM.depo.ogun();
    var dahaFazla = $("btnDahaFazlaYapilabilir");
    bosalt(kap);

    if (secili !== "hepsi") {
      var uyanlar = kayitlar.filter(function (k) { return AM.grupBul(k.t) === secili; });
      var izgara = el("div", { sinif: "tarif-izgara" });
      uyanlar.slice(0, durum.gosterYapilabilir).forEach(function (k) {
        izgara.appendChild(AM.ui.tarifKart(k, tarifAc));
      });
      kap.appendChild(izgara);
      dahaFazla.hidden = uyanlar.length <= durum.gosterYapilabilir;
      return;
    }

    dahaFazla.hidden = true;
    AM.OGUN_GRUPLARI.forEach(function (g) {
      var uyanlar = kayitlar.filter(function (k) { return AM.grupBul(k.t) === g.id; });
      if (!uyanlar.length) return;

      var baslik = el("div", { sinif: "grup-baslik" }, [
        el("span", { sinif: "gb-emoji", "aria-hidden": "true", metin: g.emoji }),
        el("h4", { metin: g.ad }),
        el("span", { sinif: "grup-adet", metin: String(uyanlar.length) })
      ]);
      if (uyanlar.length > GRUP_ONIZLEME) {
        var tumu = el("button", { type: "button", sinif: "grup-tumu", metin: "Tümü →" });
        tumu.addEventListener("click", function () { ogunSec(g.id); });
        baslik.appendChild(tumu);
      }

      var izgara = el("div", { sinif: "tarif-izgara" });
      uyanlar.slice(0, GRUP_ONIZLEME).forEach(function (k) {
        izgara.appendChild(AM.ui.tarifKart(k, tarifAc));
      });

      kap.appendChild(el("section", { sinif: "grup-bolum" }, [baslik, izgara]));
    });
  }

  /* ================================================== EKRAN: FAVORİLER */

  function ciz_favori() {
    var kap = $("listeFavori");
    var sepet = AM.depo.sepet();
    bosalt(kap);
    var favlar = AM.depo.favlar()
      .map(function (id) { return AM.T[id]; })
      .filter(Boolean);

    favlar.forEach(function (t) {
      kap.appendChild(AM.ui.tarifKart({ t: t, d: AM.degerlendir(t, sepet) }, tarifAc));
    });
    $("favoriBos").hidden = favlar.length > 0;
  }

  /* ================================================ EKRAN: TÜM TARİFLER */

  function ciz_tarifKatSerit() {
    var serit = $("tarifKatSerit");
    bosalt(serit);
    function cip(id, ad, emoji) {
      var b = el("button", {
        type: "button",
        sinif: "kat-cip" + (durum.tarifKat === id ? " aktif" : "")
      }, [emoji ? el("span", { "aria-hidden": "true", metin: emoji }) : null, ad]);
      b.addEventListener("click", function () {
        durum.tarifKat = id;
        durum.gosterTum = SAYFA_ADET;
        ciz_tarifKatSerit();
        ciz_tarifler();
      });
      return b;
    }
    serit.appendChild(cip("hepsi", "Tümü", "📖"));
    AM.TARIF_KATEGORILERI.forEach(function (k) { serit.appendChild(cip(k.id, k.ad, k.emoji)); });
  }

  function ciz_tarifler() {
    var kap = $("listeTumTarifler");
    var sepet = AM.depo.sepet();
    bosalt(kap);
    var sonuc = AM.tarifAra(durum.tarifArama, durum.tarifKat);
    sonuc.slice(0, durum.gosterTum).forEach(function (t) {
      kap.appendChild(AM.ui.tarifKart({ t: t, d: AM.degerlendir(t, sepet) }, tarifAc));
    });
    $("tarifBos").hidden = sonuc.length > 0;
    $("btnDahaFazlaTum").hidden = sonuc.length <= durum.gosterTum;
  }

  /* ==================================================== TARİF DETAYI */

  function tarifAc(id) {
    var t = AM.T[id];
    if (!t) return;
    durum.acikTarif = t;
    durum.porsiyon = t.por;
    panelAc("tarifPanel");
    ciz_detay();
  }

  function ciz_detay() {
    var t = durum.acikTarif;
    if (!t) return;
    var govde = $("panelGovde");
    bosalt(govde);
    govde.appendChild(AM.ui.detay(t, AM.depo.sepet(), durum.porsiyon, function (yeni) {
      durum.porsiyon = yeni;
      AM.ui.porsiyonYenile(govde, t, yeni);
    }));
    var fav = AM.depo.favMi(t.id);
    $("btnFavori").setAttribute("aria-pressed", fav ? "true" : "false");
    $("btnFavori").setAttribute("aria-label", fav ? "Favorilerden çıkar" : "Favorilere ekle");
  }

  /* ==================================================== PİŞİRME MODU */

  function pisirmeAc() {
    var t = durum.acikTarif;
    if (!t) return;
    durum.adim = 0;
    $("pisirmeBaslik").textContent = t.ad;
    $("pisirmePanel").hidden = false;
    document.body.style.overflow = "hidden";
    ciz_pisirme();
    uyanikTut();
    gecmisEkle("pisirme");
  }

  function ciz_pisirme() {
    var t = durum.acikTarif;
    var govde = $("pisirmeGovde");
    bosalt(govde);
    govde.appendChild(AM.ui.pisirmeAdimi(t, durum.adim, durum.porsiyon / t.por));
    govde.scrollTop = 0;
    $("adimSayac").textContent = (durum.adim + 1) + " / " + t.y.length;
    $("pisirmeDolgu").style.width = ((durum.adim + 1) / t.y.length * 100) + "%";
    $("btnAdimGeri").disabled = durum.adim === 0;
    $("btnAdimIleri").textContent = (durum.adim === t.y.length - 1) ? "Afiyet olsun 🎉" : "İleri";
  }

  function pisirmeKapat() {
    $("pisirmePanel").hidden = true;
    document.body.style.overflow = "";
    uyanikBirak();
  }

  function uyanikTut() {
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(function (k) {
      uyanikKilit = k;
      $("ekranUyanikRozet").hidden = false;
      k.addEventListener("release", function () { $("ekranUyanikRozet").hidden = true; });
    }).catch(function () { /* izin yok ya da desteklenmiyor — sorun değil */ });
  }

  function uyanikBirak() {
    if (uyanikKilit) { try { uyanikKilit.release(); } catch (e) {} uyanikKilit = null; }
    $("ekranUyanikRozet").hidden = true;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && !$("pisirmePanel").hidden && !uyanikKilit) {
      uyanikTut();
    }
  });

  /* ======================================================== PANELLER */

  function panelAc(id) {
    $(id).hidden = false;
    document.body.style.overflow = "hidden";
    gecmisEkle(id);
  }

  function panelKapat(id) {
    $(id).hidden = true;
    if ($("pisirmePanel").hidden && $("tarifPanel").hidden && $("ayarPanel").hidden) {
      document.body.style.overflow = "";
    }
  }

  function hepsiniKapat() {
    if (!$("pisirmePanel").hidden) { pisirmeKapat(); return true; }
    if (!$("tarifPanel").hidden) { panelKapat("tarifPanel"); return true; }
    if (!$("ayarPanel").hidden) { panelKapat("ayarPanel"); return true; }
    return false;
  }

  /* Android geri tuşu paneli kapatsın, uygulamadan çıkmasın. */
  var gecmisDerinlik = 0;
  function gecmisEkle(ad) {
    gecmisDerinlik++;
    try { history.pushState({ am: ad, d: gecmisDerinlik }, ""); } catch (e) {}
  }
  window.addEventListener("popstate", function () {
    if (gecmisDerinlik > 0) gecmisDerinlik--;
    hepsiniKapat();
  });
  function geriGit() {
    if (gecmisDerinlik > 0) history.back();
    else hepsiniKapat();
  }

  /* ========================================================== AYARLAR */

  function ciz_ayarlar() {
    var govde = $("ayarGovde");
    bosalt(govde);

    /* tema */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Görünüm" }));
    var temalar = [["gunisigi", "☀️ Gün ışığı"], ["gece", "🌙 Gece"], ["sistem", "📱 Telefona uy"]];
    var temaSerit = el("div", { sinif: "filtre-serit" });
    temalar.forEach(function (t) {
      var btn = el("button", {
        type: "button",
        sinif: "filtre-cip" + (AM.depo.tema() === t[0] ? " aktif" : ""),
        metin: t[1]
      });
      btn.addEventListener("click", function () {
        AM.depo.tema(t[0]);
        temayiUygula();
        ciz_ayarlar();
      });
      temaSerit.appendChild(btn);
    });
    govde.appendChild(temaSerit);

    /* yazı boyutu */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Yazı boyutu" }));
    var boyutlar = [["n", "Normal"], ["b", "Büyük"], ["cb", "Çok büyük"]];
    var boyutSerit = el("div", { sinif: "filtre-serit" });
    boyutlar.forEach(function (b) {
      var btn = el("button", {
        type: "button",
        sinif: "filtre-cip" + (AM.depo.yazi() === b[0] ? " aktif" : ""),
        metin: b[1]
      });
      btn.addEventListener("click", function () {
        AM.depo.yazi(b[0]);
        document.documentElement.dataset.yazi = b[0];
        ciz_ayarlar();
      });
      boyutSerit.appendChild(btn);
    });
    govde.appendChild(boyutSerit);

    /* tolerans */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Öneri davranışı" }));
    var anahtar = el("button", {
      type: "button", sinif: "anahtar",
      "aria-pressed": AM.depo.tolerans() ? "true" : "false",
      "aria-label": "Ufak eksiklere göz yum"
    });
    anahtar.addEventListener("click", function () {
      AM.depo.tolerans(!AM.depo.tolerans());
      ciz_ayarlar();
      ciz_bugun();
    });
    govde.appendChild(el("div", { sinif: "ayar-satir" }, [
      el("div", { sinif: "as-yazi" }, [
        el("strong", { metin: "Ufak eksiklere göz yum" }),
        el("small", { metin: "Sadece maydanoz, havuç gibi tali malzemesi eksik yemekler de önerilsin." })
      ]),
      anahtar
    ]));

    /* sürüm & güncelleme */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Uygulama" }));
    govde.appendChild(el("div", { sinif: "ayar-satir" }, [
      el("div", { sinif: "as-yazi" }, [
        el("strong", { metin: "Sürüm " + AM.SURUM }),
        el("small", { metin: AM.TARIFLER.length + " tarif · " + AM.MALZEMELER.length + " malzeme" })
      ])
    ]));

    var gncBtn = el("button", { type: "button", sinif: "btn hayalet tam", metin: "Güncelleme var mı, bak" });
    gncBtn.addEventListener("click", function () {
      if (!navigator.serviceWorker) { bildir("Bu tarayıcıda güncelleme denetimi yok."); return; }
      navigator.serviceWorker.getRegistration().then(function (r) {
        if (!r) { bildir("Çevrimdışı kurulum bulunamadı."); return; }
        r.update().then(function () { bildir("Denetlendi. Yenisi varsa haber vereceğim."); });
      }).catch(function () { bildir("Şu an denetlenemedi."); });
    });
    govde.appendChild(gncBtn);

    /* sıfırlama */
    govde.appendChild(el("div", { sinif: "td-bolum-baslik", metin: "Verilerim" }));
    var silBtn = el("button", { type: "button", sinif: "btn hayalet tehlike tam", metin: "Seçimlerimi ve favorilerimi sil" });
    var onayda = false;
    silBtn.addEventListener("click", function () {
      if (!onayda) {
        onayda = true;
        silBtn.textContent = "Emin misin? Silmek için tekrar dokun";
        setTimeout(function () { onayda = false; silBtn.textContent = "Seçimlerimi ve favorilerimi sil"; }, 4000);
        return;
      }
      AM.depo.sifirla();
      AM.depo.baslat();
      AM.depo.temelleriSec();
      panelKapat("ayarPanel");
      basla_ilkCizim(true);
      bildir("Sıfırlandı.");
    });
    govde.appendChild(silBtn);

    govde.appendChild(el("p", { sinif: "ayar-not", metin:
      "Bu uygulama tamamen telefonunuzda çalışır. İnternet bağlantısı kullanmaz, " +
      "hiçbir veri hiçbir yere gönderilmez, hesap veya izin istemez. İşaretlediğiniz " +
      "malzemeler ve favorileriniz yalnızca bu cihazda saklanır." }));
  }

  /* ====================================================== BAŞLANGIÇ */

  /** Seçili temayı <html> üzerine yazar ve tarayıcı çubuğu rengini eşitler. */
  function temayiUygula() {
    var tema = AM.depo.tema();
    document.documentElement.dataset.tema = tema;

    var koyuMu = tema === "gece" ||
      (tema === "sistem" && window.matchMedia &&
       window.matchMedia("(prefers-color-scheme: dark)").matches);

    var etiket = document.querySelector('meta[name="theme-color"]');
    if (etiket) etiket.setAttribute("content", koyuMu ? "#1B1714" : "#E0501F");
  }

  /** Yapışkan arama çubuğu tam başlığın altına otursun diye gerçek yüksekliği ölç. */
  function ustYuksekligiOlc() {
    var h = $("ustBar").offsetHeight;
    if (h > 0) document.documentElement.style.setProperty("--ust-h", h + "px");
  }

  function basla_ilkCizim(ilkKez) {
    ciz_katSerit();
    ciz_malzemeler();
    rozetGuncelle();
    ciz_tarifKatSerit();

    // İlk açılışta doğrudan malzeme ekranı; sonraki açılışlarda öneriler.
    var hosgeldin = $("hosgeldinNot");
    if (hosgeldin) hosgeldin.hidden = !ilkKez;
    git((ilkKez || AM.depo.sepet().size === 0) ? "mutfak" : "bugun");
  }

  function olaylariBagla() {
    /* alt menü + "şuraya git" düğmeleri */
    document.addEventListener("click", function (e) {
      var hedef = e.target.closest("[data-git]");
      if (hedef) { git(hedef.dataset.git); return; }
    });

    /* malzeme çipleri (olay delegasyonu — 200 dinleyici yerine 1 tane) */
    $("malzemeListe").addEventListener("click", function (e) {
      var cip = e.target.closest(".cip");
      if (!cip) return;
      var acikMi = AM.depo.sepetDegistir(cip.dataset.id);
      cip.setAttribute("aria-pressed", acikMi ? "true" : "false");
      rozetGuncelle();
      ciz_katSerit();
    });

    /* malzeme arama */
    var mArama = $("malzemeArama");
    mArama.addEventListener("input", function () {
      durum.malzemeArama = mArama.value;
      $("btnAramaTemizle").hidden = !mArama.value;
      ciz_malzemeler();
    });
    $("btnAramaTemizle").addEventListener("click", function () {
      mArama.value = ""; durum.malzemeArama = "";
      $("btnAramaTemizle").hidden = true;
      ciz_malzemeler(); mArama.focus();
    });

    $("btnTemelleriSec").addEventListener("click", function () {
      AM.depo.temelleriSec();
      ciz_malzemeler(); ciz_katSerit(); rozetGuncelle();
      bildir("Temel malzemeler işaretlendi.");
    });
    $("btnHepsiniTemizle").addEventListener("click", function () {
      AM.depo.sepetTemizle();
      ciz_malzemeler(); ciz_katSerit(); rozetGuncelle();
      bildir("Tüm seçimler kaldırıldı.");
    });

    /* filtreler */
    $("filtreSerit").addEventListener("click", function (e) {
      var b = e.target.closest(".filtre-cip");
      if (!b) return;
      AM.depo.filtre(b.dataset.filtre);
      durum.gosterYapilabilir = SAYFA_ADET;
      durum.gosterNerdeyse = 12;
      Array.prototype.forEach.call($("filtreSerit").children, function (x) {
        x.classList.toggle("aktif", x === b);
      });
      ciz_bugun();
    });

    /* öneri düğmeleri */
    $("btnTarifiAc").addEventListener("click", function () {
      var id = $("oneriKart").dataset.id;
      if (id) tarifAc(id);
    });
    $("btnBaskaOner").addEventListener("click", function () {
      AM.depo.oneriIx(AM.depo.oneriIx() + 1);
      ciz_bugun();
      $("oneriKart").scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    $("btnDahaFazlaYapilabilir").addEventListener("click", function () {
      durum.gosterYapilabilir += SAYFA_ADET; ciz_bugun();
    });
    $("btnDahaFazlaNerdeyse").addEventListener("click", function () {
      durum.gosterNerdeyse += SAYFA_ADET; ciz_bugun();
    });
    $("btnDahaFazlaTum").addEventListener("click", function () {
      durum.gosterTum += SAYFA_ADET; ciz_tarifler();
    });

    /* tarif arama */
    var tArama = $("tarifArama");
    tArama.addEventListener("input", function () {
      durum.tarifArama = tArama.value;
      durum.gosterTum = SAYFA_ADET;
      $("btnTarifAramaTemizle").hidden = !tArama.value;
      ciz_tarifler();
    });
    $("btnTarifAramaTemizle").addEventListener("click", function () {
      tArama.value = ""; durum.tarifArama = "";
      $("btnTarifAramaTemizle").hidden = true;
      ciz_tarifler(); tArama.focus();
    });

    /* tarif paneli */
    $("btnPanelKapat").addEventListener("click", geriGit);
    $("tarifPanel").addEventListener("click", function (e) {
      if (e.target === $("tarifPanel")) geriGit();
    });
    $("btnFavori").addEventListener("click", function () {
      if (!durum.acikTarif) return;
      var eklendi = AM.depo.favDegistir(durum.acikTarif.id);
      $("btnFavori").setAttribute("aria-pressed", eklendi ? "true" : "false");
      bildir(eklendi ? "Favorilere eklendi 💛" : "Favorilerden çıkarıldı");
      if (durum.ekran === "favori") ciz_favori();
    });
    $("btnPisirmeBasla").addEventListener("click", pisirmeAc);

    /* pişirme modu */
    $("btnPisirmeKapat").addEventListener("click", geriGit);
    $("btnAdimGeri").addEventListener("click", function () {
      if (durum.adim > 0) { durum.adim--; ciz_pisirme(); }
    });
    $("btnAdimIleri").addEventListener("click", function () {
      var t = durum.acikTarif;
      if (durum.adim < t.y.length - 1) { durum.adim++; ciz_pisirme(); }
      else { geriGit(); bildir("Afiyet olsun! 🎉"); }
    });

    /* ayarlar */
    $("btnAyar").addEventListener("click", function () { ciz_ayarlar(); panelAc("ayarPanel"); });
    $("btnAyarKapat").addEventListener("click", geriGit);
    $("ayarPanel").addEventListener("click", function (e) {
      if (e.target === $("ayarPanel")) geriGit();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") geriGit();
      if (!$("pisirmePanel").hidden) {
        if (e.key === "ArrowRight") $("btnAdimIleri").click();
        if (e.key === "ArrowLeft") $("btnAdimGeri").click();
      }
    });
  }

  /* ================================================ SERVICE WORKER */

  function swKur() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "file:") return;   // yerel dosyadan açıldıysa gerek yok

    function guncellemeVar(isci) {
      bildir("Yeni tarifler hazır!", "Güncelle", function () {
        isci.postMessage({ tip: "HEMEN_GEC" });
      });
    }

    navigator.serviceWorker.register("sw.js").then(function (kayit) {
      function izle(isci) {
        if (!isci) return;
        isci.addEventListener("statechange", function () {
          if (isci.state === "installed" && navigator.serviceWorker.controller) {
            guncellemeVar(isci);
          }
        });
      }

      // Yeni sürüm zaten inmiş ve sırada bekliyor olabilir (sayfa açılmadan önce
      // inmişse "updatefound" olayını kaçırırız). Önce onu kontrol et.
      if (kayit.waiting && navigator.serviceWorker.controller) {
        guncellemeVar(kayit.waiting);
      }
      // register() çağrısı sırasında kurulum başlamış olabilir.
      izle(kayit.installing);
      kayit.addEventListener("updatefound", function () { izle(kayit.installing); });

      // Her açılışta bir kez sunucuya sor: yeni sürüm var mı?
      kayit.update().catch(function () {});
    }).catch(function () { /* sessizce geç */ });

    /* Sayfa zaten bir service worker tarafından yönetiliyorduysa, denetimin el
       değiştirmesi "yeni sürüm devraldı" demektir; sayfayı tazelemek gerekir.
       Ama ilk ziyarette denetim ilk kez kuruluyor — orada yenilemek uygulamayı
       gereksiz yere baştan başlatır ve karşılama ekranını atlatır. */
    var oncedenYonetiliyordu = !!navigator.serviceWorker.controller;
    var yenilendi = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!oncedenYonetiliyordu || yenilendi) return;
      yenilendi = true;
      location.reload();
    });
  }

  /* ====================================================== ÇALIŞTIR */

  function calistir() {
    AM.depo.baslat();
    var hatalar = AM.hazirla();

    if (hatalar.bilinmeyenMalzeme.length || hatalar.cakisanId.length) {
      // Geliştirme uyarısı: kullanıcıya gösterilmez, konsola yazılır.
      console.warn("[Alganis Mutfak] veri uyarısı", hatalar);
    }

    var ilkKez = AM.depo.ilkKezMi();
    if (ilkKez) AM.depo.temelleriSec();
    document.documentElement.dataset.yazi = AM.depo.yazi();
    temayiUygula();

    // "Telefona uy" seçiliyken sistem teması değişirse anında yansısın
    if (window.matchMedia) {
      var sorgu = window.matchMedia("(prefers-color-scheme: dark)");
      var dinle = function () { if (AM.depo.tema() === "sistem") temayiUygula(); };
      if (sorgu.addEventListener) sorgu.addEventListener("change", dinle);
      else if (sorgu.addListener) sorgu.addListener(dinle);
    }

    /* kayıtlı filtreyi şeritte işaretle */
    var kayitliFiltre = AM.depo.filtre();
    Array.prototype.forEach.call($("filtreSerit").children, function (x) {
      x.classList.toggle("aktif", x.dataset.filtre === kayitliFiltre);
    });

    olaylariBagla();
    ustYuksekligiOlc();
    window.addEventListener("resize", ustYuksekligiOlc);
    basla_ilkCizim(ilkKez);
    swKur();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", calistir);
  } else {
    calistir();
  }
})();
