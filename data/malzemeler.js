/* ============================================================================
   ALGANİS MUTFAK — MALZEME KATALOĞU
   ----------------------------------------------------------------------------
   Biçim:  [ id, "Görünen ad", "kategori", temelMi(0/1), "arama takma adları" ]

   id        : Tariflerde kullanılan benzersiz anahtar. ASCII, tire ile ayrık.
               ÖNEMLİ: Bir kez yayınlandıktan sonra id DEĞİŞTİRİLMEZ
               (kullanıcıların kayıtlı seçimleri id'ye bağlıdır).
   kategori  : Aşağıdaki AM.KATEGORILER listesindeki id'lerden biri.
   temelMi   : 1 ise uygulama ilk açıldığında bu malzeme otomatik işaretli gelir
               (tuz, un, yağ gibi evde hemen her zaman bulunanlar).
   takma ad  : Arama kutusunda da eşleşsin istenen ek kelimeler (isteğe bağlı).

   Yeni malzeme eklemek: listenin uygun kategorisine yeni bir satır ekle. Başka
   hiçbir yeri değiştirmen gerekmez.
   ========================================================================== */

window.AM = window.AM || {};

AM.KATEGORILER = [
  { id: "sebze",    ad: "Sebzeler",              emoji: "🥬" },
  { id: "yesillik", ad: "Yeşillikler",           emoji: "🌿" },
  { id: "et",       ad: "Et, Tavuk & Balık",     emoji: "🍖" },
  { id: "sut",      ad: "Süt Ürünleri & Yumurta",emoji: "🥚" },
  { id: "bakliyat", ad: "Bakliyat, Tahıl & Un",  emoji: "🌾" },
  { id: "baharat",  ad: "Baharatlar",            emoji: "🧂" },
  { id: "meyve",    ad: "Meyve & Kuruyemiş",     emoji: "🍋" },
  { id: "kiler",    ad: "Kiler & Diğer",         emoji: "🫙" }
];

