/* ============================================================================
   GÖRSELİ OLAN TARİFLER
   ----------------------------------------------------------------------------
   Bu dosya ELLE DÜZENLENMEZ — tools/gorsel-liste.js üretir.
   Yeni görsel ekledikten sonra:  node tools/gorsel-liste.js

   js/gorsel.js bu listeye bakar: id buradaysa gorseller/<id>.jpg gösterilir,
   değilse tarif kendi SVG portresine düşer. Böylece görseli olmayan tarif
   boşuna 404 isteği atmaz.
   ========================================================================== */

window.AM = window.AM || {};

AM.GORSELLER = [
  "acibadem-kurabiyesi", "akcaabat-koftesi", "arnavut-cigeri", "asure",
  "atom-meze", "ayran-asi", "ayva-tatlisi", "babagannus",
  "bakla-ezmesi-sicak", "bamya-yemegi", "bezelyeli-pilav", "bibimbap",
  "browni", "bruschetta", "burma-kadayif", "cacik",
  "cag-kebabi", "cop-sis", "dugun-corbasi", "eksili-kofte",
  "elmali-turta", "eriste-corbasi", "etimek-tatlisi", "etli-bezelye",
  "etli-biber-dolmasi", "etli-ekmek", "etli-kuru-fasulye", "etli-taze-fasulye",
  "etli-yaprak-sarma", "ezme-salata", "firik-pilavi", "gul-boregi",
  "gullac", "hamsili-pilav", "hashasli-corek", "haydari",
  "hosaf", "hosmerim", "humus", "hunkar-begendi",
  "icli-kofte", "incir-tatlisi", "inegol-koftesi", "irmik-helvasi",
  "islim-kebabi", "ispanakli-yumurta", "istavrit-tava", "kabak-cicegi-dolmasi",
  "kabak-tatlisi", "kadayif-dolmasi", "kagit-kebabi", "kagit-kebabi-2",
  "kalamar-tava", "kalburabasti", "kandil-simidi", "kapak-bakliyat",
  "kapak-balik", "kapak-corba", "kapak-etli", "kapak-hamur",
  "kapak-kahvalti", "kapak-mutfak-akdeniz", "kapak-mutfak-balkan", "kapak-mutfak-fransiz",
  "kapak-mutfak-hint", "kapak-mutfak-italyan", "kapak-mutfak-meksika", "kapak-mutfak-ortadogu",
  "kapak-mutfak-turk", "kapak-mutfak-uzakdogu", "kapak-pilav", "kapak-salata",
  "kapak-sebze", "kapak-tatli", "kapak-tavuk", "karnabahar-salatasi",
  "karniyarik", "kasarli-tost", "kavurmali-yumurta", "kemalpasa-tatlisi",
  "keskul", "kesme-corbasi", "kisir", "kiymali-ispanak",
  "kol-boregi", "kusbasili-pide", "kuzu-haslama", "kuzu-incik-firin-2",
  "kuzu-kapama", "lahana-kavurma", "laz-boregi", "mapo-tofu",
  "margherita-pizza", "mercimekli-bulgur-pilavi", "mevsim-salata", "meyveli-tart",
  "mezgit-tava", "midye-dolma", "midye-tava", "misir-ekmegi",
  "mucver", "muska-boregi", "nohutlu-ispanak", "orman-kebabi",
  "paca-corbasi", "papaz-yahnisi", "pastirmali-yumurta", "patlican-oturtma",
  "patlicanli-yogurtlu-tepsi", "peynirli-pide", "pirasali-borek", "pisi",
  "pizza-lavas", "portakal-receli", "portakalli-kurabiye", "profiterol",
  "radika-yemegi", "ramazan-pidesi", "rus-salatasi", "safranli-risotto",
  "saksuka", "salatalik-tursusu", "sigara-boregi", "sobiyet",
  "sogan-piyazli-pilav", "spagetti-carbonara", "sucuklu-yumurta", "supangle",
  "sutlu-irmik-tatlisi", "tahin-pekmez-kase", "tahinli-corek", "tahinli-kurabiye",
  "tava-hamsi", "tavuk-gogsu-tatlisi", "tavuk-haslama", "tavuk-salatasi",
  "tavuk-topkapi", "tavuklu-bulgur-pilavi", "tavuklu-makarna", "tel-kadayif",
  "tepsi-kebabi", "trilece", "turk-kahvesi", "tuzda-balik",
  "un-kurabiyesi", "yesillikli-omlet", "zerde", "zeytin-ezmesi",
  "zeytinyagli-pirasa", "zeytinyagli-semizotu", "zeytinyagli-taze-fasulye", "zeytinyagli-yaprak-sarma"
];
