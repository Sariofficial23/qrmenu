"""Ищет на Wikimedia Commons свободно-лицензированные фото блюд и скачивает кандидатов."""
import json, os, re, sys, time, urllib.parse, urllib.request

UA = "IstanbulQRMenu/1.0 (https://github.com/Sariofficial23/qrmenu)"
API = "https://commons.wikimedia.org/w/api.php"
OK_LICENSE = re.compile(r"^(CC0|CC BY(-SA)? [0-9.]+|Public domain|PD)", re.I)

QUERIES = {
    "humus": ["Hummus plate", "Humus Turkish"],
    "ezme": ["Ezme salad", "Acılı ezme"],
    "coban": ["Çoban salatası", "Shepherd salad Turkish"],
    "babaganush": ["Baba ghanoush", "Babagannuş"],
    "mercimek": ["Mercimek çorbası", "Turkish lentil soup"],
    "ezogelin": ["Ezogelin çorbası", "Ezogelin soup"],
    "adana": ["Adana kebabı", "Adana kebab plate"],
    "urfa": ["Urfa kebabı", "Urfa kebap"],
    "iskender": ["İskender kebap", "Iskender kebab"],
    "chicken-sis": ["Tavuk şiş", "Chicken shish kebab"],
    "beyti": ["Beyti kebab", "Beyti sarma"],
    "lahmacun": ["Lahmacun", "Lahmacun lemon parsley"],
    "kasarli-pide": ["Kaşarlı pide", "Cheese pide"],
    "kiymali-pide": ["Kıymalı pide", "Turkish pide minced meat"],
    "manti-tr": ["Turkish mantı yogurt", "Kayseri mantısı"],
    "testi": ["Testi kebabı", "Testi kebap"],
    "karniyarik": ["Karnıyarık", "Karniyarik"],
    "baklava": ["Fıstıklı baklava", "Pistachio baklava"],
    "kunefe": ["Künefe", "Kunefe dessert"],
    "sutlac": ["Sütlaç", "Fırın sütlaç"],
    "lokum": ["Lokum", "Turkish delight assorted"],
    "cay": ["Turkish tea glass", "Türk çayı ince belli bardak"],
    "turk-kahve": ["Turkish coffee cup lokum", "Türk kahvesi"],
    "salep": ["Salep drink", "Sahlep"],
    "ayran": ["Ayran glass", "Ayran köpüklü"],
    "lemonade": ["Mint lemonade glass", "Lemonade mint"],
    "nar": ["Pomegranate juice glass", "Nar suyu"],
    "water": ["Glass of water bottle", "Mineral water glass"],
}

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:  # noqa
            print("retry", url[:80], e, file=sys.stderr)
            time.sleep(3 * (i + 1))
    return None

def search(q):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": 6, "gsrsearch": q + " filetype:bitmap", "gsrlimit": 20,
        "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 1000,
        "iiextmetadatafilter": "LicenseShortName|Artist|ImageDescription",
    }
    raw = get(API + "?" + urllib.parse.urlencode(params))
    if not raw:
        return []
    pages = json.loads(raw).get("query", {}).get("pages", {})
    out = []
    for p in sorted(pages.values(), key=lambda p: p.get("index", 99)):
        ii = (p.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "")
        if ii.get("mime") not in ("image/jpeg", "image/png", "image/webp"):
            continue
        if ii.get("width", 0) < 900 or ii.get("height", 0) < 600 or not OK_LICENSE.match(lic):
            continue
        artist = re.sub("<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip()
        out.append({"title": p["title"], "thumb": ii.get("thumburl"), "page": ii.get("descriptionurl"),
                    "license": lic, "artist": artist, "w": ii["width"], "h": ii["height"]})
    return out

os.makedirs("candidates", exist_ok=True)
index = {}
for dish, queries in QUERIES.items():
    seen, picks = set(), []
    for q in queries:
        for c in search(q):
            if c["title"] in seen:
                continue
            seen.add(c["title"])
            picks.append(c)
        time.sleep(1)
    picks = picks[:8]
    os.makedirs(f"candidates/{dish}", exist_ok=True)
    for n, c in enumerate(picks, 1):
        data = get(c["thumb"])
        if data:
            c["file"] = f"candidates/{dish}/{n}.jpg"
            open(c["file"], "wb").write(data)
        time.sleep(0.5)
    index[dish] = [c for c in picks if c.get("file")]
    print(dish, len(index[dish]))
json.dump(index, open("candidates/index.json", "w"), ensure_ascii=False, indent=1)