AM.MALZEMELER = [
  /* ---------------------------------------------------------------- SEBZE */
  ["sogan",             "Kuru soğan",             "sebze", 1, "sogan"],
  ["arpacik-sogan",     "Arpacık soğan",          "sebze", 0],
  ["sarimsak",          "Sarımsak",               "sebze", 1],
  ["patates",           "Patates",                "sebze", 1],
  ["domates",           "Domates",                "sebze", 1],
  ["salatalik",         "Salatalık",              "sebze", 0, "hiyar"],
  ["sivri-biber",       "Sivri biber",            "sebze", 1, "carliston yesil biber"],
  ["dolmalik-biber",    "Dolmalık biber",         "sebze", 0],
  ["kapya-biber",       "Kapya biber",            "sebze", 0, "kirmizi biber"],
  ["patlican",          "Patlıcan",               "sebze", 0],
  ["kabak",             "Kabak",                  "sebze", 0, "sakiz kabagi"],
  ["balkabagi",         "Bal kabağı",             "sebze", 0],
  ["havuc",             "Havuç",                  "sebze", 1],
  ["pirasa",            "Pırasa",                 "sebze", 0],
  ["ispanak",           "Ispanak",                "sebze", 0],
  ["pazi",              "Pazı",                   "sebze", 0],
  ["lahana",            "Beyaz lahana",           "sebze", 0],
  ["kirmizi-lahana",    "Kırmızı lahana",         "sebze", 0],
  ["karalahana",        "Karalahana",             "sebze", 0],
  ["karnabahar",        "Karnabahar",             "sebze", 0],
  ["brokoli",           "Brokoli",                "sebze", 0],
  ["taze-fasulye",      "Taze fasulye",           "sebze", 0, "ayse kadin"],
  ["bamya",             "Bamya",                  "sebze", 0],
  ["bezelye",           "Bezelye",                "sebze", 0],
  ["enginar",           "Enginar",                "sebze", 0],
  ["kereviz",           "Kereviz",                "sebze", 0],
  ["pancar",            "Pancar",                 "sebze", 0],
  ["turp",              "Turp",                   "sebze", 0],
  ["semizotu",          "Semizotu",               "sebze", 0],
  ["mantar",            "Mantar",                 "sebze", 0],
  ["misir",             "Mısır",                  "sebze", 0],
  ["taze-barbunya",     "Taze barbunya",          "sebze", 0],
  ["taze-bakla",        "Taze bakla",             "sebze", 0],
  ["asma-yapragi",      "Asma yaprağı",           "sebze", 0, "salamura yaprak"],
  ["kuru-dolmalik",     "Kurutulmuş dolmalık",    "sebze", 0, "kuru biber kuru patlican"],
  ["kuru-domates",      "Kuru domates",           "sebze", 0],

  /* ------------------------------------------------------------- YESILLIK */
  ["maydanoz",          "Maydanoz",               "yesillik", 1],
  ["dereotu",           "Dereotu",                "yesillik", 0],
  ["taze-nane",         "Taze nane",              "yesillik", 0],
  ["taze-sogan",        "Taze soğan",             "yesillik", 0],
  ["roka",              "Roka",                   "yesillik", 0],
  ["marul",             "Marul",                  "yesillik", 0, "kivircik goebek"],
  ["tere",              "Tere",                   "yesillik", 0],
  ["feslegen",          "Fesleğen",               "yesillik", 0],

  /* ------------------------------------------------------------------- ET */
  ["kiyma",             "Kıyma",                  "et", 0],
  ["kusbasi-et",        "Kuşbaşı et",             "et", 0, "dana kuzu"],
  ["kuzu-incik",        "Kuzu incik",             "et", 0],
  ["kuzu-pirzola",      "Kuzu pirzola",           "et", 0],
  ["kaburga",           "Kaburga / etli kemik",   "et", 0, "kemik et suyu"],
  ["ciger",             "Ciğer",                  "et", 0],
  ["tavuk-but",         "Tavuk but / baget",      "et", 0],
  ["tavuk-gogsu",       "Tavuk göğsü",            "et", 0, "tavuk fileto"],
  ["tavuk-kanat",       "Tavuk kanat",            "et", 0],
  ["butun-tavuk",       "Bütün tavuk",            "et", 0],
  ["sucuk",             "Sucuk",                  "et", 0],
  ["pastirma",          "Pastırma",               "et", 0],
  ["sosis",             "Sosis / salam",          "et", 0],
  ["kavurma",           "Kavurma",                "et", 0],
  ["hamsi",             "Hamsi",                  "et", 0],
  ["uskumru",           "Uskumru",                "et", 0],
  ["palamut",           "Palamut",                "et", 0],
  ["levrek",            "Levrek / çipura",        "et", 0],
  ["somon",             "Somon",                  "et", 0],
  ["alabalik",          "Alabalık",               "et", 0],
  ["mezgit",            "Mezgit / berlam",        "et", 0],
  ["kalamar",           "Kalamar",                "et", 0],
  ["karides",           "Karides",                "et", 0],
  ["midye",             "Midye",                  "et", 0],

  /* ------------------------------------------------------------------ SUT */
  ["yumurta",           "Yumurta",                "sut", 1],
  ["sut",               "Süt",                    "sut", 1],
  ["yogurt",            "Yoğurt",                 "sut", 1],
  ["suzme-yogurt",      "Süzme yoğurt",           "sut", 0],
  ["krema",             "Krema",                  "sut", 0],
  ["kaymak",            "Kaymak",                 "sut", 0],
  ["tereyagi",          "Tereyağı",               "sut", 1],
  ["beyaz-peynir",      "Beyaz peynir",           "sut", 1],
  ["kasar",             "Kaşar peyniri",          "sut", 1],
  ["lor",               "Lor peyniri",            "sut", 0],
  ["tulum-peyniri",     "Tulum peyniri",          "sut", 0],
  ["labne",             "Labne / krem peynir",    "sut", 0],
  ["ayran",             "Ayran",                  "sut", 0],

  /* ------------------------------------------------------------- BAKLIYAT */
  ["un",                "Un",                     "bakliyat", 1],
  ["tam-bugday-unu",    "Tam buğday unu",         "bakliyat", 0],
  ["misir-unu",         "Mısır unu",              "bakliyat", 0],
  ["irmik",             "İrmik",                  "bakliyat", 0],
  ["pirinc-unu",        "Pirinç unu",             "bakliyat", 0],
  ["nisasta",           "Nişasta",                "bakliyat", 1],
  ["galeta-unu",        "Galeta unu",             "bakliyat", 0],
  ["pirinc",            "Pirinç",                 "bakliyat", 1],
  ["bulgur",            "Pilavlık bulgur",        "bakliyat", 1],
  ["ince-bulgur",       "İnce bulgur",            "bakliyat", 1, "kofte bulguru"],
  ["dovme-bugday",      "Dövme buğday",           "bakliyat", 0, "asurelik"],
  ["yulaf",             "Yulaf ezmesi",           "bakliyat", 0],
  ["kirmizi-mercimek",  "Kırmızı mercimek",       "bakliyat", 1],
  ["yesil-mercimek",    "Yeşil mercimek",         "bakliyat", 0],
  ["nohut",             "Nohut",                  "bakliyat", 1],
  ["kuru-fasulye",      "Kuru fasulye",           "bakliyat", 1],
  ["kuru-barbunya",     "Kuru barbunya",          "bakliyat", 0],
  ["borulce",           "Börülce",                "bakliyat", 0],
  ["makarna",           "Makarna",                "bakliyat", 1],
  ["sehriye",           "Arpa şehriye",           "bakliyat", 1],
  ["tel-sehriye",       "Tel şehriye",            "bakliyat", 0],
  ["eriste",            "Erişte",                 "bakliyat", 0],
  ["kuskus",            "Kuskus",                 "bakliyat", 0],
  ["tarhana",           "Tarhana",                "bakliyat", 0],
  ["yufka",             "Yufka",                  "bakliyat", 0, "borek yufkasi"],
  ["baklavalik-yufka",  "Baklavalık yufka",       "bakliyat", 0],
  ["ekmek",             "Ekmek",                  "bakliyat", 1, "bayat ekmek"],
  ["tost-ekmegi",       "Tost ekmeği",            "bakliyat", 0],
  ["lavas",             "Lavaş / tortilla",       "bakliyat", 0],
  ["maya",              "Maya",                   "bakliyat", 0, "instant kuru yas maya"],
  ["kabartma-tozu",     "Kabartma tozu",          "bakliyat", 1],
  ["karbonat",          "Karbonat",               "bakliyat", 1],
  ["vanilya",           "Vanilya",                "bakliyat", 1, "vanilin"],

  /* -------------------------------------------------------------- BAHARAT */
  ["tuz",               "Tuz",                    "baharat", 1],
  ["karabiber",         "Karabiber",              "baharat", 1],
  ["pul-biber",         "Pul biber",              "baharat", 1],
  ["toz-biber",         "Toz kırmızı biber",      "baharat", 1, "tatli aci toz biber"],
  ["isot",              "İsot",                   "baharat", 0],
  ["kimyon",            "Kimyon",                 "baharat", 1],
  ["kekik",             "Kekik",                  "baharat", 1],
  ["kuru-nane",         "Kuru nane",              "baharat", 1],
  ["sumak",             "Sumak",                  "baharat", 0],
  ["tarcin",            "Tarçın",                 "baharat", 1],
  ["karanfil",          "Karanfil",               "baharat", 0],
  ["yenibahar",         "Yenibahar",              "baharat", 0],
  ["zerdecal",          "Zerdeçal",               "baharat", 0],
  ["zencefil",          "Zencefil",               "baharat", 0],
  ["kakule",            "Kakule",                 "baharat", 0],
  ["defne",             "Defne yaprağı",          "baharat", 0],
  ["corek-otu",         "Çörek otu",              "baharat", 0],
  ["susam",             "Susam",                  "baharat", 0],
  ["biberiye",          "Biberiye",               "baharat", 0],
  ["safran",            "Safran / zafiran",       "baharat", 0],

  /* ---------------------------------------------------------------- MEYVE */
  ["limon",             "Limon",                  "meyve", 1],
  ["portakal",          "Portakal",               "meyve", 0],
  ["elma",              "Elma",                   "meyve", 0],
  ["ayva",              "Ayva",                   "meyve", 0],
  ["muz",               "Muz",                    "meyve", 0],
  ["cilek",             "Çilek",                  "meyve", 0],
  ["visne",             "Vişne",                  "meyve", 0],
  ["kayisi",            "Kayısı",                 "meyve", 0],
  ["seftali",           "Şeftali",                "meyve", 0],
  ["uzum",              "Üzüm",                   "meyve", 0],
  ["incir",             "İncir",                  "meyve", 0],
  ["nar",               "Nar",                    "meyve", 0],
  ["kuru-uzum",         "Kuru üzüm",              "meyve", 0],
  ["kuru-kayisi",       "Kuru kayısı",            "meyve", 0],
  ["kuru-incir",        "Kuru incir",             "meyve", 0],
  ["hurma",             "Hurma",                  "meyve", 0],
  ["ceviz",             "Ceviz",                  "meyve", 0],
  ["findik",            "Fındık",                 "meyve", 0],
  ["badem",             "Badem",                  "meyve", 0],
  ["antep-fistigi",     "Antep fıstığı",          "meyve", 0],
  ["yer-fistigi",       "Yer fıstığı",            "meyve", 0],
  ["cam-fistigi",       "Çam fıstığı",            "meyve", 0, "dolmalik fistik"],
  ["kestane",           "Kestane",                "meyve", 0],
  ["hindistan-cevizi",  "Hindistan cevizi",       "meyve", 0],

  /* ---------------------------------------------------------------- KILER */
  ["su",                "Su",                     "kiler", 1],
  ["sivi-yag",          "Sıvı yağ",               "kiler", 1, "aycicek yagi"],
  ["zeytinyagi",        "Zeytinyağı",             "kiler", 1],
  ["salca",             "Domates salçası",        "kiler", 1],
  ["biber-salcasi",     "Biber salçası",          "kiler", 1],
  ["domates-rendesi",   "Domates konservesi",     "kiler", 0, "rende passata"],
  ["sirke",             "Sirke",                  "kiler", 1],
  ["nar-eksisi",        "Nar ekşisi",             "kiler", 0],
  ["toz-seker",         "Toz şeker",              "kiler", 1],
  ["pudra-sekeri",      "Pudra şekeri",           "kiler", 0],
  ["esmer-seker",       "Esmer şeker",            "kiler", 0],
  ["bal",               "Bal",                    "kiler", 0],
  ["pekmez",            "Pekmez",                 "kiler", 0],
  ["tahin",             "Tahin",                  "kiler", 0],
  ["zeytin",            "Zeytin",                 "kiler", 1, "siyah yesil zeytin"],
  ["tursu",             "Turşu",                  "kiler", 0],
  ["konserve-misir",    "Konserve mısır",         "kiler", 0],
  ["ton-baligi",        "Ton balığı konservesi",  "kiler", 0],
  ["kakao",             "Kakao",                  "kiler", 0],
  ["cikolata",          "Çikolata",               "kiler", 0, "bitter kuvertur"],
  ["et-suyu",           "Et / tavuk suyu",        "kiler", 0, "bulyon"],
  ["maden-suyu",        "Maden suyu / soda",      "kiler", 0],
  ["mayonez",           "Mayonez",                "kiler", 0],
  ["hardal",            "Hardal",                 "kiler", 0],
  ["kahve",             "Kahve",                  "kiler", 0, "nescafe turk kahvesi"],
  ["dondurma",          "Dondurma",               "kiler", 0],
  ["kadayif",           "Tel kadayıf",            "kiler", 0],

  /* ==========================================================================
     EK MALZEMELER — yöresel tarifler için sonradan eklendi.
     Ekranda gruplama listedeki sıraya değil "kategori" alanına baktığı için
     bunlar kendi başlıkları altında görünür, sona eklenmiş olmaları sorun değil.
     ========================================================================== */

  /* --- otlar ve daha az bilinen sebzeler --- */
  ["isirgan",           "Isırgan otu",            "yesillik", 0],
  ["radika",            "Radika / hindiba",       "yesillik", 0],
  ["arapsaci",          "Arapsaçı",               "yesillik", 0, "rezene otu"],
  ["labada",            "Labada / evelik",        "yesillik", 0],
  ["ebegumeci",         "Ebegümeci",              "yesillik", 0],
  ["madimak",           "Madımak",                "yesillik", 0],
  ["turp-otu",          "Turp otu / hardal otu",  "yesillik", 0],
  ["sevketi-bostan",    "Şevketi bostan",         "sebze", 0],
  ["deniz-borulcesi",   "Deniz börülcesi",        "sebze", 0],
  ["kuskonmaz",         "Kuşkonmaz",              "sebze", 0],
  ["yer-elmasi",        "Yer elması",             "sebze", 0],
  ["bruksel-lahanasi",  "Brüksel lahanası",       "sebze", 0],
  ["kereviz-sapi",      "Kereviz sapı",           "sebze", 0],
  ["acur",              "Acur",                   "sebze", 0],
  ["kabak-cicegi",      "Kabak çiçeği",           "sebze", 0],
  ["kuru-bamya",        "Kuru bamya",             "sebze", 0],

  /* --- et, sakatat, kümes, deniz --- */
  ["hindi",             "Hindi",                  "et", 0],
  ["kaz",               "Kaz / ördek",            "et", 0],
  ["bonfile",           "Bonfile / antrikot",     "et", 0],
  ["iskembe",           "İşkembe",                "et", 0],
  ["kuzu-kelle",        "Kelle / paça",           "et", 0],
  ["kurutulmus-et",     "Kurutulmuş et",          "et", 0],
  ["sardalya",          "Sardalya",               "et", 0],
  ["istavrit",          "İstavrit",               "et", 0],
  ["lufer",             "Lüfer",                  "et", 0],
  ["kefal",             "Kefal",                  "et", 0],
  ["ahtapot",           "Ahtapot",                "et", 0],

  /* --- süt ürünleri --- */
  ["otlu-peynir",       "Otlu peynir",            "sut", 0],
  ["cokelek",           "Çökelek",                "sut", 0],
  ["dil-peyniri",       "Dil peyniri",            "sut", 0],
  ["keci-peyniri",      "Keçi peyniri",           "sut", 0],
  ["kefir",             "Kefir",                  "sut", 0],

  /* --- tahıl, un, hamur --- */
  ["firik",             "Firik",                  "bakliyat", 0, "yesil bugday"],
  ["yarma",             "Yarma buğday",           "bakliyat", 0],
  ["kus-dili",          "Kuş dili şehriye",       "bakliyat", 0],
  ["gullac-yapragi",    "Güllaç yaprağı",         "bakliyat", 0],
  ["milfoy",            "Milföy hamuru",          "bakliyat", 0],

  /* --- baharat ve aroma --- */
  ["mahlep",            "Mahlep",                 "baharat", 0],
  ["damla-sakizi",      "Damla sakızı",           "baharat", 0],
  ["gul-suyu",          "Gül suyu",               "baharat", 0],
  ["sahlep",            "Salep",                  "baharat", 0],
  ["hashas",            "Haşhaş",                 "baharat", 0],
  ["limon-tuzu",        "Limon tuzu",             "baharat", 0],

  /* --- meyve ve kuruyemiş --- */
  ["erik",              "Erik",                   "meyve", 0],
  ["kiraz",             "Kiraz",                  "meyve", 0],
  ["dut",               "Dut",                    "meyve", 0],
  ["armut",             "Armut",                  "meyve", 0],
  ["kavun",             "Kavun",                  "meyve", 0],
  ["karpuz",            "Karpuz",                 "meyve", 0],
  ["mandalina",         "Mandalina",              "meyve", 0],
  ["kizilcik",          "Kızılcık",               "meyve", 0],
  ["kuru-dut",          "Kuru dut",               "meyve", 0],
  ["kabak-cekirdegi",   "Kabak / ay çekirdeği",   "meyve", 0],

  /* --- kiler --- */
  ["kapari",            "Kapari",                 "kiler", 0],
  ["recel",             "Reçel",                  "kiler", 0],
  ["jelatin",           "Jelatin / toz jöle",     "kiler", 0],
  ["ketcap",            "Ketçap",                 "kiler", 0]
];
