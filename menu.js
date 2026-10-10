/*
 * ============================================================
 *  МЕНЮ РЕСТОРАНА — единственный файл, который нужно менять.
 * ============================================================
 *
 *  Как добавить блюдо: скопируйте любой блок { ... } в списке
 *  "items", поменяйте текст и цену. Цена — просто число в сумах.
 *
 *  Поля блюда:
 *    id     — уникальное короткое имя латиницей (не повторять!)
 *    cat    — id категории из списка "categories"
 *    price  — цена в сумах (число, без пробелов)
 *    name   — название на трёх языках
 *    desc   — описание на трёх языках (можно оставить пустым "")
 *    weight — вес/объём, например "350 г" (необязательно)
 *    img    — путь к фото, например "img/adana.webp" (необязательно,
 *             без фото показывается золотой значок категории)
 *    tags   — метки: "hit" (хит), "spicy" (острое), "veg" (вегетарианское), "new" (новинка)
 *    hidden — true, если блюдо временно закончилось (скрыть из меню)
 *
 *  Значки категорий (поле icon): meze, soup, kebab, pide, bowl, dessert, tea, drink
 */

window.MENU = {
  restaurant: {
    name: "Istanbul",
    // Логотип для QR-наклеек и шапки меню (необязательно), например "img/logo.png"
    logo: "",
    tagline: {
      ru: "Турецкая и восточная кухня",
      uz: "Turk va sharq taomlari",
      en: "Turkish & Oriental cuisine",
    },
    currency: { ru: "сум", uz: "so‘m", en: "UZS" },
    // Обслуживание в процентах (0 — если нет)
    servicePercent: 10,
    // Ник в Telegram для кнопки «Отправить заказ» (необязательно), без @
    telegram: "",
  },

  categories: [
    { id: "meze",     icon: "meze",    name: { ru: "Мезе и салаты",  uz: "Meze va salatlar", en: "Meze & salads" } },
    { id: "soups",    icon: "soup",    name: { ru: "Супы",           uz: "Sho‘rvalar",       en: "Soups" } },
    { id: "kebab",    icon: "kebab",   name: { ru: "Кебабы",         uz: "Kaboblar",         en: "Kebabs" } },
    { id: "pide",     icon: "pide",    name: { ru: "Пиде и лахмаджун", uz: "Pide va lahmajun", en: "Pide & lahmacun" } },
    { id: "hot",      icon: "bowl",    name: { ru: "Горячие блюда",  uz: "Issiq taomlar",    en: "Main dishes" } },
    { id: "desserts", icon: "dessert", name: { ru: "Десерты",        uz: "Shirinliklar",     en: "Desserts" } },
    { id: "tea",      icon: "tea",     name: { ru: "Чай и кофе",     uz: "Choy va qahva",    en: "Tea & coffee" } },
    { id: "drinks",   icon: "drink",   name: { ru: "Напитки",        uz: "Ichimliklar",      en: "Drinks" } },
  ],

  items: [
    // ---------- Мезе и салаты ----------
    { id: "humus", cat: "meze", price: 28000, weight: "200 г", tags: ["veg"],
      name: { ru: "Хумус", uz: "Humus", en: "Hummus" },
      desc: { ru: "Нут, тахини, лимон, оливковое масло, горячая лепёшка",
              uz: "No‘xat, taxini, limon, zaytun moyi, issiq non",
              en: "Chickpeas, tahini, lemon, olive oil, warm bread" } },
    { id: "ezme", cat: "meze", price: 24000, weight: "180 г", tags: ["spicy", "veg"],
      name: { ru: "Эзме", uz: "Ezme", en: "Ezme" },
      desc: { ru: "Острая закуска из томатов, перца и граната",
              uz: "Pomidor, qalampir va anordan achchiq gazak",
              en: "Spicy dip of tomato, pepper and pomegranate" } },
    { id: "coban", cat: "meze", price: 26000, weight: "250 г", tags: ["veg"],
      name: { ru: "Салат «Чобан»", uz: "«Choban» salati", en: "Shepherd’s salad" },
      desc: { ru: "Томаты, огурцы, лук, перец, петрушка, гранатовый соус",
              uz: "Pomidor, bodring, piyoz, qalampir, petrushka, anor sousi",
              en: "Tomato, cucumber, onion, pepper, parsley, pomegranate dressing" } },
    { id: "babaganush", cat: "meze", price: 27000, weight: "200 г", tags: ["veg"],
      name: { ru: "Бабагануш", uz: "Babaganush", en: "Baba ghanoush" },
      desc: { ru: "Печёный баклажан с тахини и чесноком",
              uz: "Taxini va sarimsoqli pishirilgan baqlajon",
              en: "Smoky aubergine with tahini and garlic" } },

    // ---------- Супы ----------
    { id: "mercimek", cat: "soups", price: 22000, weight: "350 мл", tags: ["hit", "veg"],
      name: { ru: "Мерджимек (чечевичный суп)", uz: "Merjimek (yasmiq sho‘rva)", en: "Mercimek lentil soup" },
      desc: { ru: "Классический турецкий суп с лимоном и сухариками",
              uz: "Limon va suxariklar bilan klassik turk sho‘rvasi",
              en: "Classic Turkish soup with lemon and croutons" } },
    { id: "ezogelin", cat: "soups", price: 22000, weight: "350 мл", tags: ["spicy"],
      name: { ru: "Эзогелин", uz: "Ezogelin", en: "Ezogelin soup" },
      desc: { ru: "Чечевица, булгур, мята и перец",
              uz: "Yasmiq, bulg‘ur, yalpiz va qalampir",
              en: "Lentils, bulgur, mint and chili" } },

    // ---------- Кебабы ----------
    { id: "adana", cat: "kebab", price: 62000, weight: "300 г", tags: ["hit", "spicy"],
      name: { ru: "Адана-кебаб", uz: "Adana kabob", en: "Adana kebab" },
      desc: { ru: "Острый рубленый кебаб из баранины на углях, лаваш, лук с сумахом",
              uz: "Ko‘mirda pishgan achchiq qo‘y go‘shti kabobi, lavash, sumaxli piyoz",
              en: "Spicy minced lamb on charcoal, lavash, sumac onions" } },
    { id: "urfa", cat: "kebab", price: 60000, weight: "300 г",
      name: { ru: "Урфа-кебаб", uz: "Urfa kabob", en: "Urfa kebab" },
      desc: { ru: "Неострый кебаб из баранины и говядины",
              uz: "Qo‘y va mol go‘shtidan achchiq bo‘lmagan kabob",
              en: "Mild lamb and beef kebab" } },
    { id: "iskender", cat: "kebab", price: 75000, weight: "400 г", tags: ["hit"],
      name: { ru: "Искендер", uz: "Iskandar kabob", en: "Iskender kebab" },
      desc: { ru: "Донер на пиде, томатный соус, топлёное масло, йогурт",
              uz: "Pide ustida doner, pomidor sousi, sariyog‘, qatiq",
              en: "Doner over pide, tomato sauce, browned butter, yogurt" } },
    { id: "chicken-sis", cat: "kebab", price: 52000, weight: "300 г",
      name: { ru: "Тавук шиш", uz: "Tovuq shish", en: "Chicken shish" },
      desc: { ru: "Маринованная курица на шпажках, рис, овощи гриль",
              uz: "Marinadlangan tovuq, guruch, grilda sabzavotlar",
              en: "Marinated chicken skewers, rice, grilled vegetables" } },
    { id: "beyti", cat: "kebab", price: 68000, weight: "350 г", tags: ["new"],
      name: { ru: "Бейти", uz: "Beyti", en: "Beyti kebab" },
      desc: { ru: "Кебаб в лаваше, запечённый с томатным соусом и йогуртом",
              uz: "Lavashga o‘ralgan kabob, pomidor sousi va qatiq bilan",
              en: "Kebab wrapped in lavash with tomato sauce and yogurt" } },

    // ---------- Пиде и лахмаджун ----------
    { id: "lahmacun", cat: "pide", price: 25000, weight: "1 шт", tags: ["hit"],
      name: { ru: "Лахмаджун", uz: "Lahmajun", en: "Lahmacun" },
      desc: { ru: "Тонкая лепёшка с пряным фаршем, зеленью и лимоном",
              uz: "Ziravorli qiyma, ko‘kat va limonli yupqa non",
              en: "Thin flatbread with spiced mince, herbs and lemon" } },
    { id: "kasarli-pide", cat: "pide", price: 42000, weight: "1 шт", tags: ["veg"],
      name: { ru: "Пиде с сыром", uz: "Pishloqli pide", en: "Cheese pide" },
      desc: { ru: "Лодочка из теста с сыром кашар и яйцом",
              uz: "Kashar pishlog‘i va tuxumli qayiqcha non",
              en: "Boat-shaped bread with kashar cheese and egg" } },
    { id: "kiymali-pide", cat: "pide", price: 48000, weight: "1 шт",
      name: { ru: "Пиде с мясом", uz: "Go‘shtli pide", en: "Minced meat pide" },
      desc: { ru: "С рубленой говядиной, томатами и перцем",
              uz: "Mol go‘shti qiymasi, pomidor va qalampir bilan",
              en: "With minced beef, tomato and pepper" } },

    // ---------- Горячие блюда ----------
    { id: "manti-tr", cat: "hot", price: 45000, weight: "300 г", tags: ["hit"],
      name: { ru: "Турецкие манты", uz: "Turk mantisi", en: "Turkish manti" },
      desc: { ru: "Крошечные пельмени с йогуртом, чесноком и пряным маслом",
              uz: "Qatiq, sarimsoq va ziravorli moy bilan mayda manti",
              en: "Tiny dumplings with garlic yogurt and spiced butter" } },
    { id: "testi", cat: "hot", price: 85000, weight: "450 г", tags: ["new"],
      name: { ru: "Тести-кебаб в кувшине", uz: "Ko‘zada testi kabob", en: "Testi pottery kebab" },
      desc: { ru: "Говядина с овощами, томлёная в глиняном кувшине",
              uz: "Loy ko‘zada dimlangan mol go‘shti va sabzavotlar",
              en: "Beef and vegetables slow-cooked in a sealed clay pot" } },
    { id: "karniyarik", cat: "hot", price: 48000, weight: "350 г",
      name: { ru: "Карныярык", uz: "Karniyarik", en: "Karnıyarık" },
      desc: { ru: "Баклажан, фаршированный говядиной, с рисом",
              uz: "Mol go‘shti qiymasi bilan to‘ldirilgan baqlajon, guruch",
              en: "Aubergine stuffed with minced beef, served with rice" } },

    // ---------- Десерты ----------
    { id: "baklava", cat: "desserts", price: 32000, weight: "4 шт", tags: ["hit"],
      name: { ru: "Пахлава с фисташкой", uz: "Pistali paxlava", en: "Pistachio baklava" },
      desc: { ru: "Тончайшее тесто, антепская фисташка, сироп",
              uz: "Yupqa xamir, Antep pistasi, sharbat",
              en: "Paper-thin pastry, Antep pistachio, syrup" } },
    { id: "kunefe", cat: "desserts", price: 38000, weight: "200 г", tags: ["hit"],
      name: { ru: "Кюнефе", uz: "Kunefe", en: "Künefe" },
      desc: { ru: "Горячий десерт из кадаифа с тянущимся сыром",
              uz: "Cho‘ziluvchan pishloqli issiq kadayif shirinligi",
              en: "Warm shredded pastry with melted cheese and syrup" } },
    { id: "sutlac", cat: "desserts", price: 22000, weight: "200 г",
      name: { ru: "Сютлач", uz: "Sutlach", en: "Sütlaç rice pudding" },
      desc: { ru: "Запечённый рисовый пудинг с корицей",
              uz: "Dolchinli pishirilgan guruch pudingi",
              en: "Baked rice pudding with cinnamon" } },
    { id: "lokum", cat: "desserts", price: 18000, weight: "150 г", tags: ["veg"],
      name: { ru: "Рахат-лукум", uz: "Rohat-lukum", en: "Turkish delight" },
      desc: { ru: "Ассорти: роза, гранат, фисташка",
              uz: "Assorti: atirgul, anor, pista",
              en: "Assorted: rose, pomegranate, pistachio" } },

    // ---------- Чай и кофе ----------
    { id: "cay", cat: "tea", price: 6000, weight: "стакан",
      name: { ru: "Турецкий чай", uz: "Turk choyi", en: "Turkish tea" },
      desc: { ru: "В традиционном стакане-тюльпане", uz: "An’anaviy lola stakanda", en: "Served in a tulip glass" } },
    { id: "turk-kahve", cat: "tea", price: 18000, weight: "80 мл", tags: ["hit"],
      name: { ru: "Кофе по-турецки", uz: "Turk qahvasi", en: "Turkish coffee" },
      desc: { ru: "Сваренный на песке, с лукумом", uz: "Qumda damlangan, lukum bilan", en: "Brewed on hot sand, with lokum" } },
    { id: "salep", cat: "tea", price: 20000, weight: "250 мл", tags: ["new"],
      name: { ru: "Салеп", uz: "Salep", en: "Salep" },
      desc: { ru: "Горячий молочный напиток с корицей", uz: "Dolchinli issiq sutli ichimlik", en: "Hot milky drink with cinnamon" } },

    // ---------- Напитки ----------
    { id: "ayran", cat: "drinks", price: 10000, weight: "300 мл",
      name: { ru: "Айран", uz: "Ayron", en: "Ayran" },
      desc: { ru: "Пенный, домашний", uz: "Ko‘pikli, uy usulida", en: "Frothy, homemade" } },
    { id: "lemonade", cat: "drinks", price: 25000, weight: "1 л",
      name: { ru: "Лимонад с мятой", uz: "Yalpizli limonad", en: "Mint lemonade" },
      desc: { ru: "Лимон, мята, тростниковый сахар", uz: "Limon, yalpiz, qamish shakari", en: "Lemon, mint, cane sugar" } },
    { id: "nar", cat: "drinks", price: 28000, weight: "300 мл",
      name: { ru: "Гранатовый сок", uz: "Anor sharbati", en: "Pomegranate juice" },
      desc: { ru: "Свежевыжатый", uz: "Yangi siqilgan", en: "Freshly squeezed" } },
    { id: "water", cat: "drinks", price: 5000, weight: "0,5 л",
      name: { ru: "Вода", uz: "Suv", en: "Water" },
      desc: { ru: "С газом / без газа", uz: "Gazli / gazsiz", en: "Sparkling / still" } },
  ],
};
