/* ============================================================================
   MALZEME SÖZLÜĞÜ (İngilizce) — SADECE ARAÇLAR İÇİN

   Görsel üretim istemleri İngilizce yazılıyor; bu dosya malzeme id'lerini
   İngilizce karşılıklarına çeviriyor. UYGULAMAYA DAHİL DEĞİLDİR — index.html
   bu dosyayı yüklemez, service worker önbelleğe almaz. Sadece
   tools/gorsel-istek.js kullanır.

   Yeni malzeme eklediğinde buraya da bir satır ekle; eklemezsen görsel istemi
   üretilirken o malzeme atlanır (hata vermez, sadece istemde görünmez).
   ========================================================================== */

module.exports = {
  /* --- sebze --- */
  "sogan": "onion", "arpacik-sogan": "shallot", "sarimsak": "garlic",
  "patates": "potato", "domates": "tomato", "salatalik": "cucumber",
  "sivri-biber": "green pepper", "dolmalik-biber": "bell pepper",
  "kapya-biber": "red kapia pepper", "patlican": "eggplant",
  "kabak": "zucchini", "balkabagi": "pumpkin", "havuc": "carrot",
  "pirasa": "leek", "ispanak": "spinach", "pazi": "chard",
  "lahana": "white cabbage", "kirmizi-lahana": "red cabbage",
  "karalahana": "collard greens", "karnabahar": "cauliflower",
  "brokoli": "broccoli", "taze-fasulye": "green beans", "bamya": "okra",
  "bezelye": "green peas", "enginar": "artichoke", "kereviz": "celeriac",
  "pancar": "beetroot", "turp": "radish", "semizotu": "purslane",
  "mantar": "mushrooms", "misir": "sweetcorn",
  "taze-barbunya": "fresh cranberry beans", "taze-bakla": "fresh fava beans",
  "asma-yapragi": "vine leaves", "kuru-dolmalik": "dried peppers for stuffing",
  "kuru-domates": "sun-dried tomatoes", "sevketi-bostan": "blessed thistle",
  "deniz-borulcesi": "sea beans", "kuskonmaz": "asparagus",
  "yer-elmasi": "jerusalem artichoke", "bruksel-lahanasi": "brussels sprouts",
  "kereviz-sapi": "celery stalks", "acur": "armenian cucumber",
  "kabak-cicegi": "zucchini blossoms", "kuru-bamya": "dried okra",

  /* --- yeşillik --- */
  "maydanoz": "parsley", "dereotu": "dill", "taze-nane": "fresh mint",
  "taze-sogan": "spring onion", "roka": "arugula", "marul": "lettuce",
  "tere": "garden cress", "feslegen": "basil", "isirgan": "nettle",
  "radika": "chicory greens", "arapsaci": "wild fennel",
  "labada": "sorrel leaves", "ebegumeci": "mallow greens",
  "madimak": "madimak greens", "turp-otu": "radish greens",

  /* --- et, tavuk, balık --- */
  "kiyma": "ground beef", "kusbasi-et": "cubed beef",
  "kuzu-incik": "lamb shank", "kuzu-pirzola": "lamb chops",
  "kaburga": "meaty beef bones", "ciger": "liver",
  "tavuk-but": "chicken thighs", "tavuk-gogsu": "chicken breast",
  "tavuk-kanat": "chicken wings", "butun-tavuk": "whole chicken",
  "sucuk": "turkish sucuk sausage", "pastirma": "pastirma cured beef",
  "sosis": "sausage", "kavurma": "slow-braised meat", "hamsi": "anchovies",
  "uskumru": "mackerel", "palamut": "bonito", "levrek": "sea bass",
  "somon": "salmon", "alabalik": "trout", "mezgit": "whiting",
  "kalamar": "calamari", "karides": "shrimp", "midye": "mussels",
  "hindi": "turkey", "kaz": "goose", "bonfile": "beef tenderloin",
  "iskembe": "tripe", "kuzu-kelle": "lamb trotters",
  "kurutulmus-et": "air-dried cured meat", "sardalya": "sardines",
  "istavrit": "horse mackerel", "lufer": "bluefish", "kefal": "grey mullet",
  "ahtapot": "octopus",

  /* --- süt ürünleri --- */
  "yumurta": "eggs", "sut": "milk", "yogurt": "yogurt",
  "suzme-yogurt": "strained yogurt", "krema": "cream",
  "kaymak": "clotted cream", "tereyagi": "butter",
  "beyaz-peynir": "white brined cheese", "kasar": "kasseri cheese",
  "lor": "curd cheese", "tulum-peyniri": "tulum cheese",
  "labne": "cream cheese", "ayran": "ayran yogurt drink",
  "parmesan": "parmesan cheese", "mozzarella": "mozzarella cheese",
  "otlu-peynir": "herbed cheese", "cokelek": "dry curd cheese",
  "dil-peyniri": "string cheese", "keci-peyniri": "goat cheese",
  "kefir": "kefir",

  /* --- tahıl, bakliyat, un --- */
  "un": "flour", "tam-bugday-unu": "whole wheat flour",
  "misir-unu": "cornmeal", "irmik": "semolina", "pirinc-unu": "rice flour",
  "nisasta": "starch", "galeta-unu": "breadcrumbs", "pirinc": "rice",
  "bulgur": "bulgur", "ince-bulgur": "fine bulgur",
  "dovme-bugday": "cracked wheat", "yulaf": "rolled oats",
  "kirmizi-mercimek": "red lentils", "yesil-mercimek": "green lentils",
  "nohut": "chickpeas", "kuru-fasulye": "white beans",
  "kuru-barbunya": "cranberry beans", "kuru-bakla": "dried fava beans",
  "borulce": "black-eyed peas",
  "makarna": "pasta", "sehriye": "orzo", "tel-sehriye": "vermicelli",
  "eriste": "egg noodles", "kuskus": "couscous", "tarhana": "tarhana",
  "yufka": "thin phyllo sheets", "baklavalik-yufka": "baklava phyllo",
  "ekmek": "bread", "tost-ekmegi": "sandwich bread", "lavas": "flatbread",
  "maya": "yeast", "kabartma-tozu": "baking powder",
  "karbonat": "baking soda", "vanilya": "vanilla", "firik": "freekeh",
  "yarma": "coarse cracked wheat", "kus-dili": "tiny soup pasta",
  "gullac-yapragi": "gullac wafer sheets", "milfoy": "puff pastry",

  /* --- baharat --- */
  "tuz": "salt", "karabiber": "black pepper", "pul-biber": "red pepper flakes",
  "toz-biber": "ground red pepper", "isot": "isot pepper", "kimyon": "cumin",
  "kekik": "oregano", "kuru-nane": "dried mint", "sumak": "sumac",
  "tarcin": "cinnamon", "karanfil": "cloves", "yenibahar": "allspice",
  "zerdecal": "turmeric", "zencefil": "ginger", "kakule": "cardamom",
  "defne": "bay leaf", "corek-otu": "nigella seeds", "susam": "sesame seeds",
  "biberiye": "rosemary", "safran": "saffron", "mahlep": "mahlep",
  "muskat": "nutmeg", "adacayi": "sage",
  "damla-sakizi": "mastic", "gul-suyu": "rose water", "sahlep": "salep",
  "hashas": "poppy seeds", "limon-tuzu": "citric acid",

  /* --- meyve, kuruyemiş --- */
  "limon": "lemon", "portakal": "orange", "elma": "apple", "ayva": "quince",
  "muz": "banana", "cilek": "strawberries", "visne": "sour cherries",
  "kayisi": "apricots", "seftali": "peaches", "uzum": "grapes",
  "incir": "figs", "nar": "pomegranate", "kuru-uzum": "raisins",
  "kuru-kayisi": "dried apricots", "kuru-incir": "dried figs",
  "hurma": "dates", "ceviz": "walnuts", "findik": "hazelnuts",
  "badem": "almonds", "antep-fistigi": "pistachios",
  "yer-fistigi": "peanuts", "cam-fistigi": "pine nuts",
  "kestane": "chestnuts", "hindistan-cevizi": "coconut", "erik": "plums",
  "kiraz": "cherries", "dut": "mulberries", "armut": "pears",
  "kavun": "melon", "karpuz": "watermelon", "mandalina": "mandarin",
  "kizilcik": "cornelian cherries", "kuru-dut": "dried mulberries",
  "kabak-cekirdegi": "pumpkin seeds",

  /* --- kiler --- */
  "su": "water", "sivi-yag": "sunflower oil", "zeytinyagi": "olive oil",
  "salca": "tomato paste", "biber-salcasi": "red pepper paste",
  "domates-rendesi": "canned crushed tomatoes", "sirke": "vinegar",
  "nar-eksisi": "pomegranate molasses", "toz-seker": "sugar",
  "pudra-sekeri": "powdered sugar", "esmer-seker": "brown sugar",
  "bal": "honey", "pekmez": "grape molasses", "tahin": "tahini",
  "zeytin": "olives", "tursu": "pickles", "konserve-misir": "canned corn",
  "ton-baligi": "canned tuna", "kakao": "cocoa", "cikolata": "chocolate",
  "et-suyu": "meat broth", "maden-suyu": "sparkling water",
  "mayonez": "mayonnaise", "hardal": "mustard", "kahve": "coffee",
  "kedi-dili-biskuvi": "ladyfinger biscuits",
  "dondurma": "ice cream", "kadayif": "shredded kadayif pastry",
  "kapari": "capers", "recel": "fruit jam", "jelatin": "gelatin",
  "ketcap": "ketchup",

  /* --- uzak doğu --- */
  "soya-sosu": "soy sauce", "susam-yagi": "sesame oil",
  "pirinc-sirkesi": "rice vinegar", "istiridye-sosu": "oyster sauce",
  "tofu": "tofu"
};
